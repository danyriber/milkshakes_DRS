#!/bin/bash

# Script para configurar y levantar el CMS Strapi

echo "🚀 Configuring Strapi CMS..."
echo ""

# Cambiar al directorio cms-service
cd "$(dirname "$0")"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Next steps:"
echo ""
echo "Option 1: Start with Docker Compose (recommended)"
echo "  cd .."
echo "  docker-compose up cms"
echo ""
echo "Option 2: Start local development server"
echo "  npm run develop"
echo ""
echo "Then access Strapi admin at:"
echo "  http://localhost:1337/admin"
echo ""
echo "For deployment to Vercel, see README.md"
