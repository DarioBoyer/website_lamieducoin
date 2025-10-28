# Test d'intégration - Gestion des commandes avec Supabase

## Modifications effectuées

### 1. Fichier `admin-orders.js`
- ✅ Converti en module ES6
- ✅ Import de `dbConnection` et `orderService`
- ✅ Initialisation de la connexion Supabase au chargement
- ✅ Chargement des commandes depuis Supabase au lieu d'un fichier JSON
- ✅ Chargement des lignes de commande avec les informations produits (relation `Products`)
- ✅ Utilisation de `order.id` au lieu de `order.orderId`
- ✅ Utilisation de `order.GuidId` au lieu de `order.orderGuid`
- ✅ Gestion des valeurs nulles/undefined pour éviter les erreurs
- ✅ Fonctions d'export JSON conservées
- ✅ Affichage des toasts Bootstrap pour les messages de succès/erreur

### 2. Fichier `gestion-commandes.html`
- ✅ Ajout de la bibliothèque Supabase JS
- ✅ Chargement de `admin-orders.js` comme module ES6 (`type="module"`)
- ✅ Mise à jour des en-têtes de tableau pour correspondre aux colonnes affichées
- ✅ Correction du `data-sort` pour utiliser `id` au lieu de `orderId`
- ✅ Ajout d'un conteneur pour les toasts de notification

### 3. Structure des données
Le script charge maintenant les données avec la structure suivante:

```javascript
{
  id: 1,
  GuidId: "uuid-string",
  customerFirstName: "Prénom",
  customerLastName: "Nom",
  email: "email@example.com",
  phone: "514-123-4567",
  language: "FR" ou "EN",
  orderNote: "Note optionnelle",
  totalAmount: 45.50,
  deposit: 10.00,
  paid: false,
  status: "New"|"Plan"|"Production"|"Completed"|"Done"|"Cancel",
  deliveryDate: "2025-10-30",
  scheduledOn: "2025-10-30T10:00:00",
  created_at: "2025-10-28T14:30:00",
  orderLines: [
    {
      id: 1,
      orderId: 1,
      productId: "PAIN-001",
      quantityOrdered: 2,
      quantityProduced: 0,
      unitPrice: 5.50,
      lineStatus: "ToDo"|"Plan"|"Production"|"Completed",
      Products: {
        code: "PAIN-001",
        title_fr: "Pain blanc",
        title_en: "White bread",
        icon: "bread-slice",
        categoryId: 1
      }
    }
  ]
}
```

## Comment tester

1. **Ouvrir la page de gestion des commandes**
   ```
   http://localhost:8000/pagesadmin/gestion-commandes.html
   ```
   (Ou le port de votre serveur local)

2. **Vérifications à effectuer:**

   - ✅ La page se charge sans erreur JavaScript (vérifier la console)
   - ✅ Les statistiques affichent les bonnes valeurs (Nouvelles, Planifiées, En Production, Total Actives)
   - ✅ La liste des commandes s'affiche dans le tableau
   - ✅ Les colonnes affichées sont: #, Client, Email, Téléphone, Date, Nb Items, Montant, Statut, Actions
   - ✅ Le tri fonctionne en cliquant sur les en-têtes de colonnes
   - ✅ La recherche filtre correctement les commandes
   - ✅ Le filtre par statut fonctionne
   - ✅ Le filtre par date fonctionne
   - ✅ Le bouton "Réinitialiser" remet les filtres à zéro
   - ✅ Le bouton "Voir détails" ouvre le modal avec toutes les informations
   - ✅ Les produits dans le modal affichent le nom correct (depuis la table Products)
   - ✅ Le bouton "Exporter tout (JSON)" télécharge un fichier JSON
   - ✅ Le bouton "Exporter locales" exporte les commandes créées aujourd'hui
   - ✅ La vue "Cartes" affiche les commandes sous forme de cartes
   - ✅ Les toasts de notification apparaissent pour les actions (export, erreurs)

3. **Console du navigateur**
   Vous devriez voir:
   ```
   ✅ Connexion à Supabase établie
   ✅ Database initialized for orders management
   ✅ Loaded X orders from Supabase
   ```

4. **Vérification de la connexion Supabase**
   - Allez dans l'onglet Network de DevTools
   - Recherchez les requêtes vers `supabase.co`
   - Vérifiez qu'elles retournent un statut 200

## Dépannage

### Erreur: "La bibliothèque Supabase n'est pas chargée"
- Vérifiez que la CDN Supabase est bien chargée dans le HTML
- Vérifiez votre connexion Internet

### Erreur: "Filter elements not found"
- Vérifiez que les IDs des éléments dans le HTML correspondent à ceux utilisés dans le JS
- Vérifiez que le script se charge après le DOM

### Aucune commande affichée
- Vérifiez la console pour voir s'il y a des erreurs
- Vérifiez que des commandes existent dans Supabase
- Vérifiez les filtres actifs (par défaut: statuts actifs uniquement)

### Erreur de connexion Supabase
- Vérifiez les credentials dans `database.js`
- Vérifiez les Row Level Security (RLS) policies dans Supabase
- Vérifiez que la clé `anon` a les bonnes permissions

## Structure des fichiers modifiés

```
Test/
├── pagesadmin/
│   ├── gestion-commandes.html  ← Modifié pour charger Supabase et le module
│   └── index.html              ← Référence (déjà fonctionnel)
└── data/
    └── js/
        ├── admin-orders.js     ← Modifié pour utiliser Supabase
        ├── admin-dashboard.js  ← Référence (déjà fonctionnel)
        ├── config/
        │   └── database.js     ← Configuration Supabase
        └── services/
            └── orderService.js ← Service CRUD pour les commandes
```

## Prochaines étapes

1. Tester toutes les fonctionnalités listées ci-dessus
2. Signaler tout bug ou comportement inattendu
3. Une fois validé, appliquer le même pattern aux autres pages admin:
   - `gestion-produits.html`
   - `gestion-inventaire.html`
   - `gestion-production.html`
