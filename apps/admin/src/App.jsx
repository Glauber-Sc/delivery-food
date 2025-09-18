// import React, { useEffect } from 'react'
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import Layout from './components/Layout'
// import Login from './pages/Login'
// import Dashboard from './pages/Dashboard'
// import Orders from './pages/Orders'
// import Products from './pages/Products'
// import Categories from './pages/Categories'
// import Settings from './pages/Settings'
// import { useAuthStore } from './store/authStore'
// import Toast from './components/Toast'

// function App() {
//   const { token, loadStoredAuth } = useAuthStore()

//   useEffect(() => {
//     loadStoredAuth()
//   }, [loadStoredAuth])

//   if (!token) {
//     return (
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="*" element={<Navigate to="/login" />} />
//         </Routes>
//         <Toast />
//       </Router>
//     )
//   }

//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Navigate to="/dashboard" />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/orders" element={<Orders />} />
//           <Route path="/products" element={<Products />} />
//           <Route path="/categories" element={<Categories />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="*" element={<Navigate to="/dashboard" />} />
//         </Routes>
//       </Layout>
//       <Toast />
//     </Router>
//   )
// }

// export default App


// App.jsx
import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Settings from './pages/Settings'
import { useAuthStore } from './store/authStore'
import ApiService from './services/api'               // <-- ADICIONE
import Toast from './components/Toast'

function App() {
  const { token, loadStoredAuth } = useAuthStore()

  useEffect(() => {
    loadStoredAuth()
  }, [loadStoredAuth])

  // <-- ADICIONE: injeta/atualiza o Authorization do ApiService
  useEffect(() => {
    ApiService.setToken(token || null)
  }, [token])

  if (!token) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <Toast />
      </Router>
    )
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
      <Toast />
    </Router>
  )
}

export default App
