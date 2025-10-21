# 🚀 Guide Rapide - Produits Dynamiques

## ✨ Qu'est-ce qui a changé ?

La page **produits.html** utilise maintenant une **base de données JSON** pour afficher les produits de manière dynamique!

### Avant ❌
- Produits codés en dur dans le HTML
- Difficile à maintenir (modifier le HTML pour chaque produit)
- Pas de tri automatique
- Changement de langue complexe

### Maintenant ✅
- **Tous les produits dans un fichier JSON**
- Facile à modifier (éditer le JSON seulement)
- **Tri automatique** par ordre alphabétique
- **Changement de langue instantané** (FR ↔ EN)
- Ajout/modification de produits en quelques secondes

---

## 📝 Comment Modifier les Produits ?

### 1. Ouvrir le fichier JSON

```
Test/data/products.json
```

### 2. Trouver le produit à modifier

Chercher par l'`id` du produit, par exemple:

```json
{
  "id": "pain-blanc-classique",
  ...
}
```

### 3. Modifier les informations

```json
{
  "id": "pain-blanc-classique",
  "price": 6.49,  // ← Nouveau prix
  "title": {
    "fr": "Pain Blanc Premium",  // ← Nouveau titre
    "en": "Premium White Bread"
  }
}
```

### 4. Sauvegarder et rafraîchir

- Sauvegarder le fichier `products.json`
- Rafraîchir la page dans le navigateur
- ✅ Les changements apparaissent immédiatement!

---

## ➕ Comment Ajouter un Nouveau Produit ?

### Copier un produit existant

1. Ouvrir `data/products.json`
2. Copier un produit similaire
3. Modifier les valeurs:

```json
{
  "id": "pain-multigrains",  // ← ID unique
  "category": "pains-base",   // ← Catégorie
  "title": {
    "fr": "Pain Multigrains",
    "en": "Multigrain Bread"
  },
  "description": {
    "fr": "Pain complet avec plusieurs graines nutritives",
    "en": "Whole wheat bread with multiple nutritious seeds"
  },
  "price": 7.99,
  "currency": "CAD",
  "unit": "loaf",
  "icon": "🌾",
  "image": "/img/products/pain-multigrains.jpg",
  "weight": "700g",
  "allergens": ["gluten", "wheat", "sesame"],
  "ingredients": ["farine intégrale", "graines mélangées", "eau", "levure", "sel"],
  "available": true,
  "featured": false
}
```

4. Sauvegarder
5. Le nouveau produit apparaît automatiquement sur le site!

---

## 🎯 Catégories Disponibles

Utiliser ces IDs pour la catégorie:

| ID | Nom FR | Nom EN |
|----|--------|--------|
| `pains-base` | Pains de Base | Basic Breads |
| `pains-specialises` | Pains Spécialisés | Specialty Breads |
| `viennoiseries` | Viennoiseries | Pastries |
| `pains-forme` | Pains en Forme | Shaped Breads |
| `sans-gluten` | Options Sans Gluten | Gluten-Free Options |
| `pains-mediterraneens` | Spécialités Méditerranéennes | Mediterranean Specialties |

---

## 💰 Unités de Vente

| Valeur | Affichage FR | Affichage EN |
|--------|--------------|--------------|
| `loaf` | 5.99$ | $5.99 |
| `piece` | 5.99$ / pièce | $5.99 / piece |
| `pack of 6` | 5.99$ / paquet de 6 | $5.99 / pack of 6 |
| `bag` | 5.99$ / sac | $5.99 / bag |

---

## 🔧 Actions Rapides

### Désactiver temporairement un produit

```json
{
  "id": "croissants-francais",
  ...
  "available": false  // ← Produit n'apparaît plus sur le site
}
```

### Mettre un produit en vedette

```json
{
  "id": "baguette-tradition",
  ...
  "featured": true  // ← Marque le produit comme vedette
}
```

### Changer le prix

```json
{
  "id": "pain-aux-noix",
  ...
  "price": 9.99  // ← Nouveau prix
}
```

---

## 🌐 Test du Site

### Lancer le serveur local

**PowerShell:**
```powershell
cd "C:\...\website_lamieducoin\Test"
python -m http.server 8000
```

### Ouvrir dans le navigateur

```
http://localhost:8000/pages/produits.html
```

### Tester le changement de langue

1. Cliquer sur le bouton **EN** dans la navigation
2. Les produits se traduisent instantanément!
3. Cliquer sur **FR** pour revenir en français

---

## 🐛 Dépannage

### Les produits ne s'affichent pas

**Cause probable**: Fichier JSON invalide

**Solution**:
1. Copier le contenu de `products.json`
2. Aller sur https://jsonlint.com/
3. Coller et cliquer sur "Validate JSON"
4. Corriger les erreurs indiquées

### Erreur CORS dans la console

**Cause**: Fichier ouvert directement (file://)

**Solution**: Utiliser un serveur local (voir ci-dessus)

### Un produit n'apparaît pas

**Vérifier**:
- Le champ `"available": true` (pas `false`)
- La catégorie existe bien
- Pas d'erreurs JSON (virgules, guillemets)

---

## 📚 Documentation Complète

Pour plus de détails, consulter:

- **`data/README-PRODUCTS.md`** - Documentation complète de la base de données
- **`README.md`** - Documentation générale du projet
- **`SUMMARY.md`** - Résumé du projet complet

---

## 🎉 Avantages

✅ **Modification ultra-rapide** - Éditer 1 fichier au lieu de tout le HTML  
✅ **Pas d'erreurs HTML** - Structure générée automatiquement  
✅ **Tri intelligent** - Toujours dans l'ordre alphabétique  
✅ **Bilingue natif** - FR et EN dans le même fichier  
✅ **Prêt pour e-commerce** - Structure compatible avec système de commande  

---

*Questions ? Consulter `data/README-PRODUCTS.md` pour la documentation détaillée*
