# Script de lancement pour tester la page produits
# Auteur: La mie du coin
# Date: 27 octobre 2025

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "   🍞 LA MIE DU COIN - TEST PRODUITS" -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier si on est dans le bon dossier
$currentPath = Get-Location
Write-Host "📂 Dossier actuel: $currentPath" -ForegroundColor Gray
Write-Host ""

# Vérifier si Python est installé
Write-Host "🔍 Vérification de Python..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python trouvé: $pythonVersion" -ForegroundColor Green
    $usePython = $true
} catch {
    Write-Host "❌ Python non trouvé" -ForegroundColor Red
    $usePython = $false
}

Write-Host ""

# Vérifier si Node.js est installé
Write-Host "🔍 Vérification de Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js trouvé: $nodeVersion" -ForegroundColor Green
    $useNode = $true
} catch {
    Write-Host "❌ Node.js non trouvé" -ForegroundColor Red
    $useNode = $false
}

Write-Host ""
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Menu de choix
Write-Host "Que voulez-vous tester?" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. 🌐 Page produits complète (produits.html)" -ForegroundColor White
Write-Host "2. 🧪 Page de test Supabase (test-supabase-produits.html)" -ForegroundColor White
Write-Host "3. 📊 Les deux pages (côte à côte)" -ForegroundColor White
Write-Host "4. ❌ Annuler" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Votre choix (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Lancement de la page produits..." -ForegroundColor Cyan
        $page = "pages/produits.html"
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Lancement de la page de test..." -ForegroundColor Cyan
        $page = "pages/test-supabase-produits.html"
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Lancement des deux pages..." -ForegroundColor Cyan
        $dual = $true
    }
    "4" {
        Write-Host ""
        Write-Host "👋 Au revoir!" -ForegroundColor Yellow
        exit
    }
    default {
        Write-Host ""
        Write-Host "❌ Choix invalide!" -ForegroundColor Red
        exit
    }
}

Write-Host ""

# Démarrer le serveur
if ($usePython) {
    Write-Host "🌐 Démarrage du serveur Python sur http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Pour arrêter le serveur, appuyez sur Ctrl+C" -ForegroundColor Yellow
    Write-Host ""
    
    # Ouvrir la/les page(s) dans le navigateur
    Start-Sleep -Seconds 1
    
    if ($dual) {
        Start-Process "http://localhost:8000/pages/produits.html"
        Start-Sleep -Milliseconds 500
        Start-Process "http://localhost:8000/pages/test-supabase-produits.html"
    } else {
        Start-Process "http://localhost:8000/$page"
    }
    
    # Démarrer le serveur Python
    python -m http.server 8000
    
} elseif ($useNode) {
    Write-Host "🌐 Installation de http-server..." -ForegroundColor Cyan
    npm install -g http-server 2>&1 | Out-Null
    
    Write-Host "🌐 Démarrage du serveur Node.js sur http://localhost:8000" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  Pour arrêter le serveur, appuyez sur Ctrl+C" -ForegroundColor Yellow
    Write-Host ""
    
    # Ouvrir la/les page(s) dans le navigateur
    Start-Sleep -Seconds 1
    
    if ($dual) {
        Start-Process "http://localhost:8000/pages/produits.html"
        Start-Sleep -Milliseconds 500
        Start-Process "http://localhost:8000/pages/test-supabase-produits.html"
    } else {
        Start-Process "http://localhost:8000/$page"
    }
    
    # Démarrer le serveur Node.js
    npx http-server -p 8000
    
} else {
    Write-Host "❌ Impossible de démarrer un serveur!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Veuillez installer:" -ForegroundColor Yellow
    Write-Host "  - Python: https://www.python.org/downloads/" -ForegroundColor Gray
    Write-Host "  - OU Node.js: https://nodejs.org/" -ForegroundColor Gray
    Write-Host ""
    
    # Option de secours : ouvrir directement (peut ne pas fonctionner avec les modules ES6)
    Write-Host "Voulez-vous essayer d'ouvrir la page directement? (Peut ne pas fonctionner)" -ForegroundColor Yellow
    $tryAnyway = Read-Host "Oui/Non (O/N)"
    
    if ($tryAnyway -eq "O" -or $tryAnyway -eq "o") {
        if ($dual) {
            Start-Process "pages/produits.html"
            Start-Process "pages/test-supabase-produits.html"
        } else {
            Start-Process $page
        }
    }
}
