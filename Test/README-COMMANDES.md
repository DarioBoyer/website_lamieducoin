# Page de Commandes - Documentation

## Vue d'ensemble

La page de commandes (`commandes.html`) affiche les produits disponibles pour la vente avec une interface simplifiée et un panier permanent visible à droite de la page.

## Fichiers créés/modifiés

### Nouveaux fichiers:
1. **`Test/js/orders-display.js`** - Gestion de l'affichage des produits sur la page de commandes
2. **`Test/css/orders.css`** - Styles spécifiques pour les cartes produits compactes
3. **`Test/data/products.json`** - Base de données des produits disponibles

### Fichiers modifiés:
1. **`Test/pages/commandes.html`** - Page de commandes avec structure mise à jour
2. **`Test/js/cart.js`** - Système de panier amélioré

## Fonctionnalités

### Affichage des produits
- **Cartes produits compactes** : Design simplifié avec moins d'information que sur `produits.html`
- **Organisation par catégories** : Les produits sont groupés et triés par catégorie
- **Catégories repliables** : Cliquer sur le titre de catégorie pour replier/déplier
- **Sélection de quantité** : Boutons +/- et champ de saisie pour la quantité
- **Badge "Populaire"** : Indication visuelle pour les produits vedettes

### Panier
- **Panier latéral fixe** (desktop) : Toujours visible à droite de la page
- **Panier modal** (mobile) : Bouton flottant avec badge de compteur
- **Affichage en temps réel** : Mise à jour automatique du total et du nombre d'articles
- **Gestion des quantités** : Modifier ou supprimer des articles directement dans le panier
- **Info-bulle** : Informations sur les taxes, commande minimum, etc.

### Multilingue
- **Support FR/EN** : Tous les textes sont traduits via `translations.js`
- **Changement dynamique** : Bascule instantanée entre français et anglais
- **Contenu adapté** : Noms, descriptions et unités traduits

## Structure du fichier products.json

```json
{
  "products": [
    {
      "id": "pain-blanc",
      "code": "PB001",
      "title": {
        "fr": "Pain Blanc Classique",
        "en": "Classic White Bread"
      },
      "description": {
        "fr": "Pain blanc moelleux...",
        "en": "Soft and tasty white bread..."
      },
      "icon": "🍞",
      "category": "pains-base",
      "price": 4.50,
      "weight": "500g",
      "unit": "loaf",
      "available": true,
      "productType": "retail",
      "featured": true
    }
  ]
}
```

### Catégories disponibles:
- `pains-base` : Pains de Base / Basic Breads
- `pains-specialises` : Pains Spécialisés / Specialty Breads
- `viennoiseries` : Viennoiseries / Pastries
- `pains-forme` : Pains en Forme / Shaped Breads
- `sans-gluten` : Options Sans Gluten / Gluten-Free Options
- `pains-mediterraneens` : Spécialités Méditerranéennes / Mediterranean Specialties

## Utilisation

### Ajouter un produit
1. Le client sélectionne la quantité désirée (par défaut 1)
2. Clique sur le bouton "Ajouter" / "Add"
3. Une notification confirme l'ajout au panier
4. Le panier se met à jour automatiquement

### Gérer le panier
- **Modifier la quantité** : Utiliser les boutons +/- ou saisir directement
- **Retirer un article** : Cliquer sur l'icône de poubelle
- **Vider le panier** : Bouton "Vider le panier" avec confirmation
- **Passer commande** : Bouton "Passer la commande" ouvre le formulaire de checkout

### Version mobile
- Un bouton flottant avec badge s'affiche en bas à droite
- Cliquer ouvre le panier en modal plein écran
- Même fonctionnalités que la version desktop

## Personnalisation CSS

### Variables principales:
```css
--primary-color: #8B4513  /* Couleur principale */
--primary-light: #D2691E  /* Couleur claire */
--secondary-color: #F4A460 /* Couleur secondaire */
```

### Classes importantes:
- `.product-card-compact` : Carte produit version compacte
- `.cart-sidebar` : Panier latéral fixe
- `.cart-modal` : Modal du panier mobile
- `.category-section` : Section de catégorie
- `.floating-cart-btn` : Bouton flottant mobile

## Intégration avec order-manager.js

Le système de panier est compatible avec `order-manager.js` pour:
- Créer des commandes à partir du panier
- Générer des GUIDs uniques
- Gérer les statuts de commandes
- Sauvegarder dans localStorage

## Performance

- **Lazy loading** : Les produits sont chargés une seule fois
- **Cache localStorage** : Le panier est persisté localement
- **Mise à jour optimisée** : Seulement les éléments modifiés sont rafraîchis

## Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (dernières versions)
- ✅ Responsive design (mobile, tablette, desktop)
- ✅ Écrans tactiles et clavier
- ✅ Lecteurs d'écran (attributs ARIA)

## Prochaines étapes

1. Intégration avec le système de paiement
2. Validation côté serveur
3. Gestion des stocks en temps réel
4. Historique des commandes client
5. Système de favoris/wishlist

## Support

Pour toute question ou problème, contactez l'équipe de développement.
