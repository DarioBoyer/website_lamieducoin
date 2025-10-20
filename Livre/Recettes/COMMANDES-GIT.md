# 🚀 Commandes Git pour publier le système de commentaires

## 📋 Avant de commencer

**Vérifiez que vous avez testé localement :**
- [ ] Ouvert une recette dans votre navigateur
- [ ] Ajouté un commentaire de test
- [ ] Vérifié que le commentaire s'affiche correctement

---

## 1️⃣ Ajouter tous les fichiers

```powershell
cd "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin"

# Ajouter les nouveaux fichiers du système de commentaires
git add Livre/Recettes/comments.js
git add Livre/Recettes/comments.css
git add Livre/Recettes/README-COMMENTAIRES.md
git add Livre/Recettes/GUIDE-DEMARRAGE-RAPIDE.md
git add Livre/Recettes/RAPPORT-INSTALLATION.md

# Ajouter toutes les recettes modifiées
git add Livre/Recettes/*.html

# Optionnel : ajouter les scripts d'installation (pour référence future)
git add Livre/Recettes/add-comments-to-recipes.js
git add Livre/Recettes/add-comments-to-all-recipes.ps1
```

---

## 2️⃣ Commiter les changements

```powershell
git commit -m "✨ Ajout système de commentaires sur toutes les recettes

- Ajout de comments.js (gestion des commentaires localStorage + Giscus)
- Ajout de comments.css (styles du système de commentaires)
- Modification de 26 recettes HTML pour intégrer les commentaires
- Ajout documentation complète (README, guides, rapport)
- Système fonctionnel en mode localStorage par défaut
- Prêt pour configuration Giscus (commentaires partagés)

Fichiers modifiés:
- 26 recettes HTML
- 5 nouveaux fichiers de documentation
- 2 scripts d'installation automatique"
```

---

## 3️⃣ Pousser vers GitHub

```powershell
git push origin main
```

---

## 4️⃣ Vérifier le déploiement

### Attendre le déploiement (2-5 minutes)

1. Aller sur : https://github.com/DarioBoyer/website_lamieducoin/actions
2. Vérifier que le workflow se termine avec succès ✅

### Tester sur le site en ligne

1. Aller sur : https://www.lamieducoin.com (ou votre domaine)
2. Ouvrir une recette (ex: pain-blanc-classique.html)
3. Faire défiler vers le bas
4. Vérifier que la section "Notes et Commentaires" apparaît

---

## 🔧 Configuration Giscus (Optionnel)

**Une fois le site publié**, si vous voulez activer les commentaires partagés :

1. Suivre le guide : `GUIDE-DEMARRAGE-RAPIDE.md` section "ÉTAPE 3"
2. Temps estimé : 5-10 minutes
3. Puis :

```powershell
# Après avoir modifié comments.js
git add Livre/Recettes/comments.js
git commit -m "🔧 Configuration de Giscus pour commentaires partagés"
git push origin main
```

---

## 📊 Vérification rapide

```powershell
# Voir les fichiers modifiés
git status

# Voir le dernier commit
git log --oneline -1

# Voir les différences avant commit
git diff Livre/Recettes/comments.js
```

---

## ✅ Checklist de publication

- [ ] Testé localement (commentaires fonctionnent)
- [ ] Fichiers ajoutés avec `git add`
- [ ] Commit créé avec message descriptif
- [ ] Poussé vers GitHub avec `git push`
- [ ] Déploiement vérifié sur GitHub Actions
- [ ] Site testé en ligne
- [ ] Documentation lue

---

## 🆘 En cas de problème

### Erreur "fatal: not a git repository"
```powershell
cd "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin"
```

### Annuler des changements non commités
```powershell
git restore Livre/Recettes/nom-du-fichier.html
```

### Voir l'historique des commits
```powershell
git log --oneline --graph
```

### Forcer la mise à jour (si conflit)
```powershell
git pull origin main --rebase
git push origin main
```

---

## 📝 Commandes en une seule fois (RAPIDE)

Si vous êtes pressé et que tout est prêt :

```powershell
cd "c:\Users\dario.boyer\OneDrive - EBI Electric\Documents\GitHub\website_lamieducoin"

git add Livre/Recettes/

git commit -m "✨ Ajout système de commentaires sur toutes les recettes"

git push origin main
```

⚠️ **Note :** Cela ajoute TOUS les fichiers du dossier Recettes. Vérifiez avec `git status` avant !

---

## 🎉 Après la publication

1. ✅ Vérifier le site en ligne
2. 📝 Noter l'URL pour partager : https://www.lamieducoin.com
3. 💬 Informer les utilisateurs de la nouvelle fonctionnalité
4. 📊 Surveiller les premiers commentaires
5. ⚙️ (Optionnel) Configurer Giscus pour commentaires partagés

---

**Prêt ? Exécutez les commandes ci-dessus ! 🚀**
