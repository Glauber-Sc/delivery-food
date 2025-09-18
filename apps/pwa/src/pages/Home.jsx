import React, { useEffect, useMemo, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'
import { Search } from 'lucide-react'

// MOCKS para a seção de PROMOÇÕES (grid) — itens fictícios, como solicitado
const PROMO_GRID = [
  {
    id: 'promo-1',
    titulo: 'Mixed Salad Bento',
    distancia: '1.6 km',
    aval: 4.8,
    pedidos: 230,
    preco: 'R$ 6,00',
    tempo: '15-20m',
    badge: 'PROMO',
    emoji: '🥗'
  },
  {
    id: 'promo-2',
    titulo: 'Vegetarian Menu',
    distancia: '1.8 km',
    aval: 4.7,
    pedidos: 200,
    preco: 'R$ 5,50',
    tempo: '15-20m',
    badge: 'PROMO',
    emoji: '🥦'
  }
]

export default function Home() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showError, updateSettings, settings } = useUIStore()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Carrega configurações primeiro (usa o que já existe no app)
      const settings = await ApiService.getSettings()
      updateSettings(settings)

      // Carrega categorias e produtos reais
      const [categoriesData, productsData] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getProducts()
      ])

      setCategories(categoriesData)
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading data:', error)
      showError('Erro ao carregar dados. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    return selectedCategory
      ? products.filter(p => p.categoriaId === selectedCategory)
      : products
  }, [products, selectedCategory])

  // Map simples para ícones/emoji de categorias (usa os nomes reais de categorias se existirem)
  const categoryEmoji = useMemo(() => ({
    hamburguer: '🍔',
    burger: '🍔',
    pizza: '🍕',
    massas: '🍝',
    noodles: '🍜',
    carne: '🥩',
    vegetariano: '🥗',
    vegano: '🌱',
    sobremesa: '🍰',
    bebida: '🥤',
    drinks: '🍹',
  }), [])

  const getEmoji = (nome) => {
    if (!nome) return '🍽️'
    const key = nome.toLowerCase()
    for (const k of Object.keys(categoryEmoji)) {
      if (key.includes(k)) return categoryEmoji[k]
    }
    return '🍽️'
  }

  // Banners (até 3 imagens) — usa settings.banners se existir
  const heroBanners = useMemo(() => {
    const fromSettings = settings?.banners?.length
      ? settings.banners.map((b, i) => ({
        id: b.id ?? `sb_${i}`,
        image: b.image || b.url || b.src,
        title: b.title,
        subtitle: b.subtitle,
        overlay: b.overlay
      }))
      : null

    const fallback = [
      {
        id: 'fb1',
        image:
          'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: '30%',
        subtitle: 'DESCONTO • Válido só hoje!',
        overlay: 'rgba(16,185,129,.6)'
      },
      {
        id: 'fb2',
        image:
          'https://images.pexels.com/photos/4109130/pexels-photo-4109130.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Compre 1, leve 2',
        subtitle: 'Burgers selecionados',
        overlay: 'rgba(225,29,72,.45)'
      },
      {
        id: 'fb3',
        image:
          'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1200',
        title: 'Frete grátis',
        subtitle: 'em pedidos acima de R$ 40',
        overlay: 'rgba(0,0,0,.35)'
      }
    ]

    return (fromSettings || fallback).slice(0, 3)
  }, [settings])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <>
      {/* CSS embutido para ocultar a barra de rolagem horizontal (sem CSS externo) */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }          /* Chrome/Safari/Opera */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } /* IE/Edge/Firefox */
      `}</style>

      <div className="px-4 pb-24 pt-3 max-w-md mx-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
            <div className="leading-tight">
              <p className="text-xs text-gray-500">Entregar em</p>
              <button className="flex items-center gap-1 text-[15px] font-semibold">
                Passagem cabral, 78
              </button>
            </div>
          </div>
        </div>

        {/* BUSCA */}
        <div className="mt-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-3 py-2">
            <Search className="text-gray-400" />
            <input
              type="text"
              placeholder="O que você quer comer?"
              className="bg-transparent outline-none w-full text-[15px] placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* OFERTAS ESPECIAIS */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">Ofertas Especiais</h2>
            <button className="text-primary-600 text-sm font-medium">Ver tudo</button>
          </div>
          <HeroBanners banners={heroBanners} />
        </div>

        {/* CATEGORIAS (rolagem horizontal de ícones) */}
        {categories.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Categorias</h2>
              <button className="text-primary-600 text-sm font-medium">Ver tudo</button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {/* Algumas categorias fixas úteis */}
              {[{ id: null, nome: 'Hambúrguer' }, { id: null, nome: 'Pizza' }, { id: null, nome: 'Noodles' }, { id: null, nome: 'Carne' }, { id: null, nome: 'Vegetais' }, { id: null, nome: 'Sobremesa' }, { id: null, nome: 'Bebida' }]
                .concat(categories)
                .slice(0, 9)
                .map((cat, idx) => (
                  <button
                    key={`${cat.id ?? 'static'}-${idx}`}
                    onClick={() => cat.id ? setSelectedCategory(cat.id) : setSelectedCategory(null)}
                    className="flex flex-col items-center min-w-[56px]"
                  >
                    <span className={`h-12 w-12 grid place-items-center rounded-full border ${selectedCategory === cat.id ? 'bg-primary-50 border-primary-500' : 'bg-white border-gray-200'}`}>
                      <span className="text-xl">{getEmoji(cat.nome)}</span>
                    </span>
                    <span className="mt-1 text-[11px] text-gray-700 line-clamp-1">{cat.nome}</span>
                  </button>
                ))}
              <button className="flex flex-col items-center min-w-[56px]">
                <span className="h-12 w-12 grid place-items-center rounded-full border bg-white border-gray-200 text-xl">⋯</span>
                <span className="mt-1 text-[11px] text-gray-700">Mais</span>
              </button>
            </div>
          </div>
        )}

        {/* DESCONTOS GARANTIDOS (PROMOÇÕES em GRID — MOCK) */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Descontos garantidos! <span className="align-middle">👍</span></h2>
            <button className="text-primary-600 text-sm font-medium">Ver tudo</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PROMO_GRID.map(p => (
              <div key={p.id} className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-50 grid place-items-center text-5xl select-none">{p.emoji}
                  <span className="absolute left-2 top-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full">{p.badge}</span>
                </div>
                <div className="p-2">
                  <p className="text-[13px] font-semibold leading-tight line-clamp-2">{p.titulo}</p>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                    <span>⭐ {p.aval}</span>
                    <span>•</span>
                    <span>{p.tempo}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[13px] font-semibold text-emerald-600">{p.preco}</span>
                    <button className="h-7 w-7 grid place-items-center rounded-full bg-primary-500 text-white">＋</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RECOMENDADOS PARA VOCÊ (lista real com ProductCard) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-lg">Recomendados para você <span className="align-middle">🍔</span></h2>
            <button className="text-primary-600 text-sm font-medium">Ver tudo</button>
          </div>

          {/* Chips de filtro (usa todas as suas categorias reais) */}
          {categories.length > 0 && (
            <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${selectedCategory === null
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-700 border-gray-300'
                  }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${selectedCategory === cat.id
                      ? 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          )}

          {/* Lista com os SEUS produtos reais */}
          <div className="space-y-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de boas-vindas quando não houver produtos */}
        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bem-vindo ao Sabor Express!
            </h2>
            <p className="text-gray-500">
              Em breve teremos deliciosos produtos disponíveis para você.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

// --- Carrossel de banners com bullets discretas ---
function HeroBanners({ banners = [] }) {
  const data = (banners || []).slice(0, 3)
  const scrollerRef = useRef(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.clientWidth)
      setActive(idx)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el || data.length <= 1) return
    const id = setInterval(() => {
      const next = (active + 1) % data.length
      el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' })
      setActive(next)
    }, 4000)
    return () => clearInterval(id)
  }, [active, data.length])

  const goTo = (i) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
    setActive(i)
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth rounded-2xl"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex">
          {data.map((b, i) => (
            <div key={b.id || i} className="w-full shrink-0 snap-start">
              <div className="relative h-36 rounded-2xl overflow-hidden">
                <img src={b.image} alt={b.title || 'banner'} className="w-full h-full object-cover" />
                {b.overlay && <div className="absolute inset-0" style={{ background: b.overlay }} />}
                {(b.title || b.subtitle) && (
                  <div className="absolute inset-0 p-4 text-white flex flex-col justify-center">
                    {b.title && <div className="text-3xl font-extrabold leading-none">{b.title}</div>}
                    {b.subtitle && <div className="text-xs opacity-90">{b.subtitle}</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* bullets discretas */}
      <div className="absolute left-0 right-0 -bottom-2 flex justify-center gap-1.5">
        {data.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 w-1.5 rounded-full transition-opacity ${i === active ? 'bg-gray-900/60' : 'bg-gray-400/30'
              }`}
            aria-label={`Ir para banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
