# Script de démarrage Netlify Dev pour La Mie du Coin
# Usage: .\start-netlify-dev.ps1

Write-Host ""
Write-Host "🥖 La Mie du Coin - Netlify Dev" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "📥 Téléchargez Node.js: https://nodejs.org/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier si on est dans le bon dossier
if (-not (Test-Path ".\netlify.toml")) {
    Write-Host "❌ Fichier netlify.toml non trouvé!" -ForegroundColor Red
    Write-Host "⚠️  Veuillez exécuter ce script depuis le dossier Test/" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée pour quitter"
    exit 1
}

# Vérifier si le fichier .env existe
if (-not (Test-Path ".\.env")) {
    Write-Host "⚠️  Fichier .env non trouvé!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Création du fichier .env depuis .env.example..." -ForegroundColor Cyan
    
    if (Test-Path ".\.env.example") {
        Copy-Item .\.env.example .\.env
        Write-Host "✅ Fichier .env créé" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔧 IMPORTANT: Configurez vos identifiants SMTP dans .env" -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "Voulez-vous ouvrir .env maintenant pour le configurer? (o/N)"
        if ($response -eq "o" -or $response -eq "O") {
            notepad .\.env
            Write-Host ""
            Write-Host "⏸️  Configurez le fichier .env et appuyez sur Entrée pour continuer..." -ForegroundColor Yellow
            Read-Host
        } else {
            Write-Host ""
            Write-Host "⚠️  N'oubliez pas de configurer .env avant de tester l'envoi d'emails!" -ForegroundColor Yellow
            Write-Host ""
        }
    } else {
        Write-Host "❌ .env.example non trouvé!" -ForegroundColor Red
        Write-Host ""
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
}

# Vérifier si node_modules existe
if (-not (Test-Path ".\node_modules")) {
    Write-Host "📦 Installation des dépendances npm..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        Write-Host ""
        Read-Host "Appuyez sur Entrée pour quitter"
        exit 1
    }
    
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}

# Vérifier si le port 8888 est disponible
$portInUse = netstat -ano | Select-String ":8888"
if ($portInUse) {
    Write-Host ""
    Write-Host "⚠️  Le port 8888 est déjà utilisé!" -ForegroundColor Yellow
    Write-Host "Processus utilisant le port:" -ForegroundColor Yellow
    netstat -ano | Select-String ":8888"
    Write-Host ""
    
    $response = Read-Host "Voulez-vous utiliser un autre port? (o/N)"
    if ($response -eq "o" -or $response -eq "O") {
        $customPort = Read-Host "Entrez le numéro de port (ex: 9999)"
        $env:NETLIFY_DEV_PORT = $customPort
        Write-Host "✅ Utilisation du port $customPort" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Le serveur pourrait ne pas démarrer si le port est occupé" -ForegroundColor Yellow
    }
}

# Afficher les informations
Write-Host ""
Write-Host "🎯 Démarrage de Netlify Dev..." -ForegroundColor Green
Write-Host ""
Write-Host "📋 Informations:" -ForegroundColor Cyan
Write-Host "   - URL locale: http://localhost:8888" -ForegroundColor White
Write-Host "   - Fonctions serverless: /.netlify/functions/" -ForegroundColor White
Write-Host ""
Write-Host "📡 Fonctions disponibles:" -ForegroundColor Cyan
Write-Host "   - POST /.netlify/functions/send-email" -ForegroundColor White
Write-Host "   - POST /.netlify/functions/test-smtp" -ForegroundColor White
Write-Host "   - GET  /.netlify/functions/get-smtp-config" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Pages de test:" -ForegroundColor Cyan
Write-Host "   - Page d'accueil:   http://localhost:8888/" -ForegroundColor White
Write-Host "   - Page commandes:   http://localhost:8888/pages/orders.html" -ForegroundColor White
Write-Host "   - Config SMTP:      http://localhost:8888/pagesadmin/smtp-config.html" -ForegroundColor White
Write-Host ""
Write-Host "💡 Conseils:" -ForegroundColor Cyan
Write-Host "   - Les logs des fonctions s'affichent dans ce terminal" -ForegroundColor White
Write-Host "   - Ouvrez la console du navigateur (F12) pour voir les détails" -ForegroundColor White
Write-Host "   - Utilisez Ctrl+C pour arrêter le serveur" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""

# Démarrer Netlify Dev
netlify dev

# Si le serveur s'arrête
Write-Host ""
Write-Host "🛑 Serveur arrêté" -ForegroundColor Yellow
Write-Host ""
Read-Host "Appuyez sur Entrée pour quitter"
