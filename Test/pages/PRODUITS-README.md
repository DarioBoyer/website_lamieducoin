# Page Produits - Intégration Supabase

## 📋 Résumé des modifications

La page `produits.html` a été modifiée pour se connecter directement à la base de données Supabase et afficher dynamiquement tous les produits disponibles.

## 🔧 Fichiers modifiés

### Pages HTML
- **`produits.html`** - Page principale des produits avec intégration Supabase

### Scripts JavaScript (nouveaux)
- **`js/config/database.js`** - Configuration de connexion Supabase
- **`js/services/productService.js`** - Service de gestion des produits (lecture seule)
- **`js/services/categoryService.js`** - Service de gestion des catégories

### Scripts JavaScript (modifiés)
- **`js/products.js`** - Complètement réécrit pour utiliser Supabase au lieu de JSON

### Styles CSS
- **`css/styles.css`** - Ajout de styles pour les produits (badges vedette, info produits, etc.)

## ✨ Fonctionnalités

### Affichage dynamique des produits
- ✅ Connexion automatique à Supabase au chargement de la page
- ✅ Récupération de tous les produits actifs et disponibles
- ✅ Groupement des produits par catégorie
- ✅ Tri automatique : produits vedettes en premier, puis par titre
- ✅ Support multilingue (FR/EN)

### Informations affichées pour chaque produit
- 🍞 Icône du produit
- 📝 Titre et description (bilingue)
- 💰 Prix avec devise (CDN)
- 📦 Poids et unité de mesure
- ⚠️ Allergènes (si présents)
- ⭐ Badge "Vedette" pour les produits mis en avant
- 🛒 Bouton "Commander" (prêt pour intégration avec le panier)

### États de l'interface
- 🔄 **Chargement** : Spinner animé pendant le chargement
- ✅ **Succès** : Affichage des produits par catégorie
- ❌ **Erreur** : Message d'erreur avec bouton pour réessayer
- 📭 **Vide** : Message si aucun produit n'est disponible

### Catégories supportées
1. 🍞 Pains de base
2. 🌰 Pains spécialisés
3. 🥐 Viennoiseries
4. 🥨 Pains en forme
5. 🌾 Options sans gluten
6. 🇮🇹 Spécialités méditerranéennes

## 🎨 Design et UX

### Cartes de produits
- Design moderne avec ombres et transitions fluides
- Effet hover avec élévation de la carte
- Bordure colorée animée au survol
- Badge doré pour les produits vedettes
- Responsive : adaptation mobile et tablette

### Accessibilité
- Icônes Bootstrap pour une meilleure lisibilité
- Couleurs contrastées pour la lisibilité
- Support clavier complet
- Messages d'état clairs

## 🔌 Intégration Supabase

### Configuration
```javascript
// URL et clé d'API dans js/config/database.js
const DB_CONFIG = {
    url: 'https://mtuimnyoimiqhuyidyjv.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    options: {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    }
};
```

### Tables utilisées
- **`Products`** - Tous les produits avec détails complets
- **`BreadCategory`** - Catégories de produits avec noms bilingues

### Filtres appliqués
- `status = 'Active'` - Seulement les produits actifs
- `available = true` - Seulement les produits disponibles
- Tri par `featured DESC, title_fr ASC`

## 📱 Support responsive

### Desktop (> 992px)
- 3 produits par ligne (sauf méditerranéens : 2 par ligne)
- Navigation complète visible

### Tablette (768px - 991px)
- 2 produits par ligne
- Navigation hamburger

### Mobile (< 768px)
- 1 produit par ligne
- Interface optimisée tactile
- Icônes et textes adaptés

## 🌐 Multilingue

### Changement de langue
```javascript
// La page écoute l'événement 'languageChanged'
window.addEventListener('languageChanged', updateProductsLanguage);

// Les produits se mettent à jour automatiquement
```

### Champs traduits
- Titre du produit (`title_fr` / `title_en`)
- Description (`description_fr` / `description_en`)
- Nom de catégorie (`NameFR` / `NameEN`)
- Description de catégorie (`DescriptionFR` / `DescriptionEN`)
- Unités de mesure

## 🚀 Utilisation

### Chargement automatique
La page charge automatiquement les produits au chargement :
```javascript
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
```

### Rafraîchissement manuel
```javascript
// Depuis la console ou un autre script
window.refreshProducts();
```

## 🔜 Améliorations futures

### Fonctionnalités à ajouter
- [ ] Intégration avec le système de panier existant
- [ ] Filtres de recherche (par nom, prix, catégorie)
- [ ] Tri personnalisé (prix croissant/décroissant, alphabétique)
- [ ] Modal avec détails complets du produit
- [ ] Galerie d'images pour chaque produit
- [ ] Système de favoris
- [ ] Partage sur réseaux sociaux

### Optimisations possibles
- [ ] Cache local des produits (localStorage)
- [ ] Pagination ou lazy loading pour grandes listes
- [ ] Images optimisées avec CDN
- [ ] Compression des requêtes Supabase
- [ ] Service Worker pour mode hors-ligne

## 🐛 Débogage

### Console du navigateur
Les messages de console incluent :
- `🔄 Chargement des produits depuis Supabase...`
- `✅ Produits chargés: X produits`
- `✅ Catégories chargées: X catégories`
- `❌ Erreur...` en cas de problème

### Problèmes courants

**Les produits ne s'affichent pas :**
1. Vérifier la console pour les erreurs
2. Vérifier la connexion Supabase
3. Vérifier que des produits existent avec `status='Active'` et `available=true`

**Erreur de module ES6 :**
1. Vérifier que le serveur web supporte les modules ES6
2. Utiliser un serveur local (pas `file://`)

**Images manquantes :**
1. Vérifier les chemins d'images dans la BD
2. S'assurer que les images sont accessibles

## 📞 Support

Pour toute question ou problème, consulter :
- Documentation Supabase : https://supabase.com/docs
- Code source dans `/Test/js/`
- Console développeur du navigateur

---

**Dernière mise à jour :** 27 octobre 2025  
**Version :** 2.0 (Supabase)
