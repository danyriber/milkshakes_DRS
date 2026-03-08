# Despliegue Strapi CMS en Vercel

Guía paso a paso para desplegar el CMS Strapi en Vercel con una base de datos externa e integración con el API Gateway.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub con el código
- Servicio de base de datos PostgreSQL externo
- (Opcional) Cuenta en Cloudinary para almacenar archivos

## 🚀 Pasos de Despliegue

### 1. Contenedor Inicial en Vercel

#### 1.1 Conectar Repositorio
1. Ingresa a [vercel.com](https://vercel.com)
2. Click en "Add New..." → "Project"
3. Conecta tu repositorio GitHub
4. Selecciona el repositorio `milkshakes_DRS`

#### 1.2 Configurar Raíz del Proyecto
- **Root Directory**: `cms-service`
- **Framework**: Other
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 2. Provisionar Base de Datos PostgreSQL

Elige una de estas opciones:

#### Opción A: Supabase (Recomendado - Gratuito)
1. Ingresa a [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. Copia host, puerto, usuario, contraseña de Settings → Database
4. Guarda en Vercel variables (ver paso 3)

#### Opción B: Railway
1. Ingresa a [railway.app](https://railway.app)
2. New Project → PostgreSQL
3. Copia connection string

#### Opción C: Neon (PostgreSQL Serverless)
1. Ingresa a [neon.tech](https://neon.tech)
2. Crea nuevo proyecto
3. Copia connection string

#### Opción D: AWS RDS (Enterprise)
- Más caro pero escalable para producción

### 2. Provisionar Base de Datos PostgreSQL

Elige una de estas opciones:

#### Opción A: Supabase (Recomendado - Gratuito)
1. Ingresa a [supabase.com](https://supabase.com)
2. Crea nuevo proyecto
3. Copia host, puerto, usuario, contraseña de Settings → Database
4. Guarda en Vercel variables (ver paso 3)

#### Opción B: Railway
1. Ingresa a [railway.app](https://railway.app)
2. New Project → PostgreSQL
3. Copia connection string

#### Opción C: Neon (PostgreSQL Serverless)
1. Ingresa a [neon.tech](https://neon.tech)
2. Crea nuevo proyecto
3. Copia connection string

#### Opción D: AWS RDS (Enterprise)
- Más caro pero escalable para producción

### 3. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto:

**Settings** → **Environment Variables**

Añade estas variables:

```
DATABASE_CLIENT = postgres

DATABASE_HOST = tu-host-db.com (ej: db.xxxxxxx.supabase.co)
DATABASE_PORT = 5432
DATABASE_NAME = postgres (o el nombre de tu BD)
DATABASE_USERNAME = postgres (o tu usuario)
DATABASE_PASSWORD = tu-contraseña-segura
DATABASE_SSL = true

APP_KEYS = clave1,clave2,clave3,clave4
ADMIN_JWT_SECRET = genera-una-clave-muy-larga-y-segura-aqui-minimo-32-caracteres
TRANSFER_TOKEN_SALT = otra-clave-larga-y-segura-minimo-16-caracteres

PUBLIC_URL = https://tu-proyecto.vercel.app
NODE_ENV = production
```

## 🔗 Integración con API Gateway

### Configuración del API Gateway

Una vez desplegado el CMS en Vercel, configura tu API Gateway para consumir contenido:

1. **Variables de Entorno en API Gateway:**
```bash
# URL del CMS en Vercel
CMS_URL=https://tu-proyecto.vercel.app

# Token de API (opcional, si configuras autenticación en Strapi)
CMS_API_TOKEN=tu-api-token-de-strapi
```

2. **Rutas Disponibles:**
El API Gateway expondrá estas rutas para consumir contenido del CMS:

- `GET /api/content/products` - Productos gestionados en CMS
- `GET /api/content/categories` - Categorías de productos
- `GET /api/content/pages` - Páginas estáticas
- `GET /api/content/pages/:slug` - Página específica por slug
- `GET /api/content/blog` - Posts del blog
- `GET /api/content/search?q=query` - Búsqueda en contenido
- `GET /api/cms/health` - Health check del CMS

### Desarrollo Local

Para desarrollo local con CMS en Vercel:

1. Configura `CMS_URL=https://tu-proyecto.vercel.app` en tu `.env` del API Gateway
2. El sistema automáticamente usará la URL de producción

### Configuración de Contenido en Strapi

Después del despliegue inicial:

1. Ve a `https://tu-proyecto.vercel.app/admin`
2. Crea usuario administrador
3. Configura Content Types:
   - **Products**: nombre, descripción, precio, imagen, categoría
   - **Categories**: nombre, descripción, imagen
   - **Pages**: título, contenido, slug, meta descripción
   - **Blog Posts**: título, contenido, autor, fecha, tags

## ⚠️ Consideraciones de Producción

### Rendimiento
- Vercel tiene límites de ejecución (10s hobby, 30s pro)
- Para alta carga, considera Railway o VPS dedicado

### Almacenamiento
- Configura Cloudinary o AWS S3 para archivos
- No uses almacenamiento local en serverless

### Backup y Monitoreo
- Configura backups automáticos de PostgreSQL
- Monitorea uso de API y rendimiento
- Implementa logging centralizado

## 🐛 Solución de Problemas

### Timeouts en Vercel
- Optimiza consultas a base de datos
- Implementa cache con Redis
- Considera migrar a hosting con mejor rendimiento

### Errores de Conexión BD
- Verifica que PostgreSQL acepte conexiones externas
- Confirma `DATABASE_SSL=true`
- Revisa firewall y credenciales

### Errores de Build
- Verifica dependencias en `package.json`
- Asegura `NODE_ENV=production`
- Revisa logs de build en Vercel

> 🔒 **Importante**: Genera claves fuertes usando:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4. Almacenamiento de Archivos (Cloudinary)

Para que las imágenes subidas persistan (Vercel tiene filesystem efímero):

#### 4.1 Crear Cuenta Cloudinary
1. Ingresa a [cloudinary.com](https://cloudinary.com)
2. Crea cuenta gratuita
3. Copia Cloud Name, API Key, API Secret

#### 4.2 Instalar Plugin en Strapi
```bash
cd cms-service
npm install @strapi/provider-upload-cloudinary
```

#### 4.3 Crear `config/plugins.js`
```javascript
module.exports = {
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    },
  },
};
```

#### 4.4 Añadir Variables a Vercel
```
CLOUDINARY_NAME = tu-cloud-name
CLOUDINARY_API_KEY = tu-api-key
CLOUDINARY_API_SECRET = tu-api-secret
```

### 5. Deploy

1. En Vercel dashboard, tus cambios se detectan automáticamente
2. Click en "Deploy" o espera a que GitHub Action se ejecute
3. Verifica que el build sea exitoso
4. Accede a `https://tu-proyecto.vercel.app/admin`

**Primera vez:**
- Se creará la tabla de usuarios administrativos
- Crea tu usuario admin
- ¡Listo para usar!

## 🔧 Troubleshooting

### Error: "Cannot connect to database"
```
✅ Verifica credenciales en Vercel Environment Variables
✅ Asegúrate que la BD está activa
✅ Revisa que DATABASE_HOST es correcto (sin https://)
✅ Intenta con DATABASE_SSL = false si está en red local
```

### Error: "Module not found"
```bash
# En local, limpia e instala nuevamente
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Cannot read files (Vercel ephemeral filesystem)"
```
✅ Configura Cloudinary para uploads (ver sección 4)
✅ O usa AWS S3, Google Cloud Storage, etc.
```

### Admin panel es lentísimo
```bash
# En local:
npm run build  # Pre-compila todo

# Vercel automáticamente cachea builds
# Si persiste, revisa performance en BD (índices, queries)
```

## 📊 Monitoreo en Producción

### Logs
```bash
# Ver logs de Vercel
vercel logs cms-service
# O en dashboard → Deployments → [última] → Logs
```

### Health Check
```bash
curl https://tu-proyecto.vercel.app/admin
# Debe responder con HTTP 200 y HTML del panel
```

### Métricas de Performance
- Vercel Analytics (automático)
- Query performance de BD
- Size de build

## 🔄 CI/CD con GitHub Actions

Opcionalmente, configura despliegue automático:

```yaml
# .github/workflows/deploy-cms.yml
name: Deploy CMS

on:
  push:
    branches: [main]
    paths:
      - 'cms-service/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: cms-service
```

## 🌍 Dominio Personalizado

1. En Vercel → Settings → Domains
2. Añade tu dominio (ej: `cms.tudominio.com`)
3. Sigue instrucciones de DNS
4. Actualiza `PUBLIC_URL` con tu dominio

## 🔐 Seguridad en Producción

### Cambiar Contraseña Admin
1. Accede a `/admin`
2. Settings → Profile → Change Password

### Configurar Email (SMTP)
Para envío de notificaciones:

```javascript
// config/server.js
module.exports = ({ env }) => ({
  // ... otros settings
  email: {
    provider: 'nodemailer',
    providerOptions: {
      host: env('SMTP_HOST'),
      port: env('SMTP_PORT'),
      auth: {
        user: env('SMTP_USER'),
        pass: env('SMTP_PASS'),
      },
    },
    settings: {
      defaultFrom: env('SMTP_FROM'),
      defaultReplyTo: env('SMTP_REPLY_TO'),
    },
  },
});
```

### Rate Limiting
```javascript
// config/middlewares.js
module.exports = [
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:', 'http:'],
        },
      },
    },
  },
];
```

## 🚦 Status Page

Vercel proporciona:
- Status automático
- Downtime alerts
- Performance analytics

Accede en: [status.vercel.com](https://status.vercel.com)

## 🆘 Soporte

- [Vercel Docs](https://vercel.com/docs)
- [Strapi Docs](https://docs.strapi.io)
- [Strapi Discord Community](https://discord.strapi.io)
- [Vercel Community](https://github.com/vercel/community)

## 📝 Checklist Pre-Producción

- [ ] BD PostgreSQL externa configurada y testeo
- [ ] Variables de entorno seguras en Vercel
- [ ] Build local exitoso (`npm run build`)
- [ ] Admin accesible en `/admin` con credenciales
- [ ] Cloudinary configurado para uploads
- [ ] CORS configurado correctamente
- [ ] Email/SMTP configurado (si es necesario)
- [ ] Backups automáticos de BD
- [ ] Dominio personalizado añadido
- [ ] SSL/HTTPS activado
- [ ] Monitoreo de logs activado
- [ ] Rate limiting configurado

---

¡Tu CMS Strapi está listo para producción! 🎉
