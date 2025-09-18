import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings, 
  LogOut,
  FolderOpen
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Sidebar() {
  const { logout, user } = useAuthStore()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/orders', icon: ShoppingCart },
    { name: 'Produtos', href: '/products', icon: Package },
    { name: 'Categorias', href: '/categories', icon: FolderOpen },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ]

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-primary-600">
            Sabor Express
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.href}
                        className={({ isActive }) =>
                          `group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-600'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`
                        }
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* User section */}
            <li className="mt-auto">
              <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold">
                    {user?.nome?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <span className="sr-only">Seu perfil</span>
                <span>{user?.nome || 'Admin'}</span>
              </div>
              
              <button
                onClick={logout}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5 shrink-0" />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}