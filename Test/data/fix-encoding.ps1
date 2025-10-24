# Script pour corriger l'encodage des émojis dans products.json
$filePath = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le fichier en UTF-8
$content = Get-Content -Path $filePath -Raw -Encoding UTF8

# Mapping des émojis corrompus vers les bons émojis
$replacements = @{
    'ðŸž' = '🍞'           # Pain
    'ðŸ¥–' = '🥖'          # Baguette
    'ðŸŒ¾' = '🌾'          # Blé
    'ðŸ¥' = '🥨'           # Bretzel
    'ðŸ¥ž' = '🥞'          # Crêpes
    'ðŸ¥\u2013' = '🥯'     # Bagel
    'ðŸ¥\u0090' = '🥐'     # Croissant
    'ðŸ§€' = '🧀'          # Fromage
    'ðŸŒ°' = '🌰'          # Noix
    'ðŸŒ¿' = '🌿'          # Herbes
    'ðŸ…' = '🍅'           # Tomate
    'ðŸ«'' = '🫒'         # Olive
    'ðŸ§‚' = '🧂'          # Sel
    'Ã ' = 'à'
    'Ã©' = 'é'
    'Ã¨' = 'è'
    'Ãª' = 'ê'
    'Ã®' = 'î'
    'Ã´' = 'ô'
    'Ã»' = 'û'
    'Ã§' = 'ç'
    'Ã‰' = 'É'
    'Ã€' = 'À'
    '\u0027' = "'"
}

# Appliquer les remplacements
foreach ($key in $replacements.Keys) {
    $content = $content -replace [regex]::Escape($key), $replacements[$key]
}

# Sauvegarder le fichier corrigé avec BOM UTF-8
$utf8 = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText($filePath, $content, $utf8)

Write-Host "Encodage corrigé avec succès!" -ForegroundColor Green
