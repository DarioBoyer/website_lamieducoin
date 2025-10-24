# Script pour ajouter les propriétés inventoryQuantity et productType aux produits
# Update products with inventory quantity and product type

$jsonPath = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le fichier JSON
$json = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Ajouter les nouvelles propriétés à chaque produit
foreach ($product in $json.products) {
    # Ajouter la quantité d'inventaire (valeur par défaut: 50 pour produits disponibles, 0 sinon)
    $product | Add-Member -NotePropertyName "inventoryQuantity" -NotePropertyValue $(if ($product.available) { 50 } else { 0 }) -Force
    
    # Ajouter le type de produit (retail = vente au détail, production = pour production)
    # Par défaut, tous les produits sont pour la vente au détail
    $product | Add-Member -NotePropertyName "productType" -NotePropertyValue "retail" -Force
}

# Sauvegarder le fichier JSON avec une indentation correcte
$json | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8

Write-Host "✅ Propriétés ajoutées avec succès à tous les produits!" -ForegroundColor Green
Write-Host "   - inventoryQuantity: Quantité en inventaire (défaut: 50)" -ForegroundColor Cyan
Write-Host "   - productType: Type de produit (défaut: 'retail')" -ForegroundColor Cyan
