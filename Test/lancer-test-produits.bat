@echo off
chcp 65001 >nul
cls

echo ==========================================
echo    🍞 LA MIE DU COIN - TEST PRODUITS
echo ==========================================
echo.

REM Vérifier Python
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python trouvé
    set PYTHON_FOUND=1
) else (
    echo ❌ Python non trouvé
    set PYTHON_FOUND=0
)

REM Vérifier Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js trouvé
    set NODE_FOUND=1
) else (
    echo ❌ Node.js non trouvé
    set NODE_FOUND=0
)

echo.
echo ==========================================
echo.
echo Que voulez-vous tester?
echo.
echo 1. 🌐 Page produits complète
echo 2. 🧪 Page de test Supabase
echo 3. ❌ Annuler
echo.

set /p choice="Votre choix (1-3): "

if "%choice%"=="1" (
    set PAGE=pages/produits.html
    goto :start_server
)
if "%choice%"=="2" (
    set PAGE=pages/test-supabase-produits.html
    goto :start_server
)
if "%choice%"=="3" (
    echo.
    echo 👋 Au revoir!
    timeout /t 2 >nul
    exit /b
)

echo.
echo ❌ Choix invalide!
timeout /t 2 >nul
exit /b

:start_server
echo.

if %PYTHON_FOUND% equ 1 (
    echo 🌐 Démarrage du serveur Python...
    echo.
    echo 📂 Ouvrir dans le navigateur:
    echo    http://localhost:8000/%PAGE%
    echo.
    echo ⚠️  Pour arrêter le serveur: Ctrl+C
    echo.
    
    REM Attendre un peu puis ouvrir le navigateur
    start "" timeout /t 2 /nobreak ^& start http://localhost:8000/%PAGE%
    
    REM Démarrer le serveur
    python -m http.server 8000
    
) else if %NODE_FOUND% equ 1 (
    echo 🌐 Démarrage du serveur Node.js...
    echo.
    echo 📂 Ouvrir dans le navigateur:
    echo    http://localhost:8000/%PAGE%
    echo.
    echo ⚠️  Pour arrêter le serveur: Ctrl+C
    echo.
    
    REM Attendre un peu puis ouvrir le navigateur
    start "" timeout /t 2 /nobreak ^& start http://localhost:8000/%PAGE%
    
    REM Démarrer le serveur
    npx http-server -p 8000
    
) else (
    echo ❌ Impossible de démarrer un serveur!
    echo.
    echo Veuillez installer:
    echo   - Python: https://www.python.org/downloads/
    echo   - OU Node.js: https://nodejs.org/
    echo.
    pause
)
