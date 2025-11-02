# Script de démarrage du serveur d'emails
# Usage: .\start-email-server.ps1

Write-Host "🚀 Démarrage du serveur d'emails..." -ForegroundColor Cyan

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "📥 Téléchargez Node.js: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Vérifier si on est dans le bon dossier
if (-not (Test-Path ".\backend\package.json")) {
    Write-Host "❌ Veuillez exécuter ce script depuis le dossier Test/" -ForegroundColor Red
    exit 1
}

# Aller dans le dossier backend
Set-Location ".\backend"

# Installer les dépendances si nécessaire
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        Set-Location ".."
        exit 1
    }
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}

# Vérifier si le port 3001 est disponible
$portInUse = netstat -ano | Select-String ":3001"
if ($portInUse) {
    Write-Host "⚠️ Le port 3001 est déjà utilisé!" -ForegroundColor Yellow
    Write-Host "Processus utilisant le port:" -ForegroundColor Yellow
    netstat -ano | Select-String ":3001"
    
    $response = Read-Host "Voulez-vous continuer quand même? (o/N)"
    if ($response -ne "o") {
        Set-Location ".."
        exit 0
    }
}

# Démarrer le serveur
Write-Host ""
Write-Host "🎯 Démarrage du serveur sur http://localhost:3001" -ForegroundColor Green
Write-Host "📋 Endpoints disponibles:" -ForegroundColor Cyan
Write-Host "   - POST /api/send-email     (Envoyer un email)" -ForegroundColor White
Write-Host "   - POST /api/test-smtp      (Tester la connexion SMTP)" -ForegroundColor White
Write-Host "   - GET  /api/health         (Vérifier l'état du serveur)" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

node email-api-server.js

# Retourner au dossier parent
Set-Location ".."
