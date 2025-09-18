import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  ShoppingBag,
  Users,
  Package
} from 'lucide-react'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { showError } = useUIStore()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getOrderStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
      showError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const statCards = [
    {
      name: 'Pedidos Hoje',
      value: stats?.hoje?.total || 0,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Faturamento Hoje',
      value: formatPrice(stats?.hoje?.faturamento || 0),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Ticket Médio',
      value: formatPrice(stats?.hoje?.ticketMedio || 0),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Pedidos Ativos',
      value: (stats?.statusCount?.novo || 0) + 
             (stats?.statusCount?.aceito || 0) + 
             (stats?.statusCount?.preparo || 0) + 
             (stats?.statusCount?.pronto || 0) + 
             (stats?.statusCount?.a_caminho || 0),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  const statusCards = [
    { name: 'Novos', count: stats?.statusCount?.novo || 0, color: 'bg-blue-500' },
    { name: 'Aceitos', count: stats?.statusCount?.aceito || 0, color: 'bg-green-500' },
    { name: 'Preparo', count: stats?.statusCount?.preparo || 0, color: 'bg-orange-500' },
    { name: 'Prontos', count: stats?.statusCount?.pronto || 0, color: 'bg-success-500' },
    { name: 'A Caminho', count: stats?.statusCount?.a_caminho || 0, color: 'bg-purple-500' },
    { name: 'Concluídos', count: stats?.statusCount?.concluido || 0, color: 'bg-gray-500' }
  ]

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Visão geral do seu negócio em tempo real
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.bgColor} rounded-md p-3`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Status overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Status dos Pedidos
          </h3>
          <div className="space-y-3">
            {statusCards.map((status) => (
              <div key={status.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${status.color} mr-3`}></div>
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {status.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Resumo de Hoje
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Total de pedidos</span>
              <span className="font-semibold">{stats?.hoje?.total || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Faturamento</span>
              <span className="font-semibold text-green-600">
                {formatPrice(stats?.hoje?.faturamento || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Ticket médio</span>
              <span className="font-semibold">
                {formatPrice(stats?.hoje?.ticketMedio || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/orders"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="font-medium text-gray-900">Ver Pedidos</p>
                <p className="text-sm text-gray-500">Gerenciar pedidos ativos</p>
              </div>
            </div>
          </a>

          <a
            href="/products"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="font-medium text-gray-900">Produtos</p>
                <p className="text-sm text-gray-500">Gerenciar cardápio</p>
              </div>
            </div>
          </a>

          <a
            href="/settings"
            className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="font-medium text-gray-900">Configurações</p>
                <p className="text-sm text-gray-500">Ajustar loja</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}