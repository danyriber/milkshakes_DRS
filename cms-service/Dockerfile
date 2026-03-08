# Dockerfile para Strapi CMS Service
FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Hacer build de la aplicación
RUN npm run build

# Exponer puerto de Strapi
EXPOSE 1337

# Comando para iniciar Strapi
CMD ["npm", "run", "start"]
