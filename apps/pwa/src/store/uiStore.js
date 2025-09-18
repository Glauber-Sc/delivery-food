import { create } from 'zustand'

export const useUIStore = create((set, get) => ({
  toasts: [],
  settings: {
    nomeLoja: 'Sabor Express',
    taxaEntregaPadrao: 0,          // <- antes era 5.00
    tempoMedioPreparoMin: 25
  },
  
  addToast: (toast) => {
    const id = Date.now()
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },
  
  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
  },
  
  // Helper methods
  showSuccess: (message) => {
    get().addToast({ type: 'success', message })
  },
  
  showError: (message) => {
    get().addToast({ type: 'error', message })
  },
  
  showWarning: (message) => {
    get().addToast({ type: 'warning', message })
  },
  
  showInfo: (message) => {
    get().addToast({ type: 'info', message })
  }
}))
