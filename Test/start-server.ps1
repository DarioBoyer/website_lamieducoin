# Serveur local pour l'administration
# Démarre un serveur HTTP simple pour éviter les problèmes CORS

Write-Host "Démarrage du serveur local pour l'administration..." -ForegroundColor Green
Write-Host ""
Write-Host "Le serveur sera accessible à l'adresse: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Page d'administration: http://localhost:8000/pagesadmin/products.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arrêter le serveur" -ForegroundColor Yellow
Write-Host ""

# Changer vers le répertoire Test
Set-Location $PSScriptRoot

# Démarrer le serveur Python
python -m http.server 8000
