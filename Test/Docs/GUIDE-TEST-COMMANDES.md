# 🧪 Guide de Test - Page Commandes avec Supabase

## 🚀 Comment tester la page

### 1. Démarrer le serveur local

```powershell
cd "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin\Test"
.\start-server.ps1
```

Ou simplement:
```powershell
python -m http.server 8000
```

### 2. Ouvrir la page de commandes

Dans votre navigateur, allez à:
```
http://localhost:8000/pages/commandes.html
```

## ✅ Points à vérifier

### Affichage des produits
- [ ] Les produits se chargent automatiquement depuis Supabase
- [ ] Les produits sont groupés par catégories
- [ ] Les catégories affichent le bon nom en français
- [ ] Les icônes/emojis des produits sont visibles
- [ ] Les images des produits s'affichent correctement
- [ ] Si une image ne charge pas, l'icône s'affiche en remplacement

### Catégories
- [ ] On peut replier/déplier chaque catégorie en cliquant sur le titre
- [ ] L'icône chevron change de direction (bas ↓ / droite →)
- [ ] Le badge affiche le bon nombre de produits dans chaque catégorie

### Informations produits
- [ ] Le titre du produit est affiché
- [ ] La description est visible
- [ ] Le prix est correct (format: X.XX $)
- [ ] Le poids est affiché (ex: 450g)
- [ ] Les allergènes sont affichés s'il y en a
- [ ] Le badge "Populaire" apparaît sur les produits en vedette

### Contrôles de quantité
- [ ] Le bouton `-` diminue la quantité (minimum 1)
- [ ] Le bouton `+` augmente la quantité (maximum 99)
- [ ] On peut taper directement un nombre dans l'input
- [ ] La quantité par défaut est 1

### Ajout au panier
- [ ] Le bouton "Ajouter" ajoute le produit au panier
- [ ] Une notification "Produit ajouté au panier!" apparaît
- [ ] Le compteur du panier s'incrémente
- [ ] La quantité se réinitialise à 1 après l'ajout
- [ ] Le panier affiche correctement le produit ajouté
- [ ] Le prix total se calcule correctement

### Panier (sidebar desktop)
- [ ] Le panier affiche "Votre panier est vide" au début
- [ ] Les produits ajoutés apparaissent dans le panier
- [ ] On peut modifier la quantité depuis le panier
- [ ] On peut supprimer un produit du panier
- [ ] Le bouton "Vider le panier" vide tout
- [ ] Le total se met à jour automatiquement

### Panier mobile
- [ ] Le bouton flottant du panier apparaît en bas à droite
- [ ] Le badge du bouton affiche le nombre d'articles
- [ ] Le modal du panier s'ouvre au clic
- [ ] Le contenu du panier est synchronisé avec le desktop
- [ ] On peut fermer le modal avec le bouton X ou en cliquant à l'extérieur

### Multilingue
- [ ] Cliquer sur "EN" change la langue en anglais
- [ ] Les titres de produits changent
- [ ] Les descriptions changent
- [ ] Les noms de catégories changent
- [ ] Les boutons et labels changent
- [ ] Cliquer sur "FR" revient au français

### Responsive Design
- [ ] Sur mobile (< 768px): 1 produit par ligne
- [ ] Sur tablette (768-992px): 1 produit par ligne dans la colonne principale
- [ ] Sur desktop (> 992px): 2 produits par ligne
- [ ] Le panier passe en mode modal sur mobile
- [ ] Le panier reste en sidebar sur desktop

## 🐛 Tests de gestion d'erreurs

### Test 1: Supabase indisponible
1. Ouvrir la console développeur (F12)
2. Aller dans Network > Disable cache
3. Bloquer les requêtes vers supabase.co
4. Rafraîchir la page
5. **Résultat attendu**: Les produits se chargent depuis products.json (fallback)

### Test 2: Aucun produit retail
1. Vérifier dans Supabase que tous les produits sont de type "retail"
2. Si besoin, changer temporairement un productType
3. Rafraîchir la page
4. **Résultat attendu**: Les catégories sans produits ne s'affichent pas

### Test 3: Image manquante
1. Dans Supabase, modifier le chemin d'image d'un produit vers un fichier inexistant
2. Rafraîchir la page
3. **Résultat attendu**: L'icône emoji du produit s'affiche à la place

## 📊 Tests de performance

### Temps de chargement
- [ ] Les produits se chargent en moins de 2 secondes
- [ ] L'interface ne se bloque pas pendant le chargement
- [ ] Pas de scintillement (flash) lors du chargement

### Mémoire
- [ ] Ouvrir DevTools > Memory
- [ ] Prendre un snapshot initial
- [ ] Ajouter/retirer plusieurs produits du panier
- [ ] Prendre un nouveau snapshot
- [ ] **Vérifier**: Pas de fuite mémoire importante

## 🔍 Console du navigateur

### Messages attendus dans la console

```
✅ Client Supabase initialisé pour les commandes
📂 X catégories chargées
🍞 X produits retail chargés
✅ X produits chargés depuis Supabase pour le panier
```

### Messages d'erreur à NE PAS voir

```
❌ Erreur lors du chargement des produits
❌ Produit non trouvé
❌ Le système de panier n'est pas disponible
```

## 🎯 Scénarios de test complets

### Scénario 1: Commande simple
1. Ouvrir la page commandes
2. Trouver "Pain Blanc Classique"
3. Changer la quantité à 2
4. Cliquer sur "Ajouter"
5. Vérifier que le panier affiche: "Pain Blanc Classique × 2"
6. Vérifier que le total est correct (prix × 2)

### Scénario 2: Commande multiple
1. Ajouter 2 "Pain Blanc" au panier
2. Ajouter 3 "Baguette Française" au panier
3. Ajouter 1 "Croissant" au panier
4. Vérifier que le compteur du panier affiche "6"
5. Vérifier que les 3 produits sont listés
6. Vérifier que le total est la somme des sous-totaux

### Scénario 3: Modification du panier
1. Ajouter un produit au panier
2. Dans le panier, augmenter la quantité avec le bouton +
3. Vérifier que le total se met à jour
4. Diminuer la quantité avec le bouton -
5. Cliquer sur le bouton poubelle pour supprimer
6. Vérifier que le produit disparaît

### Scénario 4: Changement de langue
1. Ajouter des produits au panier
2. Cliquer sur "EN"
3. Vérifier que les produits dans le panier ont des noms en anglais
4. Vérifier que les catégories sont traduites
5. Cliquer sur "FR"
6. Vérifier le retour au français

### Scénario 5: Persistance du panier
1. Ajouter plusieurs produits au panier
2. Fermer l'onglet
3. Rouvrir http://localhost:8000/pages/commandes.html
4. **Vérifier**: Le panier contient toujours les produits
5. (Le panier utilise localStorage pour persister)

## 📱 Test responsive complet

### Sur mobile (simulateur Chrome)
1. Ouvrir DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Sélectionner "iPhone 12 Pro"
4. Tester l'affichage
5. Tester le bouton flottant du panier
6. Tester le modal du panier

### Sur tablette
1. Sélectionner "iPad"
2. Vérifier l'affichage en portrait
3. Vérifier l'affichage en paysage
4. Tester les interactions tactiles

## 🔧 Dépannage

### Problème: Les produits ne se chargent pas
**Solution**:
1. Ouvrir la console (F12)
2. Vérifier les erreurs réseau
3. Vérifier que Supabase est accessible
4. Vérifier les credentials Supabase dans orders-display.js

### Problème: Le panier ne fonctionne pas
**Solution**:
1. Vérifier que cart.js est bien chargé
2. Vérifier que `window.supabaseClient` existe (console)
3. Vérifier localStorage (Application > Local Storage)

### Problème: Les images ne s'affichent pas
**Solution**:
1. Vérifier que les images existent dans `/img/products/`
2. Vérifier les chemins dans Supabase (colonne `image`)
3. Vérifier la console pour les erreurs 404

### Problème: La traduction ne fonctionne pas
**Solution**:
1. Vérifier que translations.js est chargé
2. Vérifier localStorage: `language` doit être "fr" ou "en"
3. Vérifier que les produits ont des champs title_fr et title_en

## ✨ Fonctionnalités bonus à vérifier

- [ ] Animation au survol des cartes produits
- [ ] Animation lors de l'ajout au panier
- [ ] Transition fluide lors du pliage/dépliage des catégories
- [ ] Notification toast qui disparaît après 3 secondes
- [ ] Badge "Populaire" sur les produits featured
- [ ] Icônes Bootstrap fonctionnelles partout

## 📋 Checklist finale

- [ ] Tous les produits retail sont visibles
- [ ] Les catégories sont correctes
- [ ] Les images s'affichent
- [ ] Le panier fonctionne parfaitement
- [ ] Le multilingue fonctionne
- [ ] Le responsive est bon
- [ ] Pas d'erreurs dans la console
- [ ] Performance acceptable
- [ ] Le fallback JSON fonctionne si besoin

---

**Date de test**: _______________  
**Testeur**: _______________  
**Résultat**: ⭐ ⭐ ⭐ ⭐ ⭐

