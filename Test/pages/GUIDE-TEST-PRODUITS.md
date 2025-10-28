# Guide de Test - Page Produits Supabase

## 🧪 Tests à effectuer

### 1. Test de connexion Supabase
```
1. Ouvrir la page produits dans un navigateur
2. Ouvrir la console développeur (F12)
3. Vérifier les messages suivants :
   - ✅ Connexion à Supabase établie
   - ✅ Produits chargés: X produits
   - ✅ Catégories chargées: X catégories
```

### 2. Test d'affichage des produits
```
1. Vérifier que les sections suivantes s'affichent :
   - 🍞 Pains de base
   - 🌰 Pains spécialisés
   - 🥐 Viennoiseries
   - 🥨 Pains en forme
   - 🌾 Options sans gluten
   - 🇮🇹 Spécialités méditerranéennes

2. Vérifier que chaque carte de produit affiche :
   - Icône du produit
   - Titre
   - Description
   - Prix
   - Bouton Commander
```

### 3. Test multilingue
```
1. Cliquer sur le bouton "EN" en haut à droite
2. Vérifier que les titres et descriptions changent en anglais
3. Cliquer sur "FR" pour revenir au français
4. Vérifier que tout redevient en français
```

### 4. Test responsive
```
Desktop (> 992px):
- 3 colonnes de produits (sauf méditerranéens: 2 colonnes)

Tablette (768px - 991px):
- 2 colonnes de produits
- Menu hamburger

Mobile (< 768px):
- 1 colonne de produits
- Cartes adaptées à la largeur
```

### 5. Test des interactions
```
1. Survoler une carte de produit
   - La carte doit s'élever légèrement
   - Une bordure colorée doit apparaître en haut
   - L'icône doit légèrement tourner et grossir

2. Cliquer sur "Commander"
   - Une alerte doit s'afficher
   - Message: "Produit ajouté au panier!"
```

### 6. Test des produits vedettes
```
1. Identifier les produits avec une étoile ⭐
2. Vérifier qu'ils ont :
   - Un badge "Vedette" en haut à gauche
   - Un fond légèrement doré
   - Une bordure dorée
```

### 7. Test de gestion des erreurs
```
Pour simuler une erreur de connexion :
1. Modifier temporairement l'URL Supabase dans database.js
2. Recharger la page
3. Vérifier qu'un message d'erreur s'affiche
4. Vérifier qu'un bouton "Réessayer" est présent
5. Restaurer l'URL correcte
```

## 📋 Checklist de vérification

### Fonctionnalités essentielles
- [ ] Les produits se chargent depuis Supabase
- [ ] Les catégories s'affichent correctement
- [ ] Les prix sont affichés avec le bon format
- [ ] Les icônes sont visibles et correctes
- [ ] Le changement de langue fonctionne
- [ ] Les produits vedettes sont bien identifiés
- [ ] Le bouton "Commander" est cliquable

### Design et UX
- [ ] Les cartes ont un design attractif
- [ ] Les animations sont fluides
- [ ] Les couleurs sont cohérentes
- [ ] La typographie est lisible
- [ ] Les espacements sont appropriés
- [ ] Le responsive fonctionne sur tous les écrans

### Performance
- [ ] Le chargement est rapide (< 2 secondes)
- [ ] Pas de lag lors du hover
- [ ] Les transitions sont fluides
- [ ] La console ne montre pas d'erreurs

### Accessibilité
- [ ] Les contrastes sont suffisants
- [ ] Les icônes Bootstrap sont visibles
- [ ] La navigation au clavier fonctionne
- [ ] Les messages d'état sont clairs

## 🔍 Points à vérifier dans la base de données

### Table Products
```sql
-- Vérifier qu'il y a des produits actifs et disponibles
SELECT COUNT(*) FROM Products 
WHERE status = 'Active' AND available = true;

-- Vérifier la répartition par catégorie
SELECT categoryId, COUNT(*) as total 
FROM Products 
WHERE status = 'Active' AND available = true
GROUP BY categoryId;

-- Vérifier les produits vedettes
SELECT code, title_fr, featured 
FROM Products 
WHERE featured = true AND status = 'Active';
```

### Table BreadCategory
```sql
-- Vérifier toutes les catégories
SELECT id, NameFR, NameEN, icon 
FROM BreadCategory 
ORDER BY id;
```

## 🐛 Résolution de problèmes

### Problème : Aucun produit ne s'affiche
**Solutions :**
1. Vérifier la console pour les erreurs
2. Vérifier que Supabase est accessible
3. Vérifier les filtres SQL (status='Active', available=true)
4. Vérifier qu'il y a bien des produits dans la BD

### Problème : Les images ne s'affichent pas
**Solutions :**
1. Vérifier les chemins d'images dans la colonne `image`
2. S'assurer que les images sont dans le bon dossier
3. Utiliser des URLs absolues si nécessaire

### Problème : Le changement de langue ne fonctionne pas
**Solutions :**
1. Vérifier que `translations.js` est bien chargé
2. Vérifier que l'événement `languageChanged` est déclenché
3. Vérifier dans la console si les titres/descriptions existent en EN

### Problème : Erreur CORS
**Solutions :**
1. Vérifier la configuration Supabase
2. S'assurer que le domaine est autorisé
3. Utiliser un serveur local (pas file://)

## 🚀 Commandes utiles

### Démarrer un serveur local
```powershell
# PowerShell - depuis le dossier Test
python -m http.server 8000

# Ou avec Node.js
npx http-server -p 8000
```

### Ouvrir la page
```
http://localhost:8000/pages/produits.html
```

### Vider le cache
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 📊 Résultats attendus

### Temps de chargement
- Connexion Supabase : < 500ms
- Récupération produits : < 1s
- Affichage complet : < 2s

### Nombre de requêtes
- 1 requête pour les catégories
- 1 requête pour les produits
- Total : 2 requêtes

### Console
```
🔄 Chargement des produits depuis Supabase...
✅ Connexion à Supabase établie
✅ Catégories reçues de Supabase: 6 catégories
✅ Produits reçus de Supabase: XX produits
✅ Produits chargés: XX
✅ Catégories chargées: 6
🎨 Affichage des produits...
✅ Affichage terminé
```

---

**Note :** Ce guide suppose que la base de données Supabase est correctement configurée avec des données de test.
