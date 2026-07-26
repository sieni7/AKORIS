#!/bin/bash
set -e

echo "🚀 Lancement du Control Center..."

if ! command -v pnpm &> /dev/null; then
  echo "❌ pnpm n'est pas installé. Installez-le avec 'npm install -g pnpm'."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "📦 Installation des dépendances..."
  pnpm install
fi

echo "🔧 Build des packages..."
pnpm build

echo "🔄 Lancement de l'API..."
pnpm dev:api &
API_PID=$!

echo "🔄 Lancement du Dashboard..."
pnpm dev:dashboard &
DASHBOARD_PID=$!

echo "✅ Control Center en cours d'exécution"
echo "   API : http://localhost:3000"
echo "   Dashboard : http://localhost:5173"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter."

trap "kill $API_PID $DASHBOARD_PID; exit" INT
wait
