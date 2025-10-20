# Script PowerShell pour ajouter le système de commentaires à toutes les recettes
# Utilisation : .\add-comments-to-all-recipes.ps1

Write-Host "🔧 Ajout du système de commentaires à toutes les recettes..." -ForegroundColor Cyan
Write-Host ""

# Chemin du dossier des recettes
$recipesFolder = "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Livre\Recettes"

# Obtenir tous les fichiers HTML sauf les fichiers de configuration
$recipeFiles = Get-ChildItem -Path $recipesFolder -Filter "*.html" | Where-Object { 
    $_.Name -ne "iframe-styles.css" 
}

$modifiedCount = 0
$skippedCount = 0
$errorCount = 0

# Préparer les snippets à ajouter
$cssComment = [char]60 + "!-- Système de commentaires --" + [char]62
$cssLink = [char]60 + 'link rel="stylesheet" href="comments.css"' + [char]62

$jsComment = [char]60 + "!-- Système de commentaires --" + [char]62
$jsScript = [char]60 + 'script src="comments.js"' + [char]62 + [char]60 + '/script' + [char]62

$commentsSection = @"
        
        $($cssComment.Replace('!--', '!-- ').Replace('-->', ' -->'))
        <div class="comments-section">
            <div id="comments-container"></div>
        </div>
    </div>
"@

foreach ($file in $recipeFiles) {
    Write-Host "📄 Traitement de : $($file.Name)" -ForegroundColor Yellow
    
    try {
        # Lire le contenu du fichier
        $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
        
        # Vérifier si les commentaires sont déjà présents
        if ($content -match "comments\.css" -or $content -match "comments\.js") {
            Write-Host "   ⏭️  Déjà configuré - ignoré" -ForegroundColor Gray
            $skippedCount++
            continue
        }
        
        $modified = $false
        
        # 1. Ajouter le CSS dans le head
        if ($content -match '(<link href="https://cdn\.jsdelivr\.net/npm/bootstrap@[\d.]+/dist/css/bootstrap\.min\.css" rel="stylesheet">)') {
            $bootstrapLink = $matches[1]
            $newSection = $bootstrapLink + "`n    `n    " + $cssComment + "`n    " + $cssLink
            $content = $content -replace [regex]::Escape($bootstrapLink), $newSection
            $modified = $true
            Write-Host "   ✅ CSS ajouté" -ForegroundColor Green
        }
        
        # 2. Ajouter le JavaScript
        if ($content -match '(<script src="https://cdn\.jsdelivr\.net/npm/bootstrap@[\d.]+/dist/js/bootstrap\.bundle\.min\.js"></script>)') {
            $bootstrapScript = $matches[1]
            $newSection = $bootstrapScript + "`n    `n    " + $jsComment + "`n    " + $jsScript
            $content = $content -replace [regex]::Escape($bootstrapScript), $newSection
            $modified = $true
            Write-Host "   ✅ JavaScript ajouté" -ForegroundColor Green
        }
        
        # 3. Ajouter la section commentaires
        if ($content -match '        </div>\s*</div>\s*    </div>') {
            $oldEnding = $matches[0]
            $newEnding = "        </div>`n        `n        " + $cssComment.Replace('!--', '!-- ').Replace('-->', ' -->') + "`n        <div class=`"comments-section`">`n            <div id=`"comments-container`"></div>`n        </div>`n    </div>"
            $content = $content -replace [regex]::Escape($oldEnding), $newEnding
            $modified = $true
            Write-Host "   ✅ Section commentaires ajoutée" -ForegroundColor Green
        }
        
        # Sauvegarder si modifié
        if ($modified) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
            $modifiedCount++
            Write-Host "   ✔️  Fichier sauvegardé avec succès" -ForegroundColor Cyan
        } else {
            Write-Host "   ⚠️  Aucune modification effectuée" -ForegroundColor Magenta
            $skippedCount++
        }
        
    } catch {
        Write-Host "   ❌ Erreur : $_" -ForegroundColor Red
        $errorCount++
    }
    
    Write-Host ""
}

# Résumé
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RÉSUMÉ" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ Fichiers modifiés : $modifiedCount" -ForegroundColor Green
Write-Host "⏭️  Fichiers ignorés  : $skippedCount" -ForegroundColor Yellow
Write-Host "❌ Erreurs           : $errorCount" -ForegroundColor Red
Write-Host "📁 Total             : $($recipeFiles.Count)" -ForegroundColor White
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($modifiedCount -gt 0) {
    Write-Host "✨ Système de commentaires ajouté avec succès !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Prochaines étapes :" -ForegroundColor Yellow
    Write-Host "   1. Testez localement en ouvrant une recette dans votre navigateur" -ForegroundColor White
    Write-Host "   2. Lisez README-COMMENTAIRES.md pour configurer Giscus" -ForegroundColor White
    Write-Host "   3. Commitez et poussez les changements vers GitHub" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Pour activer Giscus (recommandé pour production) :" -ForegroundColor Cyan
    Write-Host "   Suivez les instructions dans Livre/Recettes/README-COMMENTAIRES.md" -ForegroundColor White
}

Write-Host ""
Write-Host "Terminé ! 🎉" -ForegroundColor Green
