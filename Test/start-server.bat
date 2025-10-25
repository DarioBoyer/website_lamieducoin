@echo off
echo Demarrage du serveur local pour l'administration...
echo.
echo Le serveur sera accessible a l'adresse: http://localhost:8000
echo Page d'administration: http://localhost:8000/pagesadmin/products.html
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

cd /d "%~dp0"
python -m http.server 8000
