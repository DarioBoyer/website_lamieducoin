# Système de Gestion des Commandes

## Fonctionnement

Le système de gestion des commandes utilise une approche hybride :

### 1. Commandes de démonstration (fichier JSON)
Les commandes d'exemple sont stockées dans `data/orders.json` (ID 1 à 5).

### 2. Commandes réelles (localStorage)
Les nouvelles commandes créées par les clients sont sauvegardées dans le **localStorage** du navigateur (ID 6+).

## Pourquoi localStorage ?

Cette solution a été choisie car :
- ✅ Pas besoin de backend/serveur
- ✅ Sauvegarde instantanée côté client
- ✅ Les commandes persistent entre les sessions
- ⚠️ **Limitation** : Les données sont stockées localement sur le navigateur

## Visualiser les commandes

### Dans le navigateur
1. Ouvrir les outils de développement (F12)
2. Aller dans l'onglet **Application** (Chrome) ou **Storage** (Firefox)
3. Dans la section **Local Storage**, trouver votre domaine
4. Chercher la clé `localOrders`

### Via la console
```javascript
// Voir toutes les commandes locales
JSON.parse(localStorage.getItem('localOrders'))

// Compter les commandes
JSON.parse(localStorage.getItem('localOrders')).length
```

## Exporter les commandes

### Option 1 : Console du navigateur
```javascript
// Copier toutes les commandes en JSON
copy(localStorage.getItem('localOrders'))
```
Puis coller dans un fichier texte.

### Option 2 : Script d'export
Ajoutez ce code dans une page admin :

```javascript
function exportOrders() {
    const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
    const blob = new Blob([JSON.stringify(localOrders, null, 2)], 
                          { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
}
```

## Ajouter les commandes au fichier JSON

Pour intégrer les commandes locales dans `orders.json` :

1. Exporter les commandes (voir ci-dessus)
2. Ouvrir `data/orders.json`
3. Copier les commandes exportées dans le tableau `orders`
4. Sauvegarder le fichier

## Vider les commandes locales

**⚠️ ATTENTION : Cette action est irréversible !**

```javascript
// Supprimer toutes les commandes locales
localStorage.removeItem('localOrders')
```

## Migrer vers un backend

Pour passer à un vrai système avec base de données :

1. **Backend Node.js/Express** :
   - Créer une API REST (`POST /api/orders`)
   - Utiliser une base de données (MongoDB, PostgreSQL, etc.)
   - Modifier `order-manager.js` pour faire des appels API

2. **Backend Python/Flask** :
   - Créer des endpoints pour CRUD des commandes
   - Utiliser SQLite ou autre DB
   - Adapter les appels dans le frontend

3. **Firebase** :
   - Utiliser Firestore pour stocker les commandes
   - Authentication pour sécuriser
   - Temps réel pour les mises à jour

## Sauvegarde automatique

Toutes les opérations suivantes sauvegardent automatiquement dans localStorage :
- ✅ Création de commande
- ✅ Modification de commande
- ✅ Ajout/suppression de ligne
- ✅ Changement de statut
- ✅ Annulation

## Structure d'une commande

```json
{
  "orderId": 6,
  "orderGuid": "f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c",
  "customerLastName": "Nom",
  "customerFirstName": "Prénom",
  "email": "client@example.com",
  "phone": "514-555-1234",
  "language": "fr",
  "orderNote": "Note spéciale",
  "totalAmount": 45.50,
  "status": "New",
  "scheduledOn": "2025-10-24T10:30:00",
  "deliveryDate": "2025-10-27",
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
      "scheduledOn": "2025-10-26T08:00:00"
    }
  ]
}
```

## Dépannage

### La commande n'apparaît pas
1. Vérifier la console (F12) pour les erreurs
2. Vérifier que `localOrders` existe dans localStorage
3. Vérifier que le GUID est correct dans l'URL

### Réinitialiser le système
```javascript
// Tout effacer et recommencer
localStorage.clear()
location.reload()
```

### Restaurer une commande
Si vous avez une sauvegarde JSON :
```javascript
const commandes = [/* vos commandes */];
localStorage.setItem('localOrders', JSON.stringify(commandes));
```

## Limitations actuelles

1. **Pas de synchronisation entre navigateurs** : Les commandes sont stockées localement
2. **Risque de perte** : Si le cache du navigateur est vidé, les commandes sont perdues
3. **Pas de backup automatique** : Il faut exporter manuellement
4. **Limite de stockage** : ~5-10MB selon le navigateur

## Recommandations

Pour un environnement de production :
- 🔴 **Ne pas** utiliser uniquement localStorage
- 🟢 **Utiliser** un backend avec base de données
- 🟢 **Implémenter** des backups automatiques
- 🟢 **Ajouter** une authentification
- 🟢 **Envoyer** des emails de confirmation
