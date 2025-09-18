import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useUIStore } from '../store/uiStore'
import ApiService from '../services/api'

export default function Login() {
  const [formData, setFormData] = useState({
    email: 'admin@delivery.com',
    senha: 'admin123'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated } = useAuthStore()
  const { showError, showSuccess } = useUIStore()

  // Redirect if already authenticated
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const response = await ApiService.login(formData.email, formData.senha)
      
      // Set token in ApiService
      ApiService.setToken(response.token)
      
      // Store auth data
      login(response.token, response.user)
      
      showSuccess('Login realizado com sucesso!')
    } catch (error) {
      console.error('Login error:', error)
      showError(error.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-primary-600 mb-2">
            Sabor Express
          </h1>
          <h2 className="text-center text-xl text-gray-900">
            Painel Administrativo
          </h2>
          <p className="text-center text-sm text-gray-600 mt-2">
            Entre com suas credenciais para acessar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="input"
                placeholder="admin@delivery.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.senha}
                  onChange={(e) => handleInputChange('senha', e.target.value)}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              {loading && <div className="loading-spinner"></div>}
              Entrar
            </button>
          </div>

          {/* Demo credentials info */}
          <div className="text-center">
            <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
              <p className="font-medium mb-1">Credenciais de demonstração:</p>
              <p>Email: admin@delivery.com</p>
              <p>Senha: admin123</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}