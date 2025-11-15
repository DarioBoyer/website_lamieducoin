# Script pour tester l'envoi d'email lors d'une commande
# Ce script démarre Netlify Dev et lance le test d'email

Write-Host "🧪 Test complet - Envoi d'email de commande" -ForegroundColor Cyan
Write-Host ""

# Vérifier si Node.js est installé
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier si le fichier .env existe
if (-not (Test-Path ".env")) {
    Write-Host "❌ Le fichier .env n'existe pas" -ForegroundColor Red
    Write-Host "💡 Lancez d'abord: .\test-resend.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Configuration trouvée" -ForegroundColor Green
Write-Host ""

# Vérifier si Netlify Dev est déjà en cours d'exécution
$netlifyRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.CommandLine -like "*netlify*dev*"
}

if ($netlifyRunning) {
    Write-Host "✅ Netlify Dev est déjà en cours d'exécution" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "🚀 Démarrage de Netlify Dev..." -ForegroundColor Cyan
    Write-Host "   (Ceci peut prendre quelques secondes)" -ForegroundColor Gray
    Write-Host ""
    
    # Démarrer Netlify Dev en arrière-plan
    $netlifyJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        netlify dev
    }
    
    # Attendre que le serveur soit prêt
    Write-Host "⏳ Attente du démarrage du serveur..." -ForegroundColor Yellow
    Start-Sleep -Seconds 8
    
    # Vérifier si le serveur répond
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8888" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Netlify Dev est prêt!" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Le serveur tarde à démarrer, mais on continue..." -ForegroundColor Yellow
    }
    Write-Host ""
}

# Lancer le test d'email
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📧 Test d'envoi d'email de commande" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

node test-email-commande.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✨ Test réussi!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "Le système d'envoi d'emails fonctionne correctement!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pour tester avec l'interface web:" -ForegroundColor Cyan
    Write-Host "  1. Ouvrez http://localhost:8888/pages/commandes.html" -ForegroundColor White
    Write-Host "  2. Ajoutez des produits au panier" -ForegroundColor White
    Write-Host "  3. Passez une commande" -ForegroundColor White
    Write-Host "  4. Vérifiez votre email!" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "❌ Le test a échoué" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vérifications:" -ForegroundColor Yellow
    Write-Host "  1. Netlify Dev est-il démarré?" -ForegroundColor White
    Write-Host "  2. La clé API Resend est-elle valide?" -ForegroundColor White
    Write-Host "  3. Le fichier .env est-il configuré?" -ForegroundColor White
    Write-Host ""
}

# Arrêter Netlify Dev si on l'a démarré
if ($netlifyJob) {
    Write-Host "🛑 Arrêt de Netlify Dev..." -ForegroundColor Yellow
    Stop-Job -Job $netlifyJob
    Remove-Job -Job $netlifyJob
}
