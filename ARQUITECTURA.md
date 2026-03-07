# Arquitectura del Proyecto Milkshakes DRS

## 1. Análisis de Arquitectura: Modelo Cliente-Servidor

### Descripción General
El proyecto Milkshakes DRS implementa un modelo de arquitectura **cliente-servidor** donde:

- **Cliente**: Navegador web del usuario (Chrome, Firefox, Safari, etc.)
- **Servidor Web**: Apache HTTP Server con módulo PHP
- **Back-end**: PHP para procesar lógica de negocio
- **Front-end**: HTML5, CSS3, JavaScript

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                        USUARIO FINAL                         │
│                     (Navegador Web)                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Request/Response
                           │ (Puerto 80/443)
┌──────────────────────────▼──────────────────────────────────┐
│                   SERVIDOR WEB (Apache)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Recibe petición HTTP                                 │ │
│  │  Identifica recurso solicitado                       │ │
│  │  Si es .php → Ejecuta PHP                           │ │
│  │  Si es .html, .css, .js → Sirve directamente        │ │
│  │  Devuelve respuesta HTTP                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Módulos Habilitados:                                       │
│  - mod_php: Procesa código PHP                             │
│  - mod_rewrite: Reescrituras de URL                        │
│  - mod_ssl: HTTPS (opcional)                               │
│  - mod_deflate: Compresión Gzip                            │
│  - mod_expires: Control de caché                           │
└──────────────────────────┬───────────────────────────────────┘
                           │ Datos procesados
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              MOTOR DE PHP / LÓGICA DE APLICACIÓN             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  index.php      - Página principal                    │ │
│  │  productos.php  - Catálogo dinámico                   │ │
│  │  carrito.php    - Gestión de compras                  │ │
│  │  contacto.php   - Formulario con validación           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Funcionalidades:                                            │
│  - Procesamiento de sesiones ($_SESSION)                   │
│  - Validación de formularios                               │
│  - Generación dinámica de contenido HTML                   │
└──────────────────────────────────────────────────────────────┘
```

### Flujo de Datos en la Arquitectura

1. **Datos Estáticos** (HTML, CSS, JavaScript):
   - Se almacenan en el disco del servidor
   - Apache los sirve directamente al navegador
   - No requieren procesamiento

2. **Datos Dinámicos** (Catálogo de productos, carrito):
   - Se generan en tiempo real con PHP
   - Utilizan arrays simulando base de datos
   - Se personalizan según la sesión del usuario

3. **Sesiones de Usuario**:
   - El carrito de compras se almacena en `$_SESSION['carrito']`
   - Se mantiene entre solicitudes usando cookies de sesión
   - Cada usuario tiene su propia sesión aislada

---

## 2. Tipología de Web: Sitio Dinámico

### ¿Por qué DINÁMICO y no ESTÁTICO?

**Requisitos del Cliente (Tienda de Milkshakes):**
- ✅ Catálogo de productos que puede cambiar frecuentemente
- ✅ Carrito de compras personalizado por usuario
- ✅ Formulario de contacto que registra datos
- ✅ Experiencia interactiva para el cliente
- ✅ Necesidad de actualizar precios sin modificar HTML

**Comparativa:**

| Aspecto | Sitio Estático | Sitio Dinámico | Milkshakes DRS |
|---------|----------|----------|---------|
| Contenido | Fijo, no cambia | Variable, genera en tiempo real | ✅ Dinámico |
| Carrito de compras | Imposible | Posible con sesiones | ✅ Implementado |
| Base de datos | No | Sí (SQL) | ✅ Simulada (arrays PHP) |
| Formularios | No interactivos | Validados y procesados | ✅ Con validación |
| Velocidad | Muy rápida | Más lenta (procesamiento) | Ajustado con caché |
| Costo servidor | Bajo | Medio-Alto | Bajo (servidor dedicado) |
| Escalabilidad | Alta | Depende configuración | Buena para local |

**Conclusión:** La tienda REQUIERE un sitio dinámico para ofrecer funcionalidades esenciales como:
- Gestión de inventario
- Carrito de compras
- Formularios de contacto
- Personalización por usuario

---

## 3. Selección Tecnológica: Apache HTTP Server

### Opciones Evaluadas

#### Apache HTTP Server ✅ SELECCIONADO
```
Características:
├─ Ventajas:
│  ├─ Excelente soporte para módulos (mod_php, mod_rewrite, mod_security)
│  ├─ Documentación abundante y comunidad activa
│  ├─ Compatible con PHP, Perl, Python
│  ├─ Flexible en configuración (VirtualHosts, .htaccess)
│  ├─ Seguridad robusta con actualizaciones frecuentes
│  ├─ Soporta múltiples sistemas operativos
│  └─ Ideal para un desarrollo local y pequeños proyectos
│
└─ Desventajas:
   ├─ Mayor consumo de memoria (multiproceso)
   ├─ Rendimiento inferior en tráfico muy alto
   └─ Configuración más compleja que Nginx

Justificación para Milkshakes DRS:
→ Un negocio local con tráfico moderado no necesita optimizaciones extremas.
→ La flexibilidad de Apache es más valiosa que el rendimiento puro.
→ mod_php simplifica la ejecución de PHP (sin FPM adicional).
```

#### Nginx (Alternativa desestimada)
```
Características:
├─ Ventajas:
│  ├─ Alto rendimiento y bajo consumo de memoria
│  ├─ Excelente para aplicaciones web modernas
│  ├─ Mejor manejo de conexiones concurrentes
│  └─ Configuración más limpia (basada en bloques)
│
└─ Desventajas:
   ├─ No tiene módulos dinámicos como Apache
   ├─ Requiere configuración PHP-FPM separada
   ├─ Menos flexible para desarrolladores principiantes
   └─ Configuración de reescrituras más compleja

Caso de Uso: Proyectos de gran escala, aplicaciones Node.js
No seleccionado para Milkshakes DRS porque la simplicidad de Apache es superior.
```

#### IIS (Internet Information Services) (No seleccionado)
```
Características:
├─ Ventajas:
│  ├─ Integración perfecta con Windows Server
│  ├─ Excelente soporte ASP.NET
│  ├─ Interfaz gráfica intuitiva
│  └─ Seguridad integrada con Active Directory
│
└─ Desventajas:
   ├─ Costo de licenciamiento (Windows Server + SQL Server)
   ├─ Complejidad para proyectos pequeños
   ├─ Menor portabilidad (solo Windows)
   ├─ PHP no es el lenguaje nativo (es ASP.NET)
   └─ Sobreingeniería para una tienda local
```

### Resumen: ¿Por qué Apache?

| Criterio | Apache | Nginx | IIS |
|----------|--------|-------|-----|
| Facilidad de uso | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Costo | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Flexibilidad | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Rendimiento | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Soporte PHP | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **TOTAL** | **21** | **19** | **15** |

→ **Apache es la mejor opción para este proyecto académico y comercial local.**

---

## 4. Funcionamiento del Protocolo HTTP

### Ciclo Completo de una Solicitud

```
PASO 1: USUARIO ABRE EL NAVEGADOR
─────────────────────────────────────

Usuario escribe: http://milkshakesdrs.local/
                 (o hace clic en un enlace)

                           ↓

PASO 2: NAVEGADOR RESUELVE DOMINIO (DNS)
─────────────────────────────────────

Navegador consulta: ¿Qué IP corresponde a "milkshakesdrs.local"?
Respuesta DNS: 127.0.0.1 (localhost) o IP del servidor

                           ↓

PASO 3: NAVEGADOR ABRE CONEXIÓN TCP
─────────────────────────────────────

Establece conexión con: 127.0.0.1:80 (HTTP)
                    o  127.0.0.1:443 (HTTPS)

                           ↓

PASO 4: NAVEGADOR ENVÍA SOLICITUD HTTP GET
─────────────────────────────────────

GET / HTTP/1.1
Host: milkshakesdrs.local
User-Agent: Mozilla/5.0...
Accept: text/html, application/xhtml+xml...
Accept-Encoding: gzip, deflate
Cookie: PHPSESSID=abc123xyz...
Connection: keep-alive

                           ↓

PASO 5: SERVIDOR APACHE RECIBE LA SOLICITUD
─────────────────────────────────────

Apache escucha en puerto 80, recibe GET /
├─ Identifica: Dominio → milkshakesdrs.local
├─ Busca VirtualHost correspondiente
├─ DocumentRoot: /var/www/html/milkshakes_drs
├─ Archivo solicitado: /index.php
└─ Verifica permisos (Usuario www-data)

                           ↓

PASO 6: APACHE DETERMINA TIPO DE ARCHIVO
─────────────────────────────────────

¿Extensión .php?
├─ SÍ → Ejecutar módulo mod_php
├─ Carga archivo: /var/www/html/milkshakes_drs/index.php
└─ NO → Servir directamente (CSS, JS, imágenes)

                           ↓

PASO 7: MOTOR PHP PROCESA index.php
─────────────────────────────────────

<?php
session_start();                    // Inicia sesión
if (!isset($_SESSION['carrito'])) {
    $_SESSION['carrito'] = array(); // Inicializa carrito
}
// Genera HTML dinámicamente
echo '<h1>Bienvenido a Milkshakes DRS</h1>';
?>

                           ↓

PASO 8: SERVIDOR GENERA RESPUESTA HTTP
─────────────────────────────────────

HTTP/1.1 200 OK
Server: Apache/2.4.x (Ubuntu)
Content-Type: text/html; charset=UTF-8
Content-Length: 15234
Cache-Control: public, max-age=3600
Set-Cookie: PHPSESSID=abc123xyz...; path=/; HttpOnly
Connection: keep-alive

<!DOCTYPE html>
<html>
<head>
    <title>Milkshakes DRS</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Bienvenido a Milkshakes DRS</h1>
    ...
</body>
</html>

                           ↓

PASO 9: NAVEGADOR RECIBE RESPUESTA
─────────────────────────────────────

├─ Analiza código HTTP (200 OK = éxito)
├─ Guarda cookies de sesión
├─ Procesa HTML
└─ Solicita recursos adicionales (CSS, JS, imágenes)

                           ↓

PASO 10: NAVEGADOR SOLICITA RECURSOS ADICIONALES
─────────────────────────────────────

GET /css/style.css HTTP/1.1
GET /js/app.js HTTP/1.1
GET /images/fresa.png HTTP/1.1
...
(Apache sirve directamente sin procesar PHP)

                           ↓

PASO 11: NAVEGADOR RENDERIZA PÁGINA
─────────────────────────────────────

1. Interpreta HTML
2. Aplica estilos CSS
3. Ejecuta JavaScript
4. Carga imágenes
5. Muestra página interactiva al usuario

                           ↓

USUARIO VE:
═════════════════════════════════════

┌──────────────────────────────────┐
│  🥤 MILKSHAKES DRS               │
│  ────────────────────────────────│
│  [Inicio] [Catálogo] [Carrito]   │
│  ────────────────────────────────│
│  ¡Bienvenido a Milkshakes DRS!   │
│  Los mejores milkshakes...       │
│  ────────────────────────────────│
│  [Explorar Catálogo]             │
└──────────────────────────────────┘
```

### Casos de Uso Específicos en la Aplicación

#### A) Solicitud de Página Estática (GET /css/style.css)
```
Usuario hace clic → Navegador Solicita CSS
                  ↓
           Apache recibe GET /css/style.css
                  ↓
           No es archivo PHP, sirve directamente
                  ↓
           HTTP 200 OK + Contenido CSS
                  ↓
           Navegador aplica estilos
```

#### B) Solicitud de Página Dinámica (GET /productos.php)
```
Usuario hace clic en "Catálogo" → GET /productos.php
                  ↓
           Apache receibe, encuentra mod_php
                  ↓
           PHP ejecuta productos.php:
           - Carga array $catalogo
           - Genera <div> para cada producto
           - Consulta $_SESSION['carrito']
           - Genera HTML dinámico
                  ↓
           HTTP 200 OK + HTML generado dinámicamente
                  ↓
           Navegador muestra catálogo actualizado
```

#### C) Envío de Formulario (POST /contacto.php)
```
Usuario llena formulario → Click "Enviar"
                  ↓
           Navegador hace POST /contacto.php:
           POST /contacto.php HTTP/1.1
           Content-Type: application/x-www-form-urlencoded
           
           nombre=Juan&email=juan@example.com
           &asunto=consulta&mensaje=Hola...
                  ↓
           PHP Procesa:
           - Valida datos ($_POST)
           - Verifica email válido
           - Guarda en log o BD
           - Genera respuesta de confirmación
                  ↓
           HTTP 200 OK + Página de confirmación
                  ↓
           Usuario ve: "¡Gracias por tu mensaje!"
```

#### D) Agregar Producto al Carrito (POST /productos.php)
```
Usuario selecciona cantidad y da clic "Agregar al Carrito"
                  ↓
           POST /productos.php
           producto_id=1&cantidad=2&agregar_carrito=1
                  ↓
           PHP Procesa:
           - Lee $POST['producto_id'] = 1
           - Lee $_POST['cantidad'] = 2
           - Busca producto en array $catalogo
           - Agrega a $_SESSION['carrito'][]
                  ↓
           HTTP 200 OK + Página actualizada
           + Mensaje: "¡Producto agregado al carrito!"
                  ↓
           Navegador actualiza contador de carrito
           (Ahora muestra: Carrito (2) en lugar de (1))
```

### Códigos de Estado HTTP Utilizados

| Código | Significado | Causa en la App |
|--------|————————————|——————————————|
| **200** | OK | Solicitud exitosa, recurso encontrado |
| **404** | Not Found | Archivo no existe (usuario solicita página inexistente) |
| **500** | Server Error | Error en código PHP |
| **301/302** | Redirección | Reescritura de URLs (.htaccess) |
| **304** | Not Modified | Recurso cacheado (no descargar nuevamente) |

---

## 5. Seguridad y Mantenimiento

### Medidas de Seguridad Implementadas

#### 1. **Validación de Entrada (input validation)**
```php
// contacto.php
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = "El email debe ser válido";
}
// Previene emails inválidos
```

#### 2. **Sanitización de Salida (output sanitization)**
```php
echo htmlspecialchars($producto['nombre']);
// Previene XSS (Cross-Site Scripting)
// Convierte: <script>alert('hack')</script>
//       a: &lt;script&gt;alert('hack')&lt;/script&gt;
```

#### 3. **Control de Sesiones**
```php
session_start();
// use $_SESSION para datos de confianza
$_SESSION['carrito'];  // ✅ Seguro
$_GET['id'];           // ⚠️ Validar siempre
```

#### 4. **Protección de Archivos Sensibles (.htaccess)**
```apache
<FilesMatch "\.env$|config\.php$">
    Order allow, deny
    Deny from all
</FilesMatch>
# Impide acceso directo a archivos de configuración
```

#### 5. **Encabezados de Seguridad (Apache)**
```apache
Header set X-XSS-Protection "1; mode=block"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
```

#### 6. **Compresión y Compactación**
```apache
AddOutputFilterByType DEFLATE text/html text/css application/javascript
# Comprime HTML, CSS, JS → reduce tamaño transferencia
```

#### 7. **Control de Caché**
```apache
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType text/css "access plus 1 month"
# Evita descargas innecesarias
```

### Buenas Prácticas de Mantenimiento

#### 1. **Copias de Seguridad Regulares**

```bash
# Script de respaldo diario (crontab)
0 2 * * * /usr/local/bin/backup-milkshakes.sh

# Contenido de backup-milkshakes.sh:
#!/bin/bash
BACKUP_DIR="/backups"
SOURCE="/var/www/html/milkshakes_drs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

tar -czf $BACKUP_DIR/milkshakes_$TIMESTAMP.tar.gz $SOURCE
find $BACKUP_DIR -name "milkshakes_*.tar.gz" -mtime +30 -delete
# Mantiene solo último mes de respaldos
```

#### 2. **Actualizaciones de Seguridad**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade apache2 php
sudo systemctl restart apache2

# Verificar versión
apache2 -v
php -v

# Monitoreo de vulnerabilidades
# Suscribirse a: security.ubuntu.com
# Recibir alertas de CVE (Common Vulnerabilities and Exposures)
```

#### 3. **Monitoreo de Logs**

```bash
# Ver errores en tiempo real
tail -f /var/log/apache2/milkshakesdrs_error.log

# Buscar intentos de acceso sospechosos
grep "403\|404\|500" /var/log/apache2/milkshakesdrs_access.log

# Análisis de acceso por IP
awk '{print $1}' /var/log/apache2/milkshakesdrs_access.log | sort | uniq -c | sort -rn | head -10
```

#### 4. **Permisos de Archivo Correctos**

```bash
# Directorios: 755 (rwxr-xr-x)
find /var/www/html/milkshakes_drs -type d -exec chmod 755 {} \;

# Archivos: 644 (rw-r--r--)
find /var/www/html/milkshakes_drs -type f -exec chmod 644 {} \;

# Archivos PHP ejecutables: 744
find /var/www/html/milkshakes_drs -type f -name "*.php" -exec chmod 744 {} \;

# Owner: usuario www-data (Apache)
sudo chown -R www-data:www-data /var/www/html/milkshakes_drs
```

#### 5. **Monitoreo del Servidor (fail2ban)**

```bash
# Instalar
sudo apt install fail2ban

# Configurar para Apache
sudo nano /etc/fail2ban/jail.local

# Ejemplo:
[DEFAULT]
bantime = 3600        # Ban durante 1 hora
maxretry = 5          # 5 intentos fallidos = ban
findtime = 600        # En 10 minutos

[sshd]
enabled = true

[apache-auth]
enabled = true

[apache-http-auth]
enabled = true

# Iniciar
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

#### 6. **HTTPS con Let's Encrypt**

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-apache

# Generar certificado
sudo certbot --apache -d milkshakesdrs.local -d www.milkshakesdrs.local

# Renovación automática
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar (cada 60 días)
sudo certbot renew --dry-run
```

#### 7. **Configuración de Firewall**

```bash
# UFW (Uncomplicated Firewall)
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir Apache
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Permitir SSH (importante para acceso remoto)
sudo ufw allow 22/tcp

# Ver estado
sudo ufw status
```

#### 8. **Incremento de Rendimiento**

```apache
# Habilitar Keep-Alive (reutilizar conexión)
KeepAlive On
KeepAliveTimeout 5

# Compresión Gzip
mod_deflate habilitado ✅

# Caché HTTP
mod_expires habilitado ✅

# Limitar conexiones
MaxConnectionsPerChild 256
```

#### 9. **Auditoría de Base de Datos (Simulada)**

```php
// logs/contactos.log
[2026-03-07 14:32:15] Juan | juan@email.com | Consulta sobre precios
[2026-03-07 14:45:22] María | maria@email.com | Sugerencia de producto

// Revisar regularmente para identificar patrones
```

#### 10. **Documentación y Capacitación**

- Mantener documentación actualizada de configuración
- Capacitar al personal en cambios de contraseña mensual
- Crear runbooks para emergencias (restauración de backups, etc.)

---

## Conclusiones

✅ **Arquitectura**: Modelo cliente-servidor bien definido con separación clara de responsabilidades

✅ **Tipología**: Sitio dinámico necesario para funcionalidades de negocio (carrito, catálogo)

✅ **Tecnología**: Apache + PHP es la mejor opción para proyecto académico y comercial local

✅ **HTTP**: Protocolo implementado correctamente con validaciones y generación de contenido dinámico

✅ **Seguridad**: Múltiples capas de protección: validación, sanitización, permisos, backups, firewalls

→ **El proyecto está listo para producción en un servidor local empresarial.**
