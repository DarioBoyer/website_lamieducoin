# Page Produits - La mie du coin

## 📋 Description

La page produits présente la liste complète des produits disponibles dans la base de données Supabase, organisés par catégorie avec une interface moderne et attractive.

## ✨ Fonctionnalités

### 1. Affichage des produits
- **Chargement dynamique** depuis la base de données Supabase
- **Groupement par catégories** (Pains de base, Pains spécialisés, Viennoiseries, etc.)
- **Cartes produits attractives** avec:
  - Icône ou image du produit
  - Titre et description
  - Prix
  - Poids
  - Allergènes
  - Badge "Vedette" pour les produits mis en avant
  - Indicateur de disponibilité en stock

### 2. Catégories repliables
- **Toggle par catégorie**: Cliquer sur l'en-tête pour afficher/masquer les produits
- **Animation fluide**: Transition douce lors du repli/dépliage
- **Compteur de produits**: Badge indiquant le nombre de produits par catégorie
- **Icônes thématiques**: Chaque catégorie a son icône distinctive

### 3. Interface moderne
- **Design responsive**: Adapté mobile, tablette et desktop
- **Animations**: Effets de survol et transitions élégantes
- **Grille adaptative**: 1-4 colonnes selon la taille d'écran
- **Couleurs attractives**: Palette harmonieuse et professionnelle

### 4. Intégration multilingue
- Support français/anglais
- Traductions automatiques selon la langue sélectionnée
- Titres et descriptions dans les deux langues

## 📁 Fichiers

### JavaScript
- **`/Test/js/products-display.js`**: Script principal d'affichage des produits
  - Initialisation de la connexion BD
  - Chargement des catégories et produits
  - Génération dynamique du HTML
  - Gestion du toggle des catégories
  - Fonction d'ajout au panier (à intégrer)

### CSS
- **`/Test/css/products.css`**: Styles dédiés à la page produits
  - Styles des catégories et cartes
  - Animations et transitions
  - Responsive design
  - Thème visuel cohérent

### HTML
- **`/Test/pages/produits.html`**: Page principale
  - Structure de base
  - Inclusion des scripts et styles
  - Container pour le contenu dynamique

## 🔧 Configuration requise

### Dépendances
- Bootstrap 5.3.2
- Bootstrap Icons
- Supabase JS Client
- Modules ES6

### Base de données Supabase
Tables requises:
- **`Products`**: Liste des produits
- **`BreadCategory`**: Catégories de produits

### Services utilisés
- `productService.getAllProducts()`: Récupère les produits disponibles
- `categoryService.getAllCategories()`: Récupère les catégories

## 🚀 Utilisation

### Affichage de la page
1. La page se charge automatiquement au chargement du DOM
2. Connexion à Supabase
3. Chargement des catégories et produits en parallèle
4. Affichage des produits groupés par catégorie

### Interaction utilisateur
- **Cliquer sur une catégorie**: Replier/déplier les produits
- **Bouton "Ajouter au panier"**: Ajoute le produit au panier (à implémenter)
- **Bouton "Passer une commande"**: Redirige vers la page de commande

### Personnalisation
```javascript
// Modifier les filtres de produits
const products = await productService.getAllProducts({
    available: true,    // Seulement les produits disponibles
    status: 'Active',   // Seulement les produits actifs
    featured: true      // Seulement les vedettes (optionnel)
});
```

## 🎨 Personnalisation visuelle

### Couleurs principales
```css
--primary: #007bff;
--success: #28a745;
--warning: #ffc107;
--text-primary: #2c3e50;
--text-secondary: #6c757d;
--background: #ffffff;
```

### Responsive breakpoints
- Mobile: < 576px
- Tablette: 576px - 768px
- Desktop: > 768px
- Large desktop: > 1200px

## 🔗 Intégration avec le panier

La fonction `addToCart()` est prête pour l'intégration:

```javascript
function addToCart(productCode) {
    // TODO: Intégrer avec cart.js
    console.log('Ajout au panier:', productCode);
    showNotification('✅ Produit ajouté au panier!');
}
```

Pour compléter l'intégration:
1. Importer les fonctions de `cart.js`
2. Récupérer les détails du produit par code
3. Appeler la fonction d'ajout au panier existante

## 📝 Notes de développement

### Performance
- Chargement des catégories et produits en parallèle avec `Promise.all()`
- Images en lazy loading
- Animations CSS optimisées

### Gestion des erreurs
- Fallback sur catégories par défaut si la BD n'est pas accessible
- Messages d'erreur conviviaux
- Console logs pour le débogage

### Accessibilité
- Attributs ARIA sur les boutons de toggle
- Contraste de couleurs conforme WCAG
- Navigation au clavier supportée

## 🐛 Débogage

### Console logs disponibles
```javascript
console.log('📂 X catégories chargées');
console.log('🍞 X produits chargés');
console.log('✅ Page produits initialisée avec succès');
```

### Problèmes courants
1. **Produits ne s'affichent pas**: Vérifier la connexion Supabase
2. **Catégories manquantes**: Vérifier la table `BreadCategory`
3. **Images non chargées**: Vérifier les chemins d'accès

## 🔄 Mises à jour futures

- [ ] Intégration complète du panier
- [ ] Filtres de recherche et tri
- [ ] Vue liste/grille
- [ ] Zoom sur les images
- [ ] Partage sur réseaux sociaux
- [ ] Favoris utilisateur

## 📞 Support

Pour toute question ou problème, référez-vous à la documentation principale du projet.
