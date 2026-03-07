FROM php:7.4-apache

# Metadatos
LABEL maintainer="Milkshakes DRS"
LABEL description="Tienda de Milkshakes - Demostración de Arquitectura Cliente-Servidor"
LABEL version="1.0"

# Actualizar paquetes del sistema
RUN apt-get update && \
    apt-get install -y \
    curl \
    wget \
    git \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Habilitar módulos de Apache necesarios
RUN a2enmod rewrite && \
    a2enmod deflate && \
    a2enmod expires && \
    a2enmod headers && \
    a2enmod ssl

# Instalar extensiones PHP
RUN docker-php-ext-install \
    session \
    standard

# Configurar PHP
RUN echo "date.timezone = UTC" > /usr/local/etc/php/conf.d/timezone.ini && \
    echo "display_errors = On" > /usr/local/etc/php/conf.d/display.ini && \
    echo "memory_limit = 256M" >> /usr/local/etc/php/conf.d/display.ini && \
    echo "post_max_size = 50M" >> /usr/local/etc/php/conf.d/display.ini && \
    echo "upload_max_filesize = 50M" >> /usr/local/etc/php/conf.d/display.ini

# Copiar archivos del proyecto al contenedor
COPY . /var/www/html/

# Crear directorio de logs y permisos
RUN mkdir -p /var/www/html/logs && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html && \
    chmod -R 644 /var/www/html/*.php && \
    chmod -R 644 /var/www/html/*.md && \
    chmod -R 644 /var/www/html/css/* && \
    chmod -R 644 /var/www/html/images/*

# Configurar archivo de configuración de Apache
COPY config/apache-vhost.conf /etc/apache2/sites-available/milkshakesdrs.conf
RUN a2ensite milkshakesdrs.conf && \
    a2dissite 000-default.conf

# Crear directorio para sesiones PHP
RUN mkdir -p /var/lib/php/sessions && \
    chown -R www-data:www-data /var/lib/php/sessions && \
    chmod 1733 /var/lib/php/sessions

# WorkDir
WORKDIR /var/www/html

# Exponer puerto 80 (HTTP)
EXPOSE 80

# Exponer puerto 443 (HTTPS - opcional)
EXPOSE 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/verificar.php || exit 1

# Comando por defecto: ejecutar Apache en primer plano
CMD ["apache2-foreground"]
