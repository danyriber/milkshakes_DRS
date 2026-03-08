import React, { useState, useEffect } from 'react'
import './SSLCertificateManager.css'

const SSLCertificateManager = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    domain: '',
    certificate: '',
    privateKey: '',
    issuer: ''
  })

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      // Mock data for demonstration
      const mockCertificates = [
        {
          id: 1,
          domain: 'milkshakes-drs.com',
          issuer: "Let's Encrypt",
          validFrom: '2024-01-01T00:00:00Z',
          validUntil: '2024-04-01T00:00:00Z',
          status: 'active',
          daysUntilExpiry: 45
        },
        {
          id: 2,
          domain: 'api.milkshakes-drs.com',
          issuer: 'DigiCert',
          validFrom: '2023-12-01T00:00:00Z',
          validUntil: '2024-12-01T00:00:00Z',
          status: 'active',
          daysUntilExpiry: 300
        },
        {
          id: 3,
          domain: 'admin.milkshakes-drs.com',
          issuer: "Let's Encrypt",
          validFrom: '2024-01-15T00:00:00Z',
          validUntil: '2024-04-15T00:00:00Z',
          status: 'expiring_soon',
          daysUntilExpiry: 7
        }
      ]
      setCertificates(mockCertificates)
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status, daysUntilExpiry) => {
    if (status === 'expired' || daysUntilExpiry <= 0) return '#dc3545'
    if (daysUntilExpiry <= 30) return '#ffc107'
    return '#28a745'
  }

  const getHealthScore = () => {
    const totalCerts = certificates.length
    const expiredCerts = certificates.filter(cert => cert.daysUntilExpiry <= 0).length
    const expiringSoonCerts = certificates.filter(cert => cert.daysUntilExpiry <= 30).length

    if (totalCerts === 0) return 0
    const score = ((totalCerts - expiredCerts - expiringSoonCerts * 0.5) / totalCerts) * 100
    return Math.max(0, Math.min(100, score))
  }

  const handleRenew = async (certificateId) => {
    try {
      // Mock renewal
      alert('Certificado renovado exitosamente')
      fetchCertificates()
    } catch (error) {
      alert('Error al renovar certificado')
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    try {
      // Mock upload
      alert('Certificado subido exitosamente')
      setShowUploadForm(false)
      setUploadForm({ domain: '', certificate: '', privateKey: '', issuer: '' })
      fetchCertificates()
    } catch (error) {
      alert('Error al subir certificado')
    }
  }

  const healthScore = getHealthScore()

  if (loading) return <div className="loading">Cargando certificados...</div>

  return (
    <div className="ssl-manager">
      <h1>Gestión de Certificados SSL/TLS</h1>

      <div className="health-score">
        <h2>Puntuación de Salud de Seguridad</h2>
        <div className="score-display">
          <div className="score-circle" style={{ background: `conic-gradient(#28a745 ${healthScore}%, #dc3545 0%)` }}>
            <span className="score-text">{Math.round(healthScore)}%</span>
          </div>
          <div className="score-info">
            <p>Basado en la validez y expiración de certificados</p>
            <small>Actualizado: {new Date().toLocaleString()}</small>
          </div>
        </div>
      </div>

      <div className="certificates-section">
        <div className="section-header">
          <h2>Certificados Activos</h2>
          <button onClick={() => setShowUploadForm(true)} className="btn-primary">
            Subir Nuevo Certificado
          </button>
        </div>

        <div className="certificates-grid">
          {certificates.map(cert => (
            <div key={cert.id} className="certificate-card">
              <div className="certificate-header">
                <h3>{cert.domain}</h3>
                <span
                  className="status-indicator"
                  style={{ backgroundColor: getStatusColor(cert.status, cert.daysUntilExpiry) }}
                ></span>
              </div>

              <div className="certificate-details">
                <div className="detail-row">
                  <span className="label">Emisor:</span>
                  <span className="value">{cert.issuer}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Válido desde:</span>
                  <span className="value">{new Date(cert.validFrom).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Válido hasta:</span>
                  <span className="value">{new Date(cert.validUntil).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Días hasta expiración:</span>
                  <span className={`value ${cert.daysUntilExpiry <= 30 ? 'warning' : ''}`}>
                    {cert.daysUntilExpiry}
                  </span>
                </div>
              </div>

              <div className="certificate-actions">
                <button onClick={() => handleRenew(cert.id)} className="btn-secondary">
                  Renovar Automáticamente
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showUploadForm && (
        <div className="upload-modal">
          <div className="modal-content">
            <h2>Subir Nuevo Certificado</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Dominio:</label>
                <input
                  type="text"
                  value={uploadForm.domain}
                  onChange={(e) => setUploadForm({...uploadForm, domain: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Certificado (PEM):</label>
                <textarea
                  value={uploadForm.certificate}
                  onChange={(e) => setUploadForm({...uploadForm, certificate: e.target.value})}
                  required
                  rows="10"
                />
              </div>
              <div className="form-group">
                <label>Llave Privada:</label>
                <textarea
                  value={uploadForm.privateKey}
                  onChange={(e) => setUploadForm({...uploadForm, privateKey: e.target.value})}
                  required
                  rows="10"
                />
              </div>
              <div className="form-group">
                <label>Emisor:</label>
                <select
                  value={uploadForm.issuer}
                  onChange={(e) => setUploadForm({...uploadForm, issuer: e.target.value})}
                  required
                >
                  <option value="">Seleccionar emisor</option>
                  <option value="Let's Encrypt">Let's Encrypt</option>
                  <option value="DigiCert">DigiCert</option>
                  <option value="Comodo">Comodo</option>
                  <option value="GlobalSign">GlobalSign</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Subir Certificado</button>
                <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">
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

export default SSLCertificateManager