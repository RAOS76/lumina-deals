#!/bin/bash

# safe_deploy.sh - Protocolo de Despliegue Seguro para Lumina

set -e # Detener script si hay error

echo "🚀 Iniciando Protocolo de Despliegue Seguro..."

# 1. Verificar Estado de Git
if [[ -n $(git status -s) ]]; then
    echo "❌ Error: Tienes cambios sin guardar (uncommitted changes)."
    echo "Por favor, haz commit o stash antes de desplegar."
    exit 1
fi

# 2. Actualizar Código
echo "📥 Descargando últimos cambios..."
git pull origin main

# 3. Instalar Dependencias (Frontend)
echo "📦 Verificando dependencias de Frontend..."
cd frontend
npm install
cd ..

# 4. Instalar Dependencias (Backend)
echo "🐍 Verificando dependencias de Backend..."
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
fi

# 5. Verificación de Tipos y Build
echo "🏗️ Construyendo aplicación (Build Check)..."
cd frontend
npm run build
cd ..

echo "✅ Despliegue completado con éxito."
echo "🔄 Para aplicar cambios, reinicia el servidor:"
echo "   npm run dev (Local) o pm2 restart all (Producción)"
