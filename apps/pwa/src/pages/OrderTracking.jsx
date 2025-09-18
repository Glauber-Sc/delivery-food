import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Clock, CheckCircle, Truck, Package } from 'lucide-react'
import { io } from 'socket.io-client'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

export default function OrderTracking() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)
  const { showError } = useUIStore()

  useEffect(() => {
    loadOrder()
    setupSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getOrder(id)
      setOrder(data)
    } catch (error) {
      console.error('Error loading order:', error)
      showError('Erro ao carregar pedido')
    } finally {
      setLoading(false)
    }
  }

  const setupSocket = () => {
    const newSocket = io('http://localhost:3000')
    
    newSocket.on('connect', () => {
      console.log('Connected to socket for order tracking')
      newSocket.emit('join:order', id)
    })

    newSocket.on('order:status', (data) => {
      console.log('Order status update:', data)
      setOrder(prevOrder => {
        if (prevOrder) {
          return { ...prevOrder, status: data.status }
        }
        return prevOrder
      })
    })

    newSocket.on('order:update', (updatedOrder) => {
      console.log('Full order update:', updatedOrder)
      if (updatedOrder.id === id) {
        setOrder(updatedOrder)
      }
    })

    setSocket(newSocket)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      novo: { 
        label: 'Pedido Recebido', 
        icon: Package, 
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Seu pedido foi recebido e está aguardando confirmação.'
      },
      aceito: { 
        label: 'Pedido Aceito', 
        icon: CheckCircle, 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Seu pedido foi aceito e será preparado em breve.'
      },
      preparo: { 
        label: 'Preparando', 
        icon: CheckCircle, 
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        description: 'Seu pedido está sendo preparado com cuidado.'
      },
      pronto: { 
        label: 'Pronto', 
        icon: CheckCircle, 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Seu pedido está pronto! O entregador sairá em breve.'
      },
      a_caminho: { 
        label: 'Saiu para entrega', 
        icon: Truck, 
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: 'Seu pedido está a caminho!'
      },
      concluido: { 
        label: 'Entregue', 
        icon: CheckCircle, 
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: 'Pedido entregue com sucesso. Obrigado!'
      },
      cancelado: { 
        label: 'Cancelado', 
        icon: Clock, 
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        description: 'Pedido cancelado.'
      }
    }

    return statusMap[status] || statusMap.novo
  }

  const statusOrder = ['novo', 'aceito', 'preparo', 'pronto', 'a_caminho', 'concluido']

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const currentStatusInfo = getStatusInfo(order.status)
  const StatusIcon = currentStatusInfo.icon
  const currentStatusIndex = statusOrder.indexOf(order.status)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 py-4">
        {/* Order Status */}
        <div className="card p-6 mb-6 text-center">
          <div className={`w-16 h-16 ${currentStatusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon className={`w-8 h-8 ${currentStatusInfo.color}`} />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {currentStatusInfo.label}
          </h2>
          <p className="text-gray-600">
            {currentStatusInfo.description}
          </p>

          {order.status === 'preparo' && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                ⏱️ Tempo estimado: ~25 minutos
              </p>
            </div>
          )}
        </div>

        {/* Progress Timeline */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Acompanhe seu pedido</h3>
          
          <div className="space-y-4">
            {statusOrder.map((status, index) => {
              const statusInfo = getStatusInfo(status)
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const StatusStepIcon = statusInfo.icon

              // Skip cancelled orders
              if (order.status === 'cancelado' && status !== 'novo' && status !== 'cancelado') {
                return null
              }

              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? isCurrent ? currentStatusInfo.bgColor : 'bg-green-100'
                      : 'bg-gray-100'
                  }`}>
                    <StatusStepIcon className={`w-4 h-4 ${
                      isCompleted 
                        ? isCurrent ? currentStatusInfo.color : 'text-green-600'
                        : 'text-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${
                      isCompleted ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {statusInfo.label}
                    </p>
                    {isCompleted && order.historico && (
                      <p className="text-sm text-gray-500">
                        {formatTime(order.historico.find(h => h.status === status)?.em || order.criadoEm)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pedido</span>
              <span className="font-mono">#{order.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Data</span>
              <span>{new Date(order.criadoEm).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{formatPrice(order.total)}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Itens</h4>
            <div className="space-y-2">
              {order.itens.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantidade}x {item.nome}
                  </span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Precisa de ajuda?</h3>
          <p className="text-gray-600 text-sm mb-2">
            Entre em contato conosco:
          </p>
          <p className="text-primary-600 font-medium">
            📞 (11) 99999-9999
          </p>
        </div>
      </div>
    </div>
  )
}