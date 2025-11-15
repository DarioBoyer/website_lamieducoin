# Script PowerShell pour tester Resend
# Usage: .\test-resend.ps1

Write-Host "🧪 Test de configuration Resend" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé ou n'est pas dans le PATH" -ForegroundColor Red
    Write-Host "💡 Téléchargez Node.js sur https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Vérifier que le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Le fichier .env n'existe pas" -ForegroundColor Yellow
    Write-Host "💡 Création à partir de .env.example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Fichier .env créé" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  ATTENTION: Vous devez maintenant éditer le fichier .env" -ForegroundColor Yellow
        Write-Host "   et ajouter votre clé API Resend" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   1. Obtenez votre clé sur https://resend.com/api-keys" -ForegroundColor White
        Write-Host "   2. Ouvrez le fichier .env dans un éditeur" -ForegroundColor White
        Write-Host "   3. Remplacez 're_votre_cle_api_ici' par votre vraie clé" -ForegroundColor White
        Write-Host ""
        
        # Ouvrir le fichier .env dans l'éditeur par défaut
        Write-Host "📝 Ouverture du fichier .env..." -ForegroundColor Cyan
        Start-Process notepad ".env"
        
        Write-Host ""
        Write-Host "Relancez ce script une fois la configuration terminée." -ForegroundColor Cyan
        exit 0
    } else {
        Write-Host "❌ Le fichier .env.example est introuvable" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
Write-Host ""

# Vérifier que les dépendances sont installées
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dépendances installées" -ForegroundColor Green
Write-Host ""

# Exécuter le test
Write-Host "🚀 Lancement du test Resend..." -ForegroundColor Cyan
Write-Host ""

node test-resend.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✨ Test réussi!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "  1. Démarrez le serveur de dev: npm run dev" -ForegroundColor White
    Write-Host "  2. Testez une commande sur http://localhost:8888" -ForegroundColor White
    Write-Host "  3. Vérifiez vos emails!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "❌ Le test a échoué" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifications à faire:" -ForegroundColor Yellow
    Write-Host "  1. La clé API Resend est-elle correcte dans .env?" -ForegroundColor White
    Write-Host "  2. L'adresse FROM utilise-t-elle un domaine vérifié?" -ForegroundColor White
    Write-Host "  3. Votre connexion internet fonctionne-t-elle?" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Pour tester rapidement, utilisez:" -ForegroundColor Cyan
    Write-Host "   RESEND_FROM_EMAIL=onboarding@resend.dev" -ForegroundColor White
    Write-Host ""
}
