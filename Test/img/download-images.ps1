# Script de téléchargement des images de produits depuis Unsplash
$productsImagePath = Join-Path $PSScriptRoot "products"
$imageWidth = 800
$imageHeight = 600

$products = @(
    @{name="pain-blanc-classique.jpg"; query="white+bread+loaf"}
    @{name="pain-blanc-sans-sucre.jpg"; query="white+sandwich+bread"}
    @{name="baguette-francaise.jpg"; query="french+baguette"}
    @{name="baguette-tradition.jpg"; query="baguette+artisan"}
    @{name="pain-de-campagne.jpg"; query="country+bread"}
    @{name="pain-integral-classique.jpg"; query="whole+wheat+bread"}
    @{name="pain-integral-graines.jpg"; query="seed+bread"}
    @{name="pain-integral-levain.jpg"; query="sourdough+bread"}
    @{name="pain-aux-noix.jpg"; query="walnut+bread"}
    @{name="pain-au-fromage.jpg"; query="cheese+bread"}
    @{name="pain-grilled-cheese.jpg"; query="sandwich+bread"}
    @{name="miche-a-soupe.jpg"; query="bread+bowl"}
    @{name="petits-pains-salade.jpg"; query="dinner+rolls"}
    @{name="pain-sous-marin.jpg"; query="submarine+bread"}
    @{name="muffins-anglais.jpg"; query="english+muffins"}
    @{name="croissants-francais.jpg"; query="french+croissant"}
    @{name="pains-au-chocolat.jpg"; query="pain+au+chocolat"}
    @{name="brioche-maison.jpg"; query="brioche+bread"}
    @{name="bagel-everything.jpg"; query="bagel"}
    @{name="bretzel-classique.jpg"; query="pretzel"}
    @{name="bretzel-bouchees.jpg"; query="pretzel+bites"}
    @{name="bretzel-cannelle-sucre.jpg"; query="cinnamon+pretzel"}
    @{name="pain-sans-gluten-classique.jpg"; query="gluten+free+bread"}
    @{name="baguette-sans-gluten.jpg"; query="gluten+free+baguette"}
    @{name="pain-sans-gluten-graines.jpg"; query="seed+bread"}
    @{name="focaccia-italienne.jpg"; query="focaccia"}
    @{name="fougasse-provencale.jpg"; query="fougasse"}
)

Write-Host "🍞 Téléchargement depuis Unsplash" -ForegroundColor Cyan
if (!(Test-Path $productsImagePath)) { New-Item -ItemType Directory -Path $productsImagePath -Force | Out-Null }

$success = 0
foreach ($p in $products) {
    $path = Join-Path $productsImagePath $p.name
    if (Test-Path $path) { Write-Host "⏭️  $($p.name)" -ForegroundColor Yellow; continue }
    try {
        $url = "https://source.unsplash.com/${imageWidth}x${imageHeight}/?$($p.query)"
        Write-Host "📥 $($p.name)..." -NoNewline
        Invoke-WebRequest -Uri $url -OutFile $path -ErrorAction Stop
        Write-Host " ✅" -ForegroundColor Green
        $success++
        Start-Sleep -Milliseconds 500
    } catch {
        Write-Host " ❌" -ForegroundColor Red
    }
}
Write-Host "`n✅ $success images téléchargées!" -ForegroundColor Green
