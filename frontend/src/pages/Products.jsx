import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    search: ''
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products')
        setProducts(response.data)
        setFilteredProducts(response.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number)
      filtered = filtered.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max
        } else {
          return product.price >= min
        }
      })
    }

    setFilteredProducts(filtered)
  }, [filters, products])

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const addToCart = async (productId) => {
    try {
      const sessionId = localStorage.getItem('sessionId') || generateSessionId()
      await axios.post(`/api/cart/${sessionId}/items`, { productId, quantity: 1 })
      alert('Producto agregado al carrito')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Error al agregar al carrito')
    }
  }

  const generateSessionId = () => {
    const sessionId = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('sessionId', sessionId)
    return sessionId
  }

  if (loading) return <div>Cargando productos...</div>

  return (
    <div className="products">
      <div className="products-header">
        <h1>Nuestros Productos</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            <option value="clásico">Clásico</option>
            <option value="premium">Premium</option>
            <option value="especial">Especial</option>
          </select>
          <select
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los precios</option>
            <option value="0-5">Menos de $5</option>
            <option value="5-10">$5 - $10</option>
            <option value="10-100">Más de $10</option>
          </select>
        </div>
      </div>
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image_url} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              <button onClick={() => addToCart(product.id)} className="btn-primary">
                Agregar al Carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products