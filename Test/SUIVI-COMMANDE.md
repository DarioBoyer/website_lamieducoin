# Système de Suivi de Commande - La mie du coin

## Vue d'ensemble

Le système de suivi de commande permet aux clients de consulter l'état de leur commande en temps réel via un lien personnalisé contenant un GUID unique.

## Fichiers créés

### Pages HTML
- **`pages/suivi-commande.html`** - Page principale de suivi de commande
- **`pages/test-suivi.html`** - Page de test pour démonstration

### Styles
- **`css/order-tracking.css`** - Styles CSS personnalisés pour la page de suivi

### JavaScript
- **`js/order-tracking.js`** - Logique métier pour le suivi de commande

### Données
- **`data/orders.json`** - Base de données des commandes (mise à jour)

## Fonctionnalités

### ✅ Fonctionnalités principales

1. **Recherche par GUID**
   - Chaque commande possède un GUID unique
   - Le client accède à sa commande via: `suivi-commande.html?guid=XXXXXXXX`
   - Validation automatique du GUID

2. **Affichage du statut**
   - **Reçu (New)**: Commande enregistrée
   - **Planifié (Plan)**: Production planifiée avec date
   - **En production (Production)**: Affichage de la progression en temps réel
   - **Prête (Completed)**: Prête pour récupération
   - **Récupérée (Done)**: Client a récupéré sa commande
   - **Annulée (Cancel)**: Commande annulée

3. **Timeline visuelle**
   - Affiche les étapes franchies (vert)
   - Étape actuelle mise en évidence avec animation
   - Étapes futures en attente (gris)

4. **Progression en production**
   - Statistiques en temps réel (total, complétés, en cours, en attente)
   - Barre de progression globale
   - Détails par produit avec mini-barres de progression
   - Calcul basé sur `quantityProduced` vs `quantityOrdered`

5. **Détails de la commande**
   - Liste des produits commandés
   - Quantités et prix
   - Notes spéciales du client
   - Informations de contact
   - Résumé financier (sous-total, dépôt, total)
   - Statut de paiement

6. **Section commentaires**
   - Permet au client de laisser un message
   - Formulaire simple et intuitif
   - Message de confirmation après envoi

7. **Support multilingue**
   - Français et anglais
   - Traductions complètes dans `translations.js`
   - Changement de langue en temps réel

8. **Design responsive**
   - Optimisé pour desktop (1920px+)
   - Tablette (768px-1024px)
   - Mobile (320px-767px)
   - Mode impression optimisé

## Structure des données

### Format de commande (orders.json)

```json
{
  "orderStatuses": {
    "New": { "fr": "Reçu", "en": "Received" },
    "Plan": { "fr": "Planifié", "en": "Planned" },
    "Production": { "fr": "En production", "en": "In Production" },
    "Completed": { "fr": "Prête", "en": "Ready" },
    "Done": { "fr": "Récupéré client", "en": "Picked Up" },
    "Cancel": { "fr": "Annulé client", "en": "Cancelled" }
  },
  "lineStatuses": {
    "ToDo": { "fr": "À faire", "en": "To Do" },
    "Plan": { "fr": "Planifié", "en": "Planned" },
    "Production": { "fr": "En production", "en": "In Production" },
    "Completed": { "fr": "Complété", "en": "Completed" }
  },
  "orders": [
    {
      "orderId": 1,
      "orderGuid": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",
      "customerLastName": "Dupont",
      "customerFirstName": "Jean",
      "email": "jean.dupont@example.com",
      "phone": "514-555-1234",
      "language": "fr",
      "orderNote": "Livraison le matin si possible",
      "totalAmount": 45.50,
      "status": "Production",
      "scheduledOn": "2025-10-23T10:30:00",
      "deliveryDate": "2025-10-25",
      "deposit": 15.00,
      "paid": false,
      "orderLines": [
        {
          "productId": "pain-blanc-classique",
          "quantityOrdered": 2,
          "quantityProduced": 1,
          "price": 5.99,
          "lineTotal": 11.98,
          "lineStatus": "Production",
          "scheduledOn": "2025-10-24T08:00:00"
        }
      ]
    }
  ]
}
```

## Utilisation

### Pour tester

1. Ouvrir `pages/test-suivi.html` dans un navigateur
2. Cliquer sur une commande de test
3. Observer l'affichage du suivi de commande

### Pour intégrer dans un courriel

```html
Bonjour {customerFirstName},

Votre commande #{orderId} a été confirmée!

Suivez l'état de votre commande en temps réel:
https://lamieducoin.com/pages/suivi-commande.html?guid={orderGuid}

Merci de votre confiance,
L'équipe La mie du coin
```

### Personnalisation des statuts

Pour modifier un statut de commande, éditez `data/orders.json`:

```json
{
  "status": "Production",  // Changez ici: New, Plan, Production, Completed, Done, Cancel
  "orderLines": [
    {
      "lineStatus": "Production",  // Statut par ligne
      "quantityProduced": 1        // Progression
    }
  ]
}
```

## Calcul de la progression

La progression en production est calculée automatiquement:

```javascript
progression = (quantityProduced / quantityOrdered) × 100
```

### Exemple
- Commandé: 4 croissants
- Produit: 2 croissants
- Progression: 50%

## Sécurité

⚠️ **Important**: Dans un environnement de production:

1. **GUID**: Utilisez des UUIDs v4 cryptographiquement sûrs
2. **API Backend**: Ne pas exposer toutes les commandes via JSON statique
3. **Authentification**: Ajouter une couche d'authentification si nécessaire
4. **HTTPS**: Toujours utiliser HTTPS en production
5. **Rate limiting**: Limiter les requêtes pour éviter les abus

## Améliorations futures

### Court terme
- [ ] Notifications par courriel lors de changement de statut
- [ ] Historique des commentaires du client
- [ ] Estimation du temps de complétion
- [ ] Photos des produits en production

### Moyen terme
- [ ] Application mobile (PWA)
- [ ] Notifications push
- [ ] QR Code pour accès rapide
- [ ] Système de feedback après récupération

### Long terme
- [ ] Intégration avec système de paiement
- [ ] Livraison en temps réel (géolocalisation)
- [ ] Chat en direct avec la boulangerie
- [ ] Programme de fidélité intégré

## Support navigateurs

✅ Testé et compatible avec:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Dépendances

- Bootstrap 5.3.2
- Bootstrap Icons 1.11.1
- JavaScript ES6+ (Fetch API, Async/await)

## Auteur

Développé pour **La mie du coin**
Date: Octobre 2025

## Licence

Usage interne uniquement - La mie du coin
