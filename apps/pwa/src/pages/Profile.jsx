import React, { useState } from 'react'
import { MapPin, Clock, Phone, Star } from 'lucide-react'
import { useUIStore } from '../store/uiStore'

export default function Profile() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Casa',
      address: 'Rua das Flores, 123 - Centro',
      isDefault: true
    }
  ])

  const { settings } = useUIStore()

  const orderHistory = [
    {
      id: 'ord_12345',
      date: '2025-01-15',
      total: 58.90,
      status: 'concluido',
      items: ['Pizza Marguerita', 'Coca-Cola']
    },
    {
      id: 'ord_12344',
      date: '2025-01-10',
      total: 35.50,
      status: 'concluido',
      items: ['X-Burger Clássico']
    }
  ]

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 py-4">
        {/* Restaurant Info */}
        <div className="card p-4 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {settings.nomeLoja}
            </h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-1">4.8 (120 avaliações)</span>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Funcionamento: {settings.horarios?.seg_dom || '18:00-23:59'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4" />
              <span>Contato: (11) 99999-9999</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{settings.endereco || 'Rua das Flores, 123 - Centro'}</span>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Meus Endereços</h3>

          <div className="space-y-3">
            {addresses.map(address => (
              <div key={address.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.address}</p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                    Padrão
                  </span>
                )}
              </div>
            ))}

            <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-300 hover:text-primary-600 transition-colors">
              + Adicionar novo endereço
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sabor Express v1.0.0</p>
          <p>Feito com ❤️ para você</p>
        </div>
      </div>
    </div>
  )
}