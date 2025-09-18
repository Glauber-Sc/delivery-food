import React, { useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { useUIStore } from '../store/uiStore'

export default function Toast() {
  const { toasts, removeToast } = useUIStore()

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          getIcon={getIcon}
          getBgColor={getBgColor}
        />
      ))}
    </div>
  )
}

function ToastItem({ toast, onRemove, getIcon, getBgColor }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 5000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={`${getBgColor(toast.type)} border rounded-lg p-4 shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        {getIcon(toast.type)}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}