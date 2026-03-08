import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId') || generateSessionId()
        const response = await axios.get(`/api/cart/${sessionId}`)
        const totalItems = response.data.items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(totalItems)
      } catch (error) {
        console.error('Error fetching cart count:', error)
      }
    }

    fetchCartCount()
  }, [])

  const generateSessionId = () => {
    const sessionId = Math.random().toString(36).substring(2, 15)
    localStorage.setItem('sessionId', sessionId)
    return sessionId
  }

  return (
    <header>
      <nav>
        <div className="nav-container">
          <Link to="/" className="logo">Milkshakes DRS</Link>
          <ul className="nav-menu">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/carrito">Carrito ({cartCount})</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
            <li><Link to="/admin">Admin</Link></li>
            <li><Link to="/http-flow">HTTP Flow</Link></li>
            <li><Link to="/ssl-certificates">SSL Certs</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header