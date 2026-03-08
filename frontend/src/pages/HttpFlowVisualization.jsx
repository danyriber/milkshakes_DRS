import React, { useState, useEffect } from 'react'
import './HttpFlowVisualization.css'

const HttpFlowVisualization = () => {
  const [currentRequest, setCurrentRequest] = useState(null)
  const [flowSteps, setFlowSteps] = useState([])

  useEffect(() => {
    // Simulate a request flow
    const simulateRequest = () => {
      const request = {
        id: Date.now(),
        method: 'GET',
        url: '/api/products',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }

      setCurrentRequest(request)

      const steps = [
        { id: 1, name: 'Browser', status: 'completed', description: 'User clicks link', timestamp: Date.now() },
        { id: 2, name: 'Nginx Proxy', status: 'processing', description: 'Reverse proxy receives request', timestamp: Date.now() + 50 },
        { id: 3, name: 'API Gateway', status: 'pending', description: 'Routing to appropriate service', timestamp: null },
        { id: 4, name: 'Product Service', status: 'pending', description: 'Fetching product data', timestamp: null },
        { id: 5, name: 'Database', status: 'pending', description: 'Querying PostgreSQL', timestamp: null },
        { id: 6, name: 'Response', status: 'pending', description: 'Sending data back to user', timestamp: null }
      ]

      setFlowSteps(steps)

      // Simulate the flow progression
      let stepIndex = 1
      const interval = setInterval(() => {
        if (stepIndex < steps.length) {
          setFlowSteps(prev => prev.map((step, index) => {
            if (index === stepIndex) {
              return { ...step, status: 'processing', timestamp: Date.now() }
            } else if (index === stepIndex - 1) {
              return { ...step, status: 'completed' }
            }
            return step
          }))
          stepIndex++
        } else {
          clearInterval(interval)
          setFlowSteps(prev => prev.map(step => ({ ...step, status: 'completed' })))
        }
      }, 1000)
    }

    simulateRequest()
    const interval = setInterval(simulateRequest, 8000) // New request every 8 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745'
      case 'processing': return '#ffc107'
      case 'pending': return '#6c757d'
      default: return '#6c757d'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✓'
      case 'processing': return '⟳'
      case 'pending': return '○'
      default: return '○'
    }
  }

  return (
    <div className="http-flow">
      <h1>Visualización del Flujo HTTP</h1>

      {currentRequest && (
        <div className="current-request">
          <h2>Petición Actual</h2>
          <div className="request-details">
            <span className="method">{currentRequest.method}</span>
            <span className="url">{currentRequest.url}</span>
            <span className="status-code">200 OK</span>
          </div>
        </div>
      )}

      <div className="flow-diagram">
        {flowSteps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flow-step ${step.status}`}>
              <div className="step-icon" style={{ backgroundColor: getStatusColor(step.status) }}>
                {getStatusIcon(step.status)}
              </div>
              <div className="step-content">
                <h3>{step.name}</h3>
                <p>{step.description}</p>
                {step.timestamp && (
                  <small>{new Date(step.timestamp).toLocaleTimeString()}</small>
                )}
              </div>
            </div>
            {index < flowSteps.length - 1 && (
              <div className="flow-arrow">
                <div className="arrow-line"></div>
                <div className="arrow-head">↓</div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flow-legend">
        <h3>Leyenda</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#28a745' }}></span>
            <span>Completado</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#ffc107' }}></span>
            <span>Procesando</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#6c757d' }}></span>
            <span>Pendiente</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HttpFlowVisualization