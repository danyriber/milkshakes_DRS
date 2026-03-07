# Diagramas de Flujo - Milkshakes DRS

## 1. Diagrama de Flujo HTTP Completo

```
   ┌─────────────────────────────────────────────────────────────────┐
   │                      USUARIO EN NAVEGADOR                        │
   │                    (http://milkshakesdrs.local)                  │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 1. USUARIO ESCRIBE URL O HACE CLIC
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │                    DNS RESOLUTION (0.1s)                         │
   │  "milkshakesdrs.local" → 127.0.0.1 (localhost)                 │
   │  (o IP real en producción)                                      │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 2. RESUELVE DIRECCIÓN IP
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │              TCP HANDSHAKE (3-way) (10-50ms)                     │
   │         Navegador ←→ Servidor en Puerto 80                       │
   │         SYN → SYN-ACK → ACK (conexión establecida)             │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 3. CONEXIÓN ESTABLECIDA
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │         NAVEGADOR ENVÍA SOLICITUD HTTP GET/POST                  │
   │  ┌────────────────────────────────────────────────────────────┐ │
   │  │ GET /index.php HTTP/1.1                                   │ │
   │  │ Host: milkshakesdrs.local                                 │ │
   │  │ User-Agent: Mozilla/5.0 (Chrome 90.0)                    │ │
   │  │ Accept: text/html, application/xhtml+xml                 │ │
   │  │ Accept-Encoding: gzip, deflate, br                       │ │
   │  │ Accept-Language: es-ES, es;q=0.9                         │ │
   │  │ Connection: keep-alive                                    │ │
   │  │ Cookie: PHPSESSID=abc123xyz789                           │ │
   │  │                                                            │ │
   │  └────────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 4. NAVEGADOR ENVÍA SOLICITUD
                                │ (aprox 500 bytes)
                                │
                ┌───────────────▼───────────────┐
                │                               │
                │    SERVIDOR WEB (APACHE)      │
                │      Puerto 80 (escucha)      │
                │                               │
                └───────────────┬───────────────┘
                                │
                                │ 5. APACHE RECIBE SOLICITUD
                                │
   ┌────────────────────────────▼──────────────────────────────────┐
   │ APACHE ANALIZA SOLICITUD                                      │
   │ ├─ Extrae método: GET                                         │
   │ ├─ Extrae ruta: /index.php                                   │
   │ ├─ Extrae host: milkshakesdrs.local                          │
   │ ├─ Busca VirtualHost correspondiente                          │
   │ ├─ DocumentRoot: /var/www/html/milkshakes_drs                │
   │ ├─ Archivo solicitado: /var/www/html/
   │ │                       milkshakes_drs/index.php             │
   │ └─ Verifica permisos (www-data: rw)                          │
   └────────────────────────────┬──────────────────────────────────┘
                                │
                                │ 6. APACHE DETERMINA TIPO
                                │
   ┌────────────────────────────▼──────────────────────────────────┐
   │ EXTENSIÓN = .php                                              │
   │                                                                │
   │ SÍ → EJECUTAR CON MOD_PHP ↓                                   │
   │       (No si es .css, .js, .png, etc.)                       │
   └────────────────────────────┬──────────────────────────────────┘
                                │
                                │ 7. CARGAR Y EJECUTAR PHP
                                │
   ┌────────────────────────────▼──────────────────────────────────┐
   │ MOD_PHP EJECUTA index.php                                     │
   │  ┌──────────────────────────────────────────────────────────┐ │
   │  │ <?php                                                   │ │
   │  │ session_start();  // Recupera sesión del cliente       │ │
   │  │                                                         │ │
   │  │ if (!isset($_SESSION['carrito'])) {                   │ │
   │  │     $_SESSION['carrito'] = array();                   │ │
   │  │ }                                                       │ │
   │  │                                                         │ │
   │  │ // Genera HTML dinámicamente                          │ │
   │  │ ?>                                                      │ │
   │  │                                                         │ │
   │  │ <!DOCTYPE html>                                        │ │
   │  │ <html>                                                 │ │
   │  │   <h1>Bienvenido a Milkshakes DRS</h1>              │ │
   │  │   <p>Los mejores milkshakes...</p>                  │ │
   │  │ </html>                                               │ │
   │  └──────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬──────────────────────────────────┘
                                │
                                │ 8. APACHE COMPILA RESPUESTA
                                │
   ┌────────────────────────────▼──────────────────────────────────┐
   │ APACHE COMPILA RESPUESTA HTTP                                 │
   │  ┌──────────────────────────────────────────────────────────┐ │
   │  │ HTTP/1.1 200 OK                                         │ │
   │  │ Server: Apache/2.4.41 (Ubuntu)                          │ │
   │  │ Date: Fri, 07 Mar 2026 14:30:00 GMT                    │ │
   │  │ Content-Type: text/html; charset=UTF-8                 │ │
   │  │ Content-Length: 15234                                   │ │
   │  │ Cache-Control: public, max-age=3600                    │ │
   │  │ X-XSS-Protection: 1; mode=block                       │ │
   │  │ X-Frame-Options: SAMEORIGIN                            │ │
   │  │ Set-Cookie: PHPSESSID=xyz789abc...; Path=/;            │ │
   │  │             HttpOnly; SameSite=Strict                  │ │
   │  │ Connection: keep-alive                                  │ │
   │  │ Transfer-Encoding: gzip                                │ │
   │  │                                                         │ │
   │  │ <!DOCTYPE html>                                        │ │
   │  │ [CONTENIDO HTML GENERADO]                             │ │
   │  │ ...                                                     │ │
   │  └──────────────────────────────────────────────────────────┘ │
   └────────────────────────────┬──────────────────────────────────┘
                                │
                                │ 9. APACHE ENVÍA RESPUESTA
                                │ (aprox 15KB, comprimida a 3KB)
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │                      NAVEGADOR RECIBE RESPUESTA                  │
   │                  HTTP/1.1 200 OK (100ms desde inicio)            │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 10. NAVEGADOR PROCESA RESPUESTA
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │ NAVEGADOR                                                        │
   │  ├─ Analiza código de estado: 200 = ÉXITO ✓                    │
   │  ├─ Guarda cookie PHPSESSID (para próximas solicitudes)        │
   │  ├─ Descomprime contenido (gzip)                                │
   │  ├─ Interpreta HTML                                             │
   │  ├─ Identifica recursos adicionales:                            │
   │  │  ├─ css/style.css                                            │
   │  │  ├─ js/app.js                                                │
   │  │  └─ images/*.png                                             │
   │  └─ Solicita cada recurso con GET separate                      │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
      ┌─────────▼─────────┐        ┌───────────▼──────────┐
      │ GET /css/style.css│        │ GET /images/fresa.png│
      │                   │        │                      │
      │ HTTP 200 OK       │        │ HTTP 200 OK          │
      │ (Apache sirve     │        │ (Directo, sin PHP)   │
      │  directamente)    │        │                      │
      └───────────────────┘        └──────────────────────┘
                │                               │
                └───────────────┬───────────────┘
                                │
                                │ 11. NAVEGADOR RENDERIZA PÁGINA
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │  NAVEGADOR PROCESA HTML, CSS, JS                                │
   │  ├─ Aplica estilos CSS                                          │
   │  ├─ Carga imágenes                                              │
   │  ├─ Ejecuta JavaScript                                          │
   │  └─ Dibuja página en pantalla                                   │
   └────────────────────────────┬────────────────────────────────────┘
                                │
                                │ 12. USUARIO VE PÁGINA FINAL
                                │
   ┌────────────────────────────▼────────────────────────────────────┐
   │                   ┌──────────────────────────┐                  │
   │                   │  🥤 MILKSHAKES DRS      │                  │
   │                   │  ────────────────────────│                  │
   │                   │ [Inicio] [Catálogo] ... │                  │
   │                   │                          │                  │
   │                   │ ¡Bienvenido!            │                  │
   │                   │ Los mejores milkshakes  │                  │
   │                   │ [Explorar Catálogo]     │                  │
   │                   └──────────────────────────┘                  │
   │            TIEMPO TOTAL desde URL: ~500-1000ms                 │
   └────────────────────────────────────────────────────────────────┘
```

---

## 2. Diagrama de Arquitectura Detallada

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USUARIO (CLIENTE)                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Navegador Web (Chrome, Firefox, Safari, Edge)              │   │
│  │  ├─ Stack HTTP/HTTPS                                        │   │
│  │  ├─ Interprete HTML/CSS/JavaScript                          │   │
│  │  ├─ Motor de renderizado                                    │   │
│  │  └─ Cookie + Session Storage                               │   │
│  └──────────────────────────────┬────────────────────────────┘   │
└─────────────────────────────────┼────────────────────────────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │ HTTP Request   │ HTTP Response  │
                 │ (JSON/Form)    │ (HTML/JSON)    │
                 │                │                │
   ┌─────────────▼────────────────▼────────────────────────────────┐
   │                      SERVIDOR WEB                             │
   │                     (APACHE 2.4)                              │
   │                                                                │
   │  ┌──────────────────────────────────────────────────────────┐ │
   │  │  HTTPD Daemon (escucha puerto 80/443)                   │ │
   │  │  ├─ Procesos/Threads de trabajo                         │ │
   │  │  ├─ Gestor de conexiones                                │ │
   │  │  └─ Cola de solicitudes                                 │ │
   │  └──────────────────────────────────────────────────────────┘ │
   │                              │ (rutea a módulos)              │
   │  ┌──────────────────────────▼──────────────────────────────┐  │
   │  │  MÓDULOS APACHE HABILITADOS                             │  │
   │  │  ├─ mod_php: Ejecuta código PHP                         │  │
   │  │  ├─ mod_rewrite: Reescrituras de URLs amigables         │  │
   │  │  ├─ mod_ssl: Soporte HTTPS (opcional)                  │  │
   │  │  ├─ mod_deflate: Compresión Gzip de contenido          │  │
   │  │  ├─ mod_expires: Control de caché HTTP                 │  │
   │  │  ├─ mod_security: Firewall de aplicación               │  │
   │  │  └─ mod_headers: Encabezados de seguridad              │  │
   │  └──────────────────────────┬──────────────────────────────┘  │
   │                              │                                │
   │  ┌──────────────────────────▼──────────────────────────────┐  │
   │  │  SISTEMAS DE ARCHIVOS                                   │  │
   │  │  /var/www/html/milkshakes_drs/                         │  │
   │  │  ├─ index.php (Página principal - DINÁMICA)            │  │
   │  │  ├─ productos.php (Catálogo - DINÁMICA)                │  │
   │  │  ├─ carrito.php (Carrito - DINÁMICA)                   │  │
   │  │  ├─ contacto.php (Formulario - DINÁMICA)               │  │
   │  │  ├─ css/style.css (Estilos - ESTÁTICO)                 │  │
   │  │  ├─ js/app.js (Scripts - ESTÁTICO)                     │  │
   │  │  ├─ images/ (Imágenes - ESTÁTICAS)                     │  │
   │  │  ├─ config/ (Archivos de configuración)                │  │
   │  │  ├─ logs/ (Registros de contacto)                      │  │
   │  │  └─ .htaccess (Configuración Apache)                   │  │
   │  └──────────────────────────┬──────────────────────────────┘  │
   │                              │                                │
   │  ┌──────────────────────────▼──────────────────────────────┐  │
   │  │  MOTOR PHP (PHP 7.4+)                                   │  │
   │  │                                                          │  │
   │  │  Para cada solicitud .php:                              │  │
   │  │  ├─ 1. PARSING: Analiza código PHP                     │  │
   │  │  ├─ 2. COMPILACIÓN: Convierte a bytecode               │  │
   │  │  ├─ 3. EJECUCIÓN: Genera HTML dinámico                 │  │
   │  │  │     ├─ session_start() - Maneja sesiones            │  │
   │  │  │     ├─ $_POST/$_GET - Procesa datos de usuario      │  │
   │  │  │     ├─ Arrays simulados - Datos de productos        │  │
   │  │  │     └─ htmlspecialchars() - Sanitiza salida         │  │
   │  │  └─ 4. OUTPUT: Genera respuesta HTTP                   │  │
   │  └──────────────────────────┬──────────────────────────────┘  │
   │                              │                                │
   │  ┌──────────────────────────▼──────────────────────────────┐  │
   │  │  GESTIÓN DE SESIONES (PHP)                              │  │
   │  │                                                          │  │
   │  │  Archivo de sesión: /var/lib/php/sessions/             │  │
   │  │  sess_abc123xyz789                                      │  │
   │  │  {                                                       │  │
   │  │    "carrito": [                                          │  │
   │  │      {                                                   │  │
   │  │        "id": 1,                                          │  │
   │  │        "nombre": "Milkshake Fresa",                     │  │
   │  │        "precio": 4.50,                                   │  │
   │  │        "cantidad": 2                                     │  │
   │  │      },                                                  │  │
   │  │      {...}                                               │  │
   │  │    ]                                                     │  │
   │  │  }                                                       │  │
   │  └──────────────────────────────────────────────────────────┘  │
   └─────────────────────────────────────────────────────────────────┘
```

---

## 3. Ciclo de Vida de una Solicitud GET (Catálogo)

```
PASO 1: Usuario hace clic en "Catálogo"
──────────────────────────────────────
<a href="productos.php">Catálogo</a>

                        ↓

PASO 2: Navegador prepara solicitud GET
──────────────────────────────────────
GET /productos.php HTTP/1.1
Host: milkshakesdrs.local
Cookie: PHPSESSID=xyz789

                        ↓

PASO 3: Apache recibe y rutea a PHP
──────────────────────────────────────
Archivo: /var/www/html/milkshakes_drs/productos.php
Módulo: mod_php
Permiso: www-data (rw)

                        ↓

PASO 4: PHP Ejecución
──────────────────────────────────────

<?php
session_start();  // Recupera sesión del usuario

// Carga catálogo (array simulado)
$catalogo = array(
    array("id" => 1, "nombre" => "Fresa", "precio" => 4.50),
    array("id" => 2, "nombre" => "Chocolate", "precio" => 4.50),
    ...
);

// Genera HTML dinámicamente
foreach ($catalogo as $producto) {
    echo '<div class="product-card">';
    echo '<h3>' . htmlspecialchars($producto['nombre']) . '</h3>';
    echo '<p>$' . number_format($producto['precio'], 2) . '</p>';
    echo '<form method="POST">';
    echo '<button name="agregar_carrito">Agregar</button>';
    echo '</form>';
    echo '</div>';
}
?>

                        ↓

PASO 5: Apache compila respuesta HTML
──────────────────────────────────────
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Encoding: gzip
Cache-Control: public, max-age=3600

<html>
<body>
<div class="product-card">
  <h3>Milkshake Fresa</h3>
  <p>$4.50</p>
  <form method="POST">
    <button>Agregar</button>
  </form>
</div>
...
</body>
</html>

                        ↓

PASO 6: Navegador renderiza catálogo
──────────────────────────────────────
┌─────────────────────────────────┐
│  🥤 Milkshakes DRS              │
│  ────────────────────────────────│
│  Nuestro Catálogo Completo      │
│                                  │
│  ┌────────────────┐ ┌─────────────┐
│  │ Fresa          │ │ Chocolate   │
│  │ $4.50          │ │ $4.50       │
│  │ [Agregar]      │ │ [Agregar]   │
│  └────────────────┘ └─────────────┘
│  
│  ┌────────────────┐ ┌─────────────┐
│  │ Vainilla       │ │ Mango       │
│  │ $4.00          │ │ $5.00       │
│  │ [Agregar]      │ │ [Agregar]   │
│  └────────────────┘ └─────────────┘
└─────────────────────────────────┘
```

---

## 4. Ciclo de Vida de una Solicitud POST (Agregar Carrito)

```
PASO 1: Usuario completa formulario y hace clic "Agregar"
────────────────────────────────────────────────────────
<form method="POST">
    <input type="hidden" name="producto_id" value="1">
    <input type="number" name="cantidad" value="2">
    <button name="agregar_carrito">Agregar al Carrito</button>
</form>

                        ↓

PASO 2: Navegador prepara solicitud POST
────────────────────────────────────────
POST /productos.php HTTP/1.1
Host: milkshakesdrs.local
Content-Type: application/x-www-form-urlencoded
Content-Length: 42
Cookie: PHPSESSID=xyz789

producto_id=1&cantidad=2&agregar_carrito=1

                        ↓

PASO 3: Apache recibe POST
────────────────────────────────────────
Método: POST
Datos: en el cuerpo de la solicitud
Tamaño: 42 bytes

                        ↓

PASO 4: PHP Procesa POST
────────────────────────────────────────

<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && 
    isset($_POST['agregar_carrito'])) {
    
    $producto_id = intval($_POST['producto_id']);  // 1
    $cantidad = intval($_POST['cantidad']);         // 2
    
    // Buscar producto en catálogo
    foreach ($catalogo as $prod) {
        if ($prod['id'] == $producto_id) {
            // Agregar a sesión
            $_SESSION['carrito'][] = array(
                'id' => 1,
                'nombre' => 'Milkshake Fresa',
                'precio' => 4.50,
                'cantidad' => 2
            );
            $mensaje = "¡Producto agregado!";
            break;
        }
    }
}
?>

                        ↓

PASO 5: Apache devuelve respuesta 200 OK
────────────────────────────────────────
HTTP/1.1 200 OK
Set-Cookie: PHPSESSID=xyz789; Path=/; HttpOnly

<div class="alert alert-success">
    ¡Producto agregado al carrito!
</div>

                        ↓

PASO 6: Navegador actualiza página
────────────────────────────────────────
✓ Muestra mensaje de confirmación
✓ Carrito (1) → Carrito (2) - Actualiza contador
✓ Mantiene sesión para próximas solicitudes
```

---

## 5. Diagrama de Flujo de Seguridad

```
NAVEGADOR ENVÍA SOLICITUD
        ↓
    ┌───┴───┐
    │ ¿POST?│ ← Recibir datos de usuario
    └───┬───┘
        │ SÍ
   ┌────▼────────────────────────────────┐
   │ VALIDACIÓN DE ENTRADA               │
   ├─────────────────────────────────────┤
   │ if (empty($email)) → ERROR          │
   │ if (!filter_var($email, VALIDATE))  │
   │    → ERROR                          │
   │ if (strlen($mensaje) < 10) → ERROR  │
   └────┬────────────────────────────────┘
        │
    ┌───┴──────────────────┐
    │ ¿Datos válidos?      │
    └───┬────────────�──────┘
        │NO          │SÍ
        │            │
   ┌────▼────┐  ┌───▼────────────────────────┐
   │ Mostrar │  │ PROCESAMIENTO SEGURO        │
   │ Errores │  ├────────────────────────────┤
   └─────────┘  │ htmlspecialchars()          │
                │  ↓                          │
                │ intval()                    │
                │  ↓                          │
                │ filter_var()                │
                │  ↓                          │
                │ Guardar en sesión ($_SESSION)
                └───┬────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │ PROTECCIÓN DE SALIDA   │
        ├──────────────────────┤
        │ htmlspecialchars()    │
        │  ↓                    │
        │ Previene XSS          │
        │  ↓                    │
        │ Controla Cache        │
        │  ↓                    │
        │ Set-Cookie HttpOnly   │
        └───┬───────────────────┘
           │
       ┌───▼──────────────────────┐
       │ RESPUESTA SEGURA         │
       ├─────────────────────────┤
       │ HTTP/1.1 200 OK         │
       │ X-XSS-Protection: 1     │
       │ X-Frame-Options: SAME  │
       │ Set-Cookie: HttpOnly    │
       │                         │
       │ Contenido comprimido    │
       │ Cache controlado        │
       └─────────────────────────┘
```

---

## 6. Diagrama de Capas de Seguridad

```
┌──────────────────────────────────────────────────┐
│           USUARIO FINAL (Internet)               │
└────────────────────┬─────────────────────────────┘
                     │ HTTP/HTTPS
                     │
   ┌─────────────────▼──────────────────┐
   │ FIREWALL (ufw/iptables)            │
   │ Puerto 80 ✓ | Puerto 443 ✓         │
   │ Puerto 22 ✓ (SSH)                  │
   │ Otros → BLOQUEADOS                 │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ APACHE - ENCABEZADOS               │
   │ X-XSS-Protection: on               │
   │ X-Frame-Options: SAMEORIGIN        │
   │ X-Content-Type-Options: nosniff    │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ APACHE - MÓDULO SECURITY           │
   │ ModSecurity WAF                    │
   │ Detecta ataques OWASP              │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ .htaccess - PROTECCIÓN DE ARCHIVOS │
   │ Archivos .env → BLOQUEADOS         │
   │ config.php → BLOQUEADOS            │
   │ /config → NO LISTAR                │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ PHP - VALIDACIÓN ENTRADA           │
   │ filter_var()                       │
   │ intval()                           │
   │ strlen() checks                    │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ PHP - SANITIZACIÓN SALIDA          │
   │ htmlspecialchars()                 │
   │ json_encode()                      │
   │ CSRF tokens (en producción)        │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ SESIONES PHP                       │
   │ PHPSESSID cookie                   │
   │ HttpOnly + SameSite=Strict         │
   │ Renovación periódica               │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ SISTEMA DE ARCHIVOS                │
   │ 755 directorios (lectura pública)  │
   │ 644 archivos (lectura pública)     │
   │ 700 config (privado)               │
   └─────────────────┬──────────────────┘
                     │
   ┌─────────────────▼──────────────────┐
   │ BASE DE DATOS (simulada en arrays) │
   │ Datos en memoria (sesión)          │
   │ No expuestos al usuario            │
   └──────────────────────────────────────┘
```

---

## Conclusiones sobre los Diagramas

1. **Flujo HTTP**: Muestra cómo viajan los datos desde el navegador al servidor y vuelta
2. **Arquitectura**: Explica cómo Apache distribuye el procesamiento entre módulos y PHP
3. **POST**: Demuestra el ciclo de vida al agregar productos al carrito
4. **Seguridad**: Múltiples capas de protección en cascada que protegen la aplicación

Estos diagramas documentan el proyecto completo para evaluación académica.
