# Script pour ajouter la propriété status aux produits
# Add status property to products (Active, Inactive, Discontinued)

$jsonPath = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test\data\products.json"

# Lire le fichier JSON
$json = Get-Content $jsonPath -Raw | ConvertFrom-Json

# Ajouter la propriété status à chaque produit
foreach ($product in $json.products) {
    # Déterminer le statut basé sur la disponibilité
    # Si available = true, status = "Active"
    # Si available = false, status = "Inactive"
    # On peut aussi mettre certains produits en "Discontinued" manuellement si nécessaire
    
    $status = if ($product.available) { "Active" } else { "Inactive" }
    
    $product | Add-Member -NotePropertyName "status" -NotePropertyValue $status -Force
}

# Ajouter les traductions de statuts dans les métadonnées si elles n'existent pas déjà
if (-not $json.metadata.PSObject.Properties['productStatuses']) {
    $statusTranslations = @{
        "Active" = @{
            "fr" = "Actif"
            "en" = "Active"
        }
        "Inactive" = @{
            "fr" = "Inactif"
            "en" = "Inactive"
        }
        "Discontinued" = @{
            "fr" = "Discontinué"
            "en" = "Discontinued"
        }
    }
    
    $json.metadata | Add-Member -NotePropertyName "productStatuses" -NotePropertyValue $statusTranslations -Force
}

# Sauvegarder le fichier JSON avec une indentation correcte
$json | ConvertTo-Json -Depth 10 | Set-Content $jsonPath -Encoding UTF8

Write-Host "✅ Propriété status ajoutée avec succès à tous les produits!" -ForegroundColor Green
Write-Host "   - Status possibles: Active, Inactive, Discontinued" -ForegroundColor Cyan
Write-Host "   - Traductions ajoutées dans metadata.productStatuses" -ForegroundColor Cyan
