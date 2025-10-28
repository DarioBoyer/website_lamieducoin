# Guide complet - Système de commandes avec Supabase

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Création de commandes](#création-de-commandes)
4. [Suivi de commandes](#suivi-de-commandes)
5. [Configuration requise](#configuration-requise)
6. [Tests](#tests)

---

## Vue d'ensemble

Le système de commandes de "La mie du coin" utilise Supabase comme base de données pour :
- ✅ Créer des commandes en ligne
- ✅ Stocker les informations clients
- ✅ Gérer les lignes de commande
- ✅ Permettre le suivi en temps réel
- ✅ Support bilingue (FR/EN)

---

## Architecture

### Composants principaux

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages                                                       │
│  • commandes.html      - Page de commande                   │
│  • suivi-commande.html - Suivi de commande                  │
│                                                              │
│  Scripts JavaScript                                          │
│  • cart.js                    - Gestion du panier           │
│  • checkout.js                - Processus de paiement       │
│  • order-service.js           - Service de commandes        │
│  • order-tracking-supabase.js - Suivi avec Supabase         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  Tables                                                      │
│  • Orders      - Commandes principales                      │
│  • OrdersLines - Lignes de commande                         │
│  • Products    - Catalogue de produits                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Création de commandes

### Flux utilisateur

1. **Client ajoute des produits au panier**
   - Fichier : `cart.js`
   - Stockage : localStorage (temporaire)

2. **Client clique sur "Passer la commande"**
   - Fichier : `checkout.js`
   - Ouvre le modal de paiement

3. **Client remplit le formulaire**
   - Prénom, nom (requis)
   - Email (requis, validé)
   - Téléphone (requis, format québécois)
   - Date de livraison (optionnel)
   - Note (optionnel)

4. **Validation et création**
   - Fichier : `order-service.js`
   - Génération d'un GUID unique
   - Insertion dans Supabase :
     - Table `Orders` (commande principale)
     - Table `OrdersLines` (lignes de commande)

5. **Confirmation**
   - Affichage du numéro de commande
   - Lien vers le suivi
   - Panier vidé

### Code exemple - Création de commande

```javascript
// Dans checkout.js
const result = await orderService.createOrder({
  customerFirstName: 'Jean',
  customerLastName: 'Dupont',
  email: 'jean@example.com',
  phone: '514-555-1234',
  orderNote: 'Sans noix SVP',
  deliveryDate: '2025-10-30',
  language: 'FR',
  orderLines: [
    {
      productId: 'pain-blanc',
      quantityOrdered: 2,
      price: 4.50
    }
  ]
});

// Résultat
{
  orderGuid: '550e8400-e29b-41d4-a716-446655440000',
  orderId: 42,
  totalAmount: 9.00,
  order: { /* données complètes */ },
  lines: [ /* lignes créées */ ]
}
```

---

## Suivi de commandes

### Accès au suivi

Le client reçoit un lien unique :
```
https://votresite.com/pages/suivi-commande.html?order=550e8400-e29b-41d4-a716-446655440000
```

### Fonctionnalités du suivi

1. **Informations de commande**
   - Numéro de commande
   - Nom du client
   - Date de commande
   - Statut actuel

2. **Progression**
   - Timeline des statuts (New → Plan → Production → Completed → Done)
   - Détails de production (si en cours)
   - Progression par produit

3. **Détails**
   - Liste des produits commandés
   - Quantités et prix
   - Total et paiement
   - Note de commande

4. **Communication**
   - Formulaire de commentaire
   - Coordonnées de contact

### Statuts de commande

| Statut | FR | EN | Description |
|--------|----|----|-------------|
| New | Nouvelle | New | Commande reçue |
| Plan | Planifiée | Planned | Production planifiée |
| Production | En production | In production | En cours de fabrication |
| Completed | Complétée | Completed | Prête pour récupération |
| Done | Récupérée | Picked up | Commande remise |
| Cancel | Annulée | Cancelled | Commande annulée |

### Code exemple - Récupération de commande

```javascript
// Dans order-tracking-supabase.js
const { data: order } = await supabaseClient
  .from('Orders')
  .select('*')
  .eq('GuidId', orderGuid)
  .single();

const { data: orderLines } = await supabaseClient
  .from('OrdersLines')
  .select(`
    *,
    Products (
      code, title_fr, title_en,
      description_fr, description_en,
      icon, price
    )
  `)
  .eq('orderId', order.id);
```

---

## Configuration requise

### 1. Structure de base de données

#### Table Orders
```sql
CREATE TABLE public."Orders" (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "GuidId" VARCHAR NOT NULL UNIQUE,
  "customerFirstName" VARCHAR NOT NULL,
  "customerLastName" VARCHAR NOT NULL,
  email VARCHAR,
  phone VARCHAR,
  "phoneIsMobile" BOOLEAN,
  language VARCHAR DEFAULT 'FR',
  "orderNote" TEXT,
  "totalAmount" REAL DEFAULT 0,
  status VARCHAR DEFAULT 'New',
  "scheduledOn" DATE,
  "deliveryDate" DATE,
  deposit REAL DEFAULT 0,
  paid BOOLEAN DEFAULT FALSE
);
```

#### Table OrdersLines
```sql
CREATE TABLE public."OrdersLines" (
  id BIGINT PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "orderId" BIGINT NOT NULL REFERENCES "Orders"(id) ON DELETE CASCADE,
  "productId" BIGINT NOT NULL REFERENCES "Products"(id),
  "quantityOrdered" INTEGER NOT NULL DEFAULT 0,
  "quantityProduced" INTEGER NOT NULL DEFAULT 0,
  price REAL NOT NULL DEFAULT 0,
  "lineTotal" REAL NOT NULL DEFAULT 0,
  "lineStatus" VARCHAR NOT NULL DEFAULT 'ToDo',
  "scheduledOn" DATE
);
```

#### Table Products (colonnes requises)
```sql
ALTER TABLE public."Products" 
ADD COLUMN IF NOT EXISTS title_fr VARCHAR,
ADD COLUMN IF NOT EXISTS title_en VARCHAR,
ADD COLUMN IF NOT EXISTS description_fr TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT,
ADD COLUMN IF NOT EXISTS icon VARCHAR,
ADD COLUMN IF NOT EXISTS code VARCHAR;
```

### 2. Permissions Supabase

```sql
-- Lecture publique des commandes par GUID
CREATE POLICY "Public read by GUID" ON "Orders"
FOR SELECT USING (true);

-- Lecture publique des lignes de commande
CREATE POLICY "Public read order lines" ON "OrdersLines"
FOR SELECT USING (true);

-- Lecture publique des produits
CREATE POLICY "Public read products" ON "Products"
FOR SELECT USING (true);

-- Insertion publique de commandes (pour le site web)
CREATE POLICY "Public insert orders" ON "Orders"
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public insert order lines" ON "OrdersLines"
FOR INSERT WITH CHECK (true);
```

### 3. Index de performance

```sql
-- Index sur GUID pour recherche rapide
CREATE INDEX idx_orders_guidid ON "Orders"("GuidId");

-- Index sur orderId pour les lignes
CREATE INDEX idx_orderlines_orderid ON "OrdersLines"("orderId");

-- Index sur productId pour les jointures
CREATE INDEX idx_orderlines_productid ON "OrdersLines"("productId");
```

### 4. Données de produits

Les produits doivent avoir les IDs suivants :

| ID | Code | Titre FR | Titre EN |
|----|------|----------|----------|
| 1 | pain-blanc | Pain Blanc Classique | Classic White Bread |
| 2 | baguette | Baguette Française | French Baguette |
| 3 | pain-campagne | Pain de Campagne | Country Bread |
| ... | ... | ... | ... |

Voir `order-service.js` pour le mapping complet.

---

## Tests

### Test 1 : Créer une commande

1. Ouvrir `pages/commandes.html`
2. Ajouter des produits au panier
3. Cliquer sur "Passer la commande"
4. Remplir le formulaire
5. Soumettre
6. Vérifier :
   - ✅ Message de succès affiché
   - ✅ Numéro de commande généré
   - ✅ Lien de suivi fonctionnel

### Test 2 : Vérifier dans Supabase

```sql
-- Dernière commande créée
SELECT * FROM "Orders" 
ORDER BY created_at DESC 
LIMIT 1;

-- Ses lignes de commande
SELECT ol.*, p.code, p.title_fr 
FROM "OrdersLines" ol
JOIN "Products" p ON p.id = ol."productId"
WHERE ol."orderId" = (SELECT id FROM "Orders" ORDER BY created_at DESC LIMIT 1);
```

### Test 3 : Suivre une commande

1. Copier le lien de suivi
2. Ouvrir dans un nouvel onglet
3. Vérifier :
   - ✅ Informations correctes affichées
   - ✅ Statut visible
   - ✅ Produits listés
   - ✅ Total correct
   - ✅ Bilingue fonctionnel (FR/EN)

### Test 4 : Console du navigateur

```javascript
// Tester la connexion Supabase
const { data, error } = await supabaseClient
  .from('Orders')
  .select('count');
console.log('Total orders:', data);

// Tester la recherche par GUID
const guid = 'VOTRE-GUID';
const { data: order } = await supabaseClient
  .from('Orders')
  .select('*')
  .eq('GuidId', guid)
  .single();
console.log('Order:', order);
```

---

## Dépannage

### Problème : "Supabase library not loaded"

**Solution** : Vérifier que le script Supabase est chargé avant vos scripts :
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="../js/order-service.js"></script>
```

### Problème : "Order not found"

**Causes possibles** :
1. GUID incorrect
2. Commande pas encore créée dans Supabase
3. Permissions insuffisantes

**Solution** : Vérifier dans Supabase SQL Editor :
```sql
SELECT "GuidId", id FROM "Orders" ORDER BY created_at DESC LIMIT 5;
```

### Problème : Produits non affichés

**Causes possibles** :
1. Colonnes `title_fr`/`title_en` manquantes
2. ProductId ne correspond pas

**Solution** :
```sql
-- Vérifier la structure
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'Products';

-- Vérifier le mapping
SELECT id, code, title_fr FROM "Products";
```

### Problème : Foreign key violation

**Solution** : S'assurer que les IDs de produits existent :
```sql
-- Lister les IDs de produits disponibles
SELECT id, code FROM "Products" ORDER BY id;
```

---

## Fichiers du projet

### JavaScript
- `Test/js/cart.js` - Gestion du panier
- `Test/js/checkout.js` - Processus de commande
- `Test/js/order-service.js` - Service de création de commandes Supabase
- `Test/js/order-tracking-supabase.js` - Suivi de commandes avec Supabase
- `Test/js/translations.js` - Traductions FR/EN

### HTML
- `Test/pages/commandes.html` - Page de commandes
- `Test/pages/suivi-commande.html` - Page de suivi

### Documentation
- `Test/INTEGRATION-SUPABASE-COMMANDES.md` - Guide d'intégration
- `Test/CONFIGURATION-BDD-SUIVI-COMMANDES.md` - Configuration base de données
- `Test/GUIDE-COMPLET-COMMANDES.md` - Ce fichier

---

## Prochaines étapes

### Fonctionnalités à ajouter

1. **Notifications email**
   - Email de confirmation à la création
   - Email de changement de statut
   - Utiliser Supabase Edge Functions

2. **Paiement en ligne**
   - Intégration Stripe
   - Calcul de dépôt automatique (25%)
   - Gestion des remboursements

3. **Authentification client**
   - Login avec Supabase Auth
   - Historique des commandes
   - Profil client

4. **Interface admin**
   - Gestion des commandes
   - Mise à jour des statuts
   - Tableau de bord de production

5. **Notifications SMS**
   - Alertes de statut
   - Rappels de récupération

---

## Support

Pour toute question :
- 📧 Email : support@lamieducoin.ca
- 📖 Documentation Supabase : https://supabase.com/docs
- 🐛 Issues GitHub : [Créer un ticket]

---

**Dernière mise à jour** : 27 octobre 2025  
**Version** : 1.0.0
