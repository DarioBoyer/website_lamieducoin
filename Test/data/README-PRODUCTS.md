# 📦 Base de Données Produits - La mie du coin

## 📄 Fichier: `products.json`

Cette base de données JSON contient **tous les produits** de la boulangerie "La mie du coin", organisés de manière structurée pour un affichage dynamique sur le site web.

---

## 🏗️ Structure du Fichier

Le fichier JSON contient trois sections principales:

### 1. **Products** (30 produits)

Tableau de tous les produits avec leurs caractéristiques complètes.

#### Champs pour chaque produit:

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `id` | string | Identifiant unique | `"pain-blanc-classique"` |
| `category` | string | ID de la catégorie | `"pains-base"` |
| `title` | object | Titre en FR et EN | `{"fr": "...", "en": "..."}` |
| `description` | object | Description de vente en FR et EN | `{"fr": "...", "en": "..."}` |
| `price` | number | Prix en dollars canadiens | `5.99` |
| `currency` | string | Devise | `"CAD"` |
| `unit` | string | Unité de vente | `"loaf"`, `"piece"`, `"pack of 6"`, `"bag"` |
| `icon` | string | Emoji pour l'affichage | `"🍞"` |
| `image` | string | Chemin vers l'image | `"/img/products/..."` |
| `weight` | string | Poids du produit | `"675g"` |
| `allergens` | array | Liste des allergènes | `["gluten", "wheat"]` |
| `ingredients` | array | Ingrédients principaux | `["farine", "eau", "levure"]` |
| `available` | boolean | Disponibilité | `true` ou `false` |
| `featured` | boolean | Produit vedette | `true` ou `false` |

### 2. **Categories** (6 catégories)

Tableau des catégories de produits.

#### Champs pour chaque catégorie:

| Champ | Type | Description | Exemple |
|-------|------|-------------|---------|
| `id` | string | Identifiant unique | `"pains-base"` |
| `name` | object | Nom en FR et EN | `{"fr": "Pains de Base", "en": "Basic Breads"}` |
| `icon` | string | Emoji de la catégorie | `"🍞"` |
| `description` | object | Description en FR et EN | `{"fr": "...", "en": "..."}` |
| `order` | number | Ordre d'affichage | `1`, `2`, `3`... |

### 3. **Metadata**

Informations sur le fichier JSON.

| Champ | Type | Description |
|-------|------|-------------|
| `version` | string | Version du fichier |
| `lastUpdated` | string | Date de dernière mise à jour |
| `currency` | string | Devise par défaut |
| `locale.default` | string | Langue par défaut |
| `locale.available` | array | Langues disponibles |

---

## 📊 Catégories de Produits

| ID | Nom FR | Nom EN | Icône | Produits |
|----|--------|--------|-------|----------|
| `pains-base` | Pains de Base | Basic Breads | 🍞 | 8 |
| `pains-specialises` | Pains Spécialisés | Specialty Breads | 🌰 | 7 |
| `viennoiseries` | Viennoiseries | Pastries | 🥐 | 3 |
| `pains-forme` | Pains en Forme | Shaped Breads | 🥨 | 5 |
| `sans-gluten` | Options Sans Gluten | Gluten-Free Options | 🌾 | 3 |
| `pains-mediterraneens` | Spécialités Méditerranéennes | Mediterranean Specialties | 🇮🇹 | 2 |

**Total: 30 produits** (incluant 2 produits manquants dans le HTML original)

---

## 🚀 Utilisation

### Chargement des produits

Le fichier `products.js` charge automatiquement les données JSON et affiche les produits de manière dynamique:

```javascript
// Les produits sont chargés automatiquement au chargement de la page
// dans js/products.js
```

### Affichage dynamique

Les produits sont affichés:
- ✅ **Groupés par catégorie** selon l'ordre défini
- ✅ **Triés alphabétiquement** par titre dans la langue courante
- ✅ **Traduits automatiquement** selon la langue sélectionnée (FR/EN)
- ✅ **Mis à jour en temps réel** lors du changement de langue

### Changement de langue

Lorsque l'utilisateur change de langue (FR ↔ EN):
1. Le système de traduction déclenche un événement `languageChanged`
2. Le script `products.js` écoute cet événement
3. Les produits sont automatiquement rechargés et réaffichés dans la nouvelle langue

---

## ✏️ Modification des Produits

### Ajouter un nouveau produit

1. Ouvrir `products.json`
2. Ajouter un nouvel objet dans le tableau `products`:

```json
{
  "id": "nouveau-produit",
  "category": "pains-base",
  "title": {
    "fr": "Nouveau Pain",
    "en": "New Bread"
  },
  "description": {
    "fr": "Description en français",
    "en": "Description in English"
  },
  "price": 6.99,
  "currency": "CAD",
  "unit": "loaf",
  "icon": "🥖",
  "image": "/img/products/nouveau-produit.jpg",
  "weight": "700g",
  "allergens": ["gluten", "wheat"],
  "ingredients": ["farine", "eau", "levure", "sel"],
  "available": true,
  "featured": false
}
```

3. Sauvegarder le fichier
4. Rafraîchir la page web - le produit apparaîtra automatiquement!

### Modifier un produit existant

1. Trouver le produit par son `id`
2. Modifier les champs souhaités
3. Sauvegarder le fichier

### Désactiver un produit temporairement

Mettre le champ `available` à `false`:

```json
{
  "id": "pain-aux-noix",
  ...
  "available": false
}
```

Le produit n'apparaîtra plus sur le site mais restera dans la base de données.

### Mettre en vedette un produit

Mettre le champ `featured` à `true`:

```json
{
  "id": "croissants-francais",
  ...
  "featured": true
}
```

(Note: Le style CSS pour les produits vedettes peut être ajouté dans `styles.css`)

---

## 🎨 Personnalisation

### Icônes disponibles

Emojis couramment utilisés:
- 🍞 Pain générique
- 🥖 Baguette
- 🥐 Croissant
- 🥨 Bretzel
- 🥯 Bagel
- 🌾 Céréales/Sans gluten
- 🌰 Noix
- 🧀 Fromage
- 🍫 Chocolat
- 🥗 Salade
- 🥣 Soupe
- 🥪 Sandwich

### Unités de vente

- `loaf` - Pain entier
- `piece` - À l'unité
- `pack of 6` - Paquet de 6
- `bag` - Sac

---

## 🔧 Maintenance

### Mise à jour de la version

Lors de modifications importantes, mettre à jour les métadonnées:

```json
"metadata": {
  "version": "1.1.0",
  "lastUpdated": "2025-10-21"
}
```

### Validation du fichier

Le fichier JSON doit être valide. Utiliser un validateur JSON en ligne si nécessaire:
- https://jsonlint.com/
- https://jsonformatter.org/

---

## 📸 Images des Produits

Les images doivent être placées dans `/img/products/` avec le même nom que l'`id` du produit:

```
/img/products/
  ├── pain-blanc-classique.jpg
  ├── baguette-francaise.jpg
  ├── croissants-francais.jpg
  └── ...
```

**Recommandations pour les images:**
- Format: JPG ou PNG
- Taille: 800x600px (4:3)
- Poids: < 200 KB
- Fond: Blanc ou neutre

---

## 🐛 Dépannage

### Les produits ne s'affichent pas

1. Vérifier que le fichier `products.json` est valide (pas d'erreurs JSON)
2. Vérifier que le script `products.js` est bien chargé dans `produits.html`
3. Ouvrir la console du navigateur (F12) pour voir les erreurs
4. Vérifier que le serveur local est actif (requis pour charger le JSON)

### Les traductions ne fonctionnent pas

1. Vérifier que les champs `title` et `description` ont bien FR et EN
2. Vérifier que le système de traduction est actif (`translations.js`)
3. Rafraîchir la page après avoir changé de langue

### Les produits ne sont pas triés correctement

Le tri est alphabétique selon la langue courante. Si un produit semble mal placé, vérifier son titre dans la langue concernée.

---

## 📝 Notes Importantes

- ⚠️ **Serveur local requis**: Le fichier JSON nécessite un serveur local pour être chargé (CORS policy)
- ✅ **Fallback**: Si le JSON ne charge pas, le contenu HTML statique original est conservé
- 🔄 **Temps réel**: Les changements dans `products.json` sont visibles après un simple rafraîchissement
- 🌐 **Bilingue**: Toujours remplir FR et EN pour chaque produit

---

## 🎉 Avantages du Système Dynamique

✅ **Facile à maintenir**: Modifier un seul fichier JSON au lieu de tout le HTML  
✅ **Pas de duplication**: Les données sont centralisées  
✅ **Tri automatique**: Les produits sont toujours bien organisés  
✅ **Traduction fluide**: Changement de langue instantané  
✅ **Évolutif**: Facile d'ajouter de nouveaux produits ou catégories  
✅ **Compatible e-commerce**: Structure prête pour un système de commande  

---

*Fait avec ❤️ pour La mie du coin - Votre amie du coin*
