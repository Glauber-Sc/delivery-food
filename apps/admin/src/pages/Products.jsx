// // // // // import React, { useState, useEffect } from 'react'
// // // // // import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
// // // // // import ApiService from '../services/api'
// // // // // import { useUIStore } from '../store/uiStore'

// // // // // export default function Products() {
// // // // //   const [products, setProducts] = useState([])
// // // // //   const [categories, setCategories] = useState([])
// // // // //   const [loading, setLoading] = useState(true)
// // // // //   const [selectedCategory, setSelectedCategory] = useState('')
// // // // //   const [showModal, setShowModal] = useState(false)
// // // // //   const [editingProduct, setEditingProduct] = useState(null)
  
// // // // //   const [formData, setFormData] = useState({
// // // // //     nome: '',
// // // // //     descricao: '',
// // // // //     categoriaId: '',
// // // // //     precoBase: '',
// // // // //     imagem: '',
// // // // //     ativo: true
// // // // //   })

// // // // //   const { showSuccess, showError } = useUIStore()

// // // // //   useEffect(() => {
// // // // //     loadData()
// // // // //   }, [])

// // // // //   const loadData = async () => {
// // // // //     try {
// // // // //       setLoading(true)
// // // // //       const [productsData, categoriesData] = await Promise.all([
// // // // //         ApiService.getProducts(),
// // // // //         ApiService.getCategories()
// // // // //       ])
// // // // //       setProducts(productsData)
// // // // //       setCategories(categoriesData)
// // // // //     } catch (error) {
// // // // //       console.error('Error loading data:', error)
// // // // //       showError('Erro ao carregar dados')
// // // // //     } finally {
// // // // //       setLoading(false)
// // // // //     }
// // // // //   }

// // // // //   const openModal = (product = null) => {
// // // // //     if (product) {
// // // // //       setEditingProduct(product)
// // // // //       setFormData({
// // // // //         nome: product.nome,
// // // // //         descricao: product.descricao,
// // // // //         categoriaId: product.categoriaId,
// // // // //         precoBase: product.precoBase.toString(),
// // // // //         imagem: product.imagem,
// // // // //         ativo: product.ativo
// // // // //       })
// // // // //     } else {
// // // // //       setEditingProduct(null)
// // // // //       setFormData({
// // // // //         nome: '',
// // // // //         descricao: '',
// // // // //         categoriaId: categories[0]?.id || '',
// // // // //         precoBase: '',
// // // // //         imagem: '',
// // // // //         ativo: true
// // // // //       })
// // // // //     }
// // // // //     setShowModal(true)
// // // // //   }

// // // // //   const closeModal = () => {
// // // // //     setShowModal(false)
// // // // //     setEditingProduct(null)
// // // // //   }

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault()
    
// // // // //     try {
// // // // //       const productData = {
// // // // //         ...formData,
// // // // //         precoBase: parseFloat(formData.precoBase)
// // // // //       }

// // // // //       if (editingProduct) {
// // // // //         await ApiService.updateProduct(editingProduct.id, productData)
// // // // //         showSuccess('Produto atualizado com sucesso!')
// // // // //       } else {
// // // // //         await ApiService.createProduct(productData)
// // // // //         showSuccess('Produto criado com sucesso!')
// // // // //       }

// // // // //       closeModal()
// // // // //       loadData()
// // // // //     } catch (error) {
// // // // //       console.error('Error saving product:', error)
// // // // //       showError(error.message || 'Erro ao salvar produto')
// // // // //     }
// // // // //   }

// // // // //   const handleDelete = async (productId, productName) => {
// // // // //     if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) {
// // // // //       return
// // // // //     }

// // // // //     try {
// // // // //       await ApiService.deleteProduct(productId)
// // // // //       showSuccess('Produto excluído com sucesso!')
// // // // //       loadData()
// // // // //     } catch (error) {
// // // // //       console.error('Error deleting product:', error)
// // // // //       showError('Erro ao excluir produto')
// // // // //     }
// // // // //   }

// // // // //   const toggleProductStatus = async (product) => {
// // // // //     try {
// // // // //       await ApiService.updateProduct(product.id, { ativo: !product.ativo })
// // // // //       showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
// // // // //       loadData()
// // // // //     } catch (error) {
// // // // //       console.error('Error toggling product status:', error)
// // // // //       showError('Erro ao alterar status do produto')
// // // // //     }
// // // // //   }

// // // // //   const formatPrice = (price) => {
// // // // //     return new Intl.NumberFormat('pt-BR', {
// // // // //       style: 'currency',
// // // // //       currency: 'BRL'
// // // // //     }).format(price)
// // // // //   }

// // // // //   const getCategoryName = (categoryId) => {
// // // // //     const category = categories.find(cat => cat.id === categoryId)
// // // // //     return category ? category.nome : 'Sem categoria'
// // // // //   }

// // // // //   const filteredProducts = selectedCategory
// // // // //     ? products.filter(p => p.categoriaId === selectedCategory)
// // // // //     : products

// // // // //   if (loading) {
// // // // //     return (
// // // // //       <div className="flex items-center justify-center h-64">
// // // // //         <div className="loading-spinner"></div>
// // // // //       </div>
// // // // //     )
// // // // //   }

// // // // //   return (
// // // // //     <div>
// // // // //       {/* Page header */}
// // // // //       <div className="flex justify-between items-center mb-6">
// // // // //         <div>
// // // // //           <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
// // // // //           <p className="text-gray-600">
// // // // //             Gerencie o cardápio da sua loja
// // // // //           </p>
// // // // //         </div>
// // // // //         <button
// // // // //           onClick={() => openModal()}
// // // // //           className="btn-primary flex items-center gap-2"
// // // // //         >
// // // // //           <Plus className="w-5 h-5" />
// // // // //           Novo Produto
// // // // //         </button>
// // // // //       </div>

// // // // //       {/* Filters */}
// // // // //       <div className="mb-6">
// // // // //         <div className="flex gap-2 overflow-x-auto pb-2">
// // // // //           <button
// // // // //             onClick={() => setSelectedCategory('')}
// // // // //             className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // // // //               selectedCategory === ''
// // // // //                 ? 'bg-primary-500 text-white'
// // // // //                 : 'bg-white text-gray-700 border border-gray-300'
// // // // //             }`}
// // // // //           >
// // // // //             Todos ({products.length})
// // // // //           </button>
// // // // //           {categories.map(category => {
// // // // //             const count = products.filter(p => p.categoriaId === category.id).length
// // // // //             return (
// // // // //               <button
// // // // //                 key={category.id}
// // // // //                 onClick={() => setSelectedCategory(category.id)}
// // // // //                 className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // // // //                   selectedCategory === category.id
// // // // //                     ? 'bg-primary-500 text-white'
// // // // //                     : 'bg-white text-gray-700 border border-gray-300'
// // // // //                 }`}
// // // // //               >
// // // // //                 {category.nome} ({count})
// // // // //               </button>
// // // // //             )
// // // // //           })}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Products Grid */}
// // // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // //         {filteredProducts.map(product => (
// // // // //           <div key={product.id} className="card p-4">
// // // // //             <div className="flex justify-between items-start mb-3">
// // // // //               <div>
// // // // //                 <h3 className="font-semibold text-gray-900 truncate">
// // // // //                   {product.nome}
// // // // //                 </h3>
// // // // //                 <p className="text-sm text-gray-500">
// // // // //                   {getCategoryName(product.categoriaId)}
// // // // //                 </p>
// // // // //               </div>
// // // // //               <span className={`px-2 py-1 text-xs rounded-full ${
// // // // //                 product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
// // // // //               }`}>
// // // // //                 {product.ativo ? 'Ativo' : 'Inativo'}
// // // // //               </span>
// // // // //             </div>

// // // // //             <p className="text-sm text-gray-600 line-clamp-2 mb-3">
// // // // //               {product.descricao}
// // // // //             </p>

// // // // //             <div className="flex justify-between items-center mb-4">
// // // // //               <span className="text-lg font-bold text-primary-600">
// // // // //                 {formatPrice(product.precoBase)}
// // // // //               </span>
// // // // //               <span className="text-sm text-gray-500">
// // // // //                 {product.perguntas?.length || 0} pergunta(s)
// // // // //               </span>
// // // // //             </div>

// // // // //             <div className="flex gap-2">
// // // // //               <button
// // // // //                 onClick={() => openModal(product)}
// // // // //                 className="btn-secondary flex-1 flex items-center justify-center gap-1"
// // // // //               >
// // // // //                 <Edit className="w-4 h-4" />
// // // // //                 Editar
// // // // //               </button>
              
// // // // //               <button
// // // // //                 onClick={() => toggleProductStatus(product)}
// // // // //                 className={`p-2 rounded-lg border transition-colors ${
// // // // //                   product.ativo 
// // // // //                     ? 'border-red-300 text-red-600 hover:bg-red-50'
// // // // //                     : 'border-green-300 text-green-600 hover:bg-green-50'
// // // // //                 }`}
// // // // //               >
// // // // //                 {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// // // // //               </button>

// // // // //               <button
// // // // //                 onClick={() => handleDelete(product.id, product.nome)}
// // // // //                 className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
// // // // //               >
// // // // //                 <Trash2 className="w-4 h-4" />
// // // // //               </button>
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}

// // // // //         {filteredProducts.length === 0 && (
// // // // //           <div className="col-span-full text-center py-12">
// // // // //             <p className="text-gray-500 mb-4">
// // // // //               {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
// // // // //             </p>
// // // // //             <button
// // // // //               onClick={() => openModal()}
// // // // //               className="btn-primary"
// // // // //             >
// // // // //               Criar Primeiro Produto
// // // // //             </button>
// // // // //           </div>
// // // // //         )}
// // // // //       </div>

// // // // //       {/* Product Modal */}
// // // // //       {showModal && (
// // // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // // //             <form onSubmit={handleSubmit} className="p-6">
// // // // //               <div className="flex justify-between items-center mb-6">
// // // // //                 <h2 className="text-xl font-bold text-gray-900">
// // // // //                   {editingProduct ? 'Editar Produto' : 'Novo Produto'}
// // // // //                 </h2>
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={closeModal}
// // // // //                   className="text-gray-400 hover:text-gray-600"
// // // // //                 >
// // // // //                   <Plus className="w-6 h-6 rotate-45" />
// // // // //                 </button>
// // // // //               </div>

// // // // //               <div className="space-y-4">
// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // // // //                     Nome *
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="text"
// // // // //                     required
// // // // //                     value={formData.nome}
// // // // //                     onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
// // // // //                     className="input"
// // // // //                     placeholder="Nome do produto"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // // // //                     Descrição *
// // // // //                   </label>
// // // // //                   <textarea
// // // // //                     required
// // // // //                     rows={3}
// // // // //                     value={formData.descricao}
// // // // //                     onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
// // // // //                     className="input"
// // // // //                     placeholder="Descrição do produto"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // // // //                     Categoria *
// // // // //                   </label>
// // // // //                   <select
// // // // //                     required
// // // // //                     value={formData.categoriaId}
// // // // //                     onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
// // // // //                     className="input"
// // // // //                   >
// // // // //                     <option value="">Selecione uma categoria</option>
// // // // //                     {categories.map(category => (
// // // // //                       <option key={category.id} value={category.id}>
// // // // //                         {category.nome}
// // // // //                       </option>
// // // // //                     ))}
// // // // //                   </select>
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // // // //                     Preço Base *
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="number"
// // // // //                     required
// // // // //                     step="0.01"
// // // // //                     min="0"
// // // // //                     value={formData.precoBase}
// // // // //                     onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
// // // // //                     className="input"
// // // // //                     placeholder="0,00"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">
// // // // //                     URL da Imagem
// // // // //                   </label>
// // // // //                   <input
// // // // //                     type="url"
// // // // //                     value={formData.imagem}
// // // // //                     onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
// // // // //                     className="input"
// // // // //                     placeholder="https://exemplo.com/imagem.jpg"
// // // // //                   />
// // // // //                 </div>

// // // // //                 <div>
// // // // //                   <label className="flex items-center gap-2">
// // // // //                     <input
// // // // //                       type="checkbox"
// // // // //                       checked={formData.ativo}
// // // // //                       onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
// // // // //                       className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
// // // // //                     />
// // // // //                     <span className="text-sm font-medium text-gray-700">
// // // // //                       Produto ativo
// // // // //                     </span>
// // // // //                   </label>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="flex gap-3 mt-6">
// // // // //                 <button type="submit" className="btn-primary flex-1">
// // // // //                   {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
// // // // //                 </button>
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={closeModal}
// // // // //                   className="btn-secondary"
// // // // //                 >
// // // // //                   Cancelar
// // // // //                 </button>
// // // // //               </div>
// // // // //             </form>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   )
// // // // // }


// // // // import React, { useState, useEffect } from 'react'
// // // // import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
// // // // import ApiService from '../services/api'
// // // // import { useUIStore } from '../store/uiStore'
// // // // import ProductQuestionsEditor from '../components/ProductQuestionsEditor'

// // // // export default function Products() {
// // // //   const [products, setProducts] = useState([])
// // // //   const [categories, setCategories] = useState([])
// // // //   const [loading, setLoading] = useState(true)
// // // //   const [selectedCategory, setSelectedCategory] = useState('')
// // // //   const [showModal, setShowModal] = useState(false)
// // // //   const [editingProduct, setEditingProduct] = useState(null)
// // // //   const [showQuestions, setShowQuestions] = useState(false)
  
// // // //   const [formData, setFormData] = useState({
// // // //     nome: '',
// // // //     descricao: '',
// // // //     categoriaId: '',
// // // //     precoBase: '',
// // // //     imagem: '',
// // // //     ativo: true
// // // //   })

// // // //   const { showSuccess, showError } = useUIStore()

// // // //   useEffect(() => {
// // // //     loadData()
// // // //   }, [])

// // // //   const loadData = async () => {
// // // //     try {
// // // //       setLoading(true)
// // // //       const [productsData, categoriesData] = await Promise.all([
// // // //         ApiService.getProducts(),
// // // //         ApiService.getCategories()
// // // //       ])
// // // //       setProducts(productsData)
// // // //       setCategories(categoriesData)
// // // //     } catch (error) {
// // // //       console.error('Error loading data:', error)
// // // //       showError('Erro ao carregar dados')
// // // //     } finally {
// // // //       setLoading(false)
// // // //     }
// // // //   }

// // // //   const openModal = (product = null) => {
// // // //     if (product) {
// // // //       setEditingProduct(product)
// // // //       setFormData({
// // // //         nome: product.nome,
// // // //         descricao: product.descricao,
// // // //         categoriaId: product.categoriaId,
// // // //         precoBase: product.precoBase.toString(),
// // // //         imagem: product.imagem,
// // // //         ativo: product.ativo
// // // //       })
// // // //     } else {
// // // //       setEditingProduct(null)
// // // //       setFormData({
// // // //         nome: '',
// // // //         descricao: '',
// // // //         categoriaId: categories[0]?.id || '',
// // // //         precoBase: '',
// // // //         imagem: '',
// // // //         ativo: true
// // // //       })
// // // //     }
// // // //     setShowModal(true)
// // // //   }

// // // //   const closeModal = () => {
// // // //     setShowModal(false)
// // // //     setEditingProduct(null)
// // // //   }

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault()
// // // //     try {
// // // //       const productData = { ...formData, precoBase: parseFloat(formData.precoBase) }
// // // //       if (editingProduct) {
// // // //         await ApiService.updateProduct(editingProduct.id, productData)
// // // //         showSuccess('Produto atualizado com sucesso!')
// // // //       } else {
// // // //         await ApiService.createProduct(productData)
// // // //         showSuccess('Produto criado com sucesso!')
// // // //       }
// // // //       closeModal()
// // // //       loadData()
// // // //     } catch (error) {
// // // //       console.error('Error saving product:', error)
// // // //       showError(error.message || 'Erro ao salvar produto')
// // // //     }
// // // //   }

// // // //   const handleDelete = async (productId, productName) => {
// // // //     if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) return
// // // //     try {
// // // //       await ApiService.deleteProduct(productId)
// // // //       showSuccess('Produto excluído com sucesso!')
// // // //       loadData()
// // // //     } catch (error) {
// // // //       console.error('Error deleting product:', error)
// // // //       showError('Erro ao excluir produto')
// // // //     }
// // // //   }

// // // //   const toggleProductStatus = async (product) => {
// // // //     try {
// // // //       await ApiService.updateProduct(product.id, { ativo: !product.ativo })
// // // //       showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
// // // //       loadData()
// // // //     } catch (error) {
// // // //       console.error('Error toggling product status:', error)
// // // //       showError('Erro ao alterar status do produto')
// // // //     }
// // // //   }

// // // //   const formatPrice = (price) => {
// // // //     return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)
// // // //   }

// // // //   const getCategoryName = (categoryId) => {
// // // //     const category = categories.find(cat => cat.id === categoryId)
// // // //     return category ? category.nome : 'Sem categoria'
// // // //   }

// // // //   const filteredProducts = selectedCategory
// // // //     ? products.filter(p => p.categoriaId === selectedCategory)
// // // //     : products

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
// // // //       <div className="flex justify-between items-center mb-6">
// // // //         <div>
// // // //           <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
// // // //           <p className="text-gray-600">Gerencie o cardápio da sua loja</p>
// // // //         </div>
// // // //         <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
// // // //           <Plus className="w-5 h-5" />
// // // //           Novo Produto
// // // //         </button>
// // // //       </div>

// // // //       {/* Filters */}
// // // //       <div className="mb-6">
// // // //         <div className="flex gap-2 overflow-x-auto pb-2">
// // // //           <button
// // // //             onClick={() => setSelectedCategory('')}
// // // //             className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // // //               selectedCategory === ''
// // // //                 ? 'bg-primary-500 text-white'
// // // //                 : 'bg-white text-gray-700 border border-gray-300'
// // // //             }`}
// // // //           >
// // // //             Todos ({products.length})
// // // //           </button>
// // // //           {categories.map(category => {
// // // //             const count = products.filter(p => p.categoriaId === category.id).length
// // // //             return (
// // // //               <button
// // // //                 key={category.id}
// // // //                 onClick={() => setSelectedCategory(category.id)}
// // // //                 className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // // //                   selectedCategory === category.id
// // // //                     ? 'bg-primary-500 text-white'
// // // //                     : 'bg-white text-gray-700 border border-gray-300'
// // // //                 }`}
// // // //               >
// // // //                 {category.nome} ({count})
// // // //               </button>
// // // //             )
// // // //           })}
// // // //         </div>
// // // //       </div>

// // // //       {/* Products Grid */}
// // // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // //         {filteredProducts.map(product => (
// // // //           <div key={product.id} className="card p-4">
// // // //             <div className="flex justify-between items-start mb-3">
// // // //               <div>
// // // //                 <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
// // // //                 <p className="text-sm text-gray-500">{getCategoryName(product.categoriaId)}</p>
// // // //               </div>
// // // //               <span className={`px-2 py-1 text-xs rounded-full ${
// // // //                 product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
// // // //               }`}>
// // // //                 {product.ativo ? 'Ativo' : 'Inativo'}
// // // //               </span>
// // // //             </div>

// // // //             <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.descricao}</p>

// // // //             <div className="flex justify-between items-center mb-4">
// // // //               <span className="text-lg font-bold text-primary-600">{formatPrice(product.precoBase)}</span>
// // // //               <span className="text-sm text-gray-500">{product.perguntas?.length || 0} pergunta(s)</span>
// // // //             </div>

// // // //             <div className="flex gap-2">
// // // //               <button onClick={() => openModal(product)} className="btn-secondary flex-1 flex items-center justify-center gap-1">
// // // //                 <Edit className="w-4 h-4" />
// // // //                 Editar
// // // //               </button>

// // // //               {/* NOVO: botão Perguntas */}
// // // //               <button
// // // //                 onClick={() => { setEditingProduct(product); setShowQuestions(true) }}
// // // //                 className="btn-secondary flex-1 flex items-center justify-center gap-1"
// // // //               >
// // // //                 Perguntas
// // // //               </button>
              
// // // //               <button
// // // //                 onClick={() => toggleProductStatus(product)}
// // // //                 className={`p-2 rounded-lg border transition-colors ${
// // // //                   product.ativo 
// // // //                     ? 'border-red-300 text-red-600 hover:bg-red-50'
// // // //                     : 'border-green-300 text-green-600 hover:bg-green-50'
// // // //                 }`}
// // // //               >
// // // //                 {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// // // //               </button>

// // // //               <button
// // // //                 onClick={() => handleDelete(product.id, product.nome)}
// // // //                 className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
// // // //               >
// // // //                 <Trash2 className="w-4 h-4" />
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         ))}

// // // //         {filteredProducts.length === 0 && (
// // // //           <div className="col-span-full text-center py-12">
// // // //             <p className="text-gray-500 mb-4">
// // // //               {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
// // // //             </p>
// // // //             <button onClick={() => openModal()} className="btn-primary">
// // // //               Criar Primeiro Produto
// // // //             </button>
// // // //           </div>
// // // //         )}
// // // //       </div>

// // // //       {/* Product Modal */}
// // // //       {showModal && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// // // //             <form onSubmit={handleSubmit} className="p-6">
// // // //               <div className="flex justify-between items-center mb-6">
// // // //                 <h2 className="text-xl font-bold text-gray-900">
// // // //                   {editingProduct ? 'Editar Produto' : 'Novo Produto'}
// // // //                 </h2>
// // // //                 <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
// // // //                   <Plus className="w-6 h-6 rotate-45" />
// // // //                 </button>
// // // //               </div>

// // // //               <div className="space-y-4">
// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
// // // //                   <input
// // // //                     type="text" required value={formData.nome}
// // // //                     onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
// // // //                     className="input" placeholder="Nome do produto"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
// // // //                   <textarea
// // // //                     required rows={3} value={formData.descricao}
// // // //                     onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
// // // //                     className="input" placeholder="Descrição do produto"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
// // // //                   <select
// // // //                     required value={formData.categoriaId}
// // // //                     onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
// // // //                     className="input"
// // // //                   >
// // // //                     <option value="">Selecione uma categoria</option>
// // // //                     {categories.map(category => (
// // // //                       <option key={category.id} value={category.id}>{category.nome}</option>
// // // //                     ))}
// // // //                   </select>
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base *</label>
// // // //                   <input
// // // //                     type="number" required step="0.01" min="0" value={formData.precoBase}
// // // //                     onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
// // // //                     className="input" placeholder="0,00"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
// // // //                   <input
// // // //                     type="url" value={formData.imagem}
// // // //                     onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
// // // //                     className="input" placeholder="https://exemplo.com/imagem.jpg"
// // // //                   />
// // // //                 </div>

// // // //                 <div>
// // // //                   <label className="flex items-center gap-2">
// // // //                     <input
// // // //                       type="checkbox" checked={formData.ativo}
// // // //                       onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
// // // //                       className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
// // // //                     />
// // // //                     <span className="text-sm font-medium text-gray-700">Produto ativo</span>
// // // //                   </label>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="flex gap-3 mt-6">
// // // //                 <button type="submit" className="btn-primary flex-1">
// // // //                   {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
// // // //                 </button>
// // // //                 <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
// // // //               </div>
// // // //             </form>
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Modal Perguntas */}
// // // //       {showQuestions && editingProduct && (
// // // //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// // // //           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// // // //             <div className="p-4 border-b flex items-center justify-between">
// // // //               <h2 className="text-lg font-bold">Perguntas de {editingProduct.nome}</h2>
// // // //               <button className="text-gray-400 hover:text-gray-600" onClick={() => setShowQuestions(false)}>
// // // //                 <Plus className="w-6 h-6 rotate-45" />
// // // //               </button>
// // // //             </div>
// // // //             <ProductQuestionsEditor
// // // //               product={editingProduct}
// // // //               onClose={() => setShowQuestions(false)}
// // // //               onSaved={() => loadData()}
// // // //               showSuccess={showSuccess}
// // // //               showError={showError}
// // // //             />
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   )
// // // // }








// // // import React, { useState, useEffect } from 'react'
// // // import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
// // // import ApiService from '../services/api'
// // // import { useUIStore } from '../store/uiStore'
// // // import ProductQuestionsEditor, { TEMPLATES } from '../components/ProductQuestionsEditor'

// // // export default function Products() {
// // //   const [products, setProducts] = useState([])
// // //   const [categories, setCategories] = useState([])
// // //   const [loading, setLoading] = useState(true)
// // //   const [selectedCategory, setSelectedCategory] = useState('')
// // //   const [showModal, setShowModal] = useState(false)
// // //   const [editingProduct, setEditingProduct] = useState(null)

// // //   // aba interna do modal
// // //   const [activeTab, setActiveTab] = useState('dados') // 'dados' | 'perguntas'
// // //   const [criarPerguntasAgora, setCriarPerguntasAgora] = useState(true)
// // //   const [perguntasDraft, setPerguntasDraft] = useState([])

// // //   const [formData, setFormData] = useState({
// // //     nome: '',
// // //     descricao: '',
// // //     categoriaId: '',
// // //     precoBase: '',
// // //     imagem: '',
// // //     ativo: true
// // //   })

// // //   const { showSuccess, showError } = useUIStore()

// // //   useEffect(() => { loadData() }, [])

// // //   const loadData = async () => {
// // //     try {
// // //       setLoading(true)
// // //       const [productsData, categoriesData] = await Promise.all([
// // //         ApiService.getProducts(),
// // //         ApiService.getCategories()
// // //       ])
// // //       setProducts(productsData)
// // //       setCategories(categoriesData)
// // //     } catch (error) {
// // //       console.error('Error loading data:', error)
// // //       showError('Erro ao carregar dados')
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   const openModal = (product = null) => {
// // //     if (product) {
// // //       setEditingProduct(product)
// // //       setFormData({
// // //         nome: product.nome,
// // //         descricao: product.descricao,
// // //         categoriaId: product.categoriaId,
// // //         precoBase: product.precoBase.toString(),
// // //         imagem: product.imagem,
// // //         ativo: product.ativo
// // //       })
// // //       setPerguntasDraft(product.perguntas || [])
// // //       setCriarPerguntasAgora(true) // ao editar, já mostra
// // //     } else {
// // //       setEditingProduct(null)
// // //       setFormData({
// // //         nome: '',
// // //         descricao: '',
// // //         categoriaId: categories[0]?.id || '',
// // //         precoBase: '',
// // //         imagem: '',
// // //         ativo: true
// // //       })
// // //       // templates padrão ao criar
// // //       setPerguntasDraft([
// // //         TEMPLATES.ADICIONAIS_QTY(),
// // //         TEMPLATES.OBSERVACOES()
// // //       ])
// // //       setCriarPerguntasAgora(true)
// // //     }
// // //     setActiveTab('dados')
// // //     setShowModal(true)
// // //   }

// // //   const closeModal = () => {
// // //     setShowModal(false)
// // //     setEditingProduct(null)
// // //     setPerguntasDraft([])
// // //   }

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault()
// // //     try {
// // //       const base = { ...formData, precoBase: parseFloat(formData.precoBase) }

// // //       if (editingProduct) {
// // //         // editar produto (se quiser também atualizar perguntas por aqui, basta enviar junto)
// // //         const payload = criarPerguntasAgora ? { ...base, perguntas: perguntasDraft } : base
// // //         await ApiService.updateProduct(editingProduct.id, payload)
// // //         showSuccess('Produto atualizado com sucesso!')
// // //       } else {
// // //         // criar produto + (opcional) perguntas
// // //         const payload = criarPerguntasAgora ? { ...base, perguntas: perguntasDraft } : base
// // //         await ApiService.createProduct(payload)
// // //         showSuccess('Produto criado com sucesso!')
// // //       }

// // //       closeModal()
// // //       loadData()
// // //     } catch (error) {
// // //       console.error('Error saving product:', error)
// // //       showError(error.message || 'Erro ao salvar produto')
// // //     }
// // //   }

// // //   const handleDelete = async (productId, productName) => {
// // //     if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) return
// // //     try {
// // //       await ApiService.deleteProduct(productId)
// // //       showSuccess('Produto excluído com sucesso!')
// // //       loadData()
// // //     } catch (error) {
// // //       console.error('Error deleting product:', error)
// // //       showError('Erro ao excluir produto')
// // //     }
// // //   }

// // //   const toggleProductStatus = async (product) => {
// // //     try {
// // //       await ApiService.updateProduct(product.id, { ativo: !product.ativo })
// // //       showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
// // //       loadData()
// // //     } catch (error) {
// // //       console.error('Error toggling product status:', error)
// // //       showError('Erro ao alterar status do produto')
// // //     }
// // //   }

// // //   const formatPrice = (price) =>
// // //     new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

// // //   const getCategoryName = (categoryId) => {
// // //     const category = categories.find(cat => cat.id === categoryId)
// // //     return category ? category.nome : 'Sem categoria'
// // //   }

// // //   const filteredProducts = selectedCategory
// // //     ? products.filter(p => p.categoriaId === selectedCategory)
// // //     : products

// // //   if (loading) {
// // //     return (
// // //       <div className="flex items-center justify-center h-64">
// // //         <div className="loading-spinner"></div>
// // //       </div>
// // //     )
// // //   }

// // //   return (
// // //     <div>
// // //       {/* Header */}
// // //       <div className="flex justify-between items-center mb-6">
// // //         <div>
// // //           <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
// // //           <p className="text-gray-600">Gerencie o cardápio da sua loja</p>
// // //         </div>
// // //         <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
// // //           <Plus className="w-5 h-5" /> Novo Produto
// // //         </button>
// // //       </div>

// // //       {/* Filtros */}
// // //       <div className="mb-6">
// // //         <div className="flex gap-2 overflow-x-auto pb-2">
// // //           <button
// // //             onClick={() => setSelectedCategory('')}
// // //             className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // //               selectedCategory === '' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
// // //             }`}
// // //           >
// // //             Todos ({products.length})
// // //           </button>
// // //           {categories.map(category => {
// // //             const count = products.filter(p => p.categoriaId === category.id).length
// // //             return (
// // //               <button
// // //                 key={category.id}
// // //                 onClick={() => setSelectedCategory(category.id)}
// // //                 className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// // //                   selectedCategory === category.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
// // //                 }`}
// // //               >
// // //                 {category.nome} ({count})
// // //               </button>
// // //             )
// // //           })}
// // //         </div>
// // //       </div>

// // //       {/* Grid */}
// // //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //         {filteredProducts.map(product => (
// // //           <div key={product.id} className="card p-4">
// // //             <div className="flex justify-between items-start mb-3">
// // //               <div>
// // //                 <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
// // //                 <p className="text-sm text-gray-500">{getCategoryName(product.categoriaId)}</p>
// // //               </div>
// // //               <span className={`px-2 py-1 text-xs rounded-full ${product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
// // //                 {product.ativo ? 'Ativo' : 'Inativo'}
// // //               </span>
// // //             </div>

// // //             <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.descricao}</p>

// // //             <div className="flex justify-between items-center mb-4">
// // //               <span className="text-lg font-bold text-primary-600">{formatPrice(product.precoBase)}</span>
// // //               <span className="text-sm text-gray-500">{product.perguntas?.length || 0} pergunta(s)</span>
// // //             </div>

// // //             <div className="flex gap-2">
// // //               <button onClick={() => openModal(product)} className="btn-secondary flex-1 flex items-center justify-center gap-1">
// // //                 <Edit className="w-4 h-4" /> Editar
// // //               </button>
// // //               <button
// // //                 onClick={() => toggleProductStatus(product)}
// // //                 className={`p-2 rounded-lg border transition-colors ${
// // //                   product.ativo ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'
// // //                 }`}
// // //               >
// // //                 {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// // //               </button>
// // //               <button
// // //                 onClick={() => handleDelete(product.id, product.nome)}
// // //                 className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
// // //               >
// // //                 <Trash2 className="w-4 h-4" />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         ))}

// // //         {filteredProducts.length === 0 && (
// // //           <div className="col-span-full text-center py-12">
// // //             <p className="text-gray-500 mb-4">
// // //               {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
// // //             </p>
// // //             <button onClick={() => openModal()} className="btn-primary">Criar Primeiro Produto</button>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* Modal Criar/Editar Produto (com abas) */}
// // //       {showModal && (
// // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// // //           <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
// // //             <form onSubmit={handleSubmit} className="p-6">
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <h2 className="text-xl font-bold text-gray-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
// // //                 <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
// // //                   <Plus className="w-6 h-6 rotate-45" />
// // //                 </button>
// // //               </div>

// // //               {/* Toggle para perguntas no ato da criação */}
// // //               <div className="mb-4">
// // //                 <label className="flex items-center gap-2">
// // //                   <input
// // //                     type="checkbox"
// // //                     checked={criarPerguntasAgora}
// // //                     onChange={(e) => setCriarPerguntasAgora(e.target.checked)}
// // //                   />
// // //                   <span>Criar perguntas agora</span>
// // //                 </label>
// // //               </div>

// // //               {/* Abas */}
// // //               <div className="border-b mb-4 flex gap-2">
// // //                 <button type="button"
// // //                   className={`px-3 py-2 rounded-t ${activeTab === 'dados' ? 'bg-primary-50 text-primary-700' : 'text-gray-600'}`}
// // //                   onClick={() => setActiveTab('dados')}>Dados</button>

// // //                 <button type="button" disabled={!criarPerguntasAgora}
// // //                   className={`px-3 py-2 rounded-t ${activeTab === 'perguntas' ? 'bg-primary-50 text-primary-700' : 'text-gray-600'} ${!criarPerguntasAgora ? 'opacity-40 cursor-not-allowed' : ''}`}
// // //                   onClick={() => setActiveTab('perguntas')}>Perguntas</button>
// // //               </div>

// // //               {/* Conteúdo da aba */}
// // //               {activeTab === 'dados' && (
// // //                 <div className="space-y-4">
// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
// // //                     <input type="text" required value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="input" placeholder="Nome do produto" />
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
// // //                     <textarea required rows={3} value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="input" placeholder="Descrição do produto" />
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
// // //                     <select required value={formData.categoriaId} onChange={e => setFormData({ ...formData, categoriaId: e.target.value })} className="input">
// // //                       <option value="">Selecione uma categoria</option>
// // //                       {categories.map(category => <option key={category.id} value={category.id}>{category.nome}</option>)}
// // //                     </select>
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base *</label>
// // //                     <input type="number" required step="0.01" min="0" value={formData.precoBase} onChange={e => setFormData({ ...formData, precoBase: e.target.value })} className="input" placeholder="0,00" />
// // //                   </div>

// // //                   <div>
// // //                     <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
// // //                     <input type="url" value={formData.imagem} onChange={e => setFormData({ ...formData, imagem: e.target.value })} className="input" placeholder="https://exemplo.com/imagem.jpg" />
// // //                   </div>

// // //                   <div>
// // //                     <label className="flex items-center gap-2">
// // //                       <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({ ...formData, ativo: e.target.checked })} className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500" />
// // //                       <span className="text-sm font-medium text-gray-700">Produto ativo</span>
// // //                     </label>
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {activeTab === 'perguntas' && criarPerguntasAgora && (
// // //                 <ProductQuestionsEditor
// // //                   inline
// // //                   value={perguntasDraft}
// // //                   onChange={setPerguntasDraft}
// // //                 />
// // //               )}

// // //               <div className="flex gap-3 mt-6">
// // //                 <button type="submit" className="btn-primary flex-1">{editingProduct ? 'Salvar Alterações' : 'Criar Produto'}</button>
// // //                 <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
// // //               </div>
// // //             </form>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   )
// // // }




// // import React, { useState, useEffect } from 'react'
// // import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
// // import ApiService from '../services/api'
// // import { useUIStore } from '../store/uiStore'
// // import ProductQuestionsEditor from '../components/ProductQuestionsEditor'

// // export default function Products() {
// //   const [products, setProducts] = useState([])
// //   const [categories, setCategories] = useState([])
// //   const [loading, setLoading] = useState(true)
// //   const [selectedCategory, setSelectedCategory] = useState('')
// //   const [showModal, setShowModal] = useState(false)
// //   const [editingProduct, setEditingProduct] = useState(null)

// //   // modal: aba e perguntas
// //   const [activeTab, setActiveTab] = useState('dados') // 'dados' | 'perguntas'
// //   const [createQuestionsNow, setCreateQuestionsNow] = useState(true)
// //   const [perguntasDraft, setPerguntasDraft] = useState([])

// //   // modal: form básico
// //   const [formData, setFormData] = useState({
// //     nome: '',
// //     descricao: '',
// //     categoriaId: '',
// //     precoBase: '',
// //     imagem: '',
// //     ativo: true
// //   })

// //   const { showSuccess, showError } = useUIStore()

// //   useEffect(() => { loadData() }, [])

// //   const loadData = async () => {
// //     try {
// //       setLoading(true)
// //       const [productsData, categoriesData] = await Promise.all([
// //         ApiService.getProducts(),
// //         ApiService.getCategories()
// //       ])
// //       setProducts(productsData)
// //       setCategories(categoriesData)
// //     } catch (error) {
// //       console.error('Error loading data:', error)
// //       showError('Erro ao carregar dados')
// //     } finally {
// //       setLoading(false)
// //     }
// //   }

// //   const openModal = (product = null) => {
// //     setActiveTab('dados')
// //     setCreateQuestionsNow(true)

// //     if (product) {
// //       setEditingProduct(product)
// //       setFormData({
// //         nome: product.nome,
// //         descricao: product.descricao,
// //         categoriaId: product.categoriaId,
// //         precoBase: product.precoBase.toString(),
// //         imagem: product.imagem,
// //         ativo: product.ativo
// //       })
// //       // carrega perguntas existentes para edição inline se quiser
// //       setPerguntasDraft(product.perguntas || [])
// //     } else {
// //       setEditingProduct(null)
// //       setFormData({
// //         nome: '',
// //         descricao: '',
// //         categoriaId: categories[0]?.id || '',
// //         precoBase: '',
// //         imagem: '',
// //         ativo: true
// //       })
// //       setPerguntasDraft([]) // começa vazio; usuário pode adicionar templates
// //     }
// //     setShowModal(true)
// //   }

// //   const closeModal = () => {
// //     setShowModal(false)
// //     setEditingProduct(null)
// //   }

// //   const handleSubmit = async (e) => {
// //     e.preventDefault()
// //     try {
// //       const productData = { ...formData, precoBase: parseFloat(formData.precoBase) }

// //       if (editingProduct) {
// //         // 1) atualiza dados
// //         const updated = await ApiService.updateProduct(editingProduct.id, productData)

// //         // 2) se quiser, atualiza perguntas
// //         if (createQuestionsNow) {
// //           await ApiService.updateProductQuestions(editingProduct.id, perguntasDraft)
// //         }

// //         showSuccess('Produto atualizado com sucesso!')
// //       } else {
// //         // cria já com as perguntas (se marcado)
// //         const payload = createQuestionsNow
// //           ? { ...productData, perguntas: perguntasDraft }
// //           : productData

// //         await ApiService.createProduct(payload)
// //         showSuccess('Produto criado com sucesso!')
// //       }

// //       closeModal()
// //       loadData()
// //     } catch (error) {
// //       console.error('Error saving product:', error)
// //       showError(error.message || 'Erro ao salvar produto')
// //     }
// //   }

// //   const handleDelete = async (productId, productName) => {
// //     if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) return
// //     try {
// //       await ApiService.deleteProduct(productId)
// //       showSuccess('Produto excluído com sucesso!')
// //       loadData()
// //     } catch (error) {
// //       console.error('Error deleting product:', error)
// //       showError('Erro ao excluir produto')
// //     }
// //   }

// //   const toggleProductStatus = async (product) => {
// //     try {
// //       await ApiService.updateProduct(product.id, { ativo: !product.ativo })
// //       showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
// //       loadData()
// //     } catch (error) {
// //       console.error('Error toggling product status:', error)
// //       showError('Erro ao alterar status do produto')
// //     }
// //   }

// //   const formatPrice = (price) =>
// //     new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

// //   const getCategoryName = (categoryId) => {
// //     const category = categories.find(cat => cat.id === categoryId)
// //     return category ? category.nome : 'Sem categoria'
// //   }

// //   const filteredProducts = selectedCategory
// //     ? products.filter(p => p.categoriaId === selectedCategory)
// //     : products

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center h-64">
// //         <div className="loading-spinner"></div>
// //       </div>
// //     )
// //   }

// //   return (
// //     <div>
// //       {/* Cabeçalho */}
// //       <div className="flex justify-between items-center mb-6">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
// //           <p className="text-gray-600">Gerencie o cardápio da sua loja</p>
// //         </div>
// //         <button onClick={() => openModal()} className="btn-primary flex items-center gap-2">
// //           <Plus className="w-5 h-5" />
// //           Novo Produto
// //         </button>
// //       </div>

// //       {/* Filtros */}
// //       <div className="mb-6">
// //         <div className="flex gap-2 overflow-x-auto pb-2">
// //           <button
// //             onClick={() => setSelectedCategory('')}
// //             className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// //               selectedCategory === ''
// //                 ? 'bg-primary-500 text-white'
// //                 : 'bg-white text-gray-700 border border-gray-300'
// //             }`}
// //           >
// //             Todos ({products.length})
// //           </button>
// //           {categories.map(category => {
// //             const count = products.filter(p => p.categoriaId === category.id).length
// //             return (
// //               <button
// //                 key={category.id}
// //                 onClick={() => setSelectedCategory(category.id)}
// //                 className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
// //                   selectedCategory === category.id
// //                     ? 'bg-primary-500 text-white'
// //                     : 'bg-white text-gray-700 border border-gray-300'
// //                 }`}
// //               >
// //                 {category.nome} ({count})
// //               </button>
// //             )
// //           })}
// //         </div>
// //       </div>

// //       {/* Grid */}
// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //         {filteredProducts.map(product => (
// //           <div key={product.id} className="card p-4">
// //             <div className="flex justify-between items-start mb-3">
// //               <div>
// //                 <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
// //                 <p className="text-sm text-gray-500">{getCategoryName(product.categoriaId)}</p>
// //               </div>
// //               <span className={`px-2 py-1 text-xs rounded-full ${
// //                 product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
// //               }`}>
// //                 {product.ativo ? 'Ativo' : 'Inativo'}
// //               </span>
// //             </div>

// //             <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.descricao}</p>

// //             <div className="flex justify-between items-center mb-4">
// //               <span className="text-lg font-bold text-primary-600">{formatPrice(product.precoBase)}</span>
// //               <span className="text-sm text-gray-500">{product.perguntas?.length || 0} pergunta(s)</span>
// //             </div>

// //             <div className="flex gap-2">
// //               <button onClick={() => openModal(product)} className="btn-secondary flex-1 flex items-center justify-center gap-1">
// //                 <Edit className="w-4 h-4" />
// //                 Editar
// //               </button>

// //               <button
// //                 onClick={() => toggleProductStatus(product)}
// //                 className={`p-2 rounded-lg border transition-colors ${
// //                   product.ativo
// //                     ? 'border-red-300 text-red-600 hover:bg-red-50'
// //                     : 'border-green-300 text-green-600 hover:bg-green-50'
// //                 }`}
// //               >
// //                 {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// //               </button>

// //               <button
// //                 onClick={() => handleDelete(product.id, product.nome)}
// //                 className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
// //               >
// //                 <Trash2 className="w-4 h-4" />
// //               </button>
// //             </div>
// //           </div>
// //         ))}

// //         {filteredProducts.length === 0 && (
// //           <div className="col-span-full text-center py-12">
// //             <p className="text-gray-500 mb-4">
// //               {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
// //             </p>
// //             <button onClick={() => openModal()} className="btn-primary">
// //               Criar Primeiro Produto
// //             </button>
// //           </div>
// //         )}
// //       </div>

// //       {/* Modal Produto (Dados + Perguntas) */}
// //       {showModal && (
// //         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
// //             <form onSubmit={handleSubmit} className="p-6">
// //               <div className="flex justify-between items-center mb-4">
// //                 <h2 className="text-xl font-bold text-gray-900">
// //                   {editingProduct ? 'Editar Produto' : 'Novo Produto'}
// //                 </h2>
// //                 <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
// //                   <Plus className="w-6 h-6 rotate-45" />
// //                 </button>
// //               </div>

// //               <label className="flex items-center gap-2 mb-4">
// //                 <input
// //                   type="checkbox"
// //                   checked={createQuestionsNow}
// //                   onChange={(e) => setCreateQuestionsNow(e.target.checked)}
// //                 />
// //                 <span>Criar perguntas agora</span>
// //               </label>

// //               {/* Abas */}
// //               <div className="flex gap-2 mb-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => setActiveTab('dados')}
// //                   className={`px-4 py-2 rounded ${activeTab==='dados' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
// //                 >
// //                   Dados
// //                 </button>
// //                 <button
// //                   type="button"
// //                   onClick={() => setActiveTab('perguntas')}
// //                   disabled={!createQuestionsNow}
// //                   className={`px-4 py-2 rounded ${activeTab==='perguntas' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'} ${!createQuestionsNow ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                 >
// //                   Perguntas
// //                 </button>
// //               </div>

// //               {activeTab === 'dados' && (
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
// //                     <input
// //                       type="text" required value={formData.nome}
// //                       onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
// //                       className="input" placeholder="Nome do produto"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
// //                     <textarea
// //                       required rows={3} value={formData.descricao}
// //                       onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
// //                       className="input" placeholder="Descrição do produto"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
// //                     <select
// //                       required value={formData.categoriaId}
// //                       onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
// //                       className="input"
// //                     >
// //                       <option value="">Selecione uma categoria</option>
// //                       {categories.map(category => (
// //                         <option key={category.id} value={category.id}>{category.nome}</option>
// //                       ))}
// //                     </select>
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base *</label>
// //                     <input
// //                       type="number" required step="0.01" min="0" value={formData.precoBase}
// //                       onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
// //                       className="input" placeholder="0,00"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
// //                     <input
// //                       type="url" value={formData.imagem}
// //                       onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
// //                       className="input" placeholder="https://exemplo.com/imagem.jpg"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="flex items-center gap-2">
// //                       <input
// //                         type="checkbox" checked={formData.ativo}
// //                         onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
// //                         className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
// //                       />
// //                       <span className="text-sm font-medium text-gray-700">Produto ativo</span>
// //                     </label>
// //                   </div>
// //                 </div>
// //               )}

// //               {activeTab === 'perguntas' && createQuestionsNow && (
// //                 <div className="border rounded-lg">
// //                   <ProductQuestionsEditor
// //                     inline
// //                     value={perguntasDraft}
// //                     onChange={setPerguntasDraft}
// //                   />
// //                 </div>
// //               )}

// //               <div className="flex gap-3 mt-6">
// //                 <button type="submit" className="btn-primary flex-1">
// //                   {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
// //                 </button>
// //                 <button type="button" onClick={closeModal} className="btn-secondary">Cancelar</button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// import React, { useState, useEffect } from 'react'
// import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
// import ApiService from '../services/api'
// import { useUIStore } from '../store/uiStore'
// import ProductQuestionsEditor from '../components/ProductQuestionsEditor'

// export default function Products() {
//   const [products, setProducts] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [selectedCategory, setSelectedCategory] = useState('')
//   const [showModal, setShowModal] = useState(false)
//   const [editingProduct, setEditingProduct] = useState(null)

//   // modal: aba e perguntas
//   const [activeTab, setActiveTab] = useState('dados') // 'dados' | 'perguntas'
//   const [createQuestionsNow, setCreateQuestionsNow] = useState(true)
//   const [perguntasDraft, setPerguntasDraft] = useState([])

//   // modal: form básico
//   const [formData, setFormData] = useState({
//     nome: '',
//     descricao: '',
//     categoriaId: '',
//     precoBase: '',
//     imagem: '',
//     ativo: true
//   })

//   const { showSuccess, showError } = useUIStore()

//   useEffect(() => { loadData() }, [])

//   const loadData = async () => {
//     try {
//       setLoading(true)
//       const [productsData, categoriesData] = await Promise.all([
//         ApiService.getProducts(),
//         ApiService.getCategories()
//       ])
//       setProducts(productsData)
//       setCategories(categoriesData)
//     } catch (error) {
//       console.error('Error loading data:', error)
//       showError('Erro ao carregar dados')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const openModal = (product = null) => {
//     setActiveTab('dados')
//     setCreateQuestionsNow(true)

//     if (product) {
//       setEditingProduct(product)
//       setFormData({
//         nome: product.nome,
//         descricao: product.descricao,
//         categoriaId: product.categoriaId,
//         precoBase: product.precoBase.toString(),
//         imagem: product.imagem,
//         ativo: product.ativo
//       })
//       setPerguntasDraft(product.perguntas || [])
//     } else {
//       setEditingProduct(null)
//       setFormData({
//         nome: '',
//         descricao: '',
//         categoriaId: categories[0]?.id || '',
//         precoBase: '',
//         imagem: '',
//         ativo: true
//       })
//       setPerguntasDraft([])
//     }
//     setShowModal(true)
//   }

//   const closeModal = () => {
//     setShowModal(false)
//     setEditingProduct(null)
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     try {
//       const productData = { ...formData, precoBase: parseFloat(formData.precoBase) }

//       if (editingProduct) {
//         await ApiService.updateProduct(editingProduct.id, productData)
//         if (createQuestionsNow) {
//           await ApiService.updateProductQuestions(editingProduct.id, perguntasDraft)
//         }
//         showSuccess('Produto atualizado com sucesso!')
//       } else {
//         const payload = createQuestionsNow
//           ? { ...productData, perguntas: perguntasDraft }
//           : productData
//         await ApiService.createProduct(payload)
//         showSuccess('Produto criado com sucesso!')
//       }

//       closeModal()
//       loadData()
//     } catch (error) {
//       console.error('Error saving product:', error)
//       showError(error.message || 'Erro ao salvar produto')
//     }
//   }

//   const handleDelete = async (productId, productName) => {
//     if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) return
//     try {
//       await ApiService.deleteProduct(productId)
//       showSuccess('Produto excluído com sucesso!')
//       loadData()
//     } catch (error) {
//       console.error('Error deleting product:', error)
//       showError('Erro ao excluir produto')
//     }
//   }

//   const toggleProductStatus = async (product) => {
//     try {
//       await ApiService.updateProduct(product.id, { ativo: !product.ativo })
//       showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
//       loadData()
//     } catch (error) {
//       console.error('Error toggling product status:', error)
//       showError('Erro ao alterar status do produto')
//     }
//   }

//   const formatPrice = (price) =>
//     new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

//   const getCategoryName = (categoryId) => {
//     const category = categories.find(cat => cat.id === categoryId)
//     return category ? category.nome : 'Sem categoria'
//   }

//   const filteredProducts = selectedCategory
//     ? products.filter(p => p.categoriaId === selectedCategory)
//     : products

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="loading-spinner"></div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Cabeçalho */}
//       <div className="flex justify-between items-end">
//         <div className="space-y-1">
//           <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
//           <p className="text-gray-600">Gerencie o cardápio da sua loja</p>
//         </div>
//         <button onClick={() => openModal()} className="btn-primary h-10 px-4 flex items-center gap-2">
//           <Plus className="w-5 h-5" />
//           Novo Produto
//         </button>
//       </div>

//       {/* Filtros */}
//       <div className="overflow-x-auto">
//         <div className="flex gap-3 pb-2">
//           <button
//             onClick={() => setSelectedCategory('')}
//             className={`h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
//               selectedCategory === ''
//                 ? 'bg-primary-500 text-white'
//                 : 'bg-white text-gray-700 border border-gray-300'
//             }`}
//           >
//             Todos ({products.length})
//           </button>
//           {categories.map(category => {
//             const count = products.filter(p => p.categoriaId === category.id).length
//             const active = selectedCategory === category.id
//             return (
//               <button
//                 key={category.id}
//                 onClick={() => setSelectedCategory(category.id)}
//                 className={`h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
//                   active ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
//                 }`}
//               >
//                 {category.nome} ({count})
//               </button>
//             )
//           })}
//         </div>
//       </div>

//       {/* Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredProducts.map(product => (
//           <div key={product.id} className="card p-4 flex flex-col h-full">
//             {/* Header */}
//             <div className="flex justify-between items-start mb-3">
//               <div className="min-w-0">
//                 <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
//                 <p className="text-sm text-gray-500">{getCategoryName(product.categoriaId)}</p>
//               </div>
//               <span className={`px-2 py-1 text-xs rounded-full ${
//                 product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {product.ativo ? 'Ativo' : 'Inativo'}
//               </span>
//             </div>

//             {/* Descrição */}
//             <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.descricao}</p>

//             {/* Preço + Perguntas */}
//             <div className="flex justify-between items-center mb-4">
//               <span className="text-lg font-bold text-primary-600">{formatPrice(product.precoBase)}</span>
//               <span className="text-sm text-gray-500">{product.perguntas?.length || 0} pergunta(s)</span>
//             </div>

//             {/* Ações (sempre no rodapé) */}
//             <div className="mt-auto flex items-center gap-2">
//               <button
//                 onClick={() => openModal(product)}
//                 className="btn-secondary h-10 flex-1 inline-flex items-center justify-center gap-1"
//               >
//                 <Edit className="w-4 h-4" />
//                 Editar
//               </button>

//               <button
//                 onClick={() => toggleProductStatus(product)}
//                 className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
//                   product.ativo
//                     ? 'border-red-300 text-red-600 hover:bg-red-50'
//                     : 'border-green-300 text-green-600 hover:bg-green-50'
//                 }`}
//                 aria-label={product.ativo ? 'Desativar' : 'Ativar'}
//               >
//                 {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>

//               <button
//                 onClick={() => handleDelete(product.id, product.nome)}
//                 className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
//                 aria-label="Excluir"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}

//         {filteredProducts.length === 0 && (
//           <div className="col-span-full text-center py-12">
//             <p className="text-gray-500 mb-4">
//               {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
//             </p>
//             <button onClick={() => openModal()} className="btn-primary h-10 px-4">
//               Criar Primeiro Produto
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Modal Produto (Dados + Perguntas) */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <form onSubmit={handleSubmit} className="p-6">
//               {/* Título + Fechar */}
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   {editingProduct ? 'Editar Produto' : 'Novo Produto'}
//                 </h2>
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                   aria-label="Fechar"
//                 >
//                   <Plus className="w-5 h-5 rotate-45" />
//                 </button>
//               </div>

//               {/* Opção criar perguntas */}
//               <label className="flex items-center gap-2 mb-4">
//                 <input
//                   type="checkbox"
//                   checked={createQuestionsNow}
//                   onChange={(e) => setCreateQuestionsNow(e.target.checked)}
//                 />
//                 <span className="text-sm text-gray-800">Criar perguntas agora</span>
//               </label>

//               {/* Abas */}
//               <div className="flex gap-2 mb-4">
//                 <button
//                   type="button"
//                   onClick={() => setActiveTab('dados')}
//                   className={`h-10 px-4 rounded-lg text-sm font-medium ${
//                     activeTab === 'dados'
//                       ? 'bg-red-100 text-red-700'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   Dados
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => createQuestionsNow && setActiveTab('perguntas')}
//                   disabled={!createQuestionsNow}
//                   className={`h-10 px-4 rounded-lg text-sm font-medium ${
//                     activeTab === 'perguntas'
//                       ? 'bg-red-100 text-red-700'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   } ${!createQuestionsNow ? 'opacity-50 cursor-not-allowed' : ''}`}
//                 >
//                   Perguntas
//                 </button>
//               </div>

//               {activeTab === 'dados' && (
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
//                     <input
//                       type="text" required value={formData.nome}
//                       onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
//                       className="input" placeholder="Nome do produto"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
//                     <textarea
//                       required rows={3} value={formData.descricao}
//                       onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
//                       className="input" placeholder="Descrição do produto"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
//                     <select
//                       required value={formData.categoriaId}
//                       onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
//                       className="input"
//                     >
//                       <option value="">Selecione uma categoria</option>
//                       {categories.map(category => (
//                         <option key={category.id} value={category.id}>{category.nome}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base *</label>
//                     <input
//                       type="number" required step="0.01" min="0" value={formData.precoBase}
//                       onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
//                       className="input" placeholder="0,00"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
//                     <input
//                       type="url" value={formData.imagem}
//                       onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
//                       className="input" placeholder="https://exemplo.com/imagem.jpg"
//                     />
//                   </div>

//                   <div>
//                     <label className="inline-flex items-center gap-2">
//                       <input
//                         type="checkbox" checked={formData.ativo}
//                         onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
//                         className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
//                       />
//                       <span className="text-sm font-medium text-gray-700">Produto ativo</span>
//                     </label>
//                   </div>
//                 </div>
//               )}

//               {activeTab === 'perguntas' && createQuestionsNow && (
//                 <div className="border rounded-lg">
//                   <ProductQuestionsEditor
//                     inline
//                     value={perguntasDraft}
//                     onChange={setPerguntasDraft}
//                   />
//                 </div>
//               )}

//               {/* Footer */}
//               <div className="flex gap-3 mt-6">
//                 <button type="submit" className="btn-primary h-10 flex-1">
//                   {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
//                 </button>
//                 <button type="button" onClick={closeModal} className="btn-secondary h-10 px-4">
//                   Cancelar
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import ApiService from '../services/api'
import { useUIStore } from '../store/uiStore'
import ProductQuestionsEditor from '../components/ProductQuestionsEditor'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // modal: aba e perguntas
  const [activeTab, setActiveTab] = useState('dados') // 'dados' | 'perguntas'
  const [createQuestionsNow, setCreateQuestionsNow] = useState(true)
  const [perguntasDraft, setPerguntasDraft] = useState([])

  // modal: form básico
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    categoriaId: '',
    precoBase: '',
    imagem: '',
    ativo: true
  })

  // paginação (estilo iFood)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(9) // 3 colunas x 3 linhas por página

  const { showSuccess, showError } = useUIStore()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
      showError('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product = null) => {
    setActiveTab('dados')
    setCreateQuestionsNow(true)

    if (product) {
      setEditingProduct(product)
      setFormData({
        nome: product.nome,
        descricao: product.descricao,
        categoriaId: product.categoriaId,
        precoBase: product.precoBase.toString(),
        imagem: product.imagem,
        ativo: product.ativo
      })
      setPerguntasDraft(product.perguntas || [])
    } else {
      setEditingProduct(null)
      setFormData({
        nome: '',
        descricao: '',
        categoriaId: categories[0]?.id || '',
        precoBase: '',
        imagem: '',
        ativo: true
      })
      setPerguntasDraft([])
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const productData = { ...formData, precoBase: parseFloat(formData.precoBase) }

      if (editingProduct) {
        await ApiService.updateProduct(editingProduct.id, productData)
        if (createQuestionsNow) {
          await ApiService.updateProductQuestions(editingProduct.id, perguntasDraft)
        }
        showSuccess('Produto atualizado com sucesso!')
      } else {
        const payload = createQuestionsNow
          ? { ...productData, perguntas: perguntasDraft }
          : productData
        await ApiService.createProduct(payload)
        showSuccess('Produto criado com sucesso!')
      }

      closeModal()
      loadData()
    } catch (error) {
      console.error('Error saving product:', error)
      showError(error.message || 'Erro ao salvar produto')
    }
  }

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${productName}"?`)) return
    try {
      await ApiService.deleteProduct(productId)
      showSuccess('Produto excluído com sucesso!')
      loadData()
    } catch (error) {
      console.error('Error deleting product:', error)
      showError('Erro ao excluir produto')
    }
  }

  const toggleProductStatus = async (product) => {
    try {
      await ApiService.updateProduct(product.id, { ativo: !product.ativo })
      showSuccess(`Produto ${!product.ativo ? 'ativado' : 'desativado'} com sucesso!`)
      loadData()
    } catch (error) {
      console.error('Error toggling product status:', error)
      showError('Erro ao alterar status do produto')
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.nome : 'Sem categoria'
  }

  // filtro + paginação (cliente)
  const filteredProducts = selectedCategory
    ? products.filter(p => p.categoriaId === selectedCategory)
    : products

  useEffect(() => {
    // sempre volta pra primeira página ao trocar categoria ou atualizar lista
    setPage(1)
  }, [selectedCategory, products])

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (page - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const pageItems = filteredProducts.slice(startIndex, endIndex)

  const pagesToShow = () => {
    const max = totalPages
    const show = 5 // mostra até 5 bolinhas
    let start = Math.max(1, page - Math.floor(show / 2))
    let end = Math.min(max, start + show - 1)
    if (end - start < show - 1) start = Math.max(1, end - show + 1)
    const arr = []
    for (let i = start; i <= end; i++) arr.push(i)
    return arr
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600">Gerencie o cardápio da sua loja</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary h-10 px-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Produto
        </button>
      </div>

      {/* Filtros */}
      <div className="overflow-x-auto">
        <div className="flex gap-3 pb-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map(category => {
            const count = products.filter(p => p.categoriaId === category.id).length
            const active = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-10 px-4 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  active ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                {category.nome} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageItems.map(product => (
          <div key={product.id} className="card p-4 flex flex-col h-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.nome}</h3>
                <p className="text-sm text-gray-500">{getCategoryName(product.categoriaId)}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                product.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.ativo ? 'Ativo' : 'Inativo'}
              </span>
            </div>

            {/* Descrição */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.descricao}</p>

            {/* Preço + Perguntas */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-primary-600">{formatPrice(product.precoBase)}</span>
              <span className="text-sm text-gray-500">{product.perguntas?.length || 0} pergunta(s)</span>
            </div>

            {/* Ações */}
            <div className="mt-auto flex items-center gap-2">
              <button
                onClick={() => openModal(product)}
                className="btn-secondary h-10 flex-1 inline-flex items-center justify-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>

              <button
                onClick={() => toggleProductStatus(product)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                  product.ativo
                    ? 'border-red-300 text-red-600 hover:bg-red-50'
                    : 'border-green-300 text-green-600 hover:bg-green-50'
                }`}
                aria-label={product.ativo ? 'Desativar' : 'Ativar'}
              >
                {product.ativo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              <button
                onClick={() => handleDelete(product.id, product.nome)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                aria-label="Excluir"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {totalItems === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">
              {selectedCategory ? 'Nenhum produto nesta categoria' : 'Nenhum produto cadastrado'}
            </p>
            <button onClick={() => openModal()} className="btn-primary h-10 px-4">
              Criar Primeiro Produto
            </button>
          </div>
        )}
      </div>

      {/* Paginação (estilo iFood) */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-gray-600">
            Mostrando <strong>{startIndex + 1}</strong>–<strong>{endIndex}</strong> de <strong>{totalItems}</strong>
          </div>

          <div className="flex items-center gap-3">
            {/* Navegação */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`h-10 px-3 rounded-full border text-sm ${
                  page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Anterior
              </button>

              {pagesToShow().map(n => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`min-w-10 h-10 px-3 rounded-full text-sm font-medium ${
                    n === page
                      ? 'bg-primary-500 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`h-10 px-3 rounded-full border text-sm ${
                  page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                Próxima
              </button>
            </div>

            {/* Itens por página */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">por página</span>
              <select
                className="input h-10 w-[110px]"
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              >
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Modal Produto (Dados + Perguntas) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Título + Fechar */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                  aria-label="Fechar"
                >
                  <Plus className="w-5 h-5 rotate-45" />
                </button>
              </div>

              {/* Opção criar perguntas */}
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={createQuestionsNow}
                  onChange={(e) => setCreateQuestionsNow(e.target.checked)}
                />
                <span className="text-sm text-gray-800">Criar perguntas agora</span>
              </label>

              {/* Abas */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('dados')}
                  className={`h-10 px-4 rounded-lg text-sm font-medium ${
                    activeTab === 'dados'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Dados
                </button>
                <button
                  type="button"
                  onClick={() => createQuestionsNow && setActiveTab('perguntas')}
                  disabled={!createQuestionsNow}
                  className={`h-10 px-4 rounded-lg text-sm font-medium ${
                    activeTab === 'perguntas'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${!createQuestionsNow ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Perguntas
                </button>
              </div>

              {activeTab === 'dados' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                    <input
                      type="text" required value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="input" placeholder="Nome do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
                    <textarea
                      required rows={3} value={formData.descricao}
                      onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                      className="input" placeholder="Descrição do produto"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria *</label>
                    <select
                      required value={formData.categoriaId}
                      onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                      className="input"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.nome}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base *</label>
                    <input
                      type="number" required step="0.01" min="0" value={formData.precoBase}
                      onChange={(e) => setFormData({ ...formData, precoBase: e.target.value })}
                      className="input" placeholder="0,00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                    <input
                      type="url" value={formData.imagem}
                      onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                      className="input" placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox" checked={formData.ativo}
                        onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                        className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Produto ativo</span>
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'perguntas' && createQuestionsNow && (
                <div className="border rounded-lg">
                  <ProductQuestionsEditor
                    inline
                    value={perguntasDraft}
                    onChange={setPerguntasDraft}
                  />
                </div>
              )}

              {/* Footer */}
              <div className="flex gap-3 mt-6">
                <button type="submit" className="btn-primary h-10 flex-1">
                  {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                </button>
                <button type="button" onClick={closeModal} className="btn-secondary h-10 px-4">
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
