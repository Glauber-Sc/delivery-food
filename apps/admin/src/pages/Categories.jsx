import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  
  const [formData, setFormData] = useState({
    nome: '',
    ordem: '',
    ativa: true
  })

  const { showSuccess, showError } = useUIStore()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const data = await ApiService.getCategories()
      setCategories(data.sort((a, b) => a.ordem - b.ordem))
    } catch (error) {
      console.error('Error loading categories:', error)
      showError('Erro ao carregar categorias')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        nome: category.nome,
        ordem: category.ordem.toString(),
        ativa: category.ativa
      })
    } else {
      setEditingCategory(null)
      const nextOrder = Math.max(...categories.map(c => c.ordem), 0) + 1
      setFormData({
        nome: '',
        ordem: nextOrder.toString(),
        ativa: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const categoryData = {
        ...formData,
        ordem: parseInt(formData.ordem)
      }

      if (editingCategory) {
        await ApiService.updateCategory(editingCategory.id, categoryData)
        showSuccess('Categoria atualizada com sucesso!')
      } else {
        await ApiService.createCategory(categoryData)
        showSuccess('Categoria criada com sucesso!')
      }

      closeModal()
      loadCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      showError(error.message || 'Erro ao salvar categoria')
    }
  }

  const handleDelete = async (categoryId, categoryName) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      return
    }

    try {
      await ApiService.deleteCategory(categoryId)
      showSuccess('Categoria excluída com sucesso!')
      loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      showError('Erro ao excluir categoria')
    }
  }

  const toggleCategoryStatus = async (category) => {
    try {
      await ApiService.updateCategory(category.id, { ativa: !category.ativa })
      showSuccess(`Categoria ${!category.ativa ? 'ativada' : 'desativada'} com sucesso!`)
      loadCategories()
    } catch (error) {
      console.error('Error toggling category status:', error)
      showError('Erro ao alterar status da categoria')
    }
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
          <p className="text-gray-600">
            Organize os produtos do seu cardápio
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nova Categoria
        </button>
      </div>

      {/* Categories List */}
      <div className="card">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma categoria cadastrada</p>
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              Criar Primeira Categoria
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category, index) => (
              <div
                key={category.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <GripVertical className="w-5 h-5" />
                    <span className="text-sm font-medium min-w-[2rem]">
                      {category.ordem}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {category.nome}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ordem: {category.ordem}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    category.ativa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {category.ativa ? 'Ativa' : 'Inativa'}
                  </span>

                  <button
                    onClick={() => openModal(category)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar categoria"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleCategoryStatus(category)}
                    className={`p-2 rounded-lg transition-colors ${
                      category.ativa 
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={category.ativa ? 'Desativar categoria' : 'Ativar categoria'}
                  >
                    {category.ativa ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDelete(category.id, category.nome)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Excluir categoria"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da Categoria *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="input"
                    placeholder="Ex: Pizzas, Lanches, Bebidas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ordem de Exibição *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.ordem}
                    onChange={(e) => setFormData({ ...formData, ordem: e.target.value })}
                    className="input"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Menor número aparece primeiro
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.ativa}
                      onChange={(e) => setFormData({ ...formData, ativa: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Categoria ativa
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary flex-1">
                  {editingCategory ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}