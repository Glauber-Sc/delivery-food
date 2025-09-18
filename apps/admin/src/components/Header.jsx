import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'

export default function Header() {
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard'
      case '/orders':
        return 'Pedidos'
      case '/products':
        return 'Produtos'
      case '/categories':
        return 'Categorias'
      case '/settings':
        return 'Configurações'
      default:
        return 'Sabor Express'
    }
  }

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden">
        <span className="sr-only">Abrir sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
          {/* Notifications */}
          <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Ver notificações</span>
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  )
}