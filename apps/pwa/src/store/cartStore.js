// import { create } from 'zustand'
// import { persist } from 'zustand/middleware'

// export const useCartStore = create(
//   persist(
//     (set, get) => ({
//       items: [],
      
//       addItem: (product, selectedOptions, quantidade = 1) => {
//         set((state) => {
//           const existingItemIndex = state.items.findIndex(item => 
//             item.produtoId === product.id && 
//             JSON.stringify(item.perguntasSelecionadas) === JSON.stringify(selectedOptions)
//           )
          
//           if (existingItemIndex >= 0) {
//             // Update existing item quantity
//             const updatedItems = [...state.items]
//             updatedItems[existingItemIndex].quantidade += quantidade
//             return { items: updatedItems }
//           } else {
//             // Add new item
//             const newItem = {
//               id: `${product.id}_${Date.now()}`,
//               produtoId: product.id,
//               nome: product.nome,
//               precoBase: product.precoBase,
//               imagem: product.imagem,
//               quantidade,
//               perguntasSelecionadas: selectedOptions,
//               precoCalculado: calculateItemPrice(product, selectedOptions)
//             }
//             return { items: [...state.items, newItem] }
//           }
//         })
//       },
      
//       removeItem: (itemId) => {
//         set((state) => ({
//           items: state.items.filter(item => item.id !== itemId)
//         }))
//       },
      
//       updateItemQuantity: (itemId, quantidade) => {
//         set((state) => ({
//           items: state.items.map(item =>
//             item.id === itemId ? { ...item, quantidade } : item
//           ).filter(item => item.quantidade > 0)
//         }))
//       },
      
//       clearCart: () => {
//         set({ items: [] })
//       },
      
//       getTotal: () => {
//         const { items } = get()
//         return items.reduce((total, item) => total + (item.precoCalculado * item.quantidade), 0)
//       },
      
//       getItemsCount: () => {
//         const { items } = get()
//         return items.reduce((count, item) => count + item.quantidade, 0)
//       }
//     }),
//     {
//       name: 'cart-storage',
//     }
//   )
// )

// // Helper function to calculate item price with selected options
// function calculateItemPrice(product, selectedOptions) {
//   let price = product.precoBase
  
//   if (selectedOptions && product.perguntas) {
//     for (const pergunta of product.perguntas) {
//       const selectedForQuestion = selectedOptions[pergunta.id]
//       if (selectedForQuestion && Array.isArray(selectedForQuestion)) {
//         for (const selectedOptionId of selectedForQuestion) {
//           const option = pergunta.opcoes?.find(op => op.id === selectedOptionId)
//           if (option && option.deltaPreco) {
//             price += option.deltaPreco
//           }
//         }
//       }
//     }
//   }
  
//   return Math.max(price, 0)
// }


import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Normaliza as seleções para comparação estável (ordena arrays) */
function canonicalizeSelections(selectedOptions = {}, product = {}) {
  const out = {}
  const perguntas = product?.perguntas || []
  for (const p of perguntas) {
    const arr = Array.isArray(selectedOptions[p.id]) ? selectedOptions[p.id] : []
    if (p.tipo === 'text') {
      out[p.id] = [String(arr[0] ?? '')]
    } else {
      // garante consistência mesmo se vier números/strings
      out[p.id] = [...arr].map(String).sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
    }
  }
  // mantém possíveis chaves extras
  for (const k of Object.keys(selectedOptions)) {
    if (out[k] === undefined) out[k] = selectedOptions[k]
  }
  return out
}

/** Monta a lista de “chips” (Feijão, Arroz…) a partir das perguntas/seleções */
function buildSummaryFrom(product, selections) {
  const chips = []
  for (const p of product?.perguntas || []) {
    const values = selections[p.id] || []
    if (p.tipo === 'text') {
      const t = String(values[0] || '').trim()
      if (t) chips.push({ label: t, isObs: true })
      continue
    }
    values.forEach((v) => {
      const op = p.opcoes?.find((o) => o.id === v || o.label === v)
      chips.push({ label: op?.label || String(v), qty: 1 })
    })
  }
  return chips
}

/** Calcula o preço considerando deltas (funciona com id ou label) */
function calculateItemPrice(product, selectedOptions) {
  let price = product.precoBase || 0
  if (selectedOptions && product.perguntas) {
    for (const pergunta of product.perguntas) {
      const selectedForQuestion = selectedOptions[pergunta.id]
      if (Array.isArray(selectedForQuestion)) {
        for (const value of selectedForQuestion) {
          const option =
            pergunta.opcoes?.find((op) => op.id === value || op.label === value)
          if (option && option.deltaPreco) price += option.deltaPreco
        }
      }
    }
  }
  return Math.max(price, 0)
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, selectedOptions, quantidade = 1) => {
        set((state) => {
          // normaliza seleção para comparação e cálculo
          const normalizedSel = canonicalizeSelections(selectedOptions, product)

          // usa resumo vindo do Product (se tiver) ou monta aqui
          const resumoSelecionados =
            Array.isArray(product.resumoSelecionados) && product.resumoSelecionados.length
              ? product.resumoSelecionados
              : buildSummaryFrom(product, normalizedSel)

          const precoCalculado = calculateItemPrice(product, normalizedSel)

          // agrupa mesma combinação produto+seleção
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.produtoId === product.id &&
              JSON.stringify(item.perguntasSelecionadas) === JSON.stringify(normalizedSel)
          )

          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items]
            updatedItems[existingItemIndex].quantidade += quantidade
            return { items: updatedItems }
          }

          // novo item
          const newItem = {
            id: `${product.id}_${Date.now()}`,
            produtoId: product.id,
            nome: product.nome,
            descricao: product.descricao,
            imagem: product.imagem,
            precoBase: product.precoBase,
            precoCalculado,
            quantidade,

            // 👇 necessário para renderizar no carrinho
            perguntas: product.perguntas,
            resumoSelecionados,              // chips prontos (Feijão, Arroz…)
            perguntasSelecionadas: normalizedSel
          }

          return { items: [...state.items, newItem] }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId)
        }))
      },

      updateItemQuantity: (itemId, quantidade) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === itemId ? { ...item, quantidade: Math.max(0, quantidade) } : item
            )
            .filter((item) => (item.quantidade || 0) > 0)
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        const { items } = get()
        return items.reduce(
          (total, item) => total + (item.precoCalculado || 0) * (item.quantidade || 0),
          0
        )
      },

      getItemsCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + (item.quantidade || 0), 0)
      }
    }),
    { name: 'cart-storage' }
  )
)
