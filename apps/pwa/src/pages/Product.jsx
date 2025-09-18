import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Minus, Plus } from 'lucide-react'
import ApiService from '../services/api'
import { useCartStore } from '../store/cartStore'
import { useUIStore } from '../store/uiStore'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [errors, setErrors] = useState({})

  const { addItem } = useCartStore()
  const { showSuccess, showError } = useUIStore()

  // esconde BottomNav nesta tela
  useEffect(() => {
    document.body.dataset.hideBottomNav = 'true'
    return () => { delete document.body.dataset.hideBottomNav }
  }, [])

  useEffect(() => { loadProduct() }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getProduct(id)
      setProduct(data)

      const defaults = {}
      if (data.perguntas) {
        for (const p of data.perguntas) {
          if (p.tipo === 'single' || p.tipo === 'multiple') {
            const def = p.opcoes?.filter(o => o.selecionadaPorPadrao).map(o => o.id) || []
            if (def.length) defaults[p.id] = def
            else if (p.obrigatoria && p.opcoes?.length) defaults[p.id] = [p.opcoes[0].id]
            else defaults[p.id] = []
          } else if (p.tipo === 'text') {
            defaults[p.id] = ['']
          }
        }
      }
      setSelectedOptions(defaults)
    } catch (e) {
      console.error(e)
      showError('Erro ao carregar produto')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleOptionChange = (perguntaId, optionId, pergunta) => {
    setSelectedOptions(prev => {
      const current = prev[perguntaId] || []
      if (pergunta.tipo === 'single') return { ...prev, [perguntaId]: [optionId] }
      if (pergunta.tipo === 'multiple') {
        const isSel = current.includes(optionId)
        const next = isSel ? current.filter(id => id !== optionId) : [...current, optionId]
        return { ...prev, [perguntaId]: next }
      }
      return prev
    })
    setErrors(prev => ({ ...prev, [perguntaId]: null }))
  }

  const handleTextChange = (perguntaId, value) => {
    const capped = value.slice(0, 140) // contador 0/140
    setSelectedOptions(prev => ({ ...prev, [perguntaId]: [capped] }))
    setErrors(prev => ({ ...prev, [perguntaId]: null }))
  }

  const validateSelections = () => {
    const newErrors = {}
    if (product?.perguntas) {
      for (const p of product.perguntas) {
        const selected = selectedOptions[p.id] || []
        if (p.tipo === 'text') {
          if (p.obrigatoria && (!selected[0] || selected[0].trim() === '')) {
            newErrors[p.id] = 'Este campo é obrigatório'
          }
        } else {
          if (p.obrigatoria && selected.length === 0) newErrors[p.id] = 'Este campo é obrigatório'
          else if (p.min && selected.length < p.min) newErrors[p.id] = `Selecione pelo menos ${p.min} opção(ões)`
          else if (p.max && selected.length > p.max) newErrors[p.id] = `Selecione no máximo ${p.max} opção(ões)`
        }
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isReadyToAdd = useMemo(() => {
    if (!product) return false
    if (product.perguntas) {
      for (const p of product.perguntas) {
        const sel = selectedOptions[p.id] || []
        if (p.tipo === 'text') {
          if (p.obrigatoria && (!sel[0] || sel[0].trim() === '')) return false
        } else {
          if (p.obrigatoria && sel.length === 0) return false
          if (p.min && sel.length < p.min) return false
          if (p.max && sel.length > p.max) return false
        }
      }
    }
    return true
  }, [product, selectedOptions])

  const calculatePrice = () => {
    if (!product) return 0
    let price = product.precoBase
    if (product.perguntas) {
      for (const p of product.perguntas) {
        const sel = selectedOptions[p.id] || []
        for (const id of sel) {
          const opt = p.opcoes?.find(o => o.id === id)
          if (opt?.deltaPreco) price += opt.deltaPreco
        }
      }
    }
    return Math.max(price, 0)
  }

  // cria lista pronta para o carrinho (chips)
  const montarResumoSelecionados = () => {
    const chips = []
    for (const p of product?.perguntas || []) {
      const sel = selectedOptions[p.id] || []
      if (p.tipo === 'text') {
        const texto = (sel[0] || '').trim()
        if (texto) chips.push({ label: texto, isObs: true })
        continue
      }
      sel.forEach((idOuLabel) => {
        const op = p.opcoes?.find(o => o.id === idOuLabel || o.label === idOuLabel)
        chips.push({ label: op?.label || String(idOuLabel), qty: 1 })
      })
    }
    return chips
  }


  const handleStepper = (pergunta, optionId, delta) => {
  setSelectedOptions(prev => {
    const atual = prev[pergunta.id] || [];
    const totalSel = atual.length;

    // remover
    if (delta < 0) {
      // impede quebrar mínimo (se houver)
      if (pergunta.min && totalSel <= pergunta.min) return prev;
      return { ...prev, [pergunta.id]: atual.filter(id => id !== optionId) };
    }

    // adicionar (vira 1 se ainda não estiver selecionado)
    if (!atual.includes(optionId)) {
      // respeita o máximo total (se houver)
      if (pergunta.max && totalSel >= pergunta.max) return prev;
      return { ...prev, [pergunta.id]: [...atual, optionId] };
    }
    return prev; // já é 1, não aumenta mais
  });

  setErrors(prev => ({ ...prev, [pergunta.id]: null }));
};


  const handleAddToCart = () => {
    if (!validateSelections()) {
      showError('Por favor, complete todas as opções obrigatórias')
      return
    }

    const resumoSelecionados = montarResumoSelecionados()
    const enrichedProduct = {
      ...product,
      perguntas: product.perguntas,
      resumoSelecionados
    }

    addItem(enrichedProduct, selectedOptions, quantidade)
    showSuccess('Produto adicionado ao carrinho!')
    navigate('/cart')
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const currentPrice = calculatePrice()
  const imageUrl =
    product.imagem && !product.imagem.includes('placeholder')
      ? `http://localhost:3000${product.imagem}`
      : 'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'

  const helperText = (p) => {
    if (p.tipo === 'single') return 'Escolha 1 opção'
    if (p.tipo === 'multiple') {
      if (p.min && p.max) return `Escolha de ${p.min} a ${p.max} opções`
      if (p.max) return `Escolha até ${p.max} opções`
      if (p.min) return `Escolha pelo menos ${p.min} opções`
      return 'Escolha as opções'
    }
    return null
  }

  return (
    <div className="bg-white min-h-screen pb-[124px]">
      {/* Imagem */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.nome}
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.currentTarget.src =
              'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
          }}
        />
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nome}</h1>
          <p className="text-gray-600 text-base leading-relaxed">{product.descricao}</p>
          <p className="text-2xl font-bold text-gray-900 mt-3">{formatPrice(currentPrice)}</p>
        </div>

        {/* Perguntas */}
        {product.perguntas && product.perguntas.map((p) => (
          <div key={p.id} className="mb-6">
            <div className="flex items-center justify-between mb-2">
               <div>
                  <h3 className="font-semibold text-gray-900">{p.titulo}</h3>
                  {(() => {
                    const hint =
                      (p.subtitulo && p.subtitulo.trim()) || helperText(p);
                    return hint ? (
                      <p className="text-sm text-gray-500">{hint}</p>
                    ) : null;
                  })()}
                </div>
              {p.obrigatoria && (
                <span className="text-xs font-bold bg-primary-500 text-white px-3 py-1 rounded-lg">
                  OBRIGATÓRIO
                </span>
              )}
            </div>

            {p.tipo === 'text' ? (
              <>
                <textarea
                  value={selectedOptions[p.id]?.[0] || ''}
                  onChange={(e) => handleTextChange(p.id, e.target.value)}
                  placeholder={p.placeholder || 'Ex: tirar a cebola, maionese à parte etc.'}
                  rows={3}
                  className={`w-full rounded-xl border ${errors[p.id] ? 'border-red-300' : 'border-gray-300'} p-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10`}
                />
                <div className="mt-1 text-right text-xs text-gray-500">
                  {(selectedOptions[p.id]?.[0] || '').length}/140
                </div>
              </>
            ) : (
            <div className="rounded-xl border border-gray-200 overflow-hidden divide-y">
  {p.opcoes?.map((op) => {
    const selecionados = selectedOptions[p.id] || [];
    const isSel = selecionados.includes(op.id);
    const totalSel = selecionados.length;

    const canAdd =
      p.tipo === 'single'
        ? !isSel // rádio — só marca quando não está marcado
        : !isSel && (!p.max || totalSel < p.max); // multiple — só até 1 por item e respeita max total

    const canRemove =
      p.tipo === 'single'
        ? false
        : isSel && (!p.min || totalSel > p.min); // multiple — não deixa quebrar min total

    return (
      <div
        key={op.id}
        className={`flex items-center justify-between px-4 py-3 ${
          isSel ? 'bg-gray-50' : 'bg-white'
        }`}
      >
        <div className="min-w-0 pr-3">
          <div className="text-gray-900 truncate">{op.label}</div>
          {op.deltaPreco !== 0 && (
            <div className="text-xs text-gray-500">
              {op.deltaPreco > 0 ? '+' : ''}
              {formatPrice(op.deltaPreco)}
            </div>
          )}
        </div>

        {/* RIGHT CONTROL */}
        {p.tipo === 'single' ? (
          // Rádio igual ao de tamanho
          <button
            type="button"
            onClick={() => handleOptionChange(p.id, op.id, p)}
            disabled={!canAdd}
            className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${isSel ? 'border-red-600' : 'border-gray-300'}`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full transition ${
                isSel ? 'bg-red-600' : 'bg-transparent'
              }`}
            />
          </button>
        ) : (
          // STEPPER – 0/1 para múltiplos
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleStepper(p, op.id, -1)}
              disabled={!canRemove}
              className="w-10 h-9 rounded-xl border border-gray-200 shadow-sm disabled:opacity-40"
            >
              <span className="block leading-none text-red-600 text-xl">−</span>
            </button>
            <span className="w-6 text-center font-medium">{isSel ? 1 : 0}</span>
            <button
              type="button"
              onClick={() => handleStepper(p, op.id, +1)}
              disabled={!canAdd}
              className="w-10 h-9 rounded-xl border border-gray-200 shadow-sm disabled:opacity-40"
            >
              <span className="block leading-none text-gray-700 text-xl">+</span>
            </button>
          </div>
        )}
      </div>
    );
  })}
</div>

            )}

            {errors[p.id] && <p className="text-red-500 text-sm mt-1">{errors[p.id]}</p>}
          </div>
        ))}

        {/* Denunciar item */}
        <button
          type="button"
          onClick={() => showSuccess('Obrigado pelo feedback!')}
          className="text-red-600 text-base underline underline-offset-2"
        >
          Denunciar item
        </button>
      </div>

      {/* Barra fixa inferior */}
      <div
        className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t shadow-[0_-8px_24px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
              disabled={quantidade <= 1}
              className="p-2 border border-gray-300 rounded-full disabled:opacity-40"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-semibold min-w-[2.5rem] text-center">{quantidade}</span>
            <button
              onClick={() => setQuantidade(quantidade + 1)}
              className="p-2 border border-gray-300 rounded-full"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!isReadyToAdd}
            className="flex-1 ml-2 rounded-xl bg-red-600 text-white font-semibold py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar • {formatPrice(currentPrice * quantidade)}
          </button>
        </div>
      </div>
    </div>
  )
}


