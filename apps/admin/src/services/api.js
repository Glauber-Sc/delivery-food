// // const API_BASE_URL = 'http://localhost:3000/api'

// // class ApiService {
// //   constructor() {
// //     this.token = null
// //   }

// //   setToken(token) {
// //     this.token = token
// //   }

// //   async request(endpoint, options = {}) {
// //     const url = `${API_BASE_URL}${endpoint}`

// //     const config = {
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       ...options,
// //     }

// //     // Add auth header if token exists
// //     if (this.token) {
// //       config.headers.Authorization = `Bearer ${this.token}`
// //     }

// //     try {
// //       const response = await fetch(url, config)

// //       if (!response.ok) {
// //         const error = await response.json().catch(() => ({ error: 'Network error' }))
// //         throw new Error(error.error || `HTTP error! status: ${response.status}`)
// //       }

// //       return await response.json()
// //     } catch (error) {
// //       console.error('API Error:', error)
// //       throw error
// //     }
// //   }

// //   // Auth
// //   async login(email, senha) {
// //     return this.request('/auth/login', {
// //       method: 'POST',
// //       body: JSON.stringify({ email, senha })
// //     })
// //   }

// //   async getCurrentUser() {
// //     return this.request('/auth/me')
// //   }

// //   // Categories
// //   async getCategories() {
// //     return this.request('/categories')
// //   }

// //   async createCategory(data) {
// //     return this.request('/categories', {
// //       method: 'POST',
// //       body: JSON.stringify(data)
// //     })
// //   }

// //   async updateCategory(id, data) {
// //     return this.request(`/categories/${id}`, {
// //       method: 'PUT',
// //       body: JSON.stringify(data)
// //     })
// //   }

// //   async deleteCategory(id) {
// //     return this.request(`/categories/${id}`, {
// //       method: 'DELETE'
// //     })
// //   }

// //   // Products
// //   async getProducts(categoryId = null) {
// //     const query = categoryId ? `?categoria=${categoryId}` : ''
// //     return this.request(`/products${query}`)
// //   }

// //   async getProduct(id) {
// //     return this.request(`/products/${id}`)
// //   }

// //   async createProduct(data) {
// //     return this.request('/products', {
// //       method: 'POST',
// //       body: JSON.stringify(data)
// //     })
// //   }

// //   async updateProduct(id, data) {
// //     return this.request(`/products/${id}`, {
// //       method: 'PUT',
// //       body: JSON.stringify(data)
// //     })
// //   }

// //   async deleteProduct(id) {
// //     return this.request(`/products/${id}`, {
// //       method: 'DELETE'
// //     })
// //   }

// //   async updateProductQuestions(id, perguntas) {
// //     return this.request(`/products/${id}/questions`, {
// //       method: 'PUT',
// //       body: JSON.stringify({ perguntas })
// //     })
// //   }

// //   // Orders
// //   async getOrders(status = null) {
// //     const query = status ? `?status=${status}` : ''
// //     return this.request(`/orders${query}`)
// //   }

// //   async getOrder(id) {
// //     return this.request(`/orders/${id}`)
// //   }

// //   async updateOrderStatus(id, status, motivo = '') {
// //     return this.request(`/orders/${id}/status`, {
// //       method: 'PATCH',
// //       body: JSON.stringify({ status, motivo })
// //     })
// //   }

// //   async getOrderStats() {
// //     return this.request('/orders/stats/summary')
// //   }

// //   // Settings
// //   async getSettings() {
// //     return this.request('/settings')
// //   }

// //   async updateSettings(data) {
// //     return this.request('/settings', {
// //       method: 'PUT',
// //       body: JSON.stringify(data)
// //     })
// //   }
// // }

// // export default new ApiService()


// // frontend/services/api.js
// const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api'

// class ApiService {
//   constructor() {
//     this.token = null
//   }

//   // <- precisa existir para o App.jsx funcionar
//   setToken(token) {
//     this.token = token || null
//   }

//   // helper genérico
//   async request(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`

//     const config = {
//       method: options.method || 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         ...(options.headers || {})
//       },
//       credentials: 'include'
//     }

//     if (options.body !== undefined) {
//       config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
//     }

//     // adiciona Authorization se houver token
//     if (this.token) {
//       config.headers.Authorization = `Bearer ${this.token}`
//     }

//     const res = await fetch(url, config)

//     if (res.status === 204) return null
//     let data
//     try { data = await res.json() } catch { data = null }

//     if (!res.ok) {
//       const msg = data?.error || data?.message || `HTTP ${res.status}`
//       throw new Error(msg)
//     }

//     return data
//   }

//   // -------- Auth
//   async login(email, senha) {
//     return this.request('/auth/login', { method: 'POST', body: { email, senha } })
//   }
//   async getCurrentUser() {
//     return this.request('/auth/me')
//   }

//   // -------- Categories
//   async getCategories() {
//     return this.request('/categories')
//   }
//   async createCategory(data) {
//     return this.request('/categories', { method: 'POST', body: data })
//   }
//   async updateCategory(id, data) {
//     return this.request(`/categories/${id}`, { method: 'PUT', body: data })
//   }
//   async deleteCategory(id) {
//     return this.request(`/categories/${id}`, { method: 'DELETE' })
//   }

//   // -------- Products
//   async getProducts(categoryId = null) {
//     const query = categoryId ? `?categoria=${encodeURIComponent(categoryId)}` : ''
//     return this.request(`/products${query}`)
//   }
//   async getProduct(id) {
//     return this.request(`/products/${id}`)
//   }
//   async createProduct(data) {
//     return this.request('/products', { method: 'POST', body: data })
//   }
//   async updateProduct(id, data) {
//     return this.request(`/products/${id}`, { method: 'PUT', body: data })
//   }
//   async deleteProduct(id) {
//     return this.request(`/products/${id}`, { method: 'DELETE' })
//   }

//   // -------- Product Questions (PERGUNTAS) — usados no editor
//   async getProductQuestions(productId) {
//     return this.request(`/products/${productId}/questions`)
//   }
//   async updateProductQuestions(productId, perguntas) {
//     return this.request(`/products/${productId}/questions`, { method: 'PUT', body: { perguntas } })
//   }

//   // -------- Orders
//   async getOrders(status = null) {
//     const query = status ? `?status=${encodeURIComponent(status)}` : ''
//     return this.request(`/orders${query}`)
//   }
//   async getOrder(id) {
//     return this.request(`/orders/${id}`)
//   }
//   async updateOrderStatus(id, status, motivo = '') {
//     return this.request(`/orders/${id}/status`, { method: 'PATCH', body: { status, motivo } })
//   }
//   async getOrderStats() {
//     return this.request('/orders/stats/summary')
//   }

//   // -------- Settings
//   async getSettings() {
//     return this.request('/settings')
//   }
//   async updateSettings(data) {
//     return this.request('/settings', { method: 'PUT', body: data })
//   }
// }

// // **exporte APENAS o default**, como instância (singleton)
// const api = new ApiService()
// export default api






// admin/services/api.js
const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api'

class ApiService {
  constructor() {
    this.token = null
  }

  // exposto porque o App.jsx injeta o token aqui
  setToken(token) {
    this.token = token || null
  }

  // helper genérico
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      credentials: 'include'
    }

    if (options.body !== undefined) {
      config.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
    }

    // Authorization se houver token
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`
    }

    const res = await fetch(url, config)

    if (res.status === 204) return null
    let data
    try { data = await res.json() } catch { data = null }

    if (!res.ok) {
      const msg = data?.error || data?.message || `HTTP ${res.status}`
      throw new Error(msg)
    }

    return data
  }

  // -------- Auth
  async login(email, senha) {
    return this.request('/auth/login', { method: 'POST', body: { email, senha } })
  }
  async getCurrentUser() {
    return this.request('/auth/me')
  }

  // -------- Categories
  async getCategories() {
    return this.request('/categories')
  }
  async createCategory(data) {
    return this.request('/categories', { method: 'POST', body: data })
  }
  async updateCategory(id, data) {
    return this.request(`/categories/${id}`, { method: 'PUT', body: data })
  }
  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' })
  }

  // -------- Products
  async getProducts(categoryId = null) {
    const query = categoryId ? `?categoria=${encodeURIComponent(categoryId)}` : ''
    return this.request(`/products${query}`)
  }
  async getProduct(id) {
    return this.request(`/products/${id}`)
  }
  async createProduct(data) {
    // aceita { ...campos, perguntas?: [...] }
    return this.request('/products', { method: 'POST', body: data })
  }
  async updateProduct(id, data) {
    return this.request(`/products/${id}`, { method: 'PUT', body: data })
  }
  async deleteProduct(id) {
    return this.request(`/products/${id}`, { method: 'DELETE' })
  }

  // -------- Product Questions (PERGUNTAS)
  async getProductQuestions(productId) {
    return this.request(`/products/${productId}/questions`)
  }
  async updateProductQuestions(productId, perguntas) {
    return this.request(`/products/${productId}/questions`, {
      method: 'PUT',
      body: { perguntas }
    })
  }

  // -------- Orders
  async getOrders(status = null) {
    const query = status ? `?status=${encodeURIComponent(status)}` : ''
    return this.request(`/orders${query}`)
  }
  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }
  async updateOrderStatus(id, status, motivo = '') {
    return this.request(`/orders/${id}/status`, { method: 'PATCH', body: { status, motivo } })
  }
  async getOrderStats() {
    return this.request('/orders/stats/summary')
  }

  // -------- Settings
  async getSettings() {
    return this.request('/settings')
  }
  async updateSettings(data) {
    return this.request('/settings', { method: 'PUT', body: data })
  }
}

// exporta instância (singleton)
const api = new ApiService()
export default api
