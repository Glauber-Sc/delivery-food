// const API_BASE_URL = 'http://localhost:3000/api'

// class ApiService {
//   async request(endpoint, options = {}) {
//     const url = `${API_BASE_URL}${endpoint}`
    
//     const config = {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       ...options,
//     }

//     try {
//       const response = await fetch(url, config)
      
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ error: 'Network error' }))
//         throw new Error(error.error || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (error) {
//       console.error('API Error:', error)
//       throw error
//     }
//   }

//   // Categories
//   async getCategories() {
//     return this.request('/categories')
//   }

//   // Products
//   async getProducts(categoryId = null) {
//     const query = categoryId ? `?categoria=${categoryId}` : ''
//     return this.request(`/products${query}`)
//   }

//   async getProduct(id) {
//     return this.request(`/products/${id}`)
//   }

//   // Orders
//   async createOrder(orderData) {
//     return this.request('/orders', {
//       method: 'POST',
//       body: JSON.stringify(orderData)
//     })
//   }

//   async getOrder(id) {
//     return this.request(`/orders/${id}`)
//   }

//   // Settings
//   async getSettings() {
//     return this.request('/settings')
//   }

//   // Health check
//   async healthCheck() {
//     return this.request('/health')
//   }
// }

// export default new ApiService()



const API_BASE_URL = 'http://localhost:3000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }))
        const msg = error?.detalhes?.length
          ? `${error.error || 'Erro'}: ${error.detalhes.join(' | ')}`
          : (error.error || `HTTP error! status: ${response.status}`)
        throw new Error(msg)
      }

      return await response.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Categories
  async getCategories() {
    return this.request('/categories')
  }

  // Products
  async getProducts(categoryId = null) {
    const query = categoryId ? `?categoria=${categoryId}` : ''
    return this.request(`/products${query}`)
  }

  async getProduct(id) {
    return this.request(`/products/${id}`)
  }

  // (Se tiver endpoints de perguntas de produto)
  async getProductQuestions(id) {
    return this.request(`/products/${id}/questions`)
  }

  async updateProductQuestions(id, perguntas) {
    return this.request(`/products/${id}/questions`, {
      method: 'PUT',
      body: JSON.stringify({ perguntas })
    })
  }

  // Orders
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`)
  }

  // Settings
  async getSettings() {
    return this.request('/settings')
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export default new ApiService()
