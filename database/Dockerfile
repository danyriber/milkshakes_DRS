# Dockerfile para PostgreSQL con inicialización
FROM postgres:13-alpine

# Variables de entorno
ENV POSTGRES_DB=milkshakes_drs
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password123

# Copiar script de inicialización
COPY init.sql /docker-entrypoint-initdb.d/

# Exponer puerto
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD pg_isready -U admin -d milkshakes_drs