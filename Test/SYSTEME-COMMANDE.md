# Système de Commande - Documentation

## Vue d'ensemble

Le système de commande en ligne a été implémenté avec les fonctionnalités suivantes:

### ✅ Fonctionnalités implémentées

1. **Panier d'achats** (`js/cart.js`)
   - Ajouter/retirer des produits
   - Gérer les quantités
   - Calculer le total automatiquement
   - Persistance dans localStorage

2. **Processus de commande** (`js/checkout.js`)
   - Modal de checkout avec résumé de commande
   - Formulaire de saisie des informations client
   - Validation des champs obligatoires:
     - Nom (obligatoire)
     - Prénom (obligatoire)
     - Email (obligatoire + validation format)
     - Téléphone (obligatoire + validation format)
     - Note (optionnel)
     - Date de livraison (optionnel)
   - Création de la commande via OrderManager
   - Sauvegarde dans localStorage

3. **Gestion des commandes** (`js/order-manager.js`)
   - Création de commandes avec GUID unique
   - Gestion des statuts de commande
   - Gestion des lignes de commande
   - Structure de données JSON complète

4. **Page de succès**
   - Confirmation de création de commande
   - Affichage du numéro de commande
   - Lien de suivi avec GUID
   - Redirection vers la page de suivi

5. **Suivi de commande** (`pages/suivi-commande.html`)
   - Visualisation de l'état de la commande
   - Support des paramètres URL: `?order=GUID` ou `?guid=GUID`
   - Affichage des détails et statuts

## Fichiers modifiés/créés

### Fichiers JavaScript
- ✅ `js/checkout.js` - Déjà existant et fonctionnel
- ✅ `js/order-manager.js` - Déjà existant et fonctionnel
- ✅ `js/cart.js` - Déjà existant et fonctionnel
- ✅ `js/translations.js` - Déjà existant avec traductions
- ✅ `js/order-tracking.js` - Déjà existant avec support GUID

### Fichiers CSS
- ✅ `css/checkout.css` - Styles du modal de checkout
- ✅ `css/cart.css` - Styles du panier

### Fichiers HTML
- 📝 `pages/commandes.html` - Page de commande (bouton "Passer la commande")
- ✅ `pages/suivi-commande.html` - Page de suivi
- ✅ `test-checkout-flow.html` - Page de test du flux complet

### Fichiers de données
- ✅ `data/orders.json` - Base de données des commandes

## Utilisation

### Pour tester le système:

1. **Ouvrir la page de test:**
   ```
   Test/test-checkout-flow.html
   ```

2. **Flux de commande:**
   - Ajouter des produits au panier
   - Cliquer sur "Passer la commande"
   - Remplir le formulaire:
     * Nom (obligatoire)
     * Prénom (obligatoire)
     * Email (obligatoire)
     * Téléphone (obligatoire)
     * Note (optionnel)
     * Date de livraison (optionnel)
   - Confirmer la commande
   - Voir la page de succès
   - Cliquer sur le lien de suivi

3. **Page de commande principale:**
   ```
   Test/pages/commandes.html
   ```

### Validation des champs

#### Email
- Format: `utilisateur@domaine.com`
- Validation en temps réel
- Message d'erreur si invalide

#### Téléphone
- Formats acceptés:
  * `514-555-1234`
  * `(514) 555-1234`
  * `5145551234`
- Validation en temps réel
- Message d'erreur si invalide

## Structure de données

### Commande créée
```json
{
  "orderId": 1,
  "orderGuid": "uuid-v4",
  "customerFirstName": "Jean",
  "customerLastName": "Dupont",
  "email": "jean.dupont@example.com",
  "phone": "514-555-1234",
  "language": "fr",
  "orderNote": "Note optionnelle",
  "totalAmount": 45.50,
  "status": "New",
  "scheduledOn": "2025-10-23T10:30:00",
  "deliveryDate": "2025-10-25",
  "deposit": 0,
  "paid": false,
  "orderLines": [
    {
      "productId": "pain-blanc-classique",
      "quantityOrdered": 2,
      "quantityProduced": 0,
      "price": 5.99,
      "lineTotal": 11.98,
      "lineStatus": "ToDo",
      "scheduledOn": "2025-10-24T08:00:00"
    }
  ]
}
```

## Statuts

### Statuts de commande
- `New` - Reçu / Received
- `Plan` - Planifié / Planned
- `Production` - En production / In Production
- `Completed` - Prête / Ready
- `Done` - Récupéré client / Picked Up
- `Cancel` - Annulé client / Cancelled

### Statuts de ligne
- `ToDo` - À faire / To Do
- `Plan` - Planifié / Planned
- `Production` - En production / In Production
- `Completed` - Complété / Completed

## Traductions

Le système est complètement bilingue (français/anglais). Toutes les traductions sont dans `js/translations.js`.

### Clés de traduction principales:
- `orders.checkout` - "Passer la commande"
- `orders.checkoutTitle` - Titre du modal
- `orders.orderSuccess` - Message de succès
- `orders.trackOrder` - Lien de suivi
- etc.

## Prochaines étapes (optionnelles)

1. **Intégration backend:**
   - Remplacer localStorage par API REST
   - Sauvegarder dans une vraie base de données
   - Envoyer emails de confirmation

2. **Paiement en ligne:**
   - Intégration Stripe/PayPal
   - Gestion des dépôts
   - Confirmation de paiement

3. **Notifications:**
   - Emails automatiques
   - SMS de confirmation
   - Notifications de statut

4. **Administration:**
   - Dashboard admin
   - Gestion des commandes
   - Génération de rapports

## Support

Pour toute question ou problème, consulter le code source ou les fichiers de test.
