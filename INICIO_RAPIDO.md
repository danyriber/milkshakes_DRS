# 🚀 Guía Rápida de Prueba Local

## Opción 1: PHP Built-in Server (Sin Apache - Para Pruebas Rápidas)

### Requisitos
- PHP 7.4+ instalado
- Terminal/Consola

### Pasos

**1. Navegar al directorio del proyecto**
```bash
cd /ruta/del/proyecto/milkshakes_DRS
```

**2. Iniciar servidor PHP integrado**
```bash
php -S localhost:8000
```

**Salida esperada:**
```
Development Server (http://127.0.0.1:8000)
Listening on http://127.0.0.1:8000
Document root is /ruta/del/proyecto/milkshakes_DRS
Press Ctrl-C to quit
```

**3. Abrir en navegador**
```
http://localhost:8000
```

### Ventajas
- ✅ No requiere instalación de Apache
- ✅ Funciona en 10 segundos
- ✅ Perfecto para demostración rápida
- ✅ Pruebas funcionales completas

### Desventajas
- ⚠️ Solo para desarrollo/pruebas
- ⚠️ No es seguro para producción
- ⚠️ Rendimiento limitado

---

## Opción 2: Docker (Más Realista - Con Apache)

### Requisitos
- Docker instalado

### Pasos

**1. Crear archivo Dockerfile**
```bash
cat > Dockerfile << 'EOF'
FROM php:7.4-apache

# Habilitar módulos necesarios
RUN a2enmod rewrite deflate expires headers
RUN docker-php-ext-install session

# Configurar DocumentRoot
COPY . /var/www/html/
WORKDIR /var/www/html

# Permisos
RUN chown -R www-data:www-data /var/www/html

# Puerto
EXPOSE 80

CMD ["apache2-foreground"]
EOF
```

**2. Construir imagen**
```bash
docker build -t milkshakes-drs .
```

**3. Ejecutar contenedor**
```bash
docker run -p 8080:80 milkshakes-drs
```

**4. Acceder**
```
http://localhost:8080
```

### Ventajas
- ✅ Ambiente similar a producción
- ✅ Apache completamente funcional
- ✅ Aislado del sistema host
- ✅ Fácil limpieza (`docker rm`)

---

## Opción 3: Instalación Apache Completa (Recomendado para Evaluación)

Ver [INSTALACION.md](INSTALACION.md) para guía completa.

```bash
# Resumen rápido (Ubuntu/Debian):
sudo apt update
sudo apt install apache2 php libapache2-mod-php -y
sudo cp -r . /var/www/html/milkshakes_drs
sudo chown -R www-data:www-data /var/www/html/milkshakes_drs
sudo a2enmod rewrite deflate expires
sudo systemctl restart apache2
```

---

## Pruebas Funcionales Rápidas

### Prueba 1: Verificar PHP Funciona
Acceder a: `http://localhost:8000/verificar.php`

Debería mostrar:
- ✅ PHP Version: 7.4.0+
- ✅ Extensiones: session, standard, filter
- ✅ Session Support: Enabled
- ✅ Todos los archivos presentes

### Prueba 2: Página Principal
Acceder a: `http://localhost:8000/index.php`

Debería mostrar:
- ✅ Logo "🥤 Milkshakes DRS"
- ✅ Navegación funcional
- ✅ Hero section atractivo
- ✅ Productos destacados

### Prueba 3: Catálogo
Acceder a: `http://localhost:8000/productos.php`

Debería mostrar:
- ✅ Grid de 8 productos
- ✅ Nombres, precios, descripciones
- ✅ Botón "Agregar al Carrito"
- ✅ Formulario con cantidad

### Prueba 4: Carrito Funcional
1. Ir a Productos
2. Agregar 2 "Milkshake Fresa" al carrito
3. Carrito debería mostrar "Carrito (2)" en navegación
4. Clic en Carrito
5. Debería mostrar:
   - ✅ Tabla con producto
   - ✅ Precio: $4.50
   - ✅ Cantidad: 2
   - ✅ Subtotal: $9.00
   - ✅ Impuesto 10%: $0.90
   - ✅ Total: $9.90

### Prueba 5: Formulario Contacto
Acceder a: `http://localhost:8000/contacto.php`

**Prueba con datos inválidos:**
1. Dejar vacío nombre → Error "El nombre es requerido"
2. Email inválido → Error "El email debe ser válido"
3. Mensaje muy corto → Error "mínimo 10 caracteres"

**Prueba con datos válidos:**
1. Nombre: "Juan Pérez"
2. Email: "juan@example.com"
3. Telefono: "555-1234"
4. Asunto: "Consulta"
5. Mensaje: "Hola, quería preguntar sobre los milkshakes especiales"
6. Clic "Enviar Mensaje"
7. Debería mostrar: "¡Gracias por tu mensaje!"

### Prueba 6: Sesiones (Persistencia)
1. Agregar producto al carrito
2. Navegar a otra página (ej: Contacto)
3. Volver a Carrito
4. **El producto debe seguir en el carrito** (sesión funciona)

---

## Comandos Útiles para Debugging

### Ver logs en tiempo real
```bash
# Con Apache
tail -f /var/log/apache2/error.log

# Con PHP server (aparecen en la terminal)
# Presionar Ctrl+C muestra resumen
```

### Probar URLs con curl
```bash
# GET
curl http://localhost:8000/index.php

# POST (agregar carrito)
curl -X POST http://localhost:8000/productos.php \
  -d "producto_id=1&cantidad=2&agregar_carrito=1"

# Ver encabezados
curl -I http://localhost:8000/
```

### Ver información PHP
```bash
php -i | grep -E "PHP Version|display_errors|memory_limit"
```

### Limpiar sesiones
```bash
# PHP server (se limpian al cerrar)

# Apache (manual)
sudo rm /var/lib/php/sessions/sess_*
```

---

## Troubleshooting Rápido

### Problema: "No se puede conectar a localhost:8000"
**Solución:**
```bash
# Verificar que PHP server está corriendo
ps aux | grep "php -S"

# Verificar puerto disponible
lsof -i :8000

# Si está en uso, usar otro puerto
php -S localhost:8001
```

### Problema: "Permiso denegado" (Apache)
**Solución:**
```bash
sudo chown -R www-data:www-data /var/www/html/milkshakes_drs
sudo chmod 755 /var/www/html/milkshakes_drs
sudo systemctl restart apache2
```

### Problema: "Sesión no se guarda"
**Solución:**
```bash
# Verificar permisos de sesiones
ls -la /var/lib/php/sessions/ | head

# Si no existen, crearlas
sudo mkdir -p /var/lib/php/sessions
sudo chown www-data:www-data /var/lib/php/sessions
sudo chmod 1733 /var/lib/php/sessions
```

### Problema: "CSS no carga" (404)
**Solución:**
- Verificar que los archivos existen en `css/style.css`
- Verificar permisos de lectura: `chmod 644 css/style.css`
- Limpiar caché: Ctrl+Shift+Del en navegador

---

## Checklist de Funcionamiento

Después de iniciar, verificar que:

- [ ] Página principal carga sin errores
- [ ] Navegación entre secciones funciona
- [ ] Catálogo muestra 8 productos
- [ ] Botón "Agregar al Carrito" funciona
- [ ] Carrito acumula productos
- [ ] Formulario contacto valida campos
- [ ] Estilos CSS se aplican (colores, fuentes)
- [ ] Imágenes de productos se cargan
- [ ] Contador de carrito se actualiza
- [ ] Sin errores en consola del navegador (F12)

**Si todo esto funciona ✅ = Proyecto listo!**

---

## Información de Soporte

| Problema | Ubicación |
|----------|-----------|
| Instalación completa | [INSTALACION.md](INSTALACION.md) |
| Arquitectura técnica | [ARQUITECTURA.md](ARQUITECTURA.md) |
| Flujos HTTP | [DIAGRAMAS.md](DIAGRAMAS.md) |
| Diagnóstico servidor | `verificar.php` (navegador) |

---

## Próximos Pasos

Después de verificar que funciona:

1. **Para evaluación rápida**: Mostrar `verificar.php` + navegar por UI
2. **Para presentación**: Mostrar catálogo y carrito funcionando
3. **Para técnico**: Mostrar arquitectura en `ARQUITECTURA.md`
4. **Para producción**: Seguir [INSTALACION.md](INSTALACION.md)

---

**¡Listo para demostrar!** 🎉
