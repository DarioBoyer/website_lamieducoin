# Migration de la page Commandes vers Supabase

## 📋 Résumé des modifications

La page de commandes (`commandes.html`) a été migrée pour utiliser Supabase au lieu d'un fichier JSON statique pour charger les produits.

## 🔄 Fichiers modifiés

### 1. `js/orders-display.js` ✅
**Modifications principales:**
- Remplacement du chargement depuis `products.json` par des requêtes Supabase
- Initialisation du client Supabase avec les credentials
- Chargement des catégories depuis la table `BreadCategory`
- Chargement des produits depuis la table `Products` avec filtres:
  - `productType = 'retail'` (uniquement produits de vente au détail)
  - `available = true` (uniquement produits disponibles)
  - `status = 'Active'` (uniquement produits actifs)
- Affichage des images de produits avec fallback sur les icônes
- Exposition du client Supabase globalement pour le panier

**Fonctionnalités:**
- Affichage des produits groupés par catégories
- Support multilingue (FR/EN)
- Gestion des quantités avec boutons +/-
- Ajout au panier avec intégration au système existant
- Affichage des badges "Populaire" pour les produits en vedette
- Affichage des allergènes si présents

### 2. `js/cart.js` ✅
**Modifications principales:**
- Ajout du support Supabase pour le chargement des produits
- Fallback automatique vers `products.json` si Supabase n'est pas disponible
- Conversion des produits Supabase au format attendu par le panier
- Utilisation du champ `code` comme identifiant unique

**Compatibilité:**
- Fonctionne avec Supabase (prioritaire)
- Fonctionne avec products.json (fallback)
- Conversion automatique des formats

### 3. `css/orders.css` ✅
**Ajouts:**
- Styles pour les images de produits compactes
- `.product-image-small` - Conteneur d'image 60x60px
- `.product-icon-fallback` - Icône de remplacement si l'image ne charge pas
- Amélioration du responsive design

## 🗄️ Structure des données Supabase

### Table `Products`
Champs utilisés:
- `code` - Identifiant unique du produit (ex: "pain-blanc")
- `categoryId` - ID de la catégorie (référence à BreadCategory)
- `title_fr` / `title_en` - Titres traduits
- `description_fr` / `description_en` - Descriptions traduites
- `price` - Prix en dollars canadiens
- `unit` - Unité de vente (loaf, piece, etc.)
- `icon` - Emoji représentant le produit
- `image` - Chemin vers l'image (ex: "/img/products/pain-blanc.jpg")
- `weight` / `weightUnit` - Poids et unité
- `allergens` - Array des allergènes
- `productType` - Type de produit ("retail" pour la vente)
- `available` - Disponibilité (true/false)
- `status` - Statut ("Active", "Deleted", etc.)
- `featured` - Produit en vedette (true/false)

### Table `BreadCategory`
Champs utilisés:
- `id` - Identifiant de la catégorie (ex: "pains-base")
- `NameFR` / `NameEN` - Noms traduits
- `icon` - Emoji de la catégorie

## 🚀 Fonctionnement

### Flux de chargement des produits

1. **Initialisation de la page commandes**
   ```javascript
   // orders-display.js initialise Supabase
   supabaseClient = supabase.createClient(URL, KEY)
   window.supabaseClient = supabaseClient // Exposé globalement
   ```

2. **Chargement des données**
   ```javascript
   // Chargement en parallèle des catégories et produits
   await Promise.all([
       loadCategories(), // depuis BreadCategory
       loadProducts()    // depuis Products (retail uniquement)
   ])
   ```

3. **Affichage**
   - Groupement des produits par catégorie
   - Génération des cartes produits avec images
   - Affichage des contrôles de quantité
   - Boutons d'ajout au panier

4. **Ajout au panier**
   ```javascript
   // orders-display.js
   addToCartFromOrders(productCode, productId)
   
   // Crée un objet compatible avec cart.js
   // et appelle cart.addItem(productCode, quantity)
   ```

5. **Synchronisation du panier**
   ```javascript
   // cart.js charge les produits depuis Supabase
   // pour avoir les données à jour lors de l'affichage du panier
   await cart.init() // Appelé au DOMContentLoaded
   ```

## 📊 Avantages de la migration

### ✅ Gestion centralisée
- Un seul endroit pour gérer les produits (Supabase)
- Pas besoin de modifier le JSON manuellement
- Mise à jour en temps réel

### ✅ Filtrage avancé
- Séparation claire entre produits retail et wholesale
- Gestion de la disponibilité
- Statuts multiples (Active, Deleted, etc.)

### ✅ Scalabilité
- Ajout facile de nouveaux produits
- Gestion d'images
- Support des catégories dynamiques

### ✅ Performance
- Chargement uniquement des produits pertinents
- Requêtes optimisées avec filtres SQL
- Images lazy-loaded

## 🧪 Tests recommandés

1. **Test de chargement des produits**
   - Vérifier que tous les produits retail s'affichent
   - Vérifier le groupement par catégories
   - Vérifier l'affichage des images

2. **Test du panier**
   - Ajouter des produits au panier
   - Modifier les quantités
   - Vérifier le calcul du total
   - Vider le panier

3. **Test multilingue**
   - Basculer entre FR et EN
   - Vérifier les traductions des produits et catégories

4. **Test responsive**
   - Vérifier l'affichage mobile
   - Tester les contrôles tactiles

5. **Test de fallback**
   - Désactiver temporairement Supabase
   - Vérifier le fallback vers products.json

## 🔧 Configuration Supabase

### Credentials (déjà configurés)
```javascript
URL: 'https://mtuimnyoimiqhuyidyjv.supabase.co'
Key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Tables requises
- ✅ `Products` - Produits avec tous les champs
- ✅ `BreadCategory` - Catégories de produits
- ✅ `Orders` - Commandes (utilisé par order-service.js)
- ✅ `OrdersLines` - Lignes de commande

## 📝 Notes importantes

1. **Identifiant des produits**
   - Le panier utilise le champ `code` comme ID (ex: "pain-blanc")
   - La BD utilise un `id` numérique
   - La conversion est gérée automatiquement

2. **Images**
   - Chemins stockés dans la BD: `/img/products/nom-produit.jpg`
   - Conversion automatique pour les pages: `../img/products/nom-produit.jpg`
   - Fallback automatique sur l'icône si l'image ne charge pas

3. **Compatibilité**
   - Le système fonctionne avec ou sans Supabase
   - Fallback automatique vers products.json
   - Pas de breaking changes pour les autres pages

## 🔄 Prochaines étapes possibles

1. **Optimisation**
   - Mettre en cache les produits côté client
   - Implémenter un système de rafraîchissement

2. **Fonctionnalités**
   - Recherche de produits
   - Filtres par allergènes
   - Tri personnalisé

3. **Analytics**
   - Tracking des produits les plus consultés
   - Suivi des ajouts au panier
   - Taux de conversion

## 📚 Fichiers de référence

- `js/orders-display.js` - Affichage des produits avec Supabase
- `js/cart.js` - Gestion du panier (hybride Supabase/JSON)
- `js/order-service.js` - Service de création de commandes
- `data/js/services/productService.js` - Service produits (admin)
- `css/orders.css` - Styles pour la page commandes
- `pages/commandes.html` - Page HTML principale

## ✅ Migration complétée

Date: 1er novembre 2025
Statut: ✅ Opérationnel
Version: 1.0

---

**Note**: L'ancien fichier `orders-display.js` a été sauvegardé sous le nom `orders-display-old.js` au cas où.
