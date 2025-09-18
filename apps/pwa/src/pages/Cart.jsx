import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useUIStore } from '../store/uiStore'

export default function Cart() {
  const navigate = useNavigate()
  const { items, removeItem, updateItemQuantity, getTotal } = useCartStore()
  const { settings } = useUIStore()

  // esconde BottomNav aqui também
  useEffect(() => {
    document.body.dataset.hideBottomNav = 'true'
    return () => { delete document.body.dataset.hideBottomNav }
  }, [])

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)

  const subtotal = useMemo(() => getTotal(), [items, getTotal])

  // === IMPORTANTE: taxa de entrega no carrinho deve ser 0 ===
  const deliveryFee = 0

  const serviceFee = settings?.taxaServicoPadrao || 0
  const total = subtotal + deliveryFee + serviceFee

  // usa resumo vindo do produto; se faltar, monta um
  const getSelectedChips = (item) => {
    if (Array.isArray(item.resumoSelecionados) && item.resumoSelecionados.length) {
      return item.resumoSelecionados
    }
    const perguntas = item.perguntas || item.product?.perguntas || []
    const sel = item.perguntasSelecionadas || {}
    const chips = []
    perguntas.forEach((p) => {
      const values = Array.isArray(sel[p.id]) ? sel[p.id] : []
      if (p.tipo === 'text') {
        const v = (values[0] || '').trim()
        if (v) chips.push({ label: v, isObs: true })
        return
      }
      values.forEach((idOuLabel) => {
        const op = p.opcoes?.find(o => o.id === idOuLabel || o.label === idOuLabel)
        chips.push({ label: op?.label || String(idOuLabel), qty: 1 })
      })
    })
    if (chips.length === 0) {
      const planos = []
      Object.values(sel).forEach((arr) => {
        ; (arr || []).forEach((v) => {
          const s = String(v).trim()
          if (s) planos.push({ label: s, qty: 1 })
        })
      })
      return planos
    }
    return chips
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Seu carrinho está vazio</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-[120px]">
      <div className="px-4 pt-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Itens adicionados</h2>

        {/* Itens */}
        <div className="space-y-4 mb-6">
          {items.map((item) => {
            const imageUrl =
              item.imagem && !item.imagem.includes('placeholder')
                ? `http://localhost:3000${item.imagem}`
                : 'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'

            const unitPrice = item.precoCalculado ?? item.preco ?? item.precoBase ?? 0
            const original = item.precoOriginal || item.precoBase
            const chips = getSelectedChips(item)

            return (
              <div key={`${item.id}-${item._uid || ''}`} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex gap-3">
                  <img
                    src={imageUrl}
                    alt={item.nome}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    onError={(e) => { e.currentTarget.src = 'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.nome}</h3>
                        {item.descricao && (
                          <p className="text-sm text-gray-500 truncate">{item.descricao}</p>
                        )}
                      </div>

                      {/* stepper */}
                      {(() => {
                        const qty = item.quantidade ?? 1
                        return (
                          <div className="bg-gray-100/80 rounded-2xl px-2 py-2 flex items-center gap-2">
                            {qty === 0 ? (
                              <>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                  title="Remover item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>

                                <span className="text-sm font-semibold min-w-[1.5rem] text-center">0</span>

                                <button
                                  onClick={() => updateItemQuantity(item.id, 1)}
                                  className="p-1 rounded-md"
                                  title="Adicionar 1"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => updateItemQuantity(item.id, Math.max(0, qty - 1))}
                                  className="p-1 rounded-md"
                                  title="Diminuir"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>

                                <span className="text-sm font-semibold min-w-[1.5rem] text-center">
                                  {qty}
                                </span>

                                <button
                                  onClick={() => updateItemQuantity(item.id, qty + 1)}
                                  className="p-1 rounded-md"
                                  title="Aumentar"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        )
                      })()}
                    </div>

                    {/* preços */}
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-green-600 font-semibold">{formatPrice(unitPrice)}</span>
                      {(original && original > unitPrice) && (
                        <span className="text-gray-400 line-through">{formatPrice(original)}</span>
                      )}
                    </div>

                    {/* lista vertical de adicionais/observações */}
                    {chips.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {chips.map((c, i) => (
                          <div key={i} className="flex items-center gap-2 text-gray-800">
                            <span className="inline-flex w-6 h-6 text-[11px] items-center justify-center rounded-full bg-gray-100">
                              {c.isObs ? '•' : (c.qty ?? 1)}
                            </span>
                            <span className="text-[15px]">{c.isObs ? `Obs: ${c.label}` : c.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mb-6">
          <button onClick={() => navigate('/')} className="text-red-600 font-semibold">
            Adicionar mais itens
          </button>
        </div>

        {/* Resumo de valores */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm mb-24">
          <h3 className="font-semibold text-gray-900 mb-3">Resumo de valores</h3>
          <div className="space-y-2 text-[15px]">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de entrega</span>
              <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                {deliveryFee === 0 ? 'R$ 0,00' : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 flex items-center gap-1">
                Taxa de serviço
                <span className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-gray-100 text-[10px] text-gray-500">?</span>
              </span>
              <span>{formatPrice(serviceFee)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra fixa inferior */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-gray-500">
              {/* No carrinho, a taxa é zero e só será calculada no checkout */}
              Total
            </div>
            <div className="font-semibold">
              {formatPrice(total)} <span className="text-gray-500 text-xs">/ {items.length} {items.length > 1 ? 'itens' : 'item'}</span>
            </div>
          </div>
          <button onClick={() => navigate('/checkout')} className="rounded-xl bg-red-600 text-white font-semibold px-6 py-3">
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
