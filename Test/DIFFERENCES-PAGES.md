# Différences entre produits.html et commandes.html

## Vue d'ensemble

Les deux pages affichent les produits de La mie du coin mais avec des objectifs et designs différents.

## 📄 Page Produits (produits.html)

### Objectif
**Présenter** les produits de manière détaillée et attractive pour informer les clients.

### Caractéristiques
- ✨ **Design élaboré** : Grandes cartes visuellement attrayantes
- 📸 **Images** : Support pour images de produits
- 📝 **Descriptions complètes** : Texte détaillé sur chaque produit
- 🏷️ **Informations riches** :
  - Poids et unité
  - Allergènes si applicable
  - Badge vedette
  - Indicateur de disponibilité en stock
  - Prix mis en valeur
- 🎯 **CTA** : "Passer une commande" redirige vers commandes.html
- 📱 **Layout** : Grille 3-4 colonnes sur desktop

### Cas d'utilisation
- Parcourir le catalogue complet
- Découvrir de nouveaux produits
- S'informer sur les détails des produits
- Navigation exploratoire

### Code principal
```javascript
// products-display.js avec module Supabase
import dbConnection from '../data/js/config/database.js';
import productService from '../data/js/services/productService.js';
```

---

## 🛒 Page Commandes (commandes.html)

### Objectif
**Permettre aux clients** d'ajouter rapidement des produits à leur panier pour passer commande.

### Caractéristiques
- 🎯 **Design compact** : Cartes plus petites et condensées
- ⚡ **Action rapide** : Focus sur l'ajout au panier
- 📊 **Informations essentielles** :
  - Icône + Nom
  - Description courte (1 ligne)
  - Poids
  - Prix
- 🔢 **Sélection quantité** : Boutons +/- intégrés dans la carte
- 🛒 **Panier permanent** : 
  - Desktop: Colonne fixe à droite
  - Mobile: Modal avec bouton flottant
- 💰 **Total visible** : Toujours affiché avec le panier
- ✅ **CTA** : "Passer la commande" ouvre le formulaire checkout

### Layout
- **Desktop** : 
  - Liste produits: 8 colonnes (col-lg-8)
  - Panier: 4 colonnes (col-lg-4) sticky
- **Mobile** : 
  - Liste produits: pleine largeur
  - Panier: modal flottant

### Code principal
```javascript
// orders-display.js - fichier standalone
// Pas de dépendance Supabase
// Charge depuis products.json
```

---

## Comparaison visuelle

### Cartes Produits

| Élément | produits.html | commandes.html |
|---------|---------------|----------------|
| **Taille** | Grande (h-100) | Compacte |
| **Image** | Oui (250px) | Non (icône emoji) |
| **Description** | Complète | 1 ligne |
| **Détails** | Allergènes, stock, poids | Poids uniquement |
| **Prix** | Grand, mis en valeur | Standard |
| **Quantité** | Non | Oui (input + boutons) |
| **Bouton** | "Ajouter au panier" | "Ajouter" |
| **Colonnes** | 3-4 par ligne | 2 par ligne |

### Organisation

| Aspect | produits.html | commandes.html |
|--------|---------------|----------------|
| **Catégories** | Repliables | Repliables |
| **Tri** | Alphabétique | Alphabétique |
| **Animations** | Entrée fadeInUp | Entrée fadeInUp |
| **Hover** | Scale + shadow | Scale + shadow |

---

## Fonctionnalités communes

✅ Support bilingue FR/EN  
✅ Catégories repliables  
✅ Design responsive  
✅ Animations fluides  
✅ Même palette de couleurs  
✅ Bootstrap Icons  
✅ Système de traductions partagé  

---

## Flux utilisateur recommandé

1. **Découverte** : Client visite `produits.html`
   - Parcourt le catalogue
   - Lit les descriptions
   - Découvre les nouveautés

2. **Commande** : Client va sur `commandes.html`
   - Sélectionne rapidement les quantités
   - Ajoute au panier
   - Valide la commande

3. **Alternative** : Bouton "Commander" sur produits.html redirige directement vers commandes.html

---

## Fichiers CSS

### produits.html
```css
products.css (complet avec images, badges, etc.)
```

### commandes.html  
```css
orders.css (compact, focus panier)
cart.css (sidebar, modal mobile)
checkout.css (formulaire)
```

---

## Fichiers JavaScript

### produits.html
- `products-display.js` - Module ES6 avec Supabase
- Charge depuis base de données
- Service-oriented architecture

### commandes.html
- `orders-display.js` - Standalone
- `cart.js` - Gestion panier
- `checkout.js` - Formulaire commande
- Charge depuis `products.json`
- Plus simple et autonome

---

## Quand utiliser quelle page?

### Utilisez produits.html pour:
- 👀 Présenter votre catalogue
- 📸 Montrer de belles photos
- 📝 Expliquer vos produits en détail
- 🎨 Impressionner les nouveaux clients
- 📱 Page "vitrine" de votre site

### Utilisez commandes.html pour:
- 🛒 Permettre les achats
- ⚡ Processus rapide
- 💰 Afficher le panier en permanence
- 📱 Conversion et vente
- ✅ Finalisation de commande

---

## Architecture technique

```
produits.html
├── Database (Supabase)
├── Services (productService, categoryService)
├── Images (si disponibles)
└── Focus: PRÉSENTATION

commandes.html
├── JSON local (products.json)
├── LocalStorage (panier)
├── Icônes emoji
└── Focus: CONVERSION
```

---

## Personnalisation

Les deux pages partagent:
- `translations.js` pour le multilingue
- Variables CSS communes
- Composants (footer, nav)
- Même identité visuelle

Mais ont des objectifs UX différents, d'où leurs designs distincts.

---

## Conclusion

**produits.html** = Vitrine 🎨  
**commandes.html** = Caisse 💰

Les deux se complètent pour offrir une expérience utilisateur complète!
