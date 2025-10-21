# 🚀 Guide de Démarrage Rapide - Système de Panier

## Lancer le Site

```bash
# 1. Naviguer vers le dossier Test
cd "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test"

# 2. Lancer le serveur local
python -m http.server 8000

# 3. Ouvrir dans le navigateur
# http://localhost:8000/pages/commandes.html
```

## Fonctionnalités du Panier

### ✅ Ce qui fonctionne maintenant

1. **Affichage des Produits**
   - 28 produits disponibles
   - 6 catégories organisées
   - Tri alphabétique selon la langue

2. **Ajout au Panier**
   - Sélectionner quantité (1-99)
   - Boutons +/- pour ajuster
   - Notification de confirmation

3. **Gestion du Panier**
   - Modifier quantités
   - Supprimer articles
   - Vider complètement
   - Compteur d'articles

4. **Calcul du Total**
   - Sous-total avant taxes
   - Mise à jour automatique
   - Format CAD (XX.XX $)

5. **Persistance**
   - Panier sauvegardé (localStorage)
   - Survit aux rechargements
   - Survit à la fermeture du navigateur

6. **Multilingue**
   - Support FR/EN complet
   - Traduction instantanée
   - Synchronisé avec le site

## Test Rapide (5 minutes)

### Étape 1: Vérifier l'Installation
```bash
python validate_cart.py
```
✅ Devrait afficher "TOUS LES TESTS SONT PASSÉS!"

### Étape 2: Lancer le Serveur
```bash
python -m http.server 8000
```

### Étape 3: Tester dans le Navigateur

1. **Ouvrir** http://localhost:8000/pages/commandes.html

2. **Ajouter des produits**
   - Cliquer sur "Ajouter au panier" sur quelques produits
   - Observer la notification verte

3. **Vérifier le panier**
   - Le panier à droite devrait afficher les produits
   - Le compteur devrait s'actualiser
   - Le total devrait se calculer automatiquement

4. **Modifier des quantités**
   - Utiliser les boutons +/- dans le panier
   - Observer la mise à jour du total

5. **Supprimer un article**
   - Cliquer sur l'icône 🗑️
   - L'article devrait disparaître

6. **Tester la persistance**
   - Rafraîchir la page (F5)
   - Le panier devrait toujours être rempli

7. **Tester le multilingue**
   - Cliquer sur EN dans la navbar
   - Les produits devraient se traduire

8. **Vider le panier**
   - Cliquer sur "Vider le panier"
   - Confirmer l'action
   - Le panier devrait être vide

### Étape 4: Test Mobile

1. Appuyer sur **F12** (ouvrir DevTools)
2. Cliquer sur l'icône "Toggle device toolbar" (Ctrl+Shift+M)
3. Sélectionner un appareil mobile (ex: iPhone 12)
4. Vérifier que tout s'affiche correctement

## Structure du Code

```
Test/
├── pages/
│   └── commandes.html         # Page principale du panier
├── js/
│   ├── cart.js                # Logique du panier (460 lignes)
│   ├── products.js            # Gestion des produits
│   ├── translations.js        # Traductions FR/EN
│   ├── main.js                # Script principal
│   └── utils.js               # Utilitaires
├── css/
│   ├── cart.css               # Styles du panier (300 lignes)
│   └── styles.css             # Styles généraux
├── data/
│   └── products.json          # Base de données (28 produits)
└── Docs/
    └── README-PANIER.md       # Documentation complète
```

## Points d'Entrée du Code

### JavaScript Principal
```javascript
// Fichier: js/cart.js
const cart = new ShoppingCart();

// Méthodes principales:
cart.addItem(productId, quantity)      // Ajouter au panier
cart.updateQuantity(productId, qty)    // Modifier quantité
cart.removeItem(productId)             // Retirer produit
cart.clearCart()                       // Vider panier
cart.getTotal()                        // Obtenir total
```

### HTML
```html
<!-- Fichier: pages/commandes.html -->

<!-- Zone d'affichage des produits -->
<div id="products-list"></div>

<!-- Zone du panier -->
<div id="cart-items"></div>
<div id="cart-total">0.00</div>
```

### CSS
```css
/* Fichier: css/cart.css */

.product-card { }      /* Carte produit */
.cart-sidebar { }      /* Panier sticky */
.cart-notification { } /* Notification d'ajout */
```

## Personnalisation

### Modifier les Produits
Éditer `data/products.json`:
```json
{
  "id": "nouveau-produit",
  "category": "pains-base",
  "title": { "fr": "Titre FR", "en": "Title EN" },
  "price": 9.99,
  "available": true
}
```

### Modifier les Couleurs
Éditer `css/cart.css` (lignes 1-10):
```css
--primary-color: #8B4513;
--secondary-color: #F4A460;
```

### Ajouter une Fonctionnalité
Éditer `js/cart.js` et ajouter une méthode:
```javascript
class ShoppingCart {
    maNouvelleFonction() {
        // Code ici
    }
}
```

## Dépannage Rapide

### Problème: Les produits ne s'affichent pas
**Solution:** 
- Vérifier que le serveur est lancé
- Ouvrir la console (F12) pour voir les erreurs
- Vérifier que `products.json` existe

### Problème: Le panier ne se sauvegarde pas
**Solution:**
- Vérifier localStorage dans DevTools (Application > Local Storage)
- Essayer dans une fenêtre de navigation privée
- Vider le cache du navigateur

### Problème: Les traductions ne fonctionnent pas
**Solution:**
- Vérifier que `translations.js` est chargé
- Vérifier la langue dans localStorage
- Essayer de changer manuellement: `localStorage.setItem('language', 'fr')`

### Problème: Le total ne se calcule pas
**Solution:**
- Vérifier la console pour erreurs JavaScript
- Recharger la page
- Vider le panier et réessayer

## Prochaines Étapes

### Développement Immédiat
- [ ] Ajouter vraies images de produits
- [ ] Implémenter système de paiement (Stripe)
- [ ] Ajouter sélecteur de date/heure de ramassage
- [ ] Créer formulaire de coordonnées client

### Améliorations Futures
- [ ] Calcul des taxes (TPS + TVQ)
- [ ] Code promo / Rabais
- [ ] Historique de commandes
- [ ] Compte client
- [ ] Email de confirmation

## Ressources

- **Documentation complète:** `Docs/README-PANIER.md`
- **Données produits:** `data/README-PRODUCTS.md`
- **Traductions:** `README-TRADUCTION.md`
- **Résumé projet:** `SUMMARY.md`

## Support

En cas de problème:
1. Consulter la documentation
2. Vérifier la console du navigateur (F12)
3. Exécuter le script de validation: `python validate_cart.py`
4. Vérifier que tous les fichiers sont présents

---

**🎉 Bon test du système de panier!**

*Dernière mise à jour: 21 octobre 2025*
