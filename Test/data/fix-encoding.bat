@echo off
chcp 65001 > nul
echo ╔════════════════════════════════════════════════════════════╗
echo ║  Correction d'Encodage - La Mie du Coin                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Correction des icônes et caractères accentués en cours...
echo.

python fix_encoding_master.py

echo.
echo ════════════════════════════════════════════════════════════
echo.
echo Appuyez sur une touche pour fermer...
pause > nul
