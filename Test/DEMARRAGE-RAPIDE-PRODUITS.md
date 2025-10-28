# 🚀 Guide de Démarrage Rapide - Page Produits

## En 3 étapes simples!

### 1️⃣ Démarrer le serveur

**Option A - Double-clic (Windows):**
```
📁 Test/
  └─ lancer-test-produits.bat  ← Double-cliquez ici!
```

**Option B - PowerShell:**
```powershell
cd Test
.\lancer-test-produits.ps1
```

**Option C - Manuel:**
```powershell
cd Test
python -m http.server 8000
# puis ouvrir http://localhost:8000/pages/produits.html
```

---

### 2️⃣ Choisir votre test

```
1. 🌐 Page produits complète       ← Pour voir le résultat final
2. 🧪 Page de test Supabase        ← Pour déboguer/tester
3. ❌ Annuler
```

---

### 3️⃣ C'est parti! 🎉

La page s'ouvre automatiquement dans votre navigateur.

---

## ⚡ Commandes Utiles

### Ouvrir la console développeur
```
F12 (Windows/Linux)
Cmd + Option + I (Mac)
```

### Rafraîchir sans cache
```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Voir le mode responsive
```
F12 > Toggle Device Toolbar (Ctrl + Shift + M)
```

---

## 🔍 Que Vérifier?

### ✅ Dans la Console (F12)
```javascript
✅ Connexion à Supabase établie
✅ Produits chargés: XX produits
✅ Catégories chargées: X catégories
🎨 Affichage des produits...
✅ Affichage terminé
```

### ✅ Sur la Page
- [ ] Les sections de produits s'affichent
- [ ] Les cartes ont des icônes 🍞
- [ ] Les prix sont visibles
- [ ] Le bouton "Commander" fonctionne
- [ ] Le changement FR/EN fonctionne

---

## 🐛 Problème?

### ❌ Rien ne s'affiche
**Solution:** Vérifiez la console pour les erreurs

### ❌ Erreur de connexion
**Solution:** Vérifiez votre connexion Internet

### ❌ Les modules ne se chargent pas
**Solution:** Utilisez un serveur local (pas file://)

---

## 📚 Plus d'infos?

- **Documentation complète:** `pages/PRODUITS-README.md`
- **Guide de test:** `pages/GUIDE-TEST-PRODUITS.md`
- **Résumé:** `RESUME-MODIFICATIONS-PRODUITS.md`

---

## 🎯 URLs Importantes

```
Page principale:
http://localhost:8000/pages/produits.html

Page de test:
http://localhost:8000/pages/test-supabase-produits.html
```

---

**C'est tout! Profitez bien! 🍞✨**
