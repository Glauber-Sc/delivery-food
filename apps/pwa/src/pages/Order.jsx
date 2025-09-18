import React, { useEffect, useMemo, useState } from 'react'
import { Clock, CheckCircle, Truck, Package } from 'lucide-react'
import { io } from 'socket.io-client'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

export default function Order() {
  const [orderHistory, setOrderHistory] = useState([])
  const [activeOrder, setActiveOrder] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const { settings } = useUIStore()

  // TODO: pegar do auth/store
  const phone = '91980824554'

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('pt-BR')

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  const getStatusInfo = (status) => {
    const statusMap = {
      novo: { label: 'Pedido Recebido', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Seu pedido foi recebido e está aguardando confirmação.' },
      aceito: { label: 'Pedido Aceito', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Seu pedido foi aceito e será preparado em breve.' },
      preparo: { label: 'Preparando', icon: CheckCircle, color: 'text-orange-600', bgColor: 'bg-orange-100', description: 'Seu pedido está sendo preparado com cuidado.' },
      pronto: { label: 'Pronto', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Seu pedido está pronto! O entregador sairá em breve.' },
      a_caminho: { label: 'Saiu para entrega', icon: Truck, color: 'text-blue-600', bgColor: 'bg-blue-100', description: 'Seu pedido está a caminho!' },
      concluido: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', description: 'Pedido entregue com sucesso. Obrigado!' },
      cancelado: { label: 'Cancelado', icon: Clock, color: 'text-red-600', bgColor: 'bg-red-100', description: 'Pedido cancelado.' }
    }
    return statusMap[status] || statusMap.novo
  }

  const statusOrder = ['novo', 'aceito', 'preparo', 'pronto', 'a_caminho', 'concluido']

  useEffect(() => {
    loadAll()
  }, [])

  const loadAll = async () => {
    try {
      const [{ active }, byPhone] = await Promise.all([
        ApiService.request(`/orders/active?phone=${phone}`),
        ApiService.request(`/orders/by-phone?phone=${phone}`)
      ])
      setActiveOrder(active || null)
      const finalizados = (byPhone?.orders || []).filter(o => o.status === 'concluido')
      setOrderHistory(finalizados)
    } catch (e) {
      console.error('Erro ao buscar pedidos:', e)
    }
  }

  // socket para pedido ativo
  useEffect(() => {
    if (!activeOrder) return
    const s = io('http://localhost:3000')
    s.on('connect', () => s.emit('join:order', activeOrder.id))
    s.on('order:update', (updated) => {
      if (updated.id !== activeOrder.id) return
      setActiveOrder(updated)
      if (['concluido', 'cancelado'].includes(updated.status)) {
        setActiveOrder(null)
        if (updated.status === 'concluido') {
          setOrderHistory(prev => prev.some(o => o.id === updated.id) ? prev : [updated, ...prev])
        }
      }
    })
    return () => s.disconnect()
  }, [activeOrder])

  const openDetails = async (orderId) => {
    try {
      setDetailsLoading(true)
      const full = await ApiService.getOrder(orderId)
      setSelectedOrder(full)
    } catch (e) {
      console.error('Erro ao carregar detalhes do pedido:', e)
    } finally {
      setDetailsLoading(false)
    }
  }

  const closeDetails = () => setSelectedOrder(null)

  const renderTrackingBlock = (o) => {
    if (!o) return null
    const currentStatusInfo = getStatusInfo(o.status)
    const StatusIcon = currentStatusInfo.icon
    const currentStatusIndex = statusOrder.indexOf(o.status)

    return (
      <>
        {/* Status */}
        <div className="card p-6 mb-6 text-center">
          <div className={`w-16 h-16 ${currentStatusInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <StatusIcon className={`w-8 h-8 ${currentStatusInfo.color}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{currentStatusInfo.label}</h2>
          <p className="text-gray-600">{currentStatusInfo.description}</p>
          {o.status === 'preparo' && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">⏱️ Tempo estimado: ~25 minutos</p>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Acompanhe seu pedido</h3>
          <div className="space-y-4">
            {statusOrder.map((status, index) => {
              const info = getStatusInfo(status)
              const isCompleted = index <= currentStatusIndex
              const isCurrent = index === currentStatusIndex
              const Icon = info.icon

              if (o.status === 'cancelado' && status !== 'novo' && status !== 'cancelado') return null

              return (
                <div key={status} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted ? (isCurrent ? currentStatusInfo.bgColor : 'bg-green-100') : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      isCompleted ? (isCurrent ? currentStatusInfo.color : 'text-green-600') : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{info.label}</p>
                    {isCompleted && o.historico && (
                      <p className="text-sm text-gray-500">
                        {formatTime(o.historico.find(h => h.status === status)?.em || o.criadoEm)}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Detalhes */}
        <div className="card p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pedido</span>
              <span className="font-mono">#{o.id.slice(-8)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Data</span>
              <span>{new Date(o.criadoEm).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{formatPrice(o.total)}</span>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-2">Itens</h4>
            <div className="space-y-2">
              {o.itens.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantidade}x {item.nome}</span>
                  <span>{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ajuda */}
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Precisa de ajuda?</h3>
          <p className="text-gray-600 text-sm mb-2">Entre em contato conosco:</p>
          <p className="text-primary-600 font-medium">📞 (11) 99999-9999</p>
        </div>
      </>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="px-4 py-4">

        {/* Rastreio do pedido ativo (inline) */}
        {activeOrder && (
          <div className="mb-6">
            {renderTrackingBlock(activeOrder)}
          </div>
        )}

        {/* Histórico (cards clicáveis) */}
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Histórico de Pedidos</h3>
          <div className="space-y-3">
            {orderHistory.map(order => (
              <div
                key={order.id}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                role="button"
                tabIndex={0}
                onClick={() => openDetails(order.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDetails(order.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-mono text-sm text-gray-600">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.criadoEm)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{formatPrice(order.total)}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Entregue</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {order.itens.map(i => `${i.quantidade}x ${i.nome}`).join(', ')}
                </p>
              </div>
            ))}

            {orderHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Sem pedidos concluídos ainda</p>
              </div>
            )}
          </div>
        </div>

        {/* App Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Sabor Express v1.0.0</p>
          <p>Feito com ❤️ para você</p>
        </div>
      </div>

      {/* Modal de detalhes (mesmo layout do OrderTracking) */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-6">
          <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-auto max-h-[90vh]">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Detalhes do Pedido</h3>
              <button
                onClick={closeDetails}
                className="text-gray-500 hover:text-gray-700 text-sm px-2 py-1"
              >
                Fechar
              </button>
            </div>

            <div className="px-4 py-4">
              {detailsLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="loading-spinner"></div>
                </div>
              ) : (
                renderTrackingBlock(selectedOrder)
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
