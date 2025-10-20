# Système de Commentaires pour les Recettes

## 📝 Vue d'ensemble

Ce système permet aux visiteurs d'ajouter des commentaires, notes et astuces sur chaque recette. Les commentaires sont **conservés de manière permanente** pour ne pas perdre les informations précieuses des utilisateurs.

## 🔧 Deux Options de Configuration

### Option 1 : Commentaires Locaux (localStorage) - **Actif par défaut**

**Avantages :**
- ✅ Fonctionne immédiatement sans configuration
- ✅ Parfait pour tester localement
- ✅ Aucune dépendance externe

**Inconvénients :**
- ❌ Les commentaires sont stockés uniquement dans le navigateur de l'utilisateur
- ❌ Ne sont pas partagés entre différents utilisateurs
- ❌ Perdus si l'utilisateur vide son cache navigateur

**Utilisation actuelle :** Cette option est active par défaut.

### Option 2 : Giscus (GitHub Discussions) - **Recommandé pour la production**

**Avantages :**
- ✅ Les commentaires sont stockés dans GitHub Discussions (permanents)
- ✅ Partagés entre tous les visiteurs
- ✅ Les utilisateurs peuvent se connecter avec leur compte GitHub
- ✅ Gratuit et sans limite
- ✅ Possibilité de modérer les commentaires
- ✅ Réactions (👍 👎 ❤️ etc.)

**Configuration requise :**

1. **Activer GitHub Discussions sur le repository :**
   - Aller sur https://github.com/DarioBoyer/website_lamieducoin
   - Cliquer sur "Settings"
   - Dans la section "Features", cocher "Discussions"

2. **Installer l'application Giscus :**
   - Aller sur https://github.com/apps/giscus
   - Cliquer sur "Install"
   - Sélectionner le repository `website_lamieducoin`

3. **Obtenir les IDs de configuration :**
   - Aller sur https://giscus.app/fr
   - Entrer : `DarioBoyer/website_lamieducoin`
   - Choisir la catégorie : "Announcements" ou créer une nouvelle catégorie "Recettes - Commentaires"
   - Copier les valeurs de `data-repo-id` et `data-category-id`

4. **Mettre à jour le fichier `comments.js` :**
   ```javascript
   const GISCUS_CONFIG = {
       repo: 'DarioBoyer/website_lamieducoin',
       repoId: 'VOTRE_REPO_ID_ICI',           // ← À remplir
       category: 'Recettes - Commentaires',
       categoryId: 'VOTRE_CATEGORY_ID_ICI',   // ← À remplir
       // ... reste de la config
   };
   ```

5. **Activer Giscus dans `comments.js` :**
   Remplacer à la fin du fichier :
   ```javascript
   // Avant :
   initLocalComments();
   
   // Après :
   initComments();
   ```

## 📋 Intégration dans une Recette

Pour ajouter les commentaires à une recette, ajouter ces 3 éléments dans le fichier HTML :

### 1. Dans le `<head>`, ajouter le CSS :
```html
<link rel="stylesheet" href="comments.css">
```

### 2. Avant la fermeture du `</body>`, ajouter le JavaScript :
```html
<script src="comments.js"></script>
```

### 3. Dans le contenu, ajouter le container de commentaires :
```html
<div class="recipe-container">
    <!-- ... contenu de la recette ... -->
    
    <!-- Section Commentaires -->
    <div class="comments-section">
        <div id="comments-container"></div>
    </div>
</div>
```

## 🎨 Exemple Complet

Voir le fichier `pain-blanc-classique.html` pour un exemple d'intégration complète.

## 🔄 Migration de localStorage vers Giscus

**Note importante :** Les commentaires stockés localement (localStorage) ne seront PAS automatiquement migrés vers Giscus. C'est normal car localStorage est personnel à chaque utilisateur.

Quand vous activerez Giscus :
- Les nouveaux commentaires seront visibles par tous
- Les anciens commentaires localStorage resteront visibles uniquement pour l'utilisateur qui les a créés
- Vous pouvez demander aux utilisateurs de re-poster leurs commentaires importants

## 🛠️ Personnalisation

### Changer les couleurs
Modifiez les couleurs dans `comments.css` :
```css
.comment-item {
    background: #fff9f0;        /* Fond du commentaire */
    border-left: 5px solid #D2691E;  /* Bordure gauche */
}
```

### Changer le thème Giscus
Dans `comments.js`, modifiez :
```javascript
theme: 'light',  // Options : 'light', 'dark', 'dark_dimmed', etc.
```

### Activer/désactiver les réactions
Dans `comments.js`, modifiez :
```javascript
reactionsEnabled: '1',  // '1' = activé, '0' = désactivé
```

## 📊 Statistiques et Modération

Avec Giscus, vous pouvez :
- Voir tous les commentaires sur : https://github.com/DarioBoyer/website_lamieducoin/discussions
- Modérer, éditer ou supprimer des commentaires inappropriés
- Répondre directement aux commentaires
- Voir les statistiques d'engagement

## 🆘 Dépannage

### Les commentaires n'apparaissent pas
1. Vérifier que les fichiers `comments.js` et `comments.css` sont bien liés
2. Ouvrir la console du navigateur (F12) pour voir les erreurs
3. Vérifier que le container `<div id="comments-container"></div>` existe

### Giscus ne charge pas
1. Vérifier que GitHub Discussions est activé
2. Vérifier que les IDs (repoId, categoryId) sont corrects
3. Vérifier que l'application Giscus est installée sur le repository

### Les commentaires localStorage disparaissent
- Normal si l'utilisateur vide son cache
- C'est pourquoi Giscus est recommandé pour la production

## 📝 Notes

- **localStorage** : Parfait pour développement et tests locaux
- **Giscus** : Recommandé dès que le site est public pour conserver réellement les commentaires

## 🔗 Ressources

- Documentation Giscus : https://giscus.app/fr
- GitHub Discussions : https://docs.github.com/en/discussions
