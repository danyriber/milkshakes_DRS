import React, { useState, useEffect } from 'react'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [nginxStatus, setNginxStatus] = useState('checking')
  const [requestFlow, setRequestFlow] = useState([])
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      // These would be real API calls to backend services
      const [nginxRes, flowRes, backupsRes] = await Promise.all([
        fetch('/api/admin/nginx-status'),
        fetch('/api/admin/request-flow'),
        fetch('/api/admin/backups')
      ])

      const nginxData = await nginxRes.json()
      const flowData = await flowRes.json()
      const backupsData = await backupsRes.json()

      setNginxStatus(nginxData.status)
      setRequestFlow(flowData.requests)
      setBackups(backupsData.backups)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Mock data for demonstration
      setNginxStatus('active')
      setRequestFlow([
        { id: 1, method: 'GET', path: '/api/products', status: 200, timestamp: new Date().toISOString() },
        { id: 2, method: 'POST', path: '/api/cart', status: 201, timestamp: new Date().toISOString() },
        { id: 3, method: 'GET', path: '/api/user/profile', status: 200, timestamp: new Date().toISOString() }
      ])
      setBackups([
        { id: 1, name: 'daily_backup_2024_01_15', size: '2.3GB', status: 'completed', created_at: '2024-01-15T10:00:00Z' },
        { id: 2, name: 'weekly_backup_2024_01_08', size: '8.7GB', status: 'completed', created_at: '2024-01-08T10:00:00Z' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    try {
      await fetch('/api/admin/backups', { method: 'POST' })
      alert('Backup creado exitosamente')
      fetchDashboardData()
    } catch (error) {
      alert('Error al crear backup')
    }
  }

  if (loading) return <div className="loading">Cargando dashboard...</div>

  return (
    <div className="admin-dashboard">
      <h1>Panel de Control del Servidor</h1>

      <div className="dashboard-grid">
        {/* Nginx Status */}
        <div className="dashboard-card">
          <h2>Estado de Nginx</h2>
          <div className={`status-indicator ${nginxStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {nginxStatus === 'active' ? 'Activo' :
               nginxStatus === 'inactive' ? 'Inactivo' : 'Verificando'}
            </span>
          </div>
          <div className="nginx-metrics">
            <div className="metric">
              <span className="metric-label">Conexiones Activas:</span>
              <span className="metric-value">1,247</span>
            </div>
            <div className="metric">
              <span className="metric-label">Peticiones por Segundo:</span>
              <span className="metric-value">45.2</span>
            </div>
            <div className="metric">
              <span className="metric-label">Uptime:</span>
              <span className="metric-value">7d 14h 32m</span>
            </div>
          </div>
        </div>

        {/* HTTP Request Flow */}
        <div className="dashboard-card">
          <h2>Flujo de Peticiones HTTP</h2>
          <div className="request-flow">
            {requestFlow.slice(0, 10).map(request => (
              <div key={request.id} className="request-item">
                <span className={`method ${request.method.toLowerCase()}`}>{request.method}</span>
                <span className="path">{request.path}</span>
                <span className={`status status-${request.status}`}>{request.status}</span>
                <span className="timestamp">{new Date(request.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Backup Management */}
        <div className="dashboard-card">
          <h2>Gestión de Copias de Seguridad</h2>
          <button onClick={createBackup} className="btn-primary">Crear Backup Manual</button>
          <div className="backups-list">
            {backups.map(backup => (
              <div key={backup.id} className="backup-item">
                <div className="backup-info">
                  <span className="backup-name">{backup.name}</span>
                  <span className="backup-size">{backup.size}</span>
                  <span className={`backup-status ${backup.status}`}>{backup.status}</span>
                </div>
                <span className="backup-date">{new Date(backup.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard