import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import BottomNav from './BottomNav'
import Toast from './Toast'

export default function Layout({ children }) {
  const location = useLocation()
  const showBottomNav = !location.pathname.includes('/checkout') && !location.pathname.includes('/order')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className={`${showBottomNav ? 'pb-20' : 'pb-4'} safe-area-bottom`}>
        {children}
      </main>

      {showBottomNav && <BottomNav />}
      <Toast />
    </div>
  )
}