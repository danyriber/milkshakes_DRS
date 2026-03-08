# Integración del CMS Strapi con los Microservicios Existentes

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend React (Vite)                      │
│                     (puerto 5173)                               │
└────────────────┬────────────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  API Gateway    │
        │  (puerto 3000)  │
        └─┬──┬──┬──┬──────┘
          │  │  │  │
    ┌─────┘  │  │  └─────────────┐
    │        │  │                │
┌───▼──┐ ┌──▼──▼──┐ ┌───────┐ ┌─▼─────┐
│Prod. │ │Cart/   │ │User   │ │Order  │
│Svc   │ │Order   │ │Svc    │ │Svc    │
└──┬───┘ └────┬───┘ └───┬───┘ └─┬─────┘
   │          │         │       │
   └──────────┴────┬────┴───────┘
                   │
          ┌────────▼────────┐
          │  PostgreSQL DB  │
          │  (puerto 5432)  │
          └─────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│            CMS Strapi (NEW)                                    │
│            (puerto 1337)                                        │
│                                                                 │
│  - GraphQL/REST API para contenido estático y dinámico         │
│  - Admin panel para gestionar productos, blogs, etc.           │
│  - Soporte para media (imágenes, documentos)                   │
└────────────┬────────────────────────────────────────┬──────────┘
             │                                        │
        ┌────▼──────────────────────┐       ┌────────▼─────┐
        │  PostgreSQL para Strapi   │       │  Cloudinary  │
        │  (puerto 5433)            │       │  (opcional)  │
        └───────────────────────────┘       └──────────────┘
```

## Casos de Uso

### 1. Servicio de Productos (Product Service + CMS)

El **Product Service** maneja productos en la BD principal.
El **CMS Strapi** puede usarse para gestionar:
- Descripciones largas de productos
- Categorías y taxonomías
- Imágenes y galería de productos
- Metadatos SEO

**Flujo:**
```
Frontend → API Gateway → Product Service
                         (get productos dinámicos)
                         ↓
                      CMS REST API
                      (get detalles, imágenes)
```

### 2. Gestión de Contenidos Estáticos

Usa Strapi para:
- Página "Sobre nosotros"
- FAQ
- Blog/Noticias
- Testimonios
- Política de privacidad, T&C

### 3. Email Marketing / Newsletters

Strapi puede almacenar plantillas de email que luego
el **User Service** puede consumir para enviar newsletters.

### 4. Sincronizar Datos entre Servicios

Usa **webhooks** de Strapi para notificar cambios:

```javascript
// En event listener de Strapi
module.exports = {
  beforeCreate: async (event) => {
    const { data } = event.params;
    
    // Notificar al Product Service
    await fetch('http://product-service:3001/sync/product', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};
```

## Ejemplos de Integración

## Conexión a la base de datos local compartida

Por defecto nuestra configuración usa un contenedor independiente (`cms_db`).
Si prefieres usar la misma base de datos PostgreSQL que el resto de los microservicios (contenedor `db`), basta ajustar las variables de entorno:

```env
# .env o docker-compose override
DATABASE_CLIENT=postgres
DATABASE_HOST=db         # apunta al servicio principal
DATABASE_PORT=5432
DATABASE_NAME=milkshakes_drs   # o crea un esquema separado
DATABASE_USERNAME=admin
DATABASE_PASSWORD=password123
``` 

Edita `cms-service/config/database.js` para no forzar `cms_db` si detecta la variable:

```javascript
module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'sqlite');
  if (client === 'postgres') {
    return {
      connection: {
        client: 'postgres',
        connection: {
          host: env('DATABASE_HOST', 'localhost'),
          port: env.int('DATABASE_PORT', 5432),
          database: env('DATABASE_NAME', 'strapi'),
          user: env('DATABASE_USERNAME', 'strapi'),
          password: env('DATABASE_PASSWORD', 'strapi'),
          ssl: env.bool('DATABASE_SSL', false),
        },
        debug: false,
      },
    };
  }
  // ... sqlite fallback
};
```

De esta forma el CMS y los otros servicios comparten la misma instancia de PostgreSQL. En un entorno Kubernetes se recomienda mantenerlos en esquemas separados o bases de datos distintas para limitar el acoplamiento.

## Gestión de Roles y Autenticación en Strapi

Strapi incluye el plugin **Users & Permissions**. Para habilitarlo:

1. En el panel admin (`/admin`) ve a **Settings → Users & Permissions Plugin**.
2. Crea roles personalizados (por ejemplo, `editor`, `viewer`, `admin`).
3. Ajusta permisos de lectura/creación/actualización para cada tipo de contenido.
4. Genera **API Tokens** para acceso desde otros servicios:
   - `Settings → API Tokens → Create new token`
   - Elige un nombre, rol y scopes.
5. Usa los tokens en las peticiones:

```bash
curl -H "Authorization: Bearer <API_TOKEN>" \
     http://cms:1337/api/products
```

Para reforzar la autenticación inter-servicios, considera crear un pequeño microservicio `auth-service` que valide JWTs y rote tokens periódicamente.


## Despliegue en Kubernetes

La carpeta `../k8s` contiene manifiestos de ejemplo:

```text
k8s/
├── cms-deployment.yaml      # Deployment + Service CMS
├── cms-db-deployment.yaml   # PostgreSQL Deployment + Service
├── strapi-secrets.yaml      # Secrets para credenciales
└── strapi-pvcs.yaml         # PersistentVolumeClaims
```

1. Aplica los recursos:

```bash
kubectl apply -f k8s/strapi-pvcs.yaml
kubectl apply -f k8s/strapi-secrets.yaml
kubectl apply -f k8s/cms-db-deployment.yaml
kubectl apply -f k8s/cms-deployment.yaml
```

2. Verifica que los pods estén en estado `Running`:

```bash
kubectl get pods
kubectl get svc strapi-cms-service
```

3. Configura un **Ingress** o LoadBalancer para exponer el puerto 1337.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: strapi-ingress
spec:
  rules:
  - host: cms.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: strapi-cms-service
            port:
              number: 1337
```

4. Ajustes de producción:
   - Usa **ConfigMaps**/Secrets para variables de entorno.
   - Habilita **autoscaling** (HPA) si hay carga.
   - Monitorea logs con `kubectl logs` o integraciones (Prometheus).

## Roles y Seguridad en Kubernetes

- Crea un `ServiceAccount` dedicado para el CMS.
- Limita permisos con `Role`/`RoleBinding` si el CMS necesita acceder al API de Kubernetes.

---

Continúa con ejemplos de Integración:

### A. Frontend consumiendo CMS

```javascript
// frontend/src/components/ProductCard.jsx
import { useEffect, useState } from 'react';

export function ProductCard({ id }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Obtener datos del Product Service (dinámicos)
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(product => setProduct(product));

    // Obtener detalles del CMS (contenido rico)
    fetch(`http://localhost:1337/api/product-details/${id}?populate=*`)
      .then(r => r.json())
      .then(cms => {
        setProduct(prev => ({ ...prev, description: cms.description }));
      });
  }, [id]);

  return (
    <div>
      <h2>{product?.name}</h2>
      <p>{product?.description}</p>
      <img src={`http://localhost:1337${product?.image?.url}`} />
    </div>
  );
}
```

### B. API Gateway ruteando a CMS

```javascript
// services/api-gateway/app.js
const express = require('express');
const app = express();

// Rutas existentes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));

// Nueva ruta al CMS
app.use('/api/cms', (req, res) => {
  // Proxy a Strapi
  const url = `http://cms:1337${req.url}`;
  fetch(url, {
    method: req.method,
    headers: req.headers,
    body: req.method !== 'GET' ? req.body : undefined
  })
    .then(r => r.json())
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ error: err.message }));
});
```

### C. Order Service integrando con CMS

```javascript
// services/order-service/app.js

// Cuando se crea un pedido, obtener detalles del CMS para el email
app.post('/orders', async (req, res) => {
  const order = await Order.create(req.body);

  // Obtener template de email del CMS
  const emailTemplate = await fetch('http://cms:1337/api/email-templates/order-confirmation')
    .then(r => r.json());

  // Enviar email (usar template del CMS)
  sendEmail({
    to: order.email,
    template: emailTemplate.content,
    data: order
  });

  res.json(order);
});
```

## Autenticación entre Microservicios

### CMS protegido con API Token

1. Ve a `/admin` → Settings → API Tokens
2. Crea un token para funciones específicas
3. Usa en requests:

```javascript
fetch('http://cms:1337/api/products', {
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`
  }
})
```

### User Service manejando autenticación CMS

```javascript
// services/user-service/app.js

const CMS_TOKEN = process.env.CMS_API_TOKEN;

app.get('/profile/:id', async (req, res) => {
  // Checkear si usuario existe en User Service
  const user = await User.findById(req.params.id);
  
  // Obtener perfil extendido del CMS
  const profile = await fetch(
    `http://cms:1337/api/user-profiles/${user.id}`,
    {
      headers: { 'Authorization': `Bearer ${CMS_TOKEN}` }
    }
  ).then(r => r.json());

  res.json({ ...user, ...profile });
});
```

## Despliegue Integrado

### Docker Compose (Local)

```bash
# Levantar todo junto
docker-compose up

# El CMS estará disponible en: http://localhost:1337/admin
# Los otros servicios en http://localhost:3000-3004
```

### Producción (Kubernetes)

Si escalas a Kubernetes:

```yaml
# deployment-cms.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: strapi-cms
spec:
  replicas: 1
  selector:
    matchLabels:
      app: strapi-cms
  template:
    metadata:
      labels:
        app: strapi-cms
    spec:
      containers:
      - name: strapi
        image: milkshakes-cms:latest
        ports:
        - containerPort: 1337
        env:
        - name: DATABASE_HOST
          valueFrom:
            configMapKeyRef:
              name: strapi-config
              key: db-host
        # ... más variables
---
apiVersion: v1
kind: Service
metadata:
  name: strapi-cms-service
spec:
  selector:
    app: strapi-cms
  ports:
  - protocol: TCP
    port: 1337
    targetPort: 1337
  type: ClusterIP
```

## Seguridad en Producción

1. **Versionamiento de API**
   - Usa `/api/v1/` para mantener backwards compatibility

2. **Rate Limiting**
   - Configura rate limits en API Gateway para CMS

3. **CORS**
   - En Strapi `config/middlewares.js`:
   ```javascript
   module.exports = [
     'strapi::cors',
     {
       name: 'strapi::cors',
       config: {
         origin: ['https://tu-dominio.com'],
         credentials: true,
       }
     }
   ];
   ```

4. **JWT & API Tokens**
   - Usa tokens con expiración
   - Rotate regularmente

5. **Firewall de BD**
   - Solo permite conexiones desde servicios conocidos
   - `cms_db` solo se conecta desde `cms` service

## Monitoreo

```bash
# Ver logs del CMS
docker logs milkshakes_drs_cms

# Ver estado de BD
docker logs milkshakes_drs_cms_db

# Health check
curl http://localhost:1337/admin
```

## Próximos Pasos

1. **Webhooks** - Notificar cambios a otros servicios
2. **Caching** - Redis para cachear respuestas del CMS
3. **GraphQL** - Strapi incluye GraphQL, úsalo para queries complejas
4. **Sincronización** - Script para sincronizar productos con Product Service
5. **Multi-idioma** - Configura i18n en Strapi para soporte multiidioma

---

Para más detalles, consulta:
- [Strapi Docs](https://docs.strapi.io)
- [Strapi Webhooks](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/webhooks.html)
