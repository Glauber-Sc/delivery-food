// src/utils/Delivery.js

// Coordenadas fixas da loja (ajuste conforme necessário)
export const STORE_COORDS = { lat: -1.4423849, lon: -48.4721648 } // Belém/PA

// Pricing (R$0 até 3 km; acima = perKm * km)
export const PRICING = {
  perKm: 2.5,
  freeRadiusKm: 3,
  roundTo: 2,
}

// Fator para estimar rota pela linha reta (fallback)
export const inflateLineFactor = 1.25

// ----------------- helpers de cálculo -----------------
export function roundTo(val, decimals = 2) {
  const f = 10 ** decimals
  return Math.round((val ?? 0) * f) / f
}

export function priceForKm(km) {
  if (PRICING.freeRadiusKm && km <= PRICING.freeRadiusKm) return 0
  const val = PRICING.perKm * km
  return roundTo(val, PRICING.roundTo ?? 2)
}

export function haversineKm(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLon = (b.lon - a.lon) * Math.PI / 180
  const lat1 = a.lat * Math.PI / 180
  const lat2 = b.lat * Math.PI / 180
  const h = Math.sin(dLat/2)**2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon/2)**2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// ----------------- chamadas a serviços -----------------
export async function drivingKmOSRM(from, to) {
  // usa o proxy do Vite: /api/osrm -> https://router.project-osrm.org
  const url = new URL(
    `/api/osrm/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}`,
    window.location.origin
  )
  url.searchParams.set('overview', 'false')
  url.searchParams.set('alternatives', 'false')
  url.searchParams.set('steps', 'false')

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' }, credentials: 'omit' })
  const data = await res.json()
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('Rota não encontrada')
  return data.routes[0].distance / 1000
}

export async function fetchJSONWithTimeout(url, { timeout = 3000 } = {}) {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeout)
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: controller.signal,
    credentials: 'omit'
  })
  clearTimeout(t)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ----------------- geolocalização -----------------
export async function ipGeoApprox() {
  const providers = [
    {
      name: 'ipapi', url: 'https://ipapi.co/json/',
      pick: (d) => (typeof d?.latitude === 'number' && typeof d?.longitude === 'number'
        ? { lat: d.latitude, lon: d.longitude } : null),
    },
    {
      name: 'ipwho', url: 'https://ipwho.is/',
      pick: (d) => (d && (d.success === undefined || d.success) && typeof d.latitude === 'number' && typeof d.longitude === 'number'
        ? { lat: d.latitude, lon: d.longitude } : null),
    },
    {
      name: 'geolocation-db', url: 'https://geolocation-db.com/json/',
      pick: (d) => {
        const lat = parseFloat(d?.latitude)
        const lon = parseFloat(d?.longitude)
        return (isFinite(lat) && isFinite(lon)) ? { lat, lon } : null
      },
    },
    {
      name: 'bigdatacloud',
      url: 'https://api.bigdatacloud.net/data/ip-geolocation?localityLanguage=pt',
      pick: (d) => (typeof d?.latitude === 'number' && typeof d?.longitude === 'number'
        ? { lat: d.latitude, lon: d.longitude } : null),
    },
  ]

  for (const p of providers) {
    try {
      const data = await fetchJSONWithTimeout(p.url, { timeout: 2500 })
      const coords = p.pick(data)
      if (coords && isFinite(coords.lat) && isFinite(coords.lon)) {
        return { ...coords, accuracy: 5000, mode: `ip:${p.name}` }
      }
    } catch {}
  }
  throw new Error('IP geolocation indisponível')
}

export async function geolocationHighPrecision() {
  if (!window.isSecureContext || !('geolocation' in navigator)) return null

  // tentativa rápida
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve, reject,
        { enableHighAccuracy: false, timeout: 2000, maximumAge: 10 * 60 * 1000 }
      )
    })
    return {
      lat: pos.coords.latitude, lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy, mode: 'geo'
    }
  } catch {}

  // alta precisão
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve, reject,
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      )
    })
    return {
      lat: pos.coords.latitude, lon: pos.coords.longitude,
      accuracy: pos.coords.accuracy, mode: 'geo:high'
    }
  } catch {}

  return null
}

export async function getUserCoordsSmart() {
  const geo = await geolocationHighPrecision()
  if (geo) return geo
  return await ipGeoApprox()
}

// ----------------- CEP e reverse geocoding -----------------
export const normalizeCEP = (cep) => (cep || '').replace(/\D/g, '').slice(0, 8)

export async function fetchViaCEP(cep) {
  const clean = normalizeCEP(cep)
  if (clean.length !== 8) throw new Error('CEP inválido')
  const url = `https://viacep.com.br/ws/${clean}/json/`
  const data = await fetchJSONWithTimeout(url, { timeout: 4000 })
  if (data?.erro) throw new Error('CEP não encontrado')
  return {
    cep: clean,
    rua: data.logradouro || '',
    bairro: data.bairro || '',
    cidade: data.localidade || '',
    uf: data.uf || ''
  }
}

export async function reverseGeocodeBR({ lat, lon }) {
  // 1) Nominatim via proxy
  const nominatimUrl = (() => {
    const u = new URL('/api/nominatim/reverse', window.location.origin)
    u.searchParams.set('format', 'jsonv2')
    u.searchParams.set('lat', String(lat))
    u.searchParams.set('lon', String(lon))
    u.searchParams.set('addressdetails', '1')
    u.searchParams.set('accept-language', 'pt-BR')
    return u.toString()
  })()

  let rua = '', numero = '', bairro = '', cep = ''
  try {
    const d = await fetchJSONWithTimeout(nominatimUrl, { timeout: 5000 })
    const a = d?.address || {}
    rua = a.road || a.pedestrian || a.residential || a.footway || a.path || a.cycleway || ''
    numero = a.house_number || ''
    bairro = a.suburb || a.neighbourhood || a.village || a.quarter || a.city_district || a.district || ''
    cep = (a.postcode || '').replace(/\D/g, '')
  } catch {}

  // 2) ViaCEP para validar/corrigir rua/bairro quando houver CEP
  if (cep && cep.length === 8) {
    try {
      const vc = await fetchViaCEP(cep)
      rua = vc.rua || rua
      bairro = vc.bairro || bairro
      cep = vc.cep || cep
    } catch {}
  }

  // 3) BigDataCloud via proxy, se necessário
  if (!rua && !bairro) {
    try {
      const bdcUrl = new URL('/api/bdc/data/reverse-geocode-client', window.location.origin)
      bdcUrl.searchParams.set('latitude', String(lat))
      bdcUrl.searchParams.set('longitude', String(lon))
      bdcUrl.searchParams.set('localityLanguage', 'pt')
      const d = await fetchJSONWithTimeout(bdcUrl.toString(), { timeout: 4000 })
      const admin = d?.localityInfo?.administrative || []
      const guessBairro = admin.find(x =>
        ['Suburb', 'Neighbourhood', 'District'].includes(x?.description)
      )?.name
      bairro = guessBairro || d?.locality || bairro
    } catch {}
  }

  if (!rua && !bairro && !numero) {
    throw new Error('Reverse geocoding indisponível')
  }

  return { rua, numero, bairro, cep }
}

// ----------------- cotação (km + taxa) -----------------
export async function quoteDelivery(userCoords) {
  let km, mode
  try {
    km = await drivingKmOSRM(userCoords, STORE_COORDS)
    mode = 'osrm'
  } catch {
    km = haversineKm(userCoords, STORE_COORDS) * inflateLineFactor
    mode = 'line'
  }
  const fee = priceForKm(km)
  return { km, fee, mode }
}
