# 🛒 Système de Panier d'Achat - La mie du coin

## Vue d'ensemble

Le système de panier d'achat permet aux utilisateurs de sélectionner des produits depuis la page des commandes, de les ajouter à leur panier avec des quantités personnalisées, et de voir le total de leur commande avant taxes.

## Fonctionnalités Implémentées

### ✅ Affichage des Produits
- **Chargement dynamique** depuis `data/products.json`
- **30 produits** disponibles organisés en 6 catégories
- **Tri alphabétique** automatique selon la langue (FR/EN)
- **Filtrage automatique** - Seuls les produits disponibles (`available: true`) sont affichés
- **Cartes produits** avec icône, titre, description, poids et prix
- **Badge "Populaire"** pour les produits vedettes

### ✅ Gestion du Panier
- **Ajout de produits** avec quantité personnalisable (1-99)
- **Modification de quantité** directement dans le panier
- **Suppression de produits** individuels
- **Vidage complet** du panier
- **Persistance** - Le panier est sauvegardé dans `localStorage`
- **Compteur d'articles** dans l'en-tête du panier

### ✅ Calcul du Total
- **Sous-total avant taxes** affiché en temps réel
- **Calcul automatique** à chaque modification
- Format monétaire canadien (CAD)

### ✅ Expérience Utilisateur
- **Notifications** visuelles lors de l'ajout au panier
- **Design responsive** - Fonctionne sur mobile, tablette et desktop
- **Interface intuitive** avec boutons +/- pour ajuster les quantités
- **Message panier vide** quand aucun produit n'est sélectionné
- **Animations** fluides et modernes

### ✅ Multilingue
- **Support FR/EN** complet
- **Traduction automatique** des produits selon la langue
- **Synchronisation** avec le système de traduction du site

## Structure des Fichiers

### Fichiers JavaScript
```
Test/js/
├── cart.js          # Logique du panier (classe ShoppingCart)
├── main.js          # Script principal du site
└── utils.js         # Fonctions utilitaires
```

### Fichiers CSS
```
Test/css/
├── cart.css         # Styles du panier et des produits
└── styles.css       # Styles généraux du site
```

### Fichiers de Données
```
Test/data/
└── products.json    # Base de données des produits
```

### Pages HTML
```
Test/pages/
└── commandes.html   # Page des commandes avec panier
```

## Architecture du Code

### Classe `ShoppingCart`

```javascript
class ShoppingCart {
    constructor()           // Initialisation du panier
    loadCart()             // Charger depuis localStorage
    saveCart()             // Sauvegarder dans localStorage
    addItem(id, qty)       // Ajouter un produit
    updateQuantity(id, qty) // Modifier la quantité
    removeItem(id)         // Retirer un produit
    clearCart()            // Vider le panier
    getTotal()             // Calculer le total
    getTotalItems()        // Compter les articles
    loadProducts()         // Charger les produits JSON
    displayProducts()      // Afficher les produits
    updateCartDisplay()    // Mettre à jour l'interface
}
```

### Structure d'un Article du Panier

```javascript
{
    productId: "pain-blanc-classique",  // ID du produit
    quantity: 2,                        // Quantité
    price: 5.99                         // Prix unitaire
}
```

## Utilisation

### Initialisation Automatique

Le panier s'initialise automatiquement au chargement de la page :

```javascript
const cart = new ShoppingCart();
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});
```

### Ajouter un Produit

Depuis l'interface utilisateur :
1. Sélectionner la quantité avec les boutons +/-
2. Cliquer sur "Ajouter au panier"

Programmatiquement :
```javascript
cart.addItem('pain-blanc-classique', 2);
```

### Modifier la Quantité

```javascript
cart.updateQuantity('pain-blanc-classique', 3);
```

### Retirer un Produit

```javascript
cart.removeItem('pain-blanc-classique');
```

### Vider le Panier

```javascript
cart.clearCart();
```

### Obtenir le Total

```javascript
const total = cart.getTotal(); // Retourne le montant en CAD
```

## Interface Utilisateur

### Section Produits (Gauche)

- **Titre de catégorie** avec icône
- **Cartes produits** en grille responsive (1-3 colonnes selon l'écran)
- **Champs quantité** avec boutons +/-
- **Bouton "Ajouter au panier"** pour chaque produit

### Panier (Droite - Sticky)

#### En-tête
- Icône panier
- Titre "Mon Panier"
- Badge compteur d'articles

#### Corps
- **Si vide** : Message et icône
- **Si rempli** : 
  - Liste des articles avec icône, nom, prix unitaire
  - Contrôles de quantité (+/- ou input direct)
  - Prix total par ligne
  - Bouton supprimer (🗑️)
  - Bouton "Vider le panier"

#### Pied (affiché seulement si panier non vide)
- **Sous-total** avant taxes
- **Note informative** sur les taxes
- **Bouton "Procéder au paiement"** (placeholder)

### Informations Supplémentaires

Carte d'informations avec :
- Commande minimum
- Ramassage gratuit
- Produits frais
- Paiement sécurisé

## Persistance des Données

### LocalStorage

Le panier utilise `localStorage` pour persister les données :

```javascript
// Sauvegarde
localStorage.setItem('shoppingCart', JSON.stringify(items));

// Chargement
const items = JSON.parse(localStorage.getItem('shoppingCart'));
```

### Données Sauvegardées

- Articles du panier (ID, quantité, prix)
- Le panier survit aux rechargements de page
- Le panier survit à la fermeture du navigateur

## Responsive Design

### Desktop (≥992px)
- Produits : 3 colonnes
- Panier : sticky à droite
- Vue optimale complète

### Tablette (768px - 991px)
- Produits : 2 colonnes
- Panier : sticky en haut de page

### Mobile (≤767px)
- Produits : 1 colonne
- Panier : en bas, non sticky
- Cartes empilées verticalement
- Contrôles de quantité pleine largeur

## Notifications

### Animation des Notifications

Lorsqu'un produit est ajouté :
1. Notification verte apparaît en haut à droite
2. Affiche l'icône ✓ et le message
3. Disparaît après 3 secondes
4. Animation fluide (slide-in/slide-out)

## Styles et Thème

### Palette de Couleurs

```css
--primary-color: #8B4513    /* Brun chocolat */
--primary-light: #D2691E    /* Orange brun */
--secondary-color: #F4A460  /* Beige sable */
--accent-color: #FFD700     /* Or */
```

### Effets Visuels

- **Hover sur produits** : Élévation + ombre
- **Hover sur panier** : Changement de fond
- **Transitions** : 0.3s ease
- **Gradients** : En-tête panier et boutons
- **Animations** : Fade-in pour les produits

## Prochaines Étapes

### 🚧 À Développer

#### Système de Paiement
- [ ] Intégration Stripe ou Square
- [ ] Formulaire de coordonnées client
- [ ] Choix mode de paiement
- [ ] Confirmation de commande

#### Fonctionnalités Avancées
- [ ] Date et heure de ramassage
- [ ] Notes spéciales sur commande
- [ ] Historique des commandes
- [ ] Compte client
- [ ] Wishlist / Favoris

#### Améliorations
- [ ] Calcul des taxes (TPS + TVQ)
- [ ] Code promo / Rabais
- [ ] Commande minimum (validation)
- [ ] Stock limité (affichage disponibilité)
- [ ] Images réelles des produits

#### Communication
- [ ] Confirmation par email
- [ ] SMS de rappel
- [ ] Notifications de statut
- [ ] Facture téléchargeable

## Support Multilingue

### Langue Actuelle

Le panier détecte automatiquement la langue :
```javascript
this.currentLang = localStorage.getItem('language') || 'fr';
```

### Éléments Traduits

- Titres de produits
- Descriptions de produits
- Noms de catégories
- Unités de mesure (pain, pièce, paquet, sac)
- Interface du panier (si ajouté au système de traduction)

### Changement de Langue

Le panier écoute l'événement de changement de langue :
```javascript
window.addEventListener('languageChanged', (e) => {
    this.currentLang = e.detail.language;
    this.displayProducts();
    this.updateCartDisplay();
});
```

## Dépannage

### Le panier ne s'affiche pas
- Vérifier que le serveur local est lancé
- Vérifier la console pour erreurs CORS
- S'assurer que `products.json` est accessible

### Les produits ne se chargent pas
- Vérifier le chemin vers `products.json`
- Vérifier que tous les produits ont `available: true`
- Vérifier la structure JSON (validité)

### Le total ne se met pas à jour
- Vérifier que `cart.js` est bien chargé
- Vérifier la console pour erreurs JavaScript
- Recharger la page

### Réinitialiser le Panier

Dans la console du navigateur :
```javascript
localStorage.removeItem('shoppingCart');
location.reload();
```

## Performance

### Optimisations
- Chargement unique du JSON (cache)
- Mise à jour ciblée du DOM (pas de re-render complet)
- Debounce sur les inputs de quantité (à ajouter si nécessaire)
- LocalStorage pour éviter les appels serveur

### Taille des Données
- Products JSON : ~30 KB
- LocalStorage panier : < 1 KB
- CSS cart.css : ~10 KB
- JS cart.js : ~15 KB

## Sécurité

### Validation Client
- Quantités min/max (1-99)
- Vérification existence produit
- Protection contre injection HTML (sanitization à ajouter)

### À Implémenter Côté Serveur
- Validation des prix (ne pas faire confiance au client)
- Vérification disponibilité stock
- Authentification utilisateur
- Protection CSRF
- Validation commande minimum

## Licence

© 2025 La mie du coin. Tous droits réservés.

---

*Documentation mise à jour : 21 octobre 2025*
