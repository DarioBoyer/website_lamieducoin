# Script pour corriger les émojis dans products.json
$filePath = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Charger le JSON
$json = Get-Content -Path $filePath -Raw | ConvertFrom-Json

# Mapping des icônes corrompues vers les bonnes
$iconMap = @{
    'pain-blanc-classique' = '🍞'
    'pain-blanc-sans-sucre' = '🍞'
    'baguette-francaise' = '🥖'
    'baguette-tradition' = '🥖'
    'pain-integral-classique' = '🌾'
    'pain-integral-graines' = '🌾'
    'pain-integral-levain' = '🌾'
    'pain-de-campagne' = '🌾'
    'pain-aux-noix' = '🌰'
    'pain-au-fromage' = '🧀'
    'pain-grilled-cheese' = '🧀'
    'miche-a-soupe' = '🍞'
    'croissants-francais' = '🥐'
    'brioche-maison' = '🥐'
    'muffins-anglais' = '🥐'
    'bretzel-classique' = '🥨'
    'bretzel-cannelle-sucre' = '🥨'
    'bretzel-bouchees' = '🥨'
    'bagel-classique' = '🥯'
    'bagel-everything' = '🥯'
    'crepes-classiques' = '🥞'
    'galettes-sarrasin' = '🥞'
    'baguette-sans-gluten' = '🌿'
    'focaccia-italienne' = '🍅'
    'fougasse-provencale' = '🫒'
}

# Corriger les icônes
foreach ($product in $json.products) {
    if ($iconMap.ContainsKey($product.id)) {
        $product.icon = $iconMap[$product.id]
    }
}

# Sauvegarder avec UTF-8 (sans BOM pour JSON)
$jsonOutput = $json | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($filePath, $jsonOutput, (New-Object System.Text.UTF8Encoding $false))

Write-Host "Icônes corrigées avec succès!" -ForegroundColor Green
