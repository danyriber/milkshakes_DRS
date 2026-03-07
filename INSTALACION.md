# Guía de Instalación - Milkshakes DRS

## Requisitos Previos

- **Sistema Operativo**: Linux (Ubuntu/Debian) o Windows con WSL
- **Apache 2.4+**: Servidor web
- **PHP 7.4+**: Intérprete de PHP con módulo para Apache
- **mod_php**: Módulo de Apache para procesar PHP
- **Conexión a Internet**: Para instalar dependencias (opcional)

---

## 1. Instalación en Ubuntu/Debian Linux

### Paso 1: Actualizar repositorios

```bash
sudo apt update
sudo apt upgrade -y
```

### Paso 2: Instalar Apache

```bash
sudo apt install apache2 -y
```

Verificar instalación:
```bash
apache2 -v
# Resultado esperado: Apache/2.4.x
```

### Paso 3: Instalar PHP y módulos

```bash
sudo apt install php php-cli libapache2-mod-php -y
```

Verificar instalación:
```bash
php -v
# Resultado esperado: PHP 7.4.x or 8.0+
```

### Paso 4: Habilitar módulos Apache necesarios

```bash
# Habilitar mod_php (si no está)
sudo a2enmod php7.4
# o para PHP 8.0+
sudo a2enmod php8.0

# Habilitar otros módulos útiles
sudo a2enmod rewrite        # Para reescrituras de URL
sudo a2enmod deflate        # Para compresión Gzip
sudo a2enmod expires        # Para control de caché
sudo a2enmod headers        # Para encabezados de seguridad
sudo a2enmod ssl            # Para HTTPS (opcional)
```

Verificar módulos habilitados:
```bash
sudo apache2ctl -M | grep "php\|rewrite\|deflate\|expires\|headers"
```

### Paso 5: Reiniciar Apache

```bash
sudo systemctl restart apache2
sudo systemctl status apache2  # Verificar que esté activo (running)
```

---

## 2. Instalación del Proyecto Milkshakes DRS

### A. Opción 1: Usando Git (Recomendado)

```bash
# Navegar a directorio web
cd /var/www/html

# Clonar repositorio
git clone https://github.com/tu-usuario/milkshakes_DRS.git

# Entrar al directorio
cd milkshakes_DRS
```

### B. Opción 2: Copiar archivos manualmente

```bash
# Copiar archivos del proyecto
sudo cp -r /ruta/local/milkshakes_DRS /var/www/html/

# Confirmar que están en su lugar
ls -la /var/www/html/milkshakes_DRS/
```

### Paso 3: Establecer permisos correctos

```bash
# Cambiar propietario a www-data (usuario de Apache)
sudo chown -R www-data:www-data /var/www/html/milkshakes_DRS

# Establecer permisos de directorios (755)
sudo find /var/www/html/milkshakes_DRS -type d -exec chmod 755 {} \;

# Establecer permisos de archivos (644)
sudo find /var/www/html/milkshakes_DRS -type f -exec chmod 644 {} \;

# Verificar permisos
ls -la /var/www/html/milkshakes_DRS/
# Resultado esperado: drwxr-xr-x www-data:www-data
```

---

## 3. Configuración de Apache para El Proyecto

### Opción A: Configuración VirtualHost (Recomendado)

#### Paso 1: Crear archivo de configuración

```bash
sudo nano /etc/apache2/sites-available/milkshakesdrs.conf
```

#### Paso 2: Copiar contenido (desde config/apache-vhost.conf)

```apache
<VirtualHost *:80>
    ServerName milkshakesdrs.local
    ServerAlias www.milkshakesdrs.local
    ServerAdmin admin@milkshakesdrs.local
    
    DocumentRoot /var/www/html/milkshakes_drs
    
    ErrorLog ${APACHE_LOG_DIR}/milkshakesdrs_error.log
    CustomLog ${APACHE_LOG_DIR}/milkshakesdrs_access.log combined
    
    <Directory /var/www/html/milkshakes_drs>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule ^(.*)$ index.php?path=$1 [QSA,L]
    </Directory>
    
    # Módulos de seguridad
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript
    </IfModule>
    
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
    </IfModule>
</VirtualHost>
```

#### Paso 3: Habilitar sitio

```bash
sudo a2ensite milkshakesdrs.conf
```

#### Paso 4: Verificar sintaxis

```bash
sudo apache2ctl configtest
# Resultado esperado: Syntax OK
```

#### Paso 5: Recargar Apache

```bash
sudo systemctl reload apache2
```

### Opción B: Usar .htaccess (Alternativa)

Si no tienes acceso a archivos de configuración de Apache, el archivo `.htaccess` ya incluido maneja:

- Reescrituras de URL
- Compresión Gzip
- Control de caché
- Protección de archivos sensibles

Ya está configurado, solo asegúrate de que `AllowOverride All` esté habilitado en VirtualHost.

---

## 4. Configurar Hosts Locales (para acceso local)

### En Linux/Mac:

```bash
sudo nano /etc/hosts
```

Agregar al final:
```
127.0.0.1    milkshakesdrs.local
127.0.0.1    www.milkshakesdrs.local
```

Guardar y salir (Ctrl+O, Enter, Ctrl+X)

### En Windows:

Editar: `C:\Windows\System32\drivers\etc\hosts`

Agregar:
```
127.0.0.1    milkshakesdrs.local
127.0.0.1    www.milkshakesdrs.local
```

---

## 5. Configurar PHP (opcional pero recomendado)

### Aumentar límite de upload

```bash
sudo nano /etc/php/7.4/apache2/php.ini
# (cambiar 7.4 por tu versión)
```

Buscar y modificar:
```ini
post_max_size = 50M          # Tamaño máximo de POST
upload_max_filesize = 50M    # Tamaño máximo de archivo
max_execution_time = 300      # Tiempo máximo de ejecución (5 min)
memory_limit = 256M           # Memoria máxima
```

### Configurar zona horaria

```bash
sudo nano /etc/php/7.4/apache2/php.ini
```

Buscar:
```ini
[Date]
; http://php.net/date.timezone
date.timezone = "America/New_York"
```

Cambiar a tu zona horaria (ej: `"America/Bogota"` para Colombia)

Reiniciar Apache:
```bash
sudo systemctl restart apache2
```

---

## 6. Habilitar HTTPS (Opcional pero Recomendado)

### Instalar Certbot (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-apache -y
```

### Generar certificado

```bash
sudo certbot --apache -d milkshakesdrs.local -d www.milkshakesdrs.local
```

Seguir las instrucciones en pantalla.

### Verificar renovación automática

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
sudo certbot renew --dry-run  # Probar renovación
```

---

## 7. Crear Estructura de Logs

```bash
# Crear directorio de logs de la aplicación
sudo mkdir -p /var/www/html/milkshakes_drs/logs

# Establecer permisos
sudo chown www-data:www-data /var/www/html/milkshakes_drs/logs
sudo chmod 755 /var/www/html/milkshakes_drs/logs
```

---

## 8. Verificar Instalación

### Prueba 1: Apache está corriendo

```bash
sudo systemctl status apache2
```

### Prueba 2: PHP está habilitado

```bash
curl http://milkshakesdrs.local/index.php | head -20
# Debe ver HTML de la página principal
```

O acceder desde navegador:
```
http://milkshakesdrs.local
```

### Prueba 3: Base de datos de módulos Apache

```bash
apache2ctl -M | grep -E "php|rewrite|deflate|expires|headers"
```

### Prueba 4: Revisar logs

```bash
# Ver errores de Apache
tail -f /var/log/apache2/milkshakesdrs_error.log

# Ver accesos
tail -f /var/log/apache2/milkshakesdrs_access.log

# Ver errores de PHP
sudo tail -f /var/log/php-fpm.log
```

---

## 9. Configurar Copia de Seguridad Automática

### Crear script de backup

```bash
sudo nano /usr/local/bin/backup-milkshakes.sh
```

Contenido:
```bash
#!/bin/bash

BACKUP_DIR="/backups/milkshakes"
SOURCE="/var/www/html/milkshakes_drs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Crear directorio si no existe
mkdir -p $BACKUP_DIR

# Hacer backup
tar -czf "$BACKUP_DIR/milkshakes_$TIMESTAMP.tar.gz" "$SOURCE"

# Eliminar backups antiguos (más de 30 días)
find "$BACKUP_DIR" -name "milkshakes_*.tar.gz" -mtime +30 -delete

echo "Backup completado: milkshakes_$TIMESTAMP.tar.gz"
```

### Hacer ejecutable

```bash
sudo chmod +x /usr/local/bin/backup-milkshakes.sh
```

### Programar con crontab (backup diario a las 2 AM)

```bash
sudo crontab -e
```

Agregar línea:
```
0 2 * * * /usr/local/bin/backup-milkshakes.sh >> /var/log/milkshakes_backup.log 2>&1
```

---

## 10. Configurar Monitoreo (fail2ban)

### Instalar fail2ban

```bash
sudo apt install fail2ban -y
```

### Configurar

```bash
sudo nano /etc/fail2ban/jail.local
```

Contenido básico:
```ini
[DEFAULT]
bantime = 3600
maxretry = 5
findtime = 600

[sshd]
enabled = true

[apache-auth]
enabled = true

[apache-http-auth]
enabled = true
```

### Iniciar

```bash
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
sudo systemctl status fail2ban
```

---

## Troubleshooting

### Problema: "Permission denied" en logs

**Solución:**
```bash
sudo chown www-data:www-data /var/www/html/milkshakes_drs/logs
sudo chmod 755 /var/www/html/milkshakes_drs/logs
```

### Problema: PHP no se ejecuta, se descarga como archivo

**Solución:**
```bash
# Verificar que mod_php está habilitado
sudo a2enmod php7.4  # (cambiar versión según corresponda)
sudo systemctl restart apache2
```

### Problema: "404 Not Found" en todos los archivos

**Solución:**
```bash
# Verificar DocumentRoot
ls -la /var/www/html/milkshakes_drs/

# Verificar permisos
sudo chown -R www-data:www-data /var/www/html/milkshakes_drs
sudo chmod 755 /var/www/html/milkshakes_drs
```

### Problema: La sesión no se guarda (carrito vacío)

**Solución:**
```bash
# Verificar directorio de sesiones
ls -la /var/lib/php/sessions/

# Limpiar sesiones antiguas
sudo php -r "require 'gc.php';"  # Garbage collector

# O simplemente reiniciar
sudo systemctl restart apache2
```

### Problema: Habilitar .htaccess (reescrituras no funcionan)

**Solución:**
En el VirtualHost, asegúrate de:
```apache
<Directory /var/www/html/milkshakes_drs>
    AllowOverride All    # ← IMPORTANTE
</Directory>
```

---

## Comandos Útiles de Mantenimiento

```bash
# Ver estado de Apache
sudo systemctl status apache2

# Reiniciar Apache
sudo systemctl restart apache2

# Ver módulos habilitados
apache2ctl -M

# Verificar sintaxis de configuración
sudo apache2ctl configtest

# Ver versión de PHP
php -v

# Ver información de PHP completo
php -i

# Limpiar cache de APCu (si está instalado)
sudo php -r "apcu_clear_cache();"

# Monitorear uso de recursos en tiempo real
watch -n 1 'ps aux | grep apache2 | wc -l'

# Ver los últimos errores
sudo tail -20 /var/log/apache2/milkshakesdrs_error.log
```

---

## Siguiente: Acceder a la Aplicación

Una vez completada la instalación:

1. Abre tu navegador
2. Dirígete a `http://milkshakesdrs.local`
3. ¡Deberías ver la página principal de Milkshakes DRS!

## Características Disponibles

- ✅ Página principal intuitiva
- ✅ Catálogo dinámico de productos
- ✅ Carrito de compras funcional
- ✅ Formulario de contacto con validación
- ✅ Sesiones de usuario
- ✅ Diseño responsivo

---

**¡Instalación completada! El proyecto está listo para usar.**
