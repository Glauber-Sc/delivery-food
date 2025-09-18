import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  // Use placeholder image if product image is not available
  const imageUrl = product.imagem && !product.imagem.includes('placeholder') 
    ? `http://localhost:3000${product.imagem}`
    : 'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'

  return (
    <div 
      className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="flex gap-3">
        <img
          src={imageUrl}
          alt={product.nome}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
          onError={(e) => {
            e.target.src = 'https://tse1.mm.bing.net/th/id/OIP.2dhr5Ln6cMHIu9SmwE_uBgHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
          }}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {product.nome}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
            {product.descricao}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="font-bold text-primary-600">
              {formatPrice(product.precoBase)}
            </span>
            <button
              className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/product/${product.id}`)
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}