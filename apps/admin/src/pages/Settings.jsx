import React, { useState, useEffect } from 'react'
import { Save, Clock, MapPin, DollarSign, Phone } from 'lucide-react'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

export default function Settings() {
  const [settings, setSettings] = useState({
    nomeLoja: '',
    endereco: '',
    horarios: { seg_dom: '' },
    tempoMedioPreparoMin: 25,
    taxaEntregaPadrao: 0,
    raioEntregaKm: 0,
    metodosPagamento: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const { showSuccess, showError } = useUIStore()

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro' },
    { id: 'cartao_maquina', name: 'Cartão na entrega' },
    { id: 'pix', name: 'PIX' }
  ]

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getSettings()
      setSettings({
        nomeLoja: data.nomeLoja || '',
        endereco: data.endereco || '',
        horarios: data.horarios || { seg_dom: '' },
        tempoMedioPreparoMin: data.tempoMedioPreparoMin || 25,
        taxaEntregaPadrao: data.taxaEntregaPadrao || 0,
        raioEntregaKm: data.raioEntregaKm || 0,
        metodosPagamento: data.metodosPagamento || []
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      showError('Erro ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      await ApiService.updateSettings({
        ...settings,
        taxaEntregaPadrao: parseFloat(settings.taxaEntregaPadrao),
        raioEntregaKm: parseFloat(settings.raioEntregaKm),
        tempoMedioPreparoMin: parseInt(settings.tempoMedioPreparoMin)
      })
      
      showSuccess('Configurações salvas com sucesso!')
    } catch (error) {
      console.error('Error saving settings:', error)
      showError('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handlePaymentMethodToggle = (methodId) => {
    setSettings(prev => ({
      ...prev,
      metodosPagamento: prev.metodosPagamento.includes(methodId)
        ? prev.metodosPagamento.filter(id => id !== methodId)
        : [...prev.metodosPagamento, methodId]
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">
          Configure os dados da sua loja e parâmetros de entrega
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Store Info */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Phone className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Dados da Loja
              </h2>
              <p className="text-sm text-gray-600">
                Informações básicas do seu estabelecimento
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome da Loja *
              </label>
              <input
                type="text"
                required
                value={settings.nomeLoja}
                onChange={(e) => setSettings({ ...settings, nomeLoja: e.target.value })}
                className="input"
                placeholder="Sabor Express"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço da Loja
              </label>
              <input
                type="text"
                value={settings.endereco}
                onChange={(e) => setSettings({ ...settings, endereco: e.target.value })}
                className="input"
                placeholder="Rua das Flores, 123 - Centro"
              />
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Horário de Funcionamento
              </h2>
              <p className="text-sm text-gray-600">
                Defina quando sua loja aceita pedidos
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Segunda a Domingo
            </label>
            <input
              type="text"
              value={settings.horarios.seg_dom}
              onChange={(e) => setSettings({ 
                ...settings, 
                horarios: { ...settings.horarios, seg_dom: e.target.value }
              })}
              className="input max-w-xs"
              placeholder="18:00-23:59"
            />
            <p className="text-xs text-gray-500 mt-1">
              Formato: HH:MM-HH:MM (ex: 18:00-23:59)
            </p>
          </div>
        </div>

        {/* Delivery Settings */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-lg">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Configurações de Entrega
              </h2>
              <p className="text-sm text-gray-600">
                Defina taxas, tempos e área de entrega
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Entrega (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={settings.taxaEntregaPadrao}
                onChange={(e) => setSettings({ ...settings, taxaEntregaPadrao: e.target.value })}
                className="input"
                placeholder="8.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raio de Entrega (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={settings.raioEntregaKm}
                onChange={(e) => setSettings({ ...settings, raioEntregaKm: e.target.value })}
                className="input"
                placeholder="6.0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tempo Médio de Preparo (min)
              </label>
              <input
                type="number"
                min="1"
                value={settings.tempoMedioPreparoMin}
                onChange={(e) => setSettings({ ...settings, tempoMedioPreparoMin: e.target.value })}
                className="input"
                placeholder="25"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Métodos de Pagamento
              </h2>
              <p className="text-sm text-gray-600">
                Selecione as formas de pagamento aceitas
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {paymentMethods.map(method => (
              <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.metodosPagamento.includes(method.id)}
                  onChange={() => handlePaymentMethodToggle(method.id)}
                  className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {method.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2 px-6"
          >
            {saving ? (
              <div className="loading-spinner"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}