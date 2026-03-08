# CMS Service - Strapi Headless CMS

Microservicio de CMS basado en Strapi para gestionar contenido dinámico de Milkshakes DRS.

## Características

- 📝 Interfaz admin intuitiva para gestionar contenido
- 🔌 API REST automática
- 🔐 Control de permisos y roles
- 📱 Soporte para múltiples idiomas (i18n)
- ☁️ Preparado para desplegar en Vercel
- 🗄️ Soporta SQLite (desarrollo) y PostgreSQL (producción)

## Instalación Local

### Prerequisites
- Node.js >= 18
- npm >= 9

### Setup

1. Instala dependencias:
```bash
cd cms-service
npm install
```

2. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

3. Inicia el servidor en modo desarrollo:
```bash
npm run develop
```

4. Accede al admin en `http://localhost:1337/admin`

## Desarrollo

### Crear una colección
1. Ve a `Content Manager` > `Create new single type` o `collection type`
2. Define los campos (titulo, descripción, imagen, etc.)
3. Guarda y publica

### API Endpoints
Una vez creada una colección "productos":
- GET `/api/productos` - Listar todos
- GET `/api/productos/:id` - Obtener uno
- POST `/api/productos` - Crear (requiere autenticación)
- PUT `/api/productos/:id` - Actualizar
- DELETE `/api/productos/:id` - Eliminar

### Plugins principales
- `@strapi/plugin-users-permissions` - Autenticación/autorización
- `@strapi/plugin-i18n` - Soporte multiidioma

## Docker Compose

Para levantar con la base de datos PostgreSQL:
```bash
docker-compose up cms
```

## Despliegue en Vercel

### 1. Push a GitHub
```bash
git add .
git commit -m "Añadir cms-service Strapi"
git push origin main
```

### 2. Crear proyecto en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio
3. Selecciona `cms-service` como root directory

### 3. Configurar variables de entorno en Vercel
```
DATABASE_CLIENT=postgres
DATABASE_HOST=<tu-host-postgres>
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<tu-password>
DATABASE_SSL=true

APP_KEYS=<genera-valores-seguros>
ADMIN_JWT_SECRET=<genera-secreto-seguro>
TRANSFER_TOKEN_SALT=<genera-salt-seguro>

PUBLIC_URL=https://tu-proyecto.vercel.app
NODE_ENV=production
```

### 4. Base de datos PostgreSQL
Recomendadas:
- **Supabase** - PostgreSQL gratuito con 500 MB
- **Railway** - Fácil de usar, con plan gratuito
- **Neon** - PostgreSQL serverless
- **AWS RDS** - Opción empresarial

### 5. Almacenamiento de archivos (opcional)
Para subidas de imágenes, configura un provider:
```bash
npm install @strapi/provider-upload-cloudinary
```

Luego en `config/plugins.js`:
```javascript
module.exports = {
  upload: {
    provider: 'cloudinary',
    providerOptions: {
      cloud_name: env('CLOUDINARY_NAME'),
      api_key: env('CLOUDINARY_KEY'),
      api_secret: env('CLOUDINARY_SECRET'),
    },
  },
};
```

## Configuración avanzada

### Roles y Permisos
1. Ve a `Settings` > `Users & Permissions Plugin`
2. Define roles (Administrador, Editor, Viewer)
3. Asigna permisos a cada rol

### Webhooks
Configura webhooks para disparar acciones (notificaciones, sync, etc.) cuando cambien los datos.

### Importar/Exportar
Usa el plugin de sincronización para importar/exportar datos entre ambientes.

## Troubleshooting

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error de base de datos**
- Verifica las variables de entorno
- Asegúrate que PostgreSQL está corriendo
- Prueba la conexión con el client

**Admin panel lento**
- Limpia el cache del navegador
- Ejecuta `npm run build`

## Links útiles

- [Documentación Strapi](https://docs.strapi.io)
- [REST API Reference](https://docs.strapi.io/developer-docs/latest/api/rest-api.html)
- [Deployment Guides](https://docs.strapi.io/developer-docs/latest/setup-deployment-guides/deployment/deployment.html)
