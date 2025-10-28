# Script d'optimisation des images de produits
# Redimensionne et compresse les images pour le web

param(
    [int]$MaxWidth = 800,
    [int]$MaxHeight = 600,
    [int]$Quality = 85
)

$productsPath = "$PSScriptRoot\products"

Write-Host "🔧 Optimisation des images de produits" -ForegroundColor Cyan
Write-Host "   Dimensions max: ${MaxWidth}x${MaxHeight}px" -ForegroundColor Gray
Write-Host "   Qualité: $Quality%" -ForegroundColor Gray
Write-Host ""

# Vérifier si le dossier existe
if (!(Test-Path $productsPath)) {
    Write-Host "❌ Le dossier products n'existe pas!" -ForegroundColor Red
    exit 1
}

# Vérifier si .NET System.Drawing est disponible
try {
    Add-Type -AssemblyName System.Drawing
    $hasSystemDrawing = $true
} catch {
    Write-Host "⚠️  System.Drawing non disponible. Installation requise." -ForegroundColor Yellow
    $hasSystemDrawing = $false
}

if (!$hasSystemDrawing) {
    Write-Host ""
    Write-Host "💡 Pour optimiser les images, vous pouvez:" -ForegroundColor Yellow
    Write-Host "   1. Utiliser un service en ligne comme TinyPNG (https://tinypng.com)" -ForegroundColor Yellow
    Write-Host "   2. Utiliser GIMP ou Photoshop" -ForegroundColor Yellow
    Write-Host "   3. Installer ImageMagick: winget install ImageMagick" -ForegroundColor Yellow
    Write-Host ""
    
    # Vérifier si ImageMagick est installé
    $magick = Get-Command magick -ErrorAction SilentlyContinue
    if ($magick) {
        Write-Host "✅ ImageMagick détecté! Utilisation..." -ForegroundColor Green
        $useImageMagick = $true
    } else {
        Write-Host "❌ Aucun outil d'optimisation disponible." -ForegroundColor Red
        exit 1
    }
}

# Obtenir toutes les images
$images = Get-ChildItem -Path $productsPath -Include *.jpg,*.jpeg,*.png -Recurse

if ($images.Count -eq 0) {
    Write-Host "❌ Aucune image trouvée dans le dossier products" -ForegroundColor Red
    exit 1
}

Write-Host "📊 $($images.Count) image(s) trouvée(s)" -ForegroundColor Cyan
Write-Host ""

$totalOriginalSize = 0
$totalOptimizedSize = 0
$optimizedCount = 0

foreach ($image in $images) {
    $originalSize = $image.Length
    $totalOriginalSize += $originalSize
    
    Write-Host "🖼️  $($image.Name) ($([math]::Round($originalSize / 1KB, 2)) KB)..." -NoNewline
    
    try {
        if ($useImageMagick) {
            # Utiliser ImageMagick
            $tempFile = Join-Path $env:TEMP "temp_$($image.Name)"
            
            & magick convert $image.FullName `
                -resize "${MaxWidth}x${MaxHeight}>" `
                -quality $Quality `
                -strip `
                $tempFile
            
            if (Test-Path $tempFile) {
                $newSize = (Get-Item $tempFile).Length
                
                # Remplacer seulement si le fichier est plus petit
                if ($newSize -lt $originalSize) {
                    Move-Item $tempFile $image.FullName -Force
                    $totalOptimizedSize += $newSize
                    $savings = $originalSize - $newSize
                    $savingsPercent = [math]::Round(($savings / $originalSize) * 100, 1)
                    Write-Host " ✅ -$savingsPercent% ($([math]::Round($newSize / 1KB, 2)) KB)" -ForegroundColor Green
                    $optimizedCount++
                } else {
                    Remove-Item $tempFile -Force
                    $totalOptimizedSize += $originalSize
                    Write-Host " ⏭️  Déjà optimisée" -ForegroundColor Yellow
                }
            }
        } else {
            # Utiliser System.Drawing (PowerShell natif)
            $img = [System.Drawing.Image]::FromFile($image.FullName)
            
            # Calculer les nouvelles dimensions
            $ratio = [Math]::Min($MaxWidth / $img.Width, $MaxHeight / $img.Height)
            
            if ($ratio -lt 1) {
                $newWidth = [int]($img.Width * $ratio)
                $newHeight = [int]($img.Height * $ratio)
                
                $newImg = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
                $graphics = [System.Drawing.Graphics]::FromImage($newImg)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.DrawImage($img, 0, 0, $newWidth, $newHeight)
                
                # Sauvegarder avec compression
                $tempFile = Join-Path $env:TEMP "temp_$($image.Name)"
                $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
                    [System.Drawing.Imaging.Encoder]::Quality, $Quality)
                $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | 
                    Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
                
                $newImg.Save($tempFile, $jpegCodec, $encoderParams)
                
                $graphics.Dispose()
                $newImg.Dispose()
                $img.Dispose()
                
                $newSize = (Get-Item $tempFile).Length
                
                if ($newSize -lt $originalSize) {
                    Move-Item $tempFile $image.FullName -Force
                    $totalOptimizedSize += $newSize
                    $savings = $originalSize - $newSize
                    $savingsPercent = [math]::Round(($savings / $originalSize) * 100, 1)
                    Write-Host " ✅ -$savingsPercent% ($([math]::Round($newSize / 1KB, 2)) KB)" -ForegroundColor Green
                    $optimizedCount++
                } else {
                    Remove-Item $tempFile -Force
                    $totalOptimizedSize += $originalSize
                    Write-Host " ⏭️  Déjà optimisée" -ForegroundColor Yellow
                }
            } else {
                $img.Dispose()
                $totalOptimizedSize += $originalSize
                Write-Host " ⏭️  Dimensions OK" -ForegroundColor Yellow
            }
        }
    } catch {
        Write-Host " ❌ Erreur" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
        $totalOptimizedSize += $originalSize
    }
}

Write-Host ""
Write-Host "📊 Résumé de l'optimisation:" -ForegroundColor Cyan
Write-Host "   Images traitées: $($images.Count)" -ForegroundColor White
Write-Host "   Images optimisées: $optimizedCount" -ForegroundColor Green
Write-Host "   Taille originale: $([math]::Round($totalOriginalSize / 1MB, 2)) MB" -ForegroundColor White
Write-Host "   Taille finale: $([math]::Round($totalOptimizedSize / 1MB, 2)) MB" -ForegroundColor Green

if ($totalOriginalSize -gt $totalOptimizedSize) {
    $totalSavings = $totalOriginalSize - $totalOptimizedSize
    $totalSavingsPercent = [math]::Round(($totalSavings / $totalOriginalSize) * 100, 1)
    Write-Host "   Économie: $([math]::Round($totalSavings / 1MB, 2)) MB (-$totalSavingsPercent%)" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Optimisation terminée!" -ForegroundColor Green
