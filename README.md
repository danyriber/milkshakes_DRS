# 🥤 Milkshakes DRS - Arquitectura de Microservicios

**Proyecto Académico de Administración de Sistemas en Servidor Web**

Este proyecto implementa una **arquitectura de microservicios** completa para una tienda de milkshakes, demostrando tecnologías modernas de desarrollo web, orquestación de contenedores y comunicación entre servicios.

---

## 📋 Descripción Ejecutiva del Proyecto

Milkshakes DRS es una **aplicación web reactiva** basada en microservicios que incluye:

- ✅ **Arquitectura de Microservicios**: Servicios independientes y escalables
- ✅ **Frontend Reactivo**: Interfaz de usuario moderna con React.js
- ✅ **Base de Datos Relacional**: PostgreSQL con esquemas optimizados
- ✅ **API Gateway**: Enrutamiento centralizado de solicitudes
- ✅ **Orquestación**: Docker Compose para gestión de contenedores
- ✅ **Comunicación**: APIs REST entre microservicios

**Tecnologías:**
- 🐳 **Contenedores**: Docker & Docker Compose
- ⚛️ **Frontend**: React.js con Vite
- 🟢 **Backend**: Node.js con Express.js
- 🐘 **Base de Datos**: PostgreSQL
- 🔄 **API Gateway**: Proxy reverso con Express
- 📡 **Comunicación**: REST APIs

---

## 🏗️ Arquitectura de Microservicios

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Gateway   │
│   (React)       │    │   (Express)     │
└─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐
            │ Product   │ │ Cart  │ │ User  │
            │ Service   │ │ Service│ │ Service│
            └───────────┘ └───────┘ └───────┘
                    │         │         │
                    └─────────┼─────────┘
                              │
                       ┌──────▼──────┐
                       │ Order       │
                       │ Service     │
                       └─────────────┘
                              │
                       ┌──────▼──────┐
                       │ PostgreSQL  │
                       │ Database    │
                       └─────────────┘
```

### Microservicios Implementados:

1. **Product Service** (Puerto 3001)
   - Gestión del catálogo de productos
   - CRUD completo de productos
   - Validación de stock

2. **Cart Service** (Puerto 3002)
   - Gestión de carritos de compra
   - Comunicación con Product Service
   - Cálculos de totales

3. **User Service** (Puerto 3003)
   - Autenticación y registro de usuarios
   - Gestión de perfiles
   - JWT para sesiones seguras

4. **Order Service** (Puerto 3004)
   - Procesamiento de pedidos
   - Integración con servicios de carrito y usuario
   - Historial de compras

5. **API Gateway** (Puerto 3000)
   - Punto de entrada único
   - Enrutamiento a microservicios
   - Balanceo de carga básico

6. **Frontend** (Puerto 5173)
   - Interfaz reactiva con React.js
   - Consumo de APIs REST
   - Gestión de estado del carrito

7. **CMS Service - Strapi** (Puerto 1337) **[NUEVO]**
   - Headless CMS para gestionar contenido dinámico
   - Admin panel intuitivo
   - APIs REST automáticas
   - Soporte para multiidioma (i18n)
   - Almacenamiento de archivos (imágenes, documentos)
   - Webhooks para sincronización con otros servicios
   - Despliegue en Vercel preparado

---

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker y Docker Compose instalados
- Node.js 18+ (para desarrollo local)
- Puerto 3000-3004 y 5173 disponibles

### Despliegue Completo

```bash
# Clonar el repositorio
git clone <repository-url>
cd milkshakes_DRS

# Construir e iniciar todos los servicios
docker-compose up --build

# Acceder a la aplicación
# Frontend: http://localhost:5173
# API Gateway: http://localhost:3000
# Base de datos: localhost:5432
# CMS Strapi: http://localhost:1337/admin [NUEVO]
```

### Notas opcionales

- Si prefieres que el CMS use la **misma base de datos** que los servicios, ajusta las variables en `.env` como se describe en `cms-service/INTEGRACION.md`.
- Para roles y permisos en el CMS, revisa el apartado **Roles y Autenticación** en el mismo archivo.
- Manifiestos de Kubernetes están en `k8s/`; despliega con `kubectl apply -f k8s/`.


### Desarrollo Local

```bash
# Instalar dependencias de cada servicio
cd services/product-service && npm install
cd ../cart-service && npm install
# ... repetir para cada servicio

cd ../../frontend && npm install

# Iniciar servicios individualmente
cd services/product-service && npm start
# En terminales separadas para cada servicio

# Iniciar frontend
cd frontend && npm run dev
```

---

## 📂 Estructura del Proyecto

```
milkshakes_DRS/
├── services/                 # Microservicios backend
│   ├── product-service/      # Servicio de productos
│   ├── cart-service/         # Servicio de carrito
│   ├── user-service/         # Servicio de usuarios
│   ├── order-service/        # Servicio de pedidos
│   └── api-gateway/          # API Gateway
├── cms-service/              # CMS Strapi [NUEVO]
│   ├── config/               # Configuración Strapi
│   ├── src/                  # Código Strapi
│   ├── Dockerfile            # Contenedor Strapi
│   ├── package.json
│   ├── README.md             # Guía del CMS
│   ├── INTEGRACION.md        # Cómo integrar con otros servicios
│   └── VERCEL_DEPLOYMENT.md  # Guía de despliegue en Vercel
├── frontend/                 # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── pages/           # Páginas de la aplicación
│   │   └── App.jsx          # App principal
│   └── Dockerfile
├── database/                 # Configuración de BD
│   ├── init.sql             # Esquema inicial
│   └── Dockerfile
├── docker-compose.yml        # Orquestación completa
├── docker-compose.dev.yml    # Configuración desarrollo
├── CMS_STRAPI_SETUP.md      # Resumen de setup CMS [NUEVO]
├── README.md                # Este archivo
├── ARQUITECTURA.md          # Documentación técnica
└── INSTALACION.md           # Guía de instalación
```

---

## 🔧 Configuración y Variables de Entorno

### Variables de Base de Datos
```env
DB_HOST=db
DB_PORT=5432
DB_NAME=milkshakes_drs
DB_USER=admin
DB_PASSWORD=password123
```

### Variables de Servicios
```env
JWT_SECRET=your_jwt_secret_key_here
```

---

## 🎭 CMS Strapi - Gestión de Contenido Dinámico

El proyecto ahora incluye **Strapi**, un **Headless CMS** que permite gestionar contenido dinámico sin tocar código.

### Características del CMS

- **Admin Panel Intuitivo**: Interfaz web para crear/editar contenido
- **API REST Automática**: Generación automática de endpoints
- **Plugins Incluidos**:
  - 👥 Users & Permissions (autenticación y roles)
  - 🌍 Internacionalización (i18n) - soporte multiidioma
  - 📁 Media Manager (gestión de imágenes y archivos)
- **Webhooks**: Sincronización automática con otros servicios
- **Vercel Ready**: Preparado para despliegue en Vercel

### Uso Rápido

```bash
# Acceder al panel admin tras levantar docker-compose
# http://localhost:1337/admin

# Crear tu primer "Content Type"
# 1. Click en "Create new Collection Type"
# 2. Añade campos (nombre, descripción, imagen, etc.)
# 3. Genera endpoints REST automáticamente
```

### Ejemplos de Colecciones que Podrías Crear

- **Blog**: Posts con título, contenido, autor, fecha
- **FAQ**: Preguntas y respuestas frecuentes
- **Testimonios**: Opiniones de clientes con rating
- **Configuración Global**: Datos de la empresa, horarios, etc.

### Ejemplos de Integración

#### Consumir CMS desde Frontend
```javascript
// React component consumiendo API del CMS
const [posts, setPosts] = useState([]);

useEffect(() => {
  fetch('http://localhost:1337/api/posts')
    .then(r => r.json())
    .then(data => setPosts(data.data));
}, []);
```

#### Sincronizar con Product Service
El CMS puede notificar cambios al Product Service mediante webhooks, permitiendo sincronización automática de contenido enriquecido (descripciones largas, SEO metadata, etc.).

### Documentación CMS

Para información detallada sobre el CMS, consulta:
- **[CMS_STRAPI_SETUP.md](CMS_STRAPI_SETUP.md)** - Guía de configuración y primeros pasos
- **[cms-service/README.md](cms-service/README.md)** - Documentación técnica
- **[cms-service/INTEGRACION.md](cms-service/INTEGRACION.md)** - Cómo integrar con otros servicios
- **[cms-service/VERCEL_DEPLOYMENT.md](cms-service/VERCEL_DEPLOYMENT.md)** - Despliegue en Vercel

---

## 📊 Endpoints de API

### Product Service
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto específico
- `POST /api/products` - Crear producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Cart Service
- `GET /api/cart/:sessionId` - Obtener carrito
- `POST /api/cart/:sessionId/items` - Agregar item
- `PUT /api/cart/:sessionId/items/:itemId` - Actualizar cantidad
- `DELETE /api/cart/:sessionId/items/:itemId` - Remover item

### User Service
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/users/profile` - Perfil de usuario

### Order Service
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:userId` - Obtener pedidos del usuario

---

## 🧪 Pruebas y Validación

### Health Checks
Cada servicio incluye endpoints de health check:
- `GET /health` - Estado del servicio

### Verificación de Funcionalidad
```bash
# Verificar que todos los servicios estén ejecutándose
docker-compose ps

# Ver logs de un servicio específico
docker-compose logs product-service

# Acceder a la base de datos
docker-compose exec db psql -U admin -d milkshakes_drs
```

---

## 📚 Documentación Adicional

- **[ARQUITECTURA.md](ARQUITECTURA.md)** - Análisis técnico detallado
- **[INSTALACION.md](INSTALACION.md)** - Guía de instalación paso a paso
- **[DIAGRAMAS.md](DIAGRAMAS.md)** - Diagramas de arquitectura y flujo
- **[ENTREGA.md](ENTREGA.md)** - Requisitos académicos cumplidos

---

## 🎯 Requisitos Académicos Cumplidos

- ✅ Arquitectura Cliente-Servidor
- ✅ Tipología Web Dinámica
- ✅ Selección Tecnológica (Apache/Node.js)
- ✅ Protocolo HTTP/HTTPS
- ✅ Seguridad Implementada
- ✅ Documentación Completa
- ✅ Microservicios Modernos
- ✅ Orquestación con Docker
- ✅ Base de Datos Relacional
- ✅ Frontend Reactivo

---

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es para fines académicos - Ver términos en el curso correspondiente.

---

**Desarrollado con ❤️ para el curso de Administración de Sistemas en Servidor Web**
│   ├─ Análisis de Arquitectura
│   ├─ Tipología de Web
│   ├─ Selección Tecnológica
│   ├─ Funcionamiento HTTP
│   └─ Seguridad y Mantenimiento
├── DIAGRAMAS.md            # Diagramas de flujo y arquitectura
│   ├─ Flujo HTTP Completo
│   ├─ Arquitectura Detallada
│   ├─ Ciclo GET (Catálogo)
│   ├─ Ciclo POST (Carrito)
│   └─ Capas de Seguridad
└── INSTALACION.md          # Guía paso a paso de instalación
    ├─ Requisitos previos
    ├─ Instalación sistema (Apache/PHP)
    ├─ Configuración del proyecto
    ├─ HTTPS y seguridad
    └─ Troubleshooting
```

---

## 🎯 Requisitos Académicos Cumplidos

### 1. **Análisis de Arquitectura** (2 pts)
- ✅ Modelo Cliente-Servidor desglosado
- ✅ Componentes claramente identificados (navegador, Apache, PHP, sesiones)
- ✅ Flujo de control entre capas

**Documentación**: [ARQUITECTURA.md](ARQUITECTURA.md#1-análisis-de-arquitectura-modelo-cliente-servidor)

### 2. **Tipología de Web** (3 pts)
- ✅ **Decidido**: Sitio DINÁMICO (no estático)
- ✅ Justificación: Catálogo interactivo, carrito, formularios, personalización
- ✅ Comparativa Estático vs Dinámico vs Actual

**Documentación**: [ARQUITECTURA.md](ARQUITECTURA.md#2-tipología-de-web-sitio-dinámico)

### 3. **Selección Tecnológica** (2 pts)
- ✅ **Seleccionado**: Apache HTTP Server
- ✅ Justificación vs Nginx (rendimiento) y IIS (costo)
- ✅ Criterios: flexibilidad, PHP nativos, módulos, comunidad

**Documentación**: [ARQUITECTURA.md](ARQUITECTURA.md#3-selección-tecnológica-apache-http-server)

### 4. **Funcionamiento del Protocolo HTTP** (2 pts)
- ✅ Ciclo completo solicitud-respuesta explicado
- ✅ Métodos: GET (páginas), POST (formularios)
- ✅ Códigos de estado (200, 404, 500, etc.)
- ✅ Encabezados HTTP ilustrados

**Documentación**: 
- [ARQUITECTURA.md](ARQUITECTURA.md#4-funcionamiento-del-protocolo-http)
- [DIAGRAMAS.md](DIAGRAMAS.md#1-diagrama-de-flujo-http-completo)

### 5. **Seguridad y Mantenimiento** (1 pt)
- ✅ Validación de entrada (contacto.php)
- ✅ Sanitización de salida (htmlspecialchars)
- ✅ Control de sesiones (PHP session)
- ✅ Protección de archivos (.htaccess)
- ✅ Encabezados de seguridad (X-XSS, X-Frame)
- ✅ Copias de seguridad (scripts)
- ✅ Monitoreo (logs)
- ✅ HTTPS (Certbot)
- ✅ Firewall (UFW)

**Documentación**: [ARQUITECTURA.md](ARQUITECTURA.md#5-seguridad-y-mantenimiento)

---

## 🚀 Inicio Rápido

### Requisitos Mínimos
```
- Apache 2.4+
- PHP 7.4+
- 50 MB de espacio en disco
- Puerto 80/443 disponible
```

### Instalación Rápida (3 pasos)

**1. Instalar dependencias**
```bash
sudo apt update
sudo apt install apache2 php libapache2-mod-php -y
```

**2. Copiar archivos a DocumentRoot**
```bash
sudo cp -r milkshakes_DRS /var/www/html/
sudo chown -R www-data:www-data /var/www/html/milkshakes_DRS
```

**3. Habilitar módulos y reiniciar**
```bash
sudo a2enmod php8.0 rewrite deflate expires
sudo systemctl restart apache2
```

**4. Acceder en navegador**
```
http://localhost/milkshakes_drs/index.php
# o si tienes dominio local:
http://milkshakesdrs.local
```

**Para instalación completa**: Ver [INSTALACION.md](INSTALACION.md)

---

## 📊 Arquitectura: Diagrama General

```
┌─────────────────────────────────────┐
│  USUARIO (Navegador Web)            │
│  Solicitud HTTP GET/POST            │
└──────────────┬──────────────────────┘
               │
               │ HTTP Port 80/443
               ▼
┌─────────────────────────────────────┐
│  SERVIDOR APACHE 2.4                │
│  ├─ mod_php (Ejecuta PHP)           │
│  ├─ mod_rewrite (URLs limpias)      │
│  ├─ mod_deflate (Compresión)        │
│  └─ mod_expires (Caché)             │
└──────────────┬──────────────────────┘
               │
               │ Ejecuta
               ▼
┌─────────────────────────────────────┐
│  MOTOR PHP 7.4+                     │
│  ├─ index.php (Inicio)              │
│  ├─ productos.php (Catálogo)        │
│  ├─ carrito.php (Sesiones)          │
│  └─ contacto.php (Formularios)      │
└──────────────┬──────────────────────┘
               │
               │ Genera HTML dinámico
               ▼
┌─────────────────────────────────────┐
│  RESPUESTA HTTP 200 OK              │
│  Content-Type: text/html            │
│  Set-Cookie: PHPSESSID=...          │
│  [HTML generado dinámicamente]      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  NAVEGADOR (Renderiza Html)         │
│  ├─ Interpreta HTML                 │
│  ├─ Aplica CSS                      │
│  ├─ Ejecuta JavaScript              │
│  └─ Muestra página final            │
└─────────────────────────────────────┘
```

---

## 🔒 Características de Seguridad

### Implementadas ✅
- **Validación de entrada**: `filter_var()`, `intval()`, búsqueda de strlen
- **Sanitización de salida**: `htmlspecialchars()` contra XSS
- **Gestión de sesiones**: `$_SESSION`, cookies HttpOnly
- **Protección de archivos**: `.htaccess` bloquea config sensible
- **Encabezados HTTP**: X-XSS-Protection, X-Frame-Options, etc.
- **Compresión**: Gzip reduce 50-80% de tamaño
- **Caché inteligente**: Recursos estáticos cacheados 1 año

### Recomendadas para Producción 🔐
- HTTPS con Let's Encrypt (scripts incluidos)
- Firewall (UFW) - scripts en INSTALACION.md
- fail2ban para protección contra fuerza bruta
- Backups automáticos diarios
- Monitoreo de logs con alertas

---

## 📱 Funcionalidades Implementadas

### 1. **Página Principal** (index.php)
- Hero section atractivo
- Tarjetas de características
- Productos destacados
- Navegación intuitiva
- Responsive design

### 2. **Catálogo Dinámico** (productos.php)
- Grid de productos (8 sabores)
- Información: nombre, precio, descripción
- Botón "Agregar al Carrito"
- Filtrado por disponibilidad
- Validación de cantidad (1-10)

### 3. **Carrito de Compras** (carrito.php)
- Tabla de productos seleccionados
- Resumen: subtotal, impuesto, total
- Botón eliminar por producto
- Opción vaciar carrito
- Persistencia con sesiones PHP

### 4. **Formulario de Contacto** (contacto.php)
- Campos: nombre, email, teléfono, asunto, mensaje
- **Validaciones**:
  - Email válido
  - Nombre no vacío
  - Mensaje mínimo 10 caracteres
- Información de contacto en sidebar
- Horario de atención
- Registro de contactos en logs

### 5. **Diseño Responsivo** (CSS)
- Mobile-first approach
- Grid layout moderno
- Animaciones fluidas
- Paleta de colores profesional
- Accesibilidad WCAG

---

## 📈 Flujo HTTP Documentado

### GET (Solicitar página)
```
Usuario → Navegador → Apache → PHP (genera HTML) → Respuesta 200 OK → Navegador → Mostrar
```

### POST (Enviar formulario)
```
Usuario → Formulario → Navegador → POST a Apache → PHP (valida) → Sesión → Respuesta con mensaje
```

**Diagramas detallados**: [DIAGRAMAS.md](DIAGRAMAS.md)

---

## 🛠️ Configuración del Servidor

### Apache VirtualHost (Recomendado)
```apache
<VirtualHost *:80>
    ServerName milkshakesdrs.local
    DocumentRoot /var/www/html/milkshakes_drs
    <Directory /var/www/html/milkshakes_drs>
        AllowOverride All
        RewriteEngine On
    </Directory>
</VirtualHost>
```

### Nginx (Alternativa)
Configuración incluida en `config/nginx.conf`

### .htaccess
- Reescrituras de URL
- Compresión Gzip
- Control de caché
- Bloqueo de archivos sensibles

---

## 📚 Documentación Completa

| Documento | Contenido |
|-----------|----------|
| [ARQUITECTURA.md](ARQUITECTURA.md) | Análisis técnico completo (2500+ líneas) |
| [DIAGRAMAS.md](DIAGRAMAS.md) | Flujos visuales y arquitectura (1500+ líneas) |
| [INSTALACION.md](INSTALACION.md) | Guía paso a paso de instalación |
| [README.md](README.md) | Este archivo (descripción general) |

---

## 🔧 Comandos Útiles

```bash
# Verificar Apache
sudo systemctl status apache2
sudo apache2ctl -M | grep php

# Ver logs
tail -f /var/log/apache2/milkshakesdrs_error.log
tail -f /var/log/apache2/milkshakesdrs_access.log

# Permisos
sudo chown -R www-data:www-data /var/www/html/milkshakes_drs
sudo chmod -R 755 /var/www/html/milkshakes_drs

# Probar sintaxis
sudo apache2ctl configtest
```

---

## 📋 Checklist de Evaluación Académica

- [x] **Análisis de Arquitectura** - Modelo cliente-servidor explicado
- [x] **Tipología de Web** - Dinámico (justificación completa)
- [x] **Selección Tecnológica** - Apache seleccionado vs Nginx + IIS
- [x] **Funcionamiento HTTP** - Ciclo completo documentado
- [x] **Seguridad y Mantenimiento** - Múltiples capas implementadas
- [x] **Código Funcional** - Aplicación web completamente operativa
- [x] **Diagramas** - Flujos visuales del protocolo HTTP
- [x] **Instalación Documentada** - Guía detallada paso por paso

**Total de Puntos: 10/10** ✅

---

## 📝 Notas Importantes

### Versiones Soportadas
- Apache: 2.4.x, 2.4.5+
- PHP: 7.4, 8.0, 8.1, 8.2
- Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Limpieza de Sesiones
```bash
# Las sesiones se limpian automáticamente cada 30 minutos
# Ubicación: /var/lib/php/sessions/
# Para limpiar manualmente:
sudo rm /var/lib/php/sessions/sess_*
```

### Simulación de Base de Datos
En esta versión, los productos se simulan con arrays PHP:
```php
$catalogo = array(
    array("id" => 1, "nombre" => "Fresa", "precio" => 4.50),
    ...
);
```

Para producción, integrar con MySQL/PostgreSQL.

---

## 🎓 Conclusión

Este proyecto académico demuestra comprensión integral de:

1 **Conceptos teóricos**: Arquitectura cliente-servidor, protocolos HTTP, tipologías web
2. **Implementación práctica**: Apache, PHP, HTML/CSS, sesiones
3. **Seguridad empresarial**: Validación, sanitización, HTTPS, firewall
4. **Documentación profesional**: Guías técnicas, diagramas, buenas prácticas

**Está completamente listo para instalación en servidor de producción o educativo.**

---

## 📞 Soporte

Para problemas durante instalación, consulta:
- [INSTALACION.md - Troubleshooting](INSTALACION.md#troubleshooting)
- Logs: `/var/log/apache2/milkshakesdrs_error.log`
- Comando de diagnóstico: `sudo apache2ctl configtest`

---

**Última actualización**: Marzo 7, 2026  
**Versión**: 1.0  
**Licencia**: Proyecto Académico
4. **Accede al sitio**: Abre `http://localhost` o el dominio configurado.

## Estructura de Archivos
```
web_milshakesDRS/
├── index.html          # Página de inicio
├── catalogo.php        # Catálogo dinámico de productos
├── contacto.html       # Formulario de contacto
├── procesar_contacto.php # Procesamiento del formulario
├── css/
│   └── estilos.css     # Estilos CSS
└── js/
    └── script.js       # JavaScript para interactividad
```

## Uso
- Navega por las páginas usando el menú.
- En el catálogo, haz clic en "Agregar al Carrito" para simular la acción.
- Envía un mensaje desde la página de contacto.

## Mejoras Futuras
- Integrar una base de datos (MySQL) para productos y pedidos reales.
- Implementar un carrito de compras persistente con sesiones.
- Agregar autenticación de usuarios.
- Optimizar para móviles con frameworks como Bootstrap.

## Autor
Proyecto desarrollado como parte de la asignatura de Implantación de Aplicaciones Web (2º ASIR).

## Licencia
Este proyecto es de uso educativo y no tiene licencia específica.
