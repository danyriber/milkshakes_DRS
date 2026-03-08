# CMS Strapi - Microservicio creado ✅

Se ha creado un nuevo microservicio **CMS Strapi** para tu arquitectura de milkshakes_DRS.

## 📁 Estructura creada

```
cms-service/
├── .env                          # Variables de entorno (desarrollo)
├── .env.example                  # Template de variables
├── .gitignore                    # Ignore list
├── Dockerfile                    # Container para producción
├── package.json                  # Dependencias (Strapi 4.x)
├── vercel.json                   # Configuración Vercel
├── setup.sh                       # Script de configuración
├── README.md                      # Guía rápida
├── INTEGRACION.md                # Cómo integrar con otros servicios
├── VERCEL_DEPLOYMENT.md          # Guía paso a paso para Vercel
├── config/
│   ├── database.js              # Configuración BD (SQLite/PostgreSQL)
│   ├── server.js                # Configuración del servidor Strapi
│   └── plugins.js               # Plugins (auth, i18n, uploads)
└── src/
    └── index.js                 # Entry point Strapi
```

## 🚀 Cómo comenzar

### Opción 1: Con Docker Compose (Recomendado)

```bash
cd /workspaces/milkshakes_DRS
docker-compose up cms
```

Esto levanta:
- Strapi CMS en `http://localhost:1337`
- PostgreSQL para el CMS en puerto 5433
- Admin dashboard en `http://localhost:1337/admin`

### Opción 2: Desarrollo Local

```bash
cd cms-service
npm install
npm run develop
```

Accede a `http://localhost:1337/admin`

## 📚 Documentación Incluida

1. **README.md** - Guía rápida, instalación, plugins
2. **INTEGRACION.md** - Cómo usar el CMS con Product Service, Order Service, etc.
3. **VERCEL_DEPLOYMENT.md** - Paso a paso para despliegue en Vercel con BD Supabase/Railway

## ⚙️ Configuración Actualizada

El archivo `docker-compose.yml` ya incluye:
- ✅ Servicio `cms` con Strapi
- ✅ Base de datos `cms_db` (PostgreSQL 15)
- ✅ Variables de entorno para ambos
- ✅ Health checks y restart policies

## 🔧 Variables de Entorno

En `.env` tenemos:
```
DATABASE_CLIENT=postgres        # Usa PostgreSQL desde Docker
DATABASE_HOST=cms_db            # Nombre del contenedor
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi_password
```

Para Vercel, crea nuevas claves seguras (ver VERCEL_DEPLOYMENT.md)

## 📦 Dependencias

```json
"dependencies": {
  "@strapi/strapi": "^4.24.0",
  "@strapi/plugin-users-permissions": "^4.24.0",
  "@strapi/plugin-i18n": "^4.24.0",
  "pg": "^8.11.3"
}
```

## 🎯 Próximos Pasos

### 1. Iniciar Strapi
```bash
docker-compose up cms
```

### 2. Crear Admin User
- Abre `http://localhost:1337/admin`
- Crea cuenta de administrador

### 3. Crear Colecciones
Ejemplos que podrías crear:
- **Productos** (nombre, descripción, imagen, precio)
- **Blog** (titulo, contenido, slug, autor, fecha)
- **Testimonios** (nombre, texto, rating)
- **FAQ** (pregunta, respuesta)
- **Configuración General** (nombre empresa, logo, etc.)

### 4. Exponer la API
Ve a `Settings > Users & Permissions > Roles`:
- Configura permisos públicos para lectura
- Usa API tokens para operaciones internas

### 5. Integrar con Otros Servicios
Ver `INTEGRACION.md` para ejemplos de:
- Frontend consumiendo CMS REST API
- API Gateway redirigiendo a CMS
- Webhooks de Strapi notificando cambios
- Sincronización con Product Service

### 6. Desplegar en Vercel
Seguir `VERCEL_DEPLOYMENT.md`:
- Conectar BD Supabase/Railway/Neon
- Configurar uploads en Cloudinary
- Deploy automático desde GitHub

## 🔗 Integración con API Gateway

Opcionalmente, puedes añadir en `services/api-gateway/app.js`:

```javascript
// Proxy a CMS
app.use('/api/cms', (req, res) => {
  const url = `http://cms:1337${req.url}`;
  fetch(url, { method: req.method, headers: req.headers })
    .then(r => r.json())
    .then(data => res.json(data));
});
```

Así el frontend accede a CMS a través del gateway:
```
Frontend → http://localhost:3000/api/cms/...
           ↓
        API Gateway → http://cms:1337/api/...
```

## 📋 Checklist de Configuración

- [x] Estructura de carpetas creada
- [x] package.json con Strapi 4.x
- [x] Dockerfile optimizado
- [x] Configuración de BD (SQLite/PostgreSQL dual)
- [x] Variables de entorno (.env)
- [x] docker-compose.yml actualizado
- [x] Documentación (README, INTEGRACION, VERCEL_DEPLOYMENT)
- [ ] **Ejecutar `npm install`** (hacer después de git pull)
- [ ] **Levantar con Docker Compose** (si usas Docker)
- [ ] **Crear Primera Colección en Admin**
- [ ] **Desplegar en Vercel** (cuando esté listo)

## 💡 Tips

1. **Desarrollo Rápido**: Crea colecciones desde admin UI, Strapi genera API automáticamente
2. **Contenido Multiidioma**: Plugin i18n ya incluido, actívalo en Admin
3. **Media Management**: Usa Cloudinary para no perder imágenes en Vercel
4. **Webhooks**: Poderosos para sincronizar con otros servicios
5. **REST vs GraphQL**: Activar GraphQL en plugins si lo necesitas

## 📞 ¿Necesitas Ayuda?

- Documentación oficial: [docs.strapi.io](https://docs.strapi.io)
- Comunidad Discord: [discord.strapi.io](https://discord.strapi.io)
- YouTube: busca "Strapi tutorial"

---

¡Tu CMS está listo! 🎉 Ahora puedes:
1. Levantar Strapi con Docker
2. Crear tu primer Content Type
3. Consumir desde Frontend/otros servicios
4. Desplegar en Vercel cuando esté listo
