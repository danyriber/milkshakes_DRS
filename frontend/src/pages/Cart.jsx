import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId')
      if (sessionId) {
        const response = await axios.get(`/api/cart/${sessionId}`)
        setCart(response.data)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      const sessionId = localStorage.getItem('sessionId')
      await axios.put(`/api/cart/${sessionId}/items/${itemId}`, { quantity })
      fetchCart()
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const removeItem = async (itemId) => {
    try {
      const sessionId = localStorage.getItem('sessionId')
      await axios.delete(`/api/cart/${sessionId}/items/${itemId}`)
      fetchCart()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const checkout = async () => {
    // Implementar checkout
    alert('Funcionalidad de checkout próximamente')
  }

  if (loading) return <div>Cargando carrito...</div>

  return (
    <div className="cart">
      <h1>Tu Carrito</h1>
      {cart.items.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div>
                  <h3>{item.name}</h3>
                  <p>${item.price} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    <button onClick={() => removeItem(item.id)} className="remove-btn">Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h2>Total: ${cart.total.toFixed(2)}</h2>
            <button onClick={checkout} className="btn-primary">Proceder al Pago</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart