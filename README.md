# milkshakes_DRS
Milkshakes DRS - Página Web de Tienda Local

## Descripción del Proyecto

Este proyecto consiste en una página web para una tienda local especializada en milkshakes. Se ha diseñado como un sitio web dinámico para permitir interactividad, como un catálogo de productos, formulario de contacto y navegación básica. El sitio está optimizado para ser servido en un servidor web como Apache, con soporte para PHP.

### Arquitectura
- **Modelo Cliente-Servidor**: El navegador del cliente solicita recursos al servidor web, que procesa las peticiones y devuelve contenido dinámico generado con PHP.
- **Componentes**:
  - Cliente: Navegador web.
  - Servidor: Apache HTTP Server (seleccionado por su estabilidad y flexibilidad).
  - Backend: PHP para generar contenido dinámico.
  - Base de datos: No implementada en esta versión básica (simulada con arrays en PHP).

### Tipología de Web
Se ha optado por un sitio **dinámico** debido a la necesidad de interactividad en el catálogo (productos generados dinámicamente, botones de agregar al carrito) y formulario de contacto. Un sitio estático no sería suficiente para una tienda que requiere personalización y actualizaciones en tiempo real.

### Selección Tecnológica
- **Servidor Web**: Apache HTTP Server.
  - **Justificación**: Alto rendimiento en configuraciones multiproceso, excelente soporte para módulos (ej. mod_rewrite, mod_security), seguridad robusta con actualizaciones frecuentes y compatibilidad con PHP. Es ideal para una tienda local con tráfico moderado, superando a Nginx en flexibilidad para configuraciones complejas y a IIS en entornos no-Windows.

### Funcionamiento del Protocolo HTTP
1. El navegador envía una petición HTTP (GET para páginas, POST para formularios).
2. El servidor Apache recibe la petición en el puerto 80/443.
3. Si es dinámica, ejecuta PHP para procesar (ej. generar catálogo o enviar email).
4. Devuelve una respuesta HTTP con código de estado (200 OK) y contenido (HTML, CSS, JS).

### Seguridad y Mantenimiento
- **Buenas Prácticas**:
  - Actualizaciones regulares de Apache y PHP para parches de seguridad.
  - Copias de seguridad diarias de archivos y configuraciones (usar rsync o herramientas como Bacula).
  - Configurar HTTPS con certificados SSL/TLS.
  - Usar firewall (ufw/iptables) y mod_security para protección contra ataques.
  - Monitoreo de logs con fail2ban.
  - Limitar permisos de archivos (755 para directorios, 644 para archivos).

## Requisitos
- Servidor web: Apache 2.4+
- PHP 7.4+ (con extensiones básicas)
- Navegador moderno (Chrome, Firefox, etc.)

## Instalación y Configuración
1. **Clona o copia los archivos** al directorio raíz del servidor web (ej. `/var/www/html/` en Linux).
2. **Configura Apache**:
   - Asegúrate de que `mod_php` esté habilitado.
   - Configura un VirtualHost si es necesario (ej. para dominio personalizado).
3. **Permisos**:
   - `chmod 755` a directorios.
   - `chmod 644` a archivos.
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
