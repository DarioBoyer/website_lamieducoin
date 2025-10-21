# 🎨 Guide Visuel du Panier d'Achat

## Interface Principale

```
┌─────────────────────────────────────────────────────────────────┐
│                      LA MIE DU COIN                             │
│  [Accueil] [Produits] [Commandes] [Histoire] [Contact] [FR|EN] │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────┬─────────────────────────────────┐
│   PRODUITS DISPONIBLES      │       MON PANIER                │
│                             │   ┌─────────────────────────┐   │
│ ┌─────────────────────────┐ │   │ 🛒 Mon Panier (3)       │   │
│ │   🍞 Pain Blanc         │ │   └─────────────────────────┘   │
│ │   Moelleux et délicieux │ │                                 │
│ │   5.99 $ / pain         │ │   🍞 Pain Blanc x2              │
│ │   [- 1 +] [AJOUTER]    │ │   5.99 $ × 2 = 11.98 $ [🗑️]    │
│ └─────────────────────────┘ │                                 │
│                             │   🥖 Baguette x1                │
│ ┌─────────────────────────┐ │   3.99 $ × 1 = 3.99 $ [🗑️]     │
│ │   🥖 Baguette          │ │                                 │
│ │   Croustillante...      │ │   [Vider le panier]             │
│ │   3.99 $ / pièce       │ │                                 │
│ │   [- 1 +] [AJOUTER]    │ │   ──────────────────────────    │
│ └─────────────────────────┘ │   Sous-total: 15.97 $          │
│                             │   (avant taxes)                 │
│         [Plus...]           │                                 │
│                             │   [PROCÉDER AU PAIEMENT]        │
└─────────────────────────────┴─────────────────────────────────┘
```

## Flux d'Utilisation

### 1️⃣ Parcourir les Produits

```
┌────────────────────────────────────┐
│  🍞 PAINS DE BASE                  │
├────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐    │
│  │ 🍞   │  │ 🥖   │  │ 🌾   │    │
│  │ Pain │  │Bague.│  │Campa.│    │
│  │ 5.99$│  │ 3.99$│  │ 6.49$│    │
│  └──────┘  └──────┘  └──────┘    │
└────────────────────────────────────┘
```

### 2️⃣ Sélectionner la Quantité

```
┌─────────────────────────────┐
│  🍞 Pain Blanc Classique    │
│  ────────────────────────   │
│  Moelleux à l'intérieur...  │
│  675g                       │
│                             │
│  5.99 $ / pain              │
│                             │
│  Quantité:                  │
│  ┌───┬─────┬───┐           │
│  │ - │  3  │ + │           │
│  └───┴─────┴───┘           │
│                             │
│  [🛒 AJOUTER AU PANIER]     │
└─────────────────────────────┘
```

### 3️⃣ Notification d'Ajout

```
┌────────────────────────────────┐
│ ✓ Pain Blanc ajouté au panier! │
└────────────────────────────────┘
     ↓ (Disparaît après 3 sec)
```

### 4️⃣ Gérer le Panier

```
┌───────────────────────────────────┐
│ 🛒 MON PANIER (5)                 │
├───────────────────────────────────┤
│                                   │
│ 🍞 Pain Blanc Classique           │
│ 5.99 $ × 3 = 17.97 $              │
│ [- 3 +] ───────────────── [🗑️]   │
│                                   │
│ 🥖 Baguette Française             │
│ 3.99 $ × 2 = 7.98 $               │
│ [- 2 +] ───────────────── [🗑️]   │
│                                   │
│ [Vider le panier]                 │
│                                   │
├───────────────────────────────────┤
│ SOUS-TOTAL: 25.95 $               │
│ (avant taxes)                     │
│                                   │
│ ℹ️ Les taxes seront calculées     │
│   lors de la finalisation         │
│                                   │
│ [💳 PROCÉDER AU PAIEMENT]         │
└───────────────────────────────────┘
```

## Actions Disponibles

### ➕ Ajouter un Produit

1. **Parcourir** les catégories de produits
2. **Ajuster** la quantité avec + / -
3. **Cliquer** sur "Ajouter au panier"
4. **Observer** la notification de confirmation
5. **Vérifier** le panier mis à jour

### ✏️ Modifier une Quantité

**Dans le panier:**
```
[- 2 +]  ou  [2 ▼]
```
- Cliquer sur `-` pour diminuer
- Cliquer sur `+` pour augmenter
- Taper directement un nombre
- Le total se met à jour automatiquement

### 🗑️ Supprimer un Article

```
🍞 Pain Blanc × 2 ───── [🗑️] ← Cliquer ici
```
- Cliquer sur l'icône de poubelle
- L'article disparaît immédiatement
- Le total se recalcule

### 🧹 Vider le Panier

```
[Vider le panier]
```
1. Cliquer sur "Vider le panier"
2. Confirmer l'action
3. Tous les articles sont supprimés

## États du Panier

### 🔴 Panier Vide

```
┌───────────────────────────┐
│ 🛒 MON PANIER             │
├───────────────────────────┤
│                           │
│      🛒                   │
│   Votre panier est vide   │
│                           │
│ Commencez à ajouter       │
│ des produits!             │
│                           │
└───────────────────────────┘
```

### 🟡 Panier Avec Articles

```
┌───────────────────────────┐
│ 🛒 MON PANIER (3)         │
├───────────────────────────┤
│ 🍞 Pain... × 2  [🗑️]     │
│ 🥖 Bague... × 1  [🗑️]    │
│ [Vider le panier]         │
├───────────────────────────┤
│ SOUS-TOTAL: 15.97 $       │
│ [💳 PAIEMENT]             │
└───────────────────────────┘
```

### 🟢 Prêt Pour Paiement

```
┌───────────────────────────┐
│ 🛒 MON PANIER (5)         │
├───────────────────────────┤
│ [Articles...]             │
├───────────────────────────┤
│ SOUS-TOTAL: 35.45 $       │
│                           │
│ ✅ Commande min. atteinte │
│                           │
│ [💳 PROCÉDER AU PAIEMENT] │
└───────────────────────────┘
```

## Responsive Design

### 📱 Mobile

```
┌──────────────────┐
│ LA MIE DU COIN   │
│ [☰]        [FR]  │
└──────────────────┘

┌──────────────────┐
│ 🍞 Pain Blanc    │
│ 5.99 $           │
│ [- 1 +]          │
│ [AJOUTER]        │
└──────────────────┘

┌──────────────────┐
│ 🥖 Baguette      │
│ 3.99 $           │
│ [- 1 +]          │
│ [AJOUTER]        │
└──────────────────┘

       ⬇️

┌──────────────────┐
│ 🛒 PANIER (2)    │
│ Pain × 1         │
│ Baguette × 1     │
│ Total: 9.98 $    │
│ [PAIEMENT]       │
└──────────────────┘
```

### 💻 Desktop

```
┌─────────────────┬───────────┐
│    PRODUITS     │  PANIER   │
│    (3 cols)     │ (sticky)  │
│                 │           │
│ [🍞][🥖][🌾]   │ 🛒 (5)    │
│ [🥐][🥨][🍫]   │ ──────    │
│ [...][...][..] │ Articles  │
│                 │ Total     │
│                 │ [PAYER]   │
└─────────────────┴───────────┘
```

## Indications Visuelles

### Icônes et Significations

- 🛒 = Panier
- 🍞 = Pain
- 🥖 = Baguette
- 🥐 = Viennoiserie
- 🥨 = Pain en forme
- 🌾 = Sans gluten
- ⭐ = Produit populaire
- 🗑️ = Supprimer
- ➕ = Augmenter
- ➖ = Diminuer
- ✓ = Confirmation
- ℹ️ = Information
- 💳 = Paiement

### Codes Couleurs

```
🟢 VERT    = Action positive (ajouter, confirmer)
🔴 ROUGE   = Action destructive (supprimer, vider)
🔵 BLEU    = Action primaire (paiement)
🟡 JAUNE   = Avertissement / Information
⚪ GRIS    = Désactivé / Secondaire
```

## Raccourcis Clavier (à venir)

| Touche | Action |
|--------|--------|
| `+` | Augmenter quantité |
| `-` | Diminuer quantité |
| `Delete` | Supprimer article sélectionné |
| `Enter` | Ajouter au panier |
| `Esc` | Fermer panier (mobile) |

## Messages d'État

### ✅ Succès

```
┌────────────────────────────┐
│ ✓ Produit ajouté au panier │
└────────────────────────────┘
```

### ℹ️ Information

```
┌──────────────────────────────────┐
│ ℹ️ Commande minimum: 10.00 $     │
└──────────────────────────────────┘
```

### ⚠️ Avertissement

```
┌──────────────────────────────────┐
│ ⚠️ Système de paiement à venir   │
└──────────────────────────────────┘
```

## Animations

### Ajout au Panier

```
Produit → Notification → Panier
  📦    →      ✓       →   🛒
       (slide)      (update)
```

### Suppression

```
Article → Fade Out → Recalcul
  🍞   →    ...    →   💰
```

### Mise à Jour Quantité

```
[- 2 +] → [- 3 +] → Total ↑
```

---

## 💡 Conseils d'Utilisation

### Pour Commander Efficacement

1. **Parcourir** d'abord tous les produits
2. **Planifier** votre commande
3. **Ajouter** tous les produits d'un coup
4. **Vérifier** le panier avant de payer
5. **Procéder** au paiement

### Pour Économiser du Temps

- Utiliser les boutons +/- rapides
- Ajouter directement la bonne quantité
- Vérifier les produits populaires (⭐)
- Profiter de la persistance du panier

### Pour Éviter les Erreurs

- Vérifier les quantités dans le panier
- Confirmer avant de vider le panier
- Vérifier le total avant paiement
- Noter la commande minimum

---

**🎨 Design créé pour une expérience utilisateur optimale!**

*Guide visuel v1.0 - 21 octobre 2025*
