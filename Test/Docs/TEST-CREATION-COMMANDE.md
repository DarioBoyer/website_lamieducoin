# 🧪 Test rapide - Création de commande corrigée

## 🎯 Objectif
Vérifier que les commandes sont maintenant créées complètement dans Supabase (en-tête ET lignes).

## 📋 Étapes de test

### 1. Ouvrir la page de commandes
```
http://localhost:8000/pages/commandes.html
```

### 2. Vérifier l'initialisation
Ouvrir la console du navigateur (F12) et vérifier les messages:
```
✅ Client Supabase initialisé pour les commandes
✅ Service de commandes initialisé avec Supabase
✅ [X] produits chargés pour le mapping
```

### 3. Ajouter des produits au panier
- Ajouter 2 "Pain Blanc Classique"
- Ajouter 1 "Baguette Française"
- Ajouter 3 "Croissant"

### 4. Passer la commande
1. Cliquer sur "Passer la commande"
2. Remplir le formulaire:
   - Prénom: Test
   - Nom: Utilisateur
   - Email: test@example.com
   - Téléphone: 514-555-1234
   - Note: Test de création de commande
3. Cliquer sur "Confirmer la commande"

### 5. Vérifier les logs console
```
📝 Création de la commande: { ... }
✅ Commande créée avec succès: { ... }
📝 Création des lignes de commande: [ ... ]
✅ Lignes de commande créées avec succès: [ ... ]
```

### 6. Vérifier dans Supabase

#### Table Orders
1. Aller sur https://supabase.com
2. Ouvrir le projet
3. Table Editor > Orders
4. Vérifier qu'une nouvelle ligne existe avec:
   - customerFirstName: "Test"
   - customerLastName: "Utilisateur"
   - email: "test@example.com"
   - totalAmount: [montant correct]
   - status: "New"

#### Table OrdersLines
1. Table Editor > OrdersLines
2. Filtrer par `orderId` = [ID de la commande créée]
3. **IMPORTANT**: Vérifier qu'il y a **3 lignes**:
   - Ligne 1: productId valide, quantityOrdered: 2 (Pain Blanc)
   - Ligne 2: productId valide, quantityOrdered: 1 (Baguette)
   - Ligne 3: productId valide, quantityOrdered: 3 (Croissant)

### 7. Vérifier les productId

Pour chaque ligne dans OrdersLines:
1. Noter le `productId`
2. Aller dans Table Editor > Products
3. Chercher le produit avec cet `id`
4. Vérifier que c'est bien le bon produit

## ✅ Critères de succès

- [ ] Aucune erreur dans la console
- [ ] Message "Commande créée avec succès"
- [ ] Message "Lignes de commande créées avec succès"
- [ ] Panier vidé automatiquement
- [ ] Modal de succès affiché
- [ ] **1 ligne dans Orders**
- [ ] **3 lignes dans OrdersLines** (une par produit)
- [ ] Tous les `productId` sont valides (non NULL)
- [ ] Les quantités correspondent
- [ ] Le total est correct

## ❌ Si le test échoue

### Erreur: "Cache des produits non initialisé"
**Solution**: Rafraîchir la page (F5) et réessayer

### Erreur: "Produit introuvable: [code]"
**Solution**: 
1. Vérifier dans Supabase > Products que le produit existe
2. Vérifier que le champ `code` correspond
3. Vérifier que `productType = 'retail'` et `status = 'Active'`

### Les lignes ne sont toujours pas créées
**Vérifications**:
1. Console > Network > Filtrer "OrdersLines"
2. Regarder la requête POST
3. Vérifier la réponse (status 200 ou erreur?)
4. Vérifier les permissions Supabase sur la table OrdersLines

### productId est NULL dans OrdersLines
**Cause**: Le mapping n'a pas fonctionné
**Solution**: 
```javascript
// Dans la console:
orderService.productsCache
// Devrait afficher un tableau de produits
```

## 🔄 Test de régression

Tester aussi:
- [ ] Commande avec 1 seul produit
- [ ] Commande avec tous les types de produits
- [ ] Commande sans date de livraison
- [ ] Commande avec note très longue
- [ ] Changement de langue (FR/EN)

## 📊 Résultat attendu dans Supabase

### Orders
```
id | GuidId | customerFirstName | customerLastName | email | totalAmount | status
---+--------+------------------+-----------------+-------+-------------+-------
50 | abc... | Test             | Utilisateur     | test@ | 25.50       | New
```

### OrdersLines
```
id | orderId | productId | quantityOrdered | price | lineTotal | lineStatus
---+---------+-----------+----------------+-------+-----------+-----------
101| 50      | 1         | 2              | 5.50  | 11.00     | ToDo
102| 50      | 2         | 1              | 6.50  | 6.50      | ToDo
103| 50      | 6         | 3              | 2.50  | 7.50      | ToDo
```

---

**Date**: 1er novembre 2025  
**Durée estimée**: 5 minutes  
**Niveau**: ⭐ Facile  
**Status**: 🟢 Prêt pour le test
