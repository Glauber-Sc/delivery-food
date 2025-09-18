// // // // import React, { useState, useEffect } from 'react'
// // // // import { Clock, User, MapPin, Phone, Eye, CheckCircle, X } from 'lucide-react'
// // // // import { io } from 'socket.io-client'
// // // // import ApiService from '../services/api'
// // // // import { useUIStore } from '../store/uiStore'

// // // // export default function Orders() {
// // // //   const [orders, setOrders] = useState([])
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [selectedOrder, setSelectedOrder] = useState(null)
// // // //   const [socket, setSocket] = useState(null)
// // // //   const { showError, showSuccess } = useUIStore()

// // // //   const statusColumns = [
// // // //     { id: 'novo', name: 'Novos', color: 'bg-blue-50 border-blue-200' },
// // // //     { id: 'aceito', name: 'Aceitos', color: 'bg-green-50 border-green-200' },
// // // //     { id: 'preparo', name: 'Preparo', color: 'bg-orange-50 border-orange-200' },
// // // //     { id: 'pronto', name: 'Prontos', color: 'bg-success-50 border-success-200' },
// // // //     { id: 'a_caminho', name: 'A Caminho', color: 'bg-purple-50 border-purple-200' },
// // // //     { id: 'concluido', name: 'Concluídos', color: 'bg-gray-50 border-gray-200' }
// // // //   ]

// // // //   useEffect(() => {
// // // //     loadOrders()
// // // //     setupSocket()

// // // //     return () => {
// // // //       if (socket) {
// // // //         socket.disconnect()
// // // //       }
// // // //     }
// // // //   }, [])

// // // //   const loadOrders = async () => {
// // // //     try {
// // // //       setLoading(true)
// // // //       const response = await ApiService.getOrders()
// // // //       setOrders(response.orders || [])
// // // //     } catch (error) {
// // // //       console.error('Error loading orders:', error)
// // // //       showError('Erro ao carregar pedidos')
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const setupSocket = () => {
// // // //     const newSocket = io('http://localhost:3000')
    
// // // //     newSocket.on('connect', () => {
// // // //       console.log('Connected to socket for admin')
// // // //       newSocket.emit('join:admin')
// // // //     })

// // // //     newSocket.on('order:new', (order) => {
// // // //       console.log('New order received:', order)
// // // //       setOrders(prev => [order, ...prev])
// // // //       showSuccess(`Novo pedido recebido! #${order.id.slice(-8)}`)
// // // //       playNotificationSound()
// // // //     })

// // // //     newSocket.on('order:update', (updatedOrder) => {
// // // //       console.log('Order updated:', updatedOrder)
// // // //       setOrders(prev => 
// // // //         prev.map(order => 
// // // //           order.id === updatedOrder.id ? updatedOrder : order
// // // //         )
// // // //       )
// // // //     })

// // // //     setSocket(newSocket)
// // // //   }

// // // //   const playNotificationSound = () => {
// // // //     // Simple notification sound using Audio API
// // // //     const audioContext = new (window.AudioContext || window.webkitAudioContext)()
// // // //     const oscillator = audioContext.createOscillator()
// // // //     const gainNode = audioContext.createGain()

// // // //     oscillator.connect(gainNode)
// // // //     gainNode.connect(audioContext.destination)

// // // //     oscillator.frequency.value = 800
// // // //     oscillator.type = 'sine'
// // // //     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
// // // //     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

// // // //     oscillator.start(audioContext.currentTime)
// // // //     oscillator.stop(audioContext.currentTime + 0.5)
// // // //   }

// // // //   const updateOrderStatus = async (orderId, newStatus) => {
// // // //     try {
// // // //       await ApiService.updateOrderStatus(orderId, newStatus)
// // // //       showSuccess('Status atualizado com sucesso!')
      
// // // //       // Emit socket event for real-time updates
// // // //       if (socket) {
// // // //         socket.emit('order:status', { orderId, status: newStatus })
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error updating order status:', error)
// // // //       showError('Erro ao atualizar status do pedido')
// // // //     }
// // // //   }

// // // //   const formatPrice = (price) => {
// // // //     return new Intl.NumberFormat('pt-BR', {
// // // //       style: 'currency',
// // // //       currency: 'BRL'
// // // //     }).format(price)
// // // //   }

// // // //   const formatTime = (dateString) => {
// // // //     return new Date(dateString).toLocaleTimeString('pt-BR', {
// // // //       hour: '2-digit',
// // // //       minute: '2-digit'
// // // //     })
// // // //   }

// // // //   const getStatusActions = (order) => {
// // // //     const actions = []
    
// // // //     switch (order.status) {
// // // //       case 'novo':
// // // //         actions.push({ label: 'Aceitar', status: 'aceito', color: 'btn-success' })
// // // //         actions.push({ label: 'Cancelar', status: 'cancelado', color: 'btn-danger' })
// // // //         break
// // // //       case 'aceito':
// // // //         actions.push({ label: 'Iniciar Preparo', status: 'preparo', color: 'btn-primary' })
// // // //         break
// // // //       case 'preparo':
// // // //         actions.push({ label: 'Marcar Pronto', status: 'pronto', color: 'btn-success' })
// // // //         break
// // // //       case 'pronto':
// // // //         actions.push({ label: 'Saiu p/ Entrega', status: 'a_caminho', color: 'btn-primary' })
// // // //         break
// // // //       case 'a_caminho':
// // // //         actions.push({ label: 'Concluir', status: 'concluido', color: 'btn-success' })
// // // //         break
// // // //     }

// // // //     return actions
// // // //   }

// // // //   const getOrdersByStatus = (status) => {
// // // //     return orders.filter(order => order.status === status)
// // // //   }

// // // //   if (loading) {
// // // //     return (
// // // //       <div className="flex items-center justify-center h-64">
// // // //         <div className="loading-spinner"></div>
// // // //       </div>
// // // //     )
// // // //   }

// // // //   return (
// // // //     <div>
// // // //       {/* Page header */}
// // // //       <div className="mb-6">
// // // //         <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
// // // //         <p className="text-gray-600">
// // // //           Gerencie todos os pedidos em tempo real
// // // //         </p>
// // // //       </div>

// // // //       {/* Kanban Board */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
// // // //         {statusColumns.map(column => {
// // // //           const columnOrders = getOrdersByStatus(column.id)
          
// // // //           return (
// // // //             <div key={column.id} className="flex flex-col">
// // // //               <div className={`${column.color} border rounded-lg p-3 mb-4`}>
// // // //                 <h3 className="font-semibold text-gray-900 text-center">
// // // //                   {column.name}
// // // //                   <span className="ml-2 bg-white px-2 py-1 rounded-full text-sm">
// // // //                     {columnOrders.length}
// // // //                   </span>
// // // //                 </h3>
// // // //               </div>

// // // //               <div className="space-y-3 flex-1">
// // // //                 {columnOrders.map(order => (
// // // //                   <div
// // // //                     key={order.id}
// // // //                     className="kanban-card"
// // // //                     onClick={() => setSelectedOrder(order)}
// // // //                   >
// // // //                     <div className="flex justify-between items-start mb-2">
// // // //                       <span className="font-mono text-sm text-gray-600">
// // // //                         #{order.id.slice(-8)}
// // // //                       </span>
// // // //                       <span className="text-xs text-gray-500">
// // // //                         {formatTime(order.criadoEm)}
// // // //                       </span>
// // // //                     </div>

// // // //                     <div className="space-y-2 mb-3">
// // // //                       <div className="flex items-center gap-2 text-sm">
// // // //                         <User className="w-4 h-4 text-gray-500" />
// // // //                         <span className="truncate">{order.cliente.nome}</span>
// // // //                       </div>
// // // //                       <div className="flex items-center gap-2 text-sm">
// // // //                         <Phone className="w-4 h-4 text-gray-500" />
// // // //                         <span>{order.cliente.telefone}</span>
// // // //                       </div>
// // // //                     </div>

// // // //                     <div className="text-lg font-bold text-primary-600 mb-3">
// // // //                       {formatPrice(order.total)}
// // // //                     </div>

// // // //                     <div className="text-xs text-gray-500 mb-3">
// // // //                       {order.itens.length} item(s)
// // // //                     </div>

// // // //                     {/* Action buttons */}
// // // //                     <div className="space-y-1">
// // // //                       {getStatusActions(order).map(action => (
// // // //                         <button
// // // //                           key={action.status}
// // // //                           onClick={(e) => {
// // // //                             e.stopPropagation()
// // // //                             updateOrderStatus(order.id, action.status)
// // // //                           }}
// // // //                           className={`${action.color} w-full text-xs py-1 px-2`}
// // // //                         >
// // // //                           {action.label}
// // // //                         </button>
// // // //                       ))}
// // // //                     </div>
// // // //                   </div>
// // // //                 ))}
                
// // // //                 {columnOrders.length === 0 && (
// // // //                   <div className="text-center text-gray-400 py-8">
// // // //                     Nenhum pedido
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           )
// // // //         })}
// // // //       </div>

// // // //       {/* Order Detail Modal */}
// // // //       {selectedOrder && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // //             <div className="p-6">
// // // //               <div className="flex justify-between items-start mb-6">
// // // //                 <div>
// // // //                   <h2 className="text-xl font-bold text-gray-900">
// // // //                     Pedido #{selectedOrder.id.slice(-8)}
// // // //                   </h2>
// // // //                   <p className="text-gray-600">
// // // //                     {new Date(selectedOrder.criadoEm).toLocaleString('pt-BR')}
// // // //                   </p>
// // // //                 </div>
// // // //                 <button
// // // //                   onClick={() => setSelectedOrder(null)}
// // // //                   className="text-gray-400 hover:text-gray-600"
// // // //                 >
// // // //                   <X className="w-6 h-6" />
// // // //                 </button>
// // // //               </div>

// // // //               {/* Customer Info */}
// // // //               <div className="card p-4 mb-6">
// // // //                 <h3 className="font-semibold mb-3">Dados do Cliente</h3>
// // // //                 <div className="space-y-2">
// // // //                   <div className="flex items-center gap-2">
// // // //                     <User className="w-4 h-4 text-gray-500" />
// // // //                     <span>{selectedOrder.cliente.nome}</span>
// // // //                   </div>
// // // //                   <div className="flex items-center gap-2">
// // // //                     <Phone className="w-4 h-4 text-gray-500" />
// // // //                     <span>{selectedOrder.cliente.telefone}</span>
// // // //                   </div>
// // // //                   <div className="flex items-start gap-2">
// // // //                     <MapPin className="w-4 h-4 text-gray-500 mt-1" />
// // // //                     <div>
// // // //                       <p>{selectedOrder.endereco.rua}, {selectedOrder.endereco.numero}</p>
// // // //                       <p>{selectedOrder.endereco.bairro}</p>
// // // //                       {selectedOrder.endereco.complemento && (
// // // //                         <p className="text-sm text-gray-600">{selectedOrder.endereco.complemento}</p>
// // // //                       )}
// // // //                     </div>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Order Items */}
// // // //               <div className="card p-4 mb-6">
// // // //                 <h3 className="font-semibold mb-3">Itens do Pedido</h3>
// // // //                 <div className="space-y-3">
// // // //                   {selectedOrder.itens.map((item, index) => (
// // // //                     <div key={index} className="flex justify-between">
// // // //                       <div>
// // // //                         <p className="font-medium">{item.quantidade}x {item.nome}</p>
// // // //                         {item.perguntasSelecionadas && (
// // // //                           <p className="text-sm text-gray-600">
// // // //                             {Object.entries(item.perguntasSelecionadas).map(([key, values]) => 
// // // //                               Array.isArray(values) ? values.join(', ') : values
// // // //                             ).filter(Boolean).join(', ')}
// // // //                           </p>
// // // //                         )}
// // // //                       </div>
// // // //                       <span className="font-semibold">{formatPrice(item.subtotal)}</span>
// // // //                     </div>
// // // //                   ))}
// // // //                 </div>

// // // //                 <div className="border-t pt-3 mt-3 space-y-2">
// // // //                   <div className="flex justify-between text-sm">
// // // //                     <span>Subtotal</span>
// // // //                     <span>{formatPrice(selectedOrder.subtotal)}</span>
// // // //                   </div>
// // // //                   <div className="flex justify-between text-sm">
// // // //                     <span>Taxa de entrega</span>
// // // //                     <span>{formatPrice(selectedOrder.taxaEntrega)}</span>
// // // //                   </div>
// // // //                   <div className="flex justify-between font-bold text-lg border-t pt-2">
// // // //                     <span>Total</span>
// // // //                     <span className="text-primary-600">{formatPrice(selectedOrder.total)}</span>
// // // //                   </div>
// // // //                 </div>
// // // //               </div>

// // // //               {/* Payment Info */}
// // // //               <div className="card p-4 mb-6">
// // // //                 <h3 className="font-semibold mb-3">Pagamento</h3>
// // // //                 <div className="space-y-2">
// // // //                   <div className="flex justify-between">
// // // //                     <span>Método</span>
// // // //                     <span className="capitalize">{selectedOrder.pagamento.metodo.replace('_', ' ')}</span>
// // // //                   </div>
// // // //                   {selectedOrder.pagamento.troco > 0 && (
// // // //                     <div className="flex justify-between">
// // // //                       <span>Troco para</span>
// // // //                       <span>{formatPrice(selectedOrder.pagamento.troco)}</span>
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               </div>

// // // //               {/* Observations */}
// // // //               {selectedOrder.observacoes && (
// // // //                 <div className="card p-4 mb-6">
// // // //                   <h3 className="font-semibold mb-3">Observações</h3>
// // // //                   <p className="text-gray-600">{selectedOrder.observacoes}</p>
// // // //                 </div>
// // // //               )}

// // // //               {/* Action buttons */}
// // // //               <div className="flex gap-2">
// // // //                 {getStatusActions(selectedOrder).map(action => (
// // // //                   <button
// // // //                     key={action.status}
// // // //                     onClick={() => {
// // // //                       updateOrderStatus(selectedOrder.id, action.status)
// // // //                       setSelectedOrder(null)
// // // //                     }}
// // // //                     className={action.color}
// // // //                   >
// // // //                     {action.label}
// // // //                   </button>
// // // //                 ))}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }



// // // import React, { useState, useEffect, useMemo } from 'react'
// // // import { Clock, User, MapPin, Phone, X, ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
// // // import { io } from 'socket.io-client'
// // // import ApiService from '../services/api'
// // // import { useUIStore } from '../store/uiStore'

// // // export default function Orders() {
// // //   const [orders, setOrders] = useState([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [selectedOrder, setSelectedOrder] = useState(null)
// // //   const [socket, setSocket] = useState(null)
// // //   const { showError, showSuccess } = useUIStore()

// // //   // ======= Filtro/Paginação por DIA =======
// // //   const toDateStr = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
// // //   const todayStr = toDateStr(new Date())
// // //   const [selectedDate, setSelectedDate] = useState(todayStr)

// // //   const isToday = selectedDate === todayStr
// // //   const isYesterday = (() => {
// // //     const y = new Date(); y.setDate(y.getDate() - 1)
// // //     return selectedDate === toDateStr(y)
// // //   })()

// // //   const getDateLabel = (isoDate) => {
// // //     if (!isoDate) return ''
// // //     if (isoDate === todayStr) return 'Hoje'
// // //     const y = new Date(); y.setDate(y.getDate() - 1)
// // //     if (isoDate === toDateStr(y)) return 'Ontem'
// // //     return new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR')
// // //   }

// // //   const goPrevDay = () => {
// // //     const d = new Date(selectedDate + 'T00:00:00')
// // //     d.setDate(d.getDate() - 1)
// // //     setSelectedDate(toDateStr(d))
// // //   }

// // //   const goNextDay = () => {
// // //     const d = new Date(selectedDate + 'T00:00:00')
// // //     d.setDate(d.getDate() + 1)
// // //     const next = toDateStr(d)
// // //     // não deixa ir para depois de hoje
// // //     if (next <= todayStr) setSelectedDate(next)
// // //   }

// // //   // ======= Colunas =======
// // //   const statusColumns = [
// // //     { id: 'novo', name: 'Novos', color: 'bg-red-50 border-red-200' },
// // //     { id: 'aceito', name: 'Aceitos', color: 'bg-green-50 border-green-200' },
// // //     { id: 'preparo', name: 'Preparo', color: 'bg-amber-50 border-amber-200' },
// // //     { id: 'pronto', name: 'Prontos', color: 'bg-emerald-50 border-emerald-200' },
// // //     { id: 'a_caminho', name: 'A Caminho', color: 'bg-purple-50 border-purple-200' },
// // //     { id: 'concluido', name: 'Concluídos', color: 'bg-gray-50 border-gray-200' }
// // //   ]

// // //   // ======= Load & Realtime =======
// // //   useEffect(() => {
// // //     loadOrders(selectedDate)
// // //   }, [selectedDate])

// // //   useEffect(() => {
// // //     setupSocket()
// // //     return () => { if (socket) socket.disconnect() }
// // //   }, [])

// // //   const loadOrders = async (dateStr) => {
// // //     try {
// // //       setLoading(true)
// // //       const response = await ApiService.getOrders({ date: dateStr })
// // //       setOrders(response.orders || [])
// // //     } catch (error) {
// // //       console.error('Error loading orders:', error)
// // //       showError('Erro ao carregar pedidos')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const setupSocket = () => {
// // //     const newSocket = io('http://localhost:3000')

// // //     newSocket.on('connect', () => {
// // //       newSocket.emit('join:admin')
// // //     })

// // //     newSocket.on('order:new', (order) => {
// // //       const orderDay = String(order.criadoEm || '').slice(0, 10)
// // //       // só adiciona em tela se for do dia selecionado
// // //       if (orderDay === selectedDate) {
// // //         setOrders(prev => [order, ...prev])
// // //         showSuccess(`Novo pedido recebido! #${order.id.slice(-8)}`)
// // //         playNotificationSound()
// // //       }
// // //     })

// // //     newSocket.on('order:update', (updatedOrder) => {
// // //       setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o))
// // //     })

// // //     setSocket(newSocket)
// // //   }

// // //   const playNotificationSound = () => {
// // //     const audioContext = new (window.AudioContext || window.webkitAudioContext)()
// // //     const oscillator = audioContext.createOscillator()
// // //     const gainNode = audioContext.createGain()
// // //     oscillator.connect(gainNode); gainNode.connect(audioContext.destination)
// // //     oscillator.frequency.value = 880; oscillator.type = 'sine'
// // //     gainNode.gain.setValueAtTime(0.25, audioContext.currentTime)
// // //     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.45)
// // //     oscillator.start(); oscillator.stop(audioContext.currentTime + 0.45)
// // //   }

// // //   const updateOrderStatus = async (orderId, newStatus) => {
// // //     try {
// // //       await ApiService.updateOrderStatus(orderId, newStatus)
// // //       showSuccess('Status atualizado com sucesso!')
// // //       if (socket) socket.emit('order:status', { orderId, status: newStatus })
// // //     } catch (error) {
// // //       console.error('Error updating order status:', error)
// // //       showError('Erro ao atualizar status do pedido')
// // //     }
// // //   }

// // //   const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)
// // //   const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
// // //   const minSince = (dateString) => {
// // //     const ms = Date.now() - new Date(dateString).getTime()
// // //     const m = Math.floor(ms / 60000)
// // //     if (m < 60) return `${m} min`
// // //     const h = Math.floor(m / 60); const rm = m % 60
// // //     return `${h}h ${rm}m`
// // //   }

// // //   const getStatusActions = (order) => {
// // //     const actions = []
// // //     switch (order.status) {
// // //       case 'novo':
// // //         actions.push({ label: 'Aceitar', status: 'aceito', color: 'bg-red-600 hover:bg-red-700 text-white' })
// // //         actions.push({ label: 'Cancelar', status: 'cancelado', color: 'bg-gray-200 hover:bg-gray-300 text-gray-800' })
// // //         break
// // //       case 'aceito':
// // //         actions.push({ label: 'Iniciar Preparo', status: 'preparo', color: 'bg-amber-600 hover:bg-amber-700 text-white' })
// // //         break
// // //       case 'preparo':
// // //         actions.push({ label: 'Marcar Pronto', status: 'pronto', color: 'bg-emerald-600 hover:bg-emerald-700 text-white' })
// // //         break
// // //       case 'pronto':
// // //         actions.push({ label: 'Saiu p/ Entrega', status: 'a_caminho', color: 'bg-purple-600 hover:bg-purple-700 text-white' })
// // //         break
// // //       case 'a_caminho':
// // //         actions.push({ label: 'Concluir', status: 'concluido', color: 'bg-slate-800 hover:bg-black text-white' })
// // //         break
// // //     }
// // //     return actions
// // //   }

// // //   const ordersByStatus = useMemo(() => {
// // //     const map = { novo: [], aceito: [], preparo: [], pronto: [], a_caminho: [], concluido: [] }
// // //     for (const o of orders) { if (map[o.status]) map[o.status].push(o) }
// // //     return map
// // //   }, [orders])

// // //   const stats = useMemo(() => {
// // //     const total = orders.length
// // //     const faturamento = orders.reduce((sum, o) => sum + (o.total || 0), 0)
// // //     const ticketMedio = total > 0 ? faturamento / total : 0
// // //     return { total, faturamento, ticketMedio }
// // //   }, [orders])

// // //   // ======= UI =======
// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center h-64">
// // //         <div className="animate-spin h-8 w-8 rounded-full border-2 border-red-500 border-t-transparent"></div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Topbar */}
// // //       <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
// // //         <div>
// // //           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Pedidos</h1>
// // //           <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
// // //             <CalendarDays className="h-4 w-4" />
// // //             <span>Exibindo: <strong>{getDateLabel(selectedDate)}</strong></span>
// // //           </div>
// // //         </div>

// // //         {/* Filtro por dia / Paginação */}
// // //         <div className="flex items-center gap-2">
// // //           <button onClick={goPrevDay} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50" aria-label="Dia anterior">
// // //             <ChevronLeft className="h-5 w-5" />
// // //           </button>
// // //           <input
// // //             type="date"
// // //             value={selectedDate}
// // //             max={todayStr}
// // //             onChange={(e) => setSelectedDate(e.target.value)}
// // //             className="px-3 py-2 rounded-lg border border-slate-200 text-sm"
// // //           />
// // //           <button onClick={goNextDay} disabled={isToday} className={`p-2 rounded-lg border border-slate-200 ${isToday ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'}`} aria-label="Próximo dia">
// // //             <ChevronRight className="h-5 w-5" />
// // //           </button>

// // //           <div className="ml-2 inline-flex overflow-hidden rounded-lg border border-slate-200">
// // //             <button
// // //               onClick={() => setSelectedDate(toDateStr(new Date()))}
// // //               className={`px-3 py-2 text-sm ${isToday ? 'bg-red-600 text-white' : 'bg-white hover:bg-slate-50'}`}
// // //             >Hoje</button>
// // //             <button
// // //               onClick={() => { const d = new Date(); d.setDate(d.getDate() - 1); setSelectedDate(toDateStr(d)) }}
// // //               className={`px-3 py-2 text-sm ${isYesterday ? 'bg-red-50 text-red-700' : 'bg-white hover:bg-slate-50'}`}
// // //             >Ontem</button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Cards de métricas do dia */}
// // //       <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
// // //         <div className="rounded-2xl border border-slate-200 p-4 bg-white">
// // //           <div className="text-xs uppercase tracking-wide text-slate-500">Pedidos no dia</div>
// // //           <div className="mt-2 text-2xl font-bold">{stats.total}</div>
// // //         </div>
// // //         <div className="rounded-2xl border border-slate-200 p-4 bg-white">
// // //           <div className="text-xs uppercase tracking-wide text-slate-500">Faturamento</div>
// // //           <div className="mt-2 text-2xl font-bold text-red-600">{formatPrice(stats.faturamento)}</div>
// // //         </div>
// // //         <div className="rounded-2xl border border-slate-200 p-4 bg-white">
// // //           <div className="text-xs uppercase tracking-wide text-slate-500">Ticket médio</div>
// // //           <div className="mt-2 text-2xl font-bold">{formatPrice(stats.ticketMedio)}</div>
// // //         </div>
// // //       </div>

// // //       {/* Kanban */}
// // //       <div className="relative">
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
// // //           {statusColumns.map(column => {
// // //             const columnOrders = ordersByStatus[column.id]
// // //             return (
// // //               <div key={column.id} className="flex flex-col min-h-[300px]">
// // //                 <div className={`${column.color} border rounded-2xl px-3 py-2 mb-3 sticky top-0 z-10 shadow-sm`}>
// // //                   <h3 className="font-semibold text-slate-900 text-center flex items-center justify-center gap-2">
// // //                     <span>{column.name}</span>
// // //                     <span className="ml-1 bg-white/90 px-2 py-0.5 rounded-full text-xs border border-slate-200">{columnOrders.length}</span>
// // //                   </h3>
// // //                 </div>

// // //                 <div className="space-y-3 flex-1">
// // //                   {columnOrders.map(order => (
// // //                     <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => setSelectedOrder(order)}>
// // //                       <div className="flex justify-between items-start mb-2">
// // //                         <span className="font-mono text-xs text-slate-500">#{order.id.slice(-8)}</span>
// // //                         <div className="flex items-center gap-2 text-xs text-slate-500">
// // //                           <Clock className="w-3.5 h-3.5" />
// // //                           <span>{formatTime(order.criadoEm)} • {minSince(order.criadoEm)}</span>
// // //                         </div>
// // //                       </div>

// // //                       <div className="space-y-2 mb-3">
// // //                         <div className="flex items-center gap-2 text-sm">
// // //                           <User className="w-4 h-4 text-slate-500" />
// // //                           <span className="truncate font-medium text-slate-900">{order.cliente.nome}</span>
// // //                         </div>
// // //                         <div className="flex items-center gap-2 text-sm">
// // //                           <Phone className="w-4 h-4 text-slate-500" />
// // //                           <span className="text-slate-700">{order.cliente.telefone}</span>
// // //                         </div>
// // //                       </div>

// // //                       <div className="flex items-center justify-between mb-2">
// // //                         <div className="text-lg font-extrabold text-red-600">{formatPrice(order.total)}</div>
// // //                         <span className="text-xs text-slate-500">{order.itens.length} item(s)</span>
// // //                       </div>

// // //                       {/* Ações */}
// // //                       <div className="space-y-1">
// // //                         {getStatusActions(order).map(action => (
// // //                           <button
// // //                             key={action.status}
// // //                             onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, action.status) }}
// // //                             className={`${action.color} w-full text-xs py-2 px-2 rounded-lg font-medium tracking-wide`}
// // //                           >
// // //                             {action.label}
// // //                           </button>
// // //                         ))}
// // //                       </div>
// // //                     </div>
// // //                   ))}

// // //                   {columnOrders.length === 0 && (
// // //                     <div className="text-center text-slate-400 py-8 text-sm">Nenhum pedido</div>
// // //                   )}
// // //                 </div>
// // //               </div>
// // //             )
// // //           })}
// // //         </div>
// // //       </div>

// // //       {/* Modal de Detalhes */}
// // //       {selectedOrder && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
// // //             <div className="p-6">
// // //               <div className="flex justify-between items-start mb-6">
// // //                 <div>
// // //                   <h2 className="text-xl font-bold text-slate-900">Pedido #{selectedOrder.id.slice(-8)}</h2>
// // //                   <p className="text-slate-600">{new Date(selectedOrder.criadoEm).toLocaleString('pt-BR')}</p>
// // //                 </div>
// // //                 <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
// // //                   <X className="w-6 h-6" />
// // //                 </button>
// // //               </div>

// // //               {/* Cliente */}
// // //               <div className="rounded-xl border border-slate-200 p-4 mb-6 bg-white">
// // //                 <h3 className="font-semibold mb-3 text-slate-900">Dados do Cliente</h3>
// // //                 <div className="space-y-2 text-slate-800">
// // //                   <div className="flex items-center gap-2">
// // //                     <User className="w-4 h-4 text-slate-500" />
// // //                     <span>{selectedOrder.cliente.nome}</span>
// // //                   </div>
// // //                   <div className="flex items-center gap-2">
// // //                     <Phone className="w-4 h-4 text-slate-500" />
// // //                     <span>{selectedOrder.cliente.telefone}</span>
// // //                   </div>
// // //                   <div className="flex items-start gap-2">
// // //                     <MapPin className="w-4 h-4 text-slate-500 mt-1" />
// // //                     <div>
// // //                       <p>{selectedOrder.endereco.rua}, {selectedOrder.endereco.numero}</p>
// // //                       <p>{selectedOrder.endereco.bairro}</p>
// // //                       {selectedOrder.endereco.complemento && (
// // //                         <p className="text-sm text-slate-600">{selectedOrder.endereco.complemento}</p>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>

// // //               {/* Itens */}
// // //               <div className="rounded-xl border border-slate-200 p-4 mb-6 bg-white">
// // //                 <h3 className="font-semibold mb-3 text-slate-900">Itens do Pedido</h3>
// // //                 <div className="space-y-3">
// // //                   {selectedOrder.itens.map((item, index) => (
// // //                     <div key={index} className="flex justify-between">
// // //                       <div>
// // //                         <p className="font-medium">{item.quantidade}x {item.nome}</p>
// // //                         {item.perguntasSelecionadas && (
// // //                           <p className="text-sm text-slate-600">
// // //                             {Object.entries(item.perguntasSelecionadas).map(([key, values]) => Array.isArray(values) ? values.join(', ') : values).filter(Boolean).join(', ')}
// // //                           </p>
// // //                         )}
// // //                       </div>
// // //                       <span className="font-semibold">{formatPrice(item.subtotal)}</span>
// // //                     </div>
// // //                   ))}
// // //                 </div>

// // //                 <div className="border-t pt-3 mt-3 space-y-2">
// // //                   <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
// // //                   <div className="flex justify-between text-sm"><span>Taxa de entrega</span><span>{formatPrice(selectedOrder.taxaEntrega)}</span></div>
// // //                   <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-red-600">{formatPrice(selectedOrder.total)}</span></div>
// // //                 </div>
// // //               </div>

// // //               {/* Pagamento */}
// // //               <div className="rounded-xl border border-slate-200 p-4 mb-6 bg-white">
// // //                 <h3 className="font-semibold mb-3 text-slate-900">Pagamento</h3>
// // //                 <div className="space-y-2">
// // //                   <div className="flex justify-between"><span>Método</span><span className="capitalize">{selectedOrder.pagamento.metodo.replace('_', ' ')}</span></div>
// // //                   {selectedOrder.pagamento.troco > 0 && (
// // //                     <div className="flex justify-between"><span>Troco para</span><span>{formatPrice(selectedOrder.pagamento.troco)}</span></div>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* Observações */}
// // //               {selectedOrder.observacoes && (
// // //                 <div className="rounded-xl border border-slate-200 p-4 mb-6 bg-white">
// // //                   <h3 className="font-semibold mb-3 text-slate-900">Observações</h3>
// // //                   <p className="text-slate-700">{selectedOrder.observacoes}</p>
// // //                 </div>
// // //               )}

// // //               {/* Ações do Modal */}
// // //               <div className="flex gap-2">
// // //                 {getStatusActions(selectedOrder).map(action => (
// // //                   <button
// // //                     key={action.status}
// // //                     onClick={() => { updateOrderStatus(selectedOrder.id, action.status); setSelectedOrder(null) }}
// // //                     className={`${action.color} rounded-lg px-3 py-2 text-sm font-medium`}
// // //                   >
// // //                     {action.label}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }



// // import React, { useState, useEffect, useMemo, useRef } from 'react'
// // import { io } from 'socket.io-client'
// // import { useUIStore } from '../store/uiStore'
// // import ApiService from '../services/api'
// // import {
// //   Calendar,
// //   ChevronLeft,
// //   ChevronRight,
// //   Filter,
// //   RefreshCcw,
// //   User,
// //   MapPin,
// //   Phone,
// //   X
// // } from 'lucide-react'

// // /**
// //  * ----------------------------
// //  * KANBAN (ADMIN) – ESTILO IFOOD
// //  * ----------------------------
// //  * Melhorias principais:
// //  * 1) Cabeçalho fixo com paginação por dia (Hoje / Ontem / Escolher data) + navegação ← → entre dias
// //  * 2) Filtro real por dia no fetch (query ?date=YYYY-MM-DD) e paginação por lote (limit/offset)
// //  * 3) Layout dos cards profissional (badges, tipografia, hierarquia visual, estados vazios)
// //  * 4) Contadores por coluna e ações contextuais com melhor destaque
// //  * 5) Manutenção total do que você já tinha: ApiService, sockets, update de status – sem inventar endpoint novo
// //  */

// // export default function Orders() {
// //   // ----------------- STATE -----------------
// //   const [orders, setOrders] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [selectedOrder, setSelectedOrder] = useState(null)
// //   const [socket, setSocket] = useState(null)

// //   // paginação por dia / paginação por lote
// //   const [selectedDate, setSelectedDate] = useState(() => new Date()) // default HOJE
// //   const [offset, setOffset] = useState(0)
// //   const [hasMore, setHasMore] = useState(true)
// //   const LIMIT = 60 // lote por requisição (ajuste conforme necessidade)

// //   const { showError, showSuccess } = useUIStore()

// //   // colunas de status (mantendo ids originais)
// //   const statusColumns = [
// //     { id: 'novo', name: 'Novos', color: 'bg-blue-50 border-blue-200', dot: 'bg-blue-400' },
// //     { id: 'aceito', name: 'Aceitos', color: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
// //     { id: 'preparo', name: 'Preparo', color: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
// //     { id: 'pronto', name: 'Prontos', color: 'bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
// //     { id: 'a_caminho', name: 'A Caminho', color: 'bg-purple-50 border-purple-200', dot: 'bg-purple-500' },
// //     { id: 'concluido', name: 'Concluídos', color: 'bg-gray-50 border-gray-200', dot: 'bg-gray-500' }
// //   ]

// //   // ----------------- HELPERS -----------------
// //   const pad2 = (n) => String(n).padStart(2, '0')
// //   const toDateKey = (d) => `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
// //   const selectedKey = useMemo(() => toDateKey(selectedDate), [selectedDate])

// //   const isToday = useMemo(() => {
// //     const now = new Date()
// //     return toDateKey(now) === selectedKey
// //   }, [selectedKey])

// //   const isYesterday = useMemo(() => {
// //     const y = new Date()
// //     y.setUTCDate(y.getUTCDate() - 1)
// //     return toDateKey(y) === selectedKey
// //   }, [selectedKey])

// //   const groupByStatus = useMemo(() => {
// //     const map = new Map(statusColumns.map((c) => [c.id, []]))
// //     for (const o of orders) {
// //       if (map.has(o.status)) map.get(o.status).push(o)
// //     }
// //     return map
// //   }, [orders])

// //   const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price || 0)
// //   const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
// //   const formatFull = (dateString) => new Date(dateString).toLocaleString('pt-BR')

// //   // Resumo do dia (com base no que está carregado; se hasMore=true é parcial)
// //   const daySummary = useMemo(() => {
// //     const total = orders.length
// //     const faturamento = orders.reduce((s, o) => s + (o.total || 0), 0)
// //     const ticketMedio = total > 0 ? faturamento / total : 0
// //     return { total, faturamento, ticketMedio, parcial: hasMore }
// //   }, [orders, hasMore])

// //   // ----------------- DATA FETCH -----------------
// //   const controllerRef = useRef(null)

// //   const loadOrders = async ({ reset = false } = {}) => {
// //     try {
// //       if (controllerRef.current) controllerRef.current.abort()
// //       controllerRef.current = new AbortController()

// //       setLoading(true)
// //       const pageOffset = reset ? 0 : offset

// //       // usa o que já existe: GET /orders?date=YYYY-MM-DD&limit&offset (servidor atualizado abaixo)
// //       const res = await ApiService.getOrders({ date: selectedKey, limit: LIMIT, offset: pageOffset })
// //       const list = res?.orders || []
// //       const nextOffset = pageOffset + list.length

// //       setOrders((prev) => (reset ? list : [...prev, ...list]))
// //       setOffset(nextOffset)
// //       setHasMore(nextOffset < (res?.total || 0))
// //     } catch (err) {
// //       if (err.name === 'AbortError') return
// //       console.error('Error loading orders:', err)
// //       showError('Erro ao carregar pedidos')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const reloadDay = () => {
// //     setOffset(0)
// //     setHasMore(true)
// //     loadOrders({ reset: true })
// //   }

// //   // init + quando muda o dia
// //   useEffect(() => {
// //     reloadDay()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [selectedKey])

// //   // ----------------- SOCKETS -----------------
// //   useEffect(() => {
// //     const newSocket = io('http://localhost:3000')

// //     newSocket.on('connect', () => {
// //       newSocket.emit('join:admin')
// //     })

// //     newSocket.on('order:new', (order) => {
// //       // só injeta se o pedido for do dia selecionado
// //       const key = toDateKey(new Date(order.criadoEm))
// //       if (key === selectedKey) {
// //         setOrders((prev) => [order, ...prev])
// //         showSuccess(`Novo pedido recebido! #${order.id.slice(-8)}`)
// //         playNotificationSound()
// //       }
// //     })

// //     newSocket.on('order:update', (updatedOrder) => {
// //       setOrders((prev) => prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o)))
// //     })

// //     setSocket(newSocket)
// //     return () => newSocket.disconnect()
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [selectedKey])

// //   const playNotificationSound = () => {
// //     const audioContext = new (window.AudioContext || window.webkitAudioContext)()
// //     const oscillator = audioContext.createOscillator()
// //     const gainNode = audioContext.createGain()

// //     oscillator.connect(gainNode)
// //     gainNode.connect(audioContext.destination)

// //     oscillator.frequency.value = 800
// //     oscillator.type = 'sine'
// //     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
// //     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

// //     oscillator.start(audioContext.currentTime)
// //     oscillator.stop(audioContext.currentTime + 0.5)
// //   }

// //   const updateOrderStatus = async (orderId, newStatus) => {
// //     try {
// //       await ApiService.updateOrderStatus(orderId, newStatus)
// //       showSuccess('Status atualizado com sucesso!')
// //       if (socket) socket.emit('order:status', { orderId, status: newStatus })
// //     } catch (error) {
// //       console.error('Error updating order status:', error)
// //       showError('Erro ao atualizar status do pedido')
// //     }
// //   }

// //   // ----------------- UI HELPERS -----------------
// //   const getStatusActions = (order) => {
// //     const actions = []
// //     switch (order.status) {
// //       case 'novo':
// //         actions.push({ label: 'Aceitar', status: 'aceito', color: 'btn-success' })
// //         actions.push({ label: 'Cancelar', status: 'cancelado', color: 'btn-danger' })
// //         break
// //       case 'aceito':
// //         actions.push({ label: 'Iniciar Preparo', status: 'preparo', color: 'btn-primary' })
// //         break
// //       case 'preparo':
// //         actions.push({ label: 'Marcar Pronto', status: 'pronto', color: 'btn-success' })
// //         break
// //       case 'pronto':
// //         actions.push({ label: 'Saiu p/ Entrega', status: 'a_caminho', color: 'btn-primary' })
// //         break
// //       case 'a_caminho':
// //         actions.push({ label: 'Concluir', status: 'concluido', color: 'btn-success' })
// //         break
// //     }
// //     return actions
// //   }

// //   const Header = () => (
// //     <div className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
// //       <div className="max-w-7xl mx-auto px-4 py-3">
// //         <div className="flex items-center justify-between gap-4">
// //           <div>
// //             <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
// //             <p className="text-gray-600">Gerencie os pedidos em tempo real com visual por dia</p>
// //           </div>

// //           <div className="flex items-center gap-2">
// //             {/* Navegação por dia */}
// //             <div className="flex items-center rounded-xl border shadow-sm overflow-hidden">
// //               <button
// //                 className="px-3 py-2 hover:bg-gray-50 disabled:opacity-40"
// //                 onClick={() => setSelectedDate((d) => { const nd = new Date(d); nd.setUTCDate(nd.getUTCDate() - 1); return nd })}
// //                 aria-label="Dia anterior"
// //               >
// //                 <ChevronLeft className="w-5 h-5" />
// //               </button>
// //               <div className="px-3 py-2 flex items-center gap-2 min-w-[160px] justify-center">
// //                 <Calendar className="w-4 h-4 text-gray-500" />
// //                 <span className="text-sm font-medium">
// //                   {isToday ? 'Hoje' : isYesterday ? 'Ontem' : new Date(selectedDate).toLocaleDateString('pt-BR')}
// //                 </span>
// //               </div>
// //               <button
// //                 className="px-3 py-2 hover:bg-gray-50 disabled:opacity-40"
// //                 onClick={() => setSelectedDate((d) => { const nd = new Date(d); nd.setUTCDate(nd.getUTCDate() + 1); return nd })}
// //                 disabled={isToday}
// //                 aria-label="Próximo dia"
// //               >
// //                 <ChevronRight className="w-5 h-5" />
// //               </button>
// //             </div>

// //             {/* Botões rápidos – Hoje / Ontem */}
// //             <div className="hidden md:flex items-center gap-2">
// //               <button
// //                 className={`px-3 py-2 rounded-lg border text-sm ${isToday ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
// //                 onClick={() => setSelectedDate(new Date())}
// //               >Hoje</button>
// //               <button
// //                 className={`px-3 py-2 rounded-lg border text-sm ${isYesterday ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
// //                 onClick={() => { const y = new Date(); y.setUTCDate(y.getUTCDate() - 1); setSelectedDate(y) }}
// //               >Ontem</button>
// //               <label className="px-3 py-2 rounded-lg border text-sm cursor-pointer hover:bg-gray-50">
// //                 Escolher
// //                 <input
// //                   type="date"
// //                   className="hidden"
// //                   value={selectedKey}
// //                   onChange={(e) => {
// //                     const [Y, M, D] = e.target.value.split('-').map(Number)
// //                     const d = new Date(Date.UTC(Y, M - 1, D))
// //                     setSelectedDate(d)
// //                   }}
// //                 />
// //               </label>
// //             </div>

// //             <button
// //               onClick={reloadDay}
// //               className="px-3 py-2 rounded-lg border hover:bg-gray-50 flex items-center gap-2"
// //             >
// //               <RefreshCcw className="w-4 h-4" />
// //               <span className="hidden sm:inline text-sm">Atualizar</span>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Resumo do dia */}
// //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
// //           <SummaryCard label="Pedidos" value={daySummary.total} hint={daySummary.parcial ? 'parcial' : ''} />
// //           <SummaryCard label="Faturamento" value={formatPrice(daySummary.faturamento)} hint={daySummary.parcial ? 'parcial' : ''} />
// //           <SummaryCard label="Ticket médio" value={formatPrice(daySummary.ticketMedio)} hint={daySummary.parcial ? 'parcial' : ''} />
// //         </div>
// //       </div>
// //     </div>
// //   )

// //   const SummaryCard = ({ label, value, hint }) => (
// //     <div className="rounded-xl border p-3 bg-white flex items-center justify-between">
// //       <div>
// //         <p className="text-xs text-gray-500">{label}</p>
// //         <p className="text-lg font-semibold">{value}</p>
// //       </div>
// //       {hint ? <span className="text-xs text-amber-600">{hint}</span> : null}
// //     </div>
// //   )

// //   const ColumnHeader = ({ cfg }) => (
// //     <div className={`${cfg.color} border rounded-xl p-3 mb-3 flex items-center justify-center gap-2`}>
// //       <span className={`inline-block w-2.5 h-2.5 rounded-full ${cfg.dot}`}></span>
// //       <h3 className="font-semibold text-gray-900">{cfg.name}</h3>
// //       <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-xs border">
// //         {groupByStatus.get(cfg.id)?.length || 0}
// //       </span>
// //     </div>
// //   )

// //   const OrderCard = ({ order }) => (
// //     <div className="group rounded-xl border hover:shadow-md transition-shadow cursor-pointer bg-white p-3 space-y-3" onClick={() => setSelectedOrder(order)}>
// //       <div className="flex items-start justify-between">
// //         <div className="flex items-center gap-2">
// //           <span className="font-mono text-[13px] text-gray-600">#{order.id.slice(-8)}</span>
// //         </div>
// //         <span className="text-xs text-gray-500">{formatTime(order.criadoEm)}</span>
// //       </div>

// //       <div className="space-y-2">
// //         <div className="flex items-center gap-2 text-sm">
// //           <User className="w-4 h-4 text-gray-500" />
// //           <span className="truncate font-medium text-gray-900">{order.cliente?.nome}</span>
// //         </div>
// //         <div className="flex items-center gap-2 text-sm text-gray-700">
// //           <Phone className="w-4 h-4 text-gray-500" />
// //           <span>{order.cliente?.telefone}</span>
// //         </div>
// //       </div>

// //       <div className="flex items-center justify-between">
// //         <div className="text-lg font-bold text-emerald-700">{formatPrice(order.total)}</div>
// //         <div className="text-xs text-gray-500">{order.itens?.length || 0} item(s)</div>
// //       </div>

// //       <div className="grid grid-cols-1 gap-2">
// //         {getStatusActions(order).map((action) => (
// //           <button
// //             key={action.status}
// //             onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, action.status) }}
// //             className={`${action.color} w-full text-xs py-2 px-2 rounded-lg`}
// //           >
// //             {action.label}
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   )

// //   // ----------------- RENDER -----------------
// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       <Header />

// //       <div className="max-w-7xl mx-auto px-4 py-6">
// //         {/* BOARD */}
// //         {loading && orders.length === 0 ? (
// //           <div className="flex items-center justify-center h-64">
// //             <div className="loading-spinner" />
// //           </div>
// //         ) : (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
// //             {statusColumns.map((col) => (
// //               <div key={col.id} className="flex flex-col">
// //                 <ColumnHeader cfg={col} />
// //                 <div className="space-y-3">
// //                   {(groupByStatus.get(col.id) || []).map((o) => (
// //                     <OrderCard key={o.id} order={o} />
// //                   ))}

// //                   {(groupByStatus.get(col.id) || []).length === 0 && (
// //                     <div className="text-center text-gray-400 py-10 border rounded-xl bg-white">Nenhum pedido</div>
// //                   )}
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Paginação (carregar mais do mesmo dia) */}
// //         {hasMore && (
// //           <div className="flex justify-center mt-6">
// //             <button onClick={() => loadOrders()} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50 text-sm">Carregar mais</button>
// //           </div>
// //         )}
// //       </div>

// //       {/* MODAL DE DETALHE */}
// //       {selectedOrder && (
// //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
// //             <div className="p-6">
// //               <div className="flex justify-between items-start mb-6">
// //                 <div>
// //                   <h2 className="text-xl font-bold text-gray-900">Pedido #{selectedOrder.id.slice(-8)}</h2>
// //                   <p className="text-gray-600">{formatFull(selectedOrder.criadoEm)}</p>
// //                 </div>
// //                 <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
// //                   <X className="w-6 h-6" />
// //                 </button>
// //               </div>

// //               {/* Cliente */}
// //               <div className="rounded-xl border p-4 mb-6 bg-white">
// //                 <h3 className="font-semibold mb-3">Dados do Cliente</h3>
// //                 <div className="space-y-2 text-sm">
// //                   <div className="flex items-center gap-2">
// //                     <User className="w-4 h-4 text-gray-500" />
// //                     <span>{selectedOrder.cliente?.nome}</span>
// //                   </div>
// //                   <div className="flex items-center gap-2">
// //                     <Phone className="w-4 h-4 text-gray-500" />
// //                     <span>{selectedOrder.cliente?.telefone}</span>
// //                   </div>
// //                   <div className="flex items-start gap-2">
// //                     <MapPin className="w-4 h-4 text-gray-500 mt-1" />
// //                     <div>
// //                       <p>{selectedOrder.endereco?.rua}, {selectedOrder.endereco?.numero}</p>
// //                       <p>{selectedOrder.endereco?.bairro}</p>
// //                       {selectedOrder.endereco?.complemento && (
// //                         <p className="text-sm text-gray-600">{selectedOrder.endereco?.complemento}</p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Itens */}
// //               <div className="rounded-xl border p-4 mb-6 bg-white">
// //                 <h3 className="font-semibold mb-3">Itens do Pedido</h3>
// //                 <div className="space-y-3 text-sm">
// //                   {selectedOrder.itens?.map((item, idx) => (
// //                     <div key={idx} className="flex justify-between">
// //                       <div>
// //                         <p className="font-medium">{item.quantidade}x {item.nome}</p>
// //                         {item.perguntasSelecionadas && (
// //                           <p className="text-gray-600">
// //                             {Object.entries(item.perguntasSelecionadas).map(([key, values]) => Array.isArray(values) ? values.join(', ') : values).filter(Boolean).join(', ')}
// //                           </p>
// //                         )}
// //                       </div>
// //                       <span className="font-semibold">{formatPrice(item.subtotal)}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //                 <div className="border-t pt-3 mt-3 space-y-2 text-sm">
// //                   <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
// //                   <div className="flex justify-between"><span>Taxa de entrega</span><span>{formatPrice(selectedOrder.taxaEntrega)}</span></div>
// //                   <div className="flex justify-between font-bold text-lg border-t pt-2">
// //                     <span>Total</span>
// //                     <span className="text-emerald-700">{formatPrice(selectedOrder.total)}</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Pagamento */}
// //               <div className="rounded-xl border p-4 mb-6 bg-white">
// //                 <h3 className="font-semibold mb-3">Pagamento</h3>
// //                 <div className="space-y-1 text-sm">
// //                   <div className="flex justify-between"><span>Método</span><span className="capitalize">{selectedOrder.pagamento?.metodo?.replace('_', ' ')}</span></div>
// //                   {selectedOrder.pagamento?.troco > 0 && (
// //                     <div className="flex justify-between"><span>Troco para</span><span>{formatPrice(selectedOrder.pagamento?.troco)}</span></div>
// //                   )}
// //                 </div>
// //               </div>

// //               {selectedOrder.observacoes && (
// //                 <div className="rounded-xl border p-4 mb-6 bg-white">
// //                   <h3 className="font-semibold mb-3">Observações</h3>
// //                   <p className="text-gray-700 text-sm">{selectedOrder.observacoes}</p>
// //                 </div>
// //               )}

// //               <div className="flex gap-2">
// //                 {getStatusActions(selectedOrder).map((action) => (
// //                   <button
// //                     key={action.status}
// //                     onClick={() => { updateOrderStatus(selectedOrder.id, action.status); setSelectedOrder(null) }}
// //                     className={`${action.color} rounded-lg px-3 py-2 text-sm`}
// //                   >{action.label}</button>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// import React, { useState, useEffect, useMemo } from 'react'
// import { Clock, User, MapPin, Phone, Eye, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react'
// import { io } from 'socket.io-client'
// import ApiService from '../services/api'
// import { useUIStore } from '../store/uiStore'

// /**
//  * IMPORTANTE: Apenas layout/UI foi melhorado.
//  * - Fluxos existentes, sockets, serviços e endpoints foram mantidos.
//  * - Adicionada "paginação por dia" e "filtro por dia" no topo (client-side), SEM alterar a API.
//  * - Visual inspirado no iFood: cabeçalho fixo com controles, colunas com cabeçalhos sticky, cards com badges.
//  */

// export default function Orders() {
//   const [orders, setOrders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedOrder, setSelectedOrder] = useState(null)
//   const [socket, setSocket] = useState(null)

//   // ======== NOVO: Controle de dia (paginação + filtro) ========
//   const TZ = 'America/Belem'
//   const todayYMD = () => new Date().toLocaleDateString('sv-SE', { timeZone: TZ })
//   const [selectedDate, setSelectedDate] = useState(todayYMD()) // formato YYYY-MM-DD

//   const { showError, showSuccess } = useUIStore()

//   const statusColumns = [
//     { id: 'novo', name: 'Novos', color: 'bg-blue-50 border-blue-200 text-blue-800' },
//     { id: 'aceito', name: 'Aceitos', color: 'bg-green-50 border-green-200 text-green-800' },
//     { id: 'preparo', name: 'Preparo', color: 'bg-orange-50 border-orange-200 text-orange-800' },
//     { id: 'pronto', name: 'Prontos', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
//     { id: 'a_caminho', name: 'A Caminho', color: 'bg-purple-50 border-purple-200 text-purple-800' },
//     { id: 'concluido', name: 'Concluídos', color: 'bg-gray-50 border-gray-200 text-gray-800' }
//   ]

//   useEffect(() => {
//     loadOrders()
//     setupSocket()

//     return () => {
//       if (socket) socket.disconnect()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const loadOrders = async () => {
//     try {
//       setLoading(true)
//       const response = await ApiService.getOrders() // usa o que já existe
//       setOrders(response.orders || [])
//     } catch (error) {
//       console.error('Error loading orders:', error)
//       showError('Erro ao carregar pedidos')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const setupSocket = () => {
//     const newSocket = io('http://localhost:3000')

//     newSocket.on('connect', () => {
//       console.log('Connected to socket for admin')
//       newSocket.emit('join:admin')
//     })

//     newSocket.on('order:new', (order) => {
//       console.log('New order received:', order)
//       setOrders(prev => [order, ...prev])
//       showSuccess(`Novo pedido recebido! #${order.id.slice(-8)}`)
//       playNotificationSound()
//     })

//     newSocket.on('order:update', (updatedOrder) => {
//       console.log('Order updated:', updatedOrder)
//       setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order))
//     })

//     setSocket(newSocket)
//   }

//   const playNotificationSound = () => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)()
//     const oscillator = audioContext.createOscillator()
//     const gainNode = audioContext.createGain()

//     oscillator.connect(gainNode)
//     gainNode.connect(audioContext.destination)

//     oscillator.frequency.value = 800
//     oscillator.type = 'sine'
//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

//     oscillator.start(audioContext.currentTime)
//     oscillator.stop(audioContext.currentTime + 0.5)
//   }

//   const updateOrderStatus = async (orderId, newStatus) => {
//     try {
//       await ApiService.updateOrderStatus(orderId, newStatus)
//       showSuccess('Status atualizado com sucesso!')
//       if (socket) socket.emit('order:status', { orderId, status: newStatus })
//     } catch (error) {
//       console.error('Error updating order status:', error)
//       showError('Erro ao atualizar status do pedido')
//     }
//   }

//   // ======== Helpers de formato ========
//   const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

//   const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ })

//   const dateKey = (dateString) => new Date(dateString).toLocaleDateString('sv-SE', { timeZone: TZ }) // YYYY-MM-DD

//   const timeAgo = (dateString) => {
//     const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
//     const now = new Date()
//     const then = new Date(dateString)
//     const diffMs = now - then
//     const diffMin = Math.round(diffMs / 60000)
//     if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, 'minute')
//     const diffH = Math.round(diffMin / 60)
//     return rtf.format(-diffH, 'hour')
//   }

//   const pagamentoBadge = (metodo) => {
//     if (!metodo) return null
//     const label = String(metodo).replace('_', ' ').toUpperCase()
//     const color = metodo === 'pix' ? 'bg-green-100 text-green-700' : metodo === 'dinheiro' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
//     return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
//   }

//   // ======== NOVO: Filtragem por dia (client-side) ========
//   const filteredOrders = useMemo(() => orders.filter(o => dateKey(o.criadoEm) === selectedDate), [orders, selectedDate])

//   // Mantém função original, mas aqui usamos a fonte filtrada do dia
//   const getOrdersByStatusForList = (list, status) => list.filter(order => order.status === status)

//   // ======== NOVO: Paginação por dia ========
//   const changeDay = (delta) => {
//     const d = new Date(selectedDate + 'T00:00:00')
//     d.setDate(d.getDate() + delta)
//     const ymd = d.toLocaleDateString('sv-SE', { timeZone: TZ })
//     setSelectedDate(ymd)
//   }

//   const goToday = () => setSelectedDate(todayYMD())

//   // ======== UI ========
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="loading-spinner"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-4">
//       {/* ===== Cabeçalho da Página (estilo iFood) ===== */}
//       <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
//         <div className="max-w-full px-2 md:px-4 py-3 flex flex-col gap-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
//               <p className="text-gray-600">Gerencie todos os pedidos em tempo real</p>
//             </div>
//             {/* Controle de Dia */}
//             <div className="flex items-center gap-2">
//               <button onClick={() => changeDay(-1)} className="btn-ghost inline-flex items-center gap-1 rounded-xl border px-3 py-2 hover:bg-gray-50">
//                 <ChevronLeft className="w-4 h-4" />
//                 <span className="hidden sm:inline">Anterior</span>
//               </button>
//               <div className="relative">
//                 <input
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   className="border rounded-xl px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
//                 />
//                 <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
//               </div>
//               <button onClick={() => changeDay(1)} className="btn-ghost inline-flex items-center gap-1 rounded-xl border px-3 py-2 hover:bg-gray-50">
//                 <span className="hidden sm:inline">Próximo</span>
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//               <button onClick={goToday} className="btn-primary rounded-xl px-3 py-2">Hoje</button>
//             </div>
//           </div>

//           {/* Barra de filtro/infos do dia */}
//           <div className="flex items-center gap-2 text-sm text-gray-600">
//             <Filter className="w-4 h-4" />
//             <span>
//               {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
//             </span>
//             <span className="mx-2">•</span>
//             <span>
//               Total no dia: <strong>{formatPrice(filteredOrders.reduce((s, o) => s + (o.total || 0), 0))}</strong>
//             </span>
//             <span className="mx-2">•</span>
//             <span>Pedidos: <strong>{filteredOrders.length}</strong></span>
//           </div>
//         </div>
//       </div>

//       {/* ===== Kanban ===== */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 px-2 md:px-4">
//         {statusColumns.map(column => {
//           const columnOrders = getOrdersByStatusForList(filteredOrders, column.id)

//           return (
//             <div key={column.id} className="flex flex-col min-h-[60vh]">
//               {/* Cabeçalho da coluna */}
//               <div className={`sticky top-[92px] ${column.color} border rounded-2xl px-3 py-2 mb-3 flex items-center justify-between shadow-sm`}>
//                 <h3 className="font-semibold">
//                   {column.name}
//                 </h3>
//                 <span className="ml-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-semibold border">{columnOrders.length}</span>
//               </div>

//               {/* Cards */}
//               <div className="space-y-3 flex-1">
//                 {columnOrders.map(order => (
//                   <div
//                     key={order.id}
//                     className="kanban-card bg-white border rounded-2xl p-3 hover:shadow-lg transition cursor-pointer"
//                     onClick={() => setSelectedOrder(order)}
//                   >
//                     {/* Top row */}
//                     <div className="flex justify-between items-start mb-2">
//                       <div className="flex items-center gap-2">
//                         <span className="font-mono text-xs text-gray-600">#{order.id.slice(-8)}</span>
//                         {pagamentoBadge(order.pagamento?.metodo)}
//                       </div>
//                       <div className="text-right">
//                         <div className="text-xs text-gray-500">{formatTime(order.criadoEm)}</div>
//                         <div className="text-[10px] text-gray-400">{timeAgo(order.criadoEm)}</div>
//                       </div>
//                     </div>

//                     {/* Cliente */}
//                     <div className="space-y-1 mb-3">
//                       <div className="flex items-center gap-2 text-sm">
//                         <User className="w-4 h-4 text-gray-400" />
//                         <span className="truncate font-medium text-gray-800">{order.cliente?.nome}</span>
//                       </div>
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Phone className="w-4 h-4 text-gray-400" />
//                         <span>{order.cliente?.telefone}</span>
//                       </div>
//                     </div>

//                     {/* Valores e itens */}
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="text-xs text-gray-500">{order.itens?.length || 0} item(s)</div>
//                       <div className="text-lg font-extrabold text-primary-600">{formatPrice(order.total)}</div>
//                     </div>

//                     {/* Ações */}
//                     <div className="grid grid-cols-1 gap-1">
//                       {getStatusActions(order).map(action => (
//                         <button
//                           key={action.status}
//                           onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, action.status) }}
//                           className={`${action.color} w-full text-xs py-1.5 px-2 rounded-lg`}
//                         >
//                           {action.label}
//                         </button>
//                       ))}
//                       <button
//                         onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
//                         className="w-full text-xs py-1.5 px-2 rounded-lg border hover:bg-gray-50 inline-flex items-center justify-center gap-1"
//                       >
//                         <Eye className="w-3.5 h-3.5" /> Ver detalhes
//                       </button>
//                     </div>
//                   </div>
//                 ))}

//                 {columnOrders.length === 0 && (
//                   <div className="text-center text-gray-400 py-8 border rounded-2xl">Nenhum pedido</div>
//                 )}
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       {/* ===== Modal de Detalhes ===== */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
//             {/* Header */}
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between">
//               <div>
//                 <h2 className="text-xl font-bold text-gray-900">Pedido #{selectedOrder.id.slice(-8)}</h2>
//                 <p className="text-gray-600 flex items-center gap-2 text-sm">
//                   <Clock className="w-4 h-4 text-gray-400" />
//                   {new Date(selectedOrder.criadoEm).toLocaleString('pt-BR', { timeZone: TZ })}
//                 </p>
//               </div>
//               <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Body */}
//             <div className="p-6 space-y-6">
//               {/* Cliente */}
//               <div className="card p-4 rounded-xl border">
//                 <h3 className="font-semibold mb-3">Dados do Cliente</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
//                   <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span>{selectedOrder.cliente?.nome}</span></div>
//                   <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{selectedOrder.cliente?.telefone}</span></div>
//                   <div className="sm:col-span-2 flex items-start gap-2">
//                     <MapPin className="w-4 h-4 text-gray-400 mt-1" />
//                     <div>
//                       <p>{selectedOrder.endereco?.rua}, {selectedOrder.endereco?.numero}</p>
//                       <p>{selectedOrder.endereco?.bairro}</p>
//                       {selectedOrder.endereco?.complemento && (
//                         <p className="text-gray-600">{selectedOrder.endereco.complemento}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Itens */}
//               <div className="card p-4 rounded-xl border">
//                 <h3 className="font-semibold mb-3">Itens do Pedido</h3>
//                 <div className="space-y-3">
//                   {selectedOrder.itens.map((item, index) => (
//                     <div key={index} className="flex justify-between text-sm">
//                       <div>
//                         <p className="font-medium">{item.quantidade}x {item.nome}</p>
//                         {item.perguntasSelecionadas && (
//                           <p className="text-gray-600">
//                             {Object.entries(item.perguntasSelecionadas).map(([key, values]) => Array.isArray(values) ? values.join(', ') : values).filter(Boolean).join(', ')}
//                           </p>
//                         )}
//                       </div>
//                       <span className="font-semibold">{formatPrice(item.subtotal)}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="border-t pt-3 mt-3 space-y-2 text-sm">
//                   <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
//                   <div className="flex justify-between"><span>Taxa de entrega</span><span>{formatPrice(selectedOrder.taxaEntrega)}</span></div>
//                   <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-primary-600">{formatPrice(selectedOrder.total)}</span></div>
//                 </div>
//               </div>

//               {/* Pagamento */}
//               <div className="card p-4 rounded-xl border">
//                 <h3 className="font-semibold mb-3">Pagamento</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between"><span>Método</span><span className="capitalize">{String(selectedOrder.pagamento?.metodo || '').replace('_', ' ')}</span></div>
//                   {selectedOrder.pagamento?.troco > 0 && (
//                     <div className="flex justify-between"><span>Troco para</span><span>{formatPrice(selectedOrder.pagamento.troco)}</span></div>
//                   )}
//                 </div>
//               </div>

//               {/* Observações */}
//               {selectedOrder.observacoes && (
//                 <div className="card p-4 rounded-xl border">
//                   <h3 className="font-semibold mb-3">Observações</h3>
//                   <p className="text-gray-700 text-sm">{selectedOrder.observacoes}</p>
//                 </div>
//               )}

//               {/* Ações */}
//               <div className="sticky bottom-0 bg-white pt-2">
//                 <div className="flex flex-col sm:flex-row gap-2 border-t pt-3">
//                   {getStatusActions(selectedOrder).map(action => (
//                     <button
//                       key={action.status}
//                       onClick={() => { updateOrderStatus(selectedOrder.id, action.status); setSelectedOrder(null) }}
//                       className={`${action.color} rounded-lg`}
//                     >
//                       {action.label}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )

//   // ======== Ações por status (mantido) ========
//   function getStatusActions(order) {
//     const actions = []
//     switch (order.status) {
//       case 'novo':
//         actions.push({ label: 'Aceitar', status: 'aceito', color: 'btn-success' })
//         actions.push({ label: 'Cancelar', status: 'cancelado', color: 'btn-danger' })
//         break
//       case 'aceito':
//         actions.push({ label: 'Iniciar Preparo', status: 'preparo', color: 'btn-primary' })
//         break
//       case 'preparo':
//         actions.push({ label: 'Marcar Pronto', status: 'pronto', color: 'btn-success' })
//         break
//       case 'pronto':
//         actions.push({ label: 'Saiu p/ Entrega', status: 'a_caminho', color: 'btn-primary' })
//         break
//       case 'a_caminho':
//         actions.push({ label: 'Concluir', status: 'concluido', color: 'btn-success' })
//         break
//       default:
//         break
//     }
//     return actions
//   }
// }


import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Clock, User, MapPin, Phone, Eye, X, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Bell, BellOff } from 'lucide-react'
import { io } from 'socket.io-client'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

/**
 * IMPORTANTE: Apenas layout/UI foi melhorado e BUGFIXES de som e duplicidade.
 * - Mantive seus endpoints e lógica.
 * - Corrigi sockets duplicados (StrictMode) e duplo cadastro de pedidos.
 * - Som: AudioContext persistente + fallback e botão para habilitar caso o navegador bloqueie.
 * - Paginação por dia + filtro por dia continuam.
 */

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // ======== Refs e estados auxiliares ========
  const socketRef = useRef(null) // evita múltiplas conexões e listeners duplicados
  const audioRef = useRef(null)  // único AudioContext reaproveitado
  const [soundOn, setSoundOn] = useState(true)

  const TZ = 'America/Belem'
  const todayYMD = () => new Date().toLocaleDateString('sv-SE', { timeZone: TZ })
  const [selectedDate, setSelectedDate] = useState(todayYMD()) // formato YYYY-MM-DD

  const { showError, showSuccess } = useUIStore()

  const statusColumns = [
    { id: 'novo', name: 'Novos', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { id: 'aceito', name: 'Aceitos', color: 'bg-green-50 border-green-200 text-green-800' },
    { id: 'preparo', name: 'Preparo', color: 'bg-orange-50 border-orange-200 text-orange-800' },
    { id: 'pronto', name: 'Prontos', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { id: 'a_caminho', name: 'A Caminho', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { id: 'concluido', name: 'Concluídos', color: 'bg-gray-50 border-gray-200 text-gray-800' }
  ]

  useEffect(() => {
    loadOrders()
    const cleanup = setupSocket()
    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await ApiService.getOrders() // usa o que já existe
      setOrders(response.orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
      showError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const setupSocket = () => {
    try {
      // Se já existe, desconecta para evitar listeners duplicados (dev/StrictMode)
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }

      const s = io('http://localhost:3000')

      const onConnect = () => {
        console.log('Connected to socket for admin')
        s.emit('join:admin')
      }

      const onNew = (order) => {
        console.log('New order received:', order)
        // Evita duplicidade: se já existe, atualiza; senão insere
        setOrders(prev => {
          const exists = prev.some(o => o.id === order.id)
          return exists ? prev.map(o => (o.id === order.id ? order : o)) : [order, ...prev]
        })
        showSuccess(`Novo pedido recebido! #${order.id.slice(-8)}`)
        playNotificationSound()
      }

      const onUpdate = (updatedOrder) => {
        console.log('Order updated:', updatedOrder)
        setOrders(prev => prev.map(order => order.id === updatedOrder.id ? updatedOrder : order))
      }

      s.on('connect', onConnect)
      s.on('order:new', onNew)
      s.on('order:update', onUpdate)

      socketRef.current = s

      // cleanup específico deste socket
      return () => {
        try {
          s.off('connect', onConnect)
          s.off('order:new', onNew)
          s.off('order:update', onUpdate)
          s.disconnect()
        } catch (e) { /* noop */ }
        if (socketRef.current === s) socketRef.current = null
      }
    } catch (e) {
      console.error('Socket setup error:', e)
      return () => {}
    }
  }

  const playNotificationSound = async () => {
    if (!soundOn) return
    try {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      if (!audioRef.current) audioRef.current = new AC()
      const ctx = audioRef.current
      if (ctx.state === 'suspended') {
        // Tenta retomar automaticamente; se o navegador bloquear, há botão para ativar
        await ctx.resume()
      }
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      const t = ctx.currentTime
      gainNode.gain.setValueAtTime(0.0001, t)
      gainNode.gain.exponentialRampToValueAtTime(0.2, t + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      oscillator.start(t)
      oscillator.stop(t + 0.5)
    } catch (e) {
      console.warn('Som possivelmente bloqueado pelo navegador:', e)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ApiService.updateOrderStatus(orderId, newStatus)
      showSuccess('Status atualizado com sucesso!')
      if (socketRef.current) socketRef.current.emit('order:status', { orderId, status: newStatus })
    } catch (error) {
      console.error('Error updating order status:', error)
      showError('Erro ao atualizar status do pedido')
    }
  }

  // ======== Helpers de formato ========
  const formatPrice = (price) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
  const dateKey = (dateString) => new Date(dateString).toLocaleDateString('sv-SE', { timeZone: TZ }) // YYYY-MM-DD

  const timeAgo = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
    const now = new Date()
    const then = new Date(dateString)
    const diffMs = now - then
    const diffMin = Math.round(diffMs / 60000)
    if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, 'minute')
    const diffH = Math.round(diffMin / 60)
    return rtf.format(-diffH, 'hour')
  }

  const pagamentoBadge = (metodo) => {
    if (!metodo) return null
    const label = String(metodo).replace('_', ' ').toUpperCase()
    const color = metodo === 'pix' ? 'bg-green-100 text-green-700' : metodo === 'dinheiro' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
    return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
  }

  // ======== Filtro por dia (client-side) ========
  const filteredOrders = useMemo(() => orders.filter(o => dateKey(o.criadoEm) === selectedDate), [orders, selectedDate])
  const getOrdersByStatusForList = (list, status) => list.filter(order => order.status === status)

  // ======== Paginação por dia ========
  const changeDay = (delta) => {
    const d = new Date(selectedDate + 'T00:00:00')
    d.setDate(d.getDate() + delta)
    const ymd = d.toLocaleDateString('sv-SE', { timeZone: TZ })
    setSelectedDate(ymd)
  }
  const goToday = () => setSelectedDate(todayYMD())

  // ======== UI ========
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ===== Cabeçalho da Página (estilo iFood) ===== */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
        <div className="max-w-full px-2 md:px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-600">Gerencie todos os pedidos em tempo real</p>
            </div>
            {/* Controles de Dia + Som */}
            <div className="flex items-center gap-2">
              <button onClick={() => changeDay(-1)} className="btn-ghost inline-flex items-center gap-1 rounded-xl border px-3 py-2 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </button>
              <div className="relative">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded-xl px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <CalendarIcon className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
              <button onClick={() => changeDay(1)} className="btn-ghost inline-flex items-center gap-1 rounded-xl border px-3 py-2 hover:bg-gray-50">
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={goToday} className="btn-primary rounded-xl px-3 py-2">Hoje</button>

              {/* Toggle Som */}
              <button
                onClick={async () => {
                  try {
                    setSoundOn(v => !v)
                    const AC = window.AudioContext || window.webkitAudioContext
                    if (AC) {
                      if (!audioRef.current) audioRef.current = new AC()
                      if (audioRef.current.state === 'suspended') await audioRef.current.resume()
                    }
                  } catch (e) { /* noop */ }
                }}
                title={soundOn ? 'Som ativado' : 'Som desativado'}
                className={`ml-1 rounded-xl border px-3 py-2 hover:bg-gray-50 inline-flex items-center gap-2 ${soundOn ? 'text-green-700' : 'text-gray-500'}`}
              >
                {soundOn ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <span className="hidden sm:inline">Som</span>
              </button>
            </div>
          </div>

          {/* Barra de filtro/infos do dia */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Filter className="w-4 h-4" />
            <span>
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </span>
            <span className="mx-2">•</span>
            <span>
              Total no dia: <strong>{formatPrice(filteredOrders.reduce((s, o) => s + (o.total || 0), 0))}</strong>
            </span>
            <span className="mx-2">•</span>
            <span>Pedidos: <strong>{filteredOrders.length}</strong></span>
          </div>
        </div>
      </div>

      {/* ===== Kanban ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 px-2 md:px-4">
        {statusColumns.map(column => {
          const columnOrders = getOrdersByStatusForList(filteredOrders, column.id)

          return (
            <div key={column.id} className="flex flex-col min-h-[60vh]">
              {/* Cabeçalho da coluna */}
              <div className={`sticky top-[92px] ${column.color} border rounded-2xl px-3 py-2 mb-3 flex items-center justify-between shadow-sm`}>
                <h3 className="font-semibold">
                  {column.name}
                </h3>
                <span className="ml-2 bg-white/90 px-2 py-0.5 rounded-full text-xs font-semibold border">{columnOrders.length}</span>
              </div>

              {/* Cards */}
              <div className="space-y-3 flex-1">
                {columnOrders.map(order => (
                  <div
                    key={order.id}
                    className="kanban-card bg-white border rounded-2xl p-3 hover:shadow-lg transition cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    {/* Top row */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-600">#{order.id.slice(-8)}</span>
                        {pagamentoBadge(order.pagamento?.metodo)}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{formatTime(order.criadoEm)}</div>
                        <div className="text-[10px] text-gray-400">{timeAgo(order.criadoEm)}</div>
                      </div>
                    </div>

                    {/* Cliente */}
                    <div className="space-y-1 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="truncate font-medium text-gray-800">{order.cliente?.nome}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{order.cliente?.telefone}</span>
                      </div>
                    </div>

                    {/* Valores e itens */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-500">{order.itens?.length || 0} item(s)</div>
                      <div className="text-lg font-extrabold text-primary-600">{formatPrice(order.total)}</div>
                    </div>

                    {/* Ações */}
                    <div className="grid grid-cols-1 gap-1">
                      {getStatusActions(order).map(action => (
                        <button
                          key={action.status}
                          onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, action.status) }}
                          className={`${action.color} w-full text-xs py-1.5 px-2 rounded-lg`}
                        >
                          {action.label}
                        </button>
                      ))}
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedOrder(order) }}
                        className="w-full text-xs py-1.5 px-2 rounded-lg border hover:bg-gray-50 inline-flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}

                {columnOrders.length === 0 && (
                  <div className="text-center text-gray-400 py-8 border rounded-2xl">Nenhum pedido</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ===== Modal de Detalhes ===== */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Pedido #{selectedOrder.id.slice(-8)}</h2>
                <p className="text-gray-600 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {new Date(selectedOrder.criadoEm).toLocaleString('pt-BR', { timeZone: TZ })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Cliente */}
              <div className="card p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Dados do Cliente</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span>{selectedOrder.cliente?.nome}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span>{selectedOrder.cliente?.telefone}</span></div>
                  <div className="sm:col-span-2 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                    <div>
                      <p>{selectedOrder.endereco?.rua}, {selectedOrder.endereco?.numero}</p>
                      <p>{selectedOrder.endereco?.bairro}</p>
                      {selectedOrder.endereco?.complemento && (
                        <p className="text-gray-600">{selectedOrder.endereco.complemento}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Itens */}
              <div className="card p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.itens.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.quantidade}x {item.nome}</p>
                        {item.perguntasSelecionadas && (
                          <p className="text-gray-600">
                            {Object.entries(item.perguntasSelecionadas).map(([key, values]) => Array.isArray(values) ? values.join(', ') : values).filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold">{formatPrice(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 mt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(selectedOrder.subtotal)}</span></div>
                  <div className="flex justify-between"><span>Taxa de entrega</span><span>{formatPrice(selectedOrder.taxaEntrega)}</span></div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span className="text-primary-600">{formatPrice(selectedOrder.total)}</span></div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="card p-4 rounded-xl border">
                <h3 className="font-semibold mb-3">Pagamento</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Método</span><span className="capitalize">{String(selectedOrder.pagamento?.metodo || '').replace('_', ' ')}</span></div>
                  {selectedOrder.pagamento?.troco > 0 && (
                    <div className="flex justify-between"><span>Troco para</span><span>{formatPrice(selectedOrder.pagamento.troco)}</span></div>
                  )}
                </div>
              </div>

              {/* Observações */}
              {selectedOrder.observacoes && (
                <div className="card p-4 rounded-xl border">
                  <h3 className="font-semibold mb-3">Observações</h3>
                  <p className="text-gray-700 text-sm">{selectedOrder.observacoes}</p>
                </div>
              )}

              {/* Ações */}
              <div className="sticky bottom-0 bg-white pt-2">
                <div className="flex flex-col sm:flex-row gap-2 border-t pt-3">
                  {getStatusActions(selectedOrder).map(action => (
                    <button
                      key={action.status}
                      onClick={() => { updateOrderStatus(selectedOrder.id, action.status); setSelectedOrder(null) }}
                      className={`${action.color} rounded-lg`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // ======== Ações por status (mantido) ========
  function getStatusActions(order) {
    const actions = []
    switch (order.status) {
      case 'novo':
        actions.push({ label: 'Aceitar', status: 'aceito', color: 'btn-success' })
        actions.push({ label: 'Cancelar', status: 'cancelado', color: 'btn-danger' })
        break
      case 'aceito':
        actions.push({ label: 'Iniciar Preparo', status: 'preparo', color: 'btn-primary' })
        break
      case 'preparo':
        actions.push({ label: 'Marcar Pronto', status: 'pronto', color: 'btn-success' })
        break
      case 'pronto':
        actions.push({ label: 'Saiu p/ Entrega', status: 'a_caminho', color: 'btn-primary' })
        break
      case 'a_caminho':
        actions.push({ label: 'Concluir', status: 'concluido', color: 'btn-success' })
        break
      default:
        break
    }
    return actions
  }
}
