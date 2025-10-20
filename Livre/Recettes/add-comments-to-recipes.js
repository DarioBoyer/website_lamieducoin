/**
 * Script Node.js pour ajouter le système de commentaires à toutes les recettes
 * Usage: node add-comments-to-recipes.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const RECIPES_DIR = path.join(__dirname);
const CSS_LINK = '    <!-- Système de commentaires -->\n    <link rel="stylesheet" href="comments.css">\n';
const JS_SCRIPT = '    <!-- Système de commentaires -->\n    <script src="comments.js"></script>\n';
const COMMENTS_SECTION = `        
        <!-- Section Commentaires -->
        <div class="comments-section">
            <div id="comments-container"></div>
        </div>
    </div>`;

console.log('🔧 Ajout du système de commentaires à toutes les recettes...\n');

// Lire tous les fichiers HTML du dossier
fs.readdir(RECIPES_DIR, (err, files) => {
    if (err) {
        console.error('❌ Erreur de lecture du dossier:', err);
        return;
    }

    const htmlFiles = files.filter(file => file.endsWith('.html'));
    let modifiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    htmlFiles.forEach(file => {
        const filePath = path.join(RECIPES_DIR, file);
        console.log(`📄 Traitement de : ${file}`);

        try {
            let content = fs.readFileSync(filePath, 'utf8');

            // Vérifier si déjà modifié
            if (content.includes('comments.css') || content.includes('comments.js')) {
                console.log('   ⏭️  Déjà configuré - ignoré\n');
                skippedCount++;
                return;
            }

            let modified = false;

            // 1. Ajouter le CSS après Bootstrap CSS
            const bootstrapCSSRegex = /(<link href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@[\d.]+\/dist\/css\/bootstrap\.min\.css" rel="stylesheet">)/;
            if (bootstrapCSSRegex.test(content)) {
                content = content.replace(bootstrapCSSRegex, '$1\n' + CSS_LINK);
                console.log('   ✅ CSS ajouté');
                modified = true;
            }

            // 2. Ajouter le JavaScript après Bootstrap JS
            const bootstrapJSRegex = /(<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@[\d.]+\/dist\/js\/bootstrap\.bundle\.min\.js"><\/script>)/;
            if (bootstrapJSRegex.test(content)) {
                content = content.replace(bootstrapJSRegex, '$1\n' + JS_SCRIPT);
                console.log('   ✅ JavaScript ajouté');
                modified = true;
            }

            // 3. Ajouter la section commentaires avant la fermeture du recipe-container
            // Chercher différents patterns
            const patterns = [
                /(        <\/div>\s*<\/div>\s*    <\/div>)/,
                /(            <\/div>\s*        <\/div>\s*    <\/div>)/,
                /(                <\/p>\s*            <\/div>\s*        <\/div>\s*    <\/div>)/
            ];

            let sectionAdded = false;
            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    content = content.replace(pattern, (match) => {
                        // Trouver le dernier </div> avant </div>    </div>
                        const lastDiv = match.lastIndexOf('</div>');
                        if (lastDiv !== -1) {
                            return match.substring(0, lastDiv) + '</div>\n' + COMMENTS_SECTION;
                        }
                        return match;
                    });
                    console.log('   ✅ Section commentaires ajoutée');
                    modified = true;
                    sectionAdded = true;
                    break;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log('   ✔️  Fichier sauvegardé avec succès\n');
                modifiedCount++;
            } else {
                console.log('   ⚠️  Aucune modification effectuée\n');
                skippedCount++;
            }

        } catch (error) {
            console.log(`   ❌ Erreur : ${error.message}\n`);
            errorCount++;
        }
    });

    // Résumé
    console.log('═══════════════════════════════════════════');
    console.log('📊 RÉSUMÉ');
    console.log('═══════════════════════════════════════════');
    console.log(`✅ Fichiers modifiés : ${modifiedCount}`);
    console.log(`⏭️  Fichiers ignorés  : ${skippedCount}`);
    console.log(`❌ Erreurs           : ${errorCount}`);
    console.log(`📁 Total             : ${htmlFiles.length}`);
    console.log('═══════════════════════════════════════════\n');

    if (modifiedCount > 0) {
        console.log('✨ Système de commentaires ajouté avec succès !');
        console.log('\n📝 Prochaines étapes :');
        console.log('   1. Testez localement en ouvrant une recette dans votre navigateur');
        console.log('   2. Lisez README-COMMENTAIRES.md pour configurer Giscus');
        console.log('   3. Commitez et poussez les changements vers GitHub');
        console.log('\n💡 Pour activer Giscus (recommandé pour production) :');
        console.log('   Suivez les instructions dans Livre/Recettes/README-COMMENTAIRES.md');
    }

    console.log('\nTerminé ! 🎉');
});
