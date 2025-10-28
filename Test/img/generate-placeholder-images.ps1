# Script de génération d'images placeholder pour les produits
# Crée des images temporaires avec canvas HTML5 et emojis

param(
    [switch]$Force
)

$productsImagePath = "$PSScriptRoot\products"
$imageWidth = 800
$imageHeight = 600

# Liste des produits avec leurs emojis
$products = @(
    @{name="pain-blanc-classique.jpg"; emoji="🍞"; bg="#F5E6D3"},
    @{name="pain-blanc-sans-sucre.jpg"; emoji="🍞"; bg="#F5E6D3"},
    @{name="baguette-francaise.jpg"; emoji="🥖"; bg="#F4E4C1"},
    @{name="baguette-tradition.jpg"; emoji="🥖"; bg="#F4E4C1"},
    @{name="pain-de-campagne.jpg"; emoji="🌾"; bg="#E8D7C3"},
    @{name="pain-integral-classique.jpg"; emoji="🌾"; bg="#D4C4A8"},
    @{name="pain-integral-graines.jpg"; emoji="🌾"; bg="#D4C4A8"},
    @{name="pain-integral-levain.jpg"; emoji="🌾"; bg="#D4C4A8"},
    @{name="pain-aux-noix.jpg"; emoji="🌰"; bg="#E6D5C3"},
    @{name="pain-au-fromage.jpg"; emoji="🧀"; bg="#FFE5B4"},
    @{name="pain-grilled-cheese.jpg"; emoji="🧀"; bg="#FFE5B4"},
    @{name="miche-a-soupe.jpg"; emoji="🥣"; bg="#F5E6D3"},
    @{name="petits-pains-salade.jpg"; emoji="🍞"; bg="#F5E6D3"},
    @{name="pain-sous-marin.jpg"; emoji="🍞"; bg="#F5E6D3"},
    @{name="muffins-anglais.jpg"; emoji="🥐"; bg="#F4E4C1"},
    @{name="croissants-francais.jpg"; emoji="🥐"; bg="#F9E4B7"},
    @{name="pains-au-chocolat.jpg"; emoji="🍫"; bg="#D4A574"},
    @{name="brioche-maison.jpg"; emoji="🥐"; bg="#FFD700"},
    @{name="bagel-everything.jpg"; emoji="🥯"; bg="#E8D5B7"},
    @{name="bretzel-classique.jpg"; emoji="🥨"; bg="#D2B48C"},
    @{name="bretzel-bouchees.jpg"; emoji="🥨"; bg="#D2B48C"},
    @{name="bretzel-cannelle-sucre.jpg"; emoji="🥨"; bg="#DEB887"},
    @{name="pain-sans-gluten-classique.jpg"; emoji="🌿"; bg="#E8F5E9"},
    @{name="baguette-sans-gluten.jpg"; emoji="🌿"; bg="#E8F5E9"},
    @{name="pain-sans-gluten-graines.jpg"; emoji="🌿"; bg="#C8E6C9"},
    @{name="focaccia-italienne.jpg"; emoji="🍅"; bg="#FFF3E0"},
    @{name="fougasse-provencale.jpg"; emoji="🫒"; bg="#E8F5E9"}
)

Write-Host "🎨 Génération des images placeholder pour les produits" -ForegroundColor Cyan
Write-Host ""

# Vérifier si le dossier existe
if (!(Test-Path $productsImagePath)) {
    New-Item -ItemType Directory -Path $productsImagePath -Force | Out-Null
}

# Créer un fichier HTML temporaire pour générer les images
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Image Generator</title>
</head>
<body>
    <canvas id="canvas" width="$imageWidth" height="$imageHeight"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        function generateImage(emoji, bgColor, filename) {
            // Fond dégradé
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, adjustBrightness(bgColor, -20));
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Ajouter un pattern subtil
            ctx.globalAlpha = 0.1;
            for (let i = 0; i < 50; i++) {
                ctx.fillStyle = '#fff';
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 3;
                ctx.fillRect(x, y, size, size);
            }
            ctx.globalAlpha = 1;
            
            // Emoji géant au centre
            ctx.font = '300px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Ombre portée pour l'emoji
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            
            ctx.fillText(emoji, canvas.width / 2, canvas.height / 2);
            
            // Reset shadow
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Texte "Placeholder" en bas
            ctx.font = 'bold 24px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText('Placeholder Image', canvas.width / 2, canvas.height - 40);
            
            return canvas.toDataURL('image/jpeg', 0.9);
        }
        
        function adjustBrightness(color, amount) {
            const num = parseInt(color.replace('#', ''), 16);
            const r = Math.max(0, Math.min(255, (num >> 16) + amount));
            const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
            const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
            return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
        }
        
        // Export function for PowerShell
        window.generatePlaceholder = generateImage;
    </script>
</body>
</html>
"@

$tempHtml = Join-Path $env:TEMP "placeholder-generator.html"
$htmlContent | Out-File -FilePath $tempHtml -Encoding UTF8

Write-Host "⚙️  Utilisation de la méthode alternative..." -ForegroundColor Yellow
Write-Host ""

# Créer des images SVG comme placeholder (alternative plus simple)
foreach ($product in $products) {
    $imagePath = Join-Path $productsImagePath $product.name
    
    # Vérifier si l'image existe déjà et si on n'a pas forcé la régénération
    if ((Test-Path $imagePath) -and !$Force) {
        Write-Host "⏭️  $($product.name) - Déjà présente" -ForegroundColor Yellow
        continue
    }
    
    # Créer une image SVG
    $svgPath = $imagePath -replace '.jpg$', '.svg'
    
    $svgContent = @"
<svg width="$imageWidth" height="$imageHeight" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad$($product.name -replace '[^a-zA-Z0-9]', '')" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:$($product.bg);stop-opacity:1" />
            <stop offset="100%" style="stop-color:$($product.bg);stop-opacity:0.8" />
        </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad$($product.name -replace '[^a-zA-Z0-9]', ''))" />
    <text x="50%" y="50%" font-size="250" text-anchor="middle" dominant-baseline="middle" 
          filter="drop-shadow(3px 3px 2px rgba(0,0,0,0.3))">$($product.emoji)</text>
    <text x="50%" y="90%" font-size="24" text-anchor="middle" fill="rgba(0,0,0,0.5)" 
          font-family="Arial, sans-serif" font-weight="bold">PLACEHOLDER</text>
</svg>
"@
    
    try {
        $svgContent | Out-File -FilePath $svgPath -Encoding UTF8
        Write-Host "✅ $($product.name -replace '.jpg$', '.svg') - Créé" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur pour $($product.name): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📊 Images SVG placeholder créées avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Note: Les fichiers SVG ont été créés. Pour de vraies photos:" -ForegroundColor Yellow
Write-Host "   1. Utilisez le script download-product-images.ps1" -ForegroundColor Yellow
Write-Host "   2. Ou téléchargez manuellement depuis Unsplash/Pexels" -ForegroundColor Yellow
Write-Host "   3. Ou prenez vos propres photos des produits" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔄 Pour utiliser les SVG dans votre application:" -ForegroundColor Cyan
Write-Host "   Mettez à jour les chemins d'images de .jpg à .svg dans votre BD" -ForegroundColor Cyan
