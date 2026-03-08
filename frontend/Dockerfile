# Dockerfile para frontend React
FROM node:18-alpine

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 5173

# Comando para ejecutar
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]