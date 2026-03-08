import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import HttpFlowVisualization from './pages/HttpFlowVisualization'
import SSLCertificateManager from './pages/SSLCertificateManager'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/http-flow" element={<HttpFlowVisualization />} />
            <Route path="/ssl-certificates" element={<SSLCertificateManager />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
