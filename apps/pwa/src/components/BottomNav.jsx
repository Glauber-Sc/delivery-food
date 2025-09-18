import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, ShoppingCart, User, ReceiptText } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

export default function BottomNav() {
  const navRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // esconder APENAS pelas rotas (nada de dataset!)
  const hide =
    /^\/(produto|product)\/[^/]+$/.test(location.pathname) || // tela de produto
    /^\/cart(?:\/|$)/.test(location.pathname)                 // carrinho (vazio ou não)

  // por segurança: se sobrou algum data-attr, apaga quando a rota mudar
  useEffect(() => {
    document.body.removeAttribute('data-hide-bottom-nav')
  }, [location.pathname])

  const cartItemsCount = useCartStore(
    (state) => state.items.reduce((sum, item) => sum + (item.quantidade || 0), 0)
  )

  // atualiza a CSS var com a altura da nav
  useEffect(() => {
    if (!navRef.current) return
    const updateVar = () => {
      const h = navRef.current?.offsetHeight || 0
      document.documentElement.style.setProperty('--bottom-nav-h', `${h}px`)
    }
    updateVar()
    window.addEventListener('resize', updateVar)
    return () => {
      window.removeEventListener('resize', updateVar)
      document.documentElement.style.removeProperty('--bottom-nav-h')
    }
  }, [cartItemsCount])

  if (hide) return null

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/cart', icon: ShoppingCart, label: 'Carrinho', badge: cartItemsCount },
    { path: '/order', icon: ReceiptText, label: 'Pedidos' },
    { path: '/profile', icon: User, label: 'Perfil' }
  ]

  return (
    <nav
      ref={navRef}
      data-bottom-nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: Icon, label, badge }) => {
          const isActive = location.pathname === path
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 min-w-0 flex-1 transition-colors ${
                isActive ? 'text-primary-500' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : 'text-gray-500'}`} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-primary-500 font-medium' : 'text-gray-500'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
