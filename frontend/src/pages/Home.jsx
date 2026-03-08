import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Home.css'

const Home = () => {
  const [cmsContent, setCmsContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCmsContent = async () => {
      try {
        // Intentar obtener contenido dinámico del CMS
        const [pagesRes, productsRes] = await Promise.allSettled([
          axios.get('/api/content/pages/home'),
          axios.get('/api/content/products?limit=4')
        ])

        const content = {}

        if (pagesRes.status === 'fulfilled') {
          content.page = pagesRes.value.data
        }

        if (productsRes.status === 'fulfilled') {
          content.featuredProducts = productsRes.value.data
        }

        setCmsContent(content)
      } catch (error) {
        console.log('CMS not available, using static content')
      } finally {
        setLoading(false)
      }
    }

    fetchCmsContent()
  }, [])

  if (loading) {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-image">
          <img src="/images/fresa.png" alt="Delicious Strawberry Milkshake" />
        </div>
        <div className="hero-content">
          <h1>{cmsContent?.page?.title || 'Milkshakes DRS'}</h1>
          <p>{cmsContent?.page?.subtitle || 'Artesanal • Fresco • Delicioso'}</p>
          <a href="/productos" className="btn-minimal">Descubrir</a>
        </div>
      </section>

      {/* Featured Products from CMS */}
      {cmsContent?.featuredProducts && cmsContent.featuredProducts.length > 0 && (
        <section className="featured-products">
          <h2>Productos Destacados</h2>
          <div className="products-grid">
            {cmsContent.featuredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image?.url || '/images/fresa.png'} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">${product.price}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="collection">
        <div className="collection-grid">
          <div className="collection-item">
            <img src="/images/chocolate.png" alt="Chocolate Milkshake" />
            <span>Chocolate</span>
          </div>
          <div className="collection-item">
            <img src="/images/vainilla.png" alt="Vanilla Milkshake" />
            <span>Vainilla</span>
          </div>
          <div className="collection-item">
            <img src="/images/fresa.png" alt="Strawberry Milkshake" />
            <span>Fresa</span>
          </div>
          <div className="collection-item">
            <img src="/images/mango.png" alt="Mango Milkshake" />
            <span>Mango</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home