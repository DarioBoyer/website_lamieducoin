# 🔄 Migration vers Netlify - Checklist

## ✅ Fichiers créés pour Netlify

### Configuration
- ✅ `netlify.toml` - Configuration Netlify
- ✅ `package.json` - Dépendances Node.js
- ✅ `.env.example` - Template variables d'environnement
- ✅ `.gitignore` - Fichiers à ne pas commiter

### Fonctions Serverless
- ✅ `netlify/functions/send-email.js` - Envoi d'emails SMTP
- ✅ `netlify/functions/test-smtp.js` - Test de connexion SMTP
- ✅ `netlify/functions/get-smtp-config.js` - Récupération config sécurisée

### Documentation
- ✅ `NETLIFY-DEPLOYMENT.md` - Guide de déploiement complet
- ✅ `netlify/TEST-LOCAL.md` - Guide de test local
- ✅ `MIGRATION-NETLIFY.md` - Cette checklist

### Services mis à jour
- ✅ `data/js/services/emailService.js` - Adapté pour Netlify Functions

## 📝 Étapes de migration

### 1. Préparer l'environnement local

```powershell
# Naviguer dans le dossier Test
cd Test

# Installer les dépendances
npm install

# Créer le fichier .env
Copy-Item .env.example .env

# Éditer .env avec vos identifiants SMTP
notepad .env
```

### 2. Tester localement

```powershell
# Démarrer Netlify Dev
npm run dev

# Le site sera disponible sur http://localhost:8888
```

#### Tests à effectuer:
- [ ] Page d'accueil charge correctement
- [ ] Page de commandes affiche les produits
- [ ] Panier fonctionne (ajout/modification/suppression)
- [ ] Test de connexion SMTP réussit
- [ ] Email de test envoyé avec succès
- [ ] Commande complète génère un email de confirmation

### 3. Configurer Supabase (si pas déjà fait)

```powershell
# Exécuter le script SQL dans Supabase Dashboard
# Fichier: backend/init-parameters-table.sql
```

### 4. Préparer Git

```powershell
# Vérifier le statut
git status

# Ajouter les nouveaux fichiers
git add netlify/
git add netlify.toml
git add package.json
git add .gitignore
git add .env.example
git add NETLIFY-DEPLOYMENT.md
git add MIGRATION-NETLIFY.md

# NE PAS ajouter .env (sensible!)
# S'assurer que .env est dans .gitignore

# Commiter
git commit -m "feat: Migration vers Netlify avec fonctions serverless

- Ajout configuration Netlify (netlify.toml)
- Création fonctions serverless pour envoi emails
- Adaptation emailService.js pour Netlify Functions
- Documentation complète de déploiement
- Support environnement local avec Netlify Dev"

# Pusher vers GitHub
git push origin main
```

### 5. Déployer sur Netlify

#### Via l'interface web (Recommandé):

1. **Connexion**
   - [ ] Aller sur https://app.netlify.com
   - [ ] Se connecter avec GitHub

2. **Import du projet**
   - [ ] Cliquer "Add new site" → "Import an existing project"
   - [ ] Sélectionner GitHub
   - [ ] Choisir le repository `website_lamieducoin`
   - [ ] Branch: `main`

3. **Configuration Build**
   - [ ] Base directory: `Test`
   - [ ] Build command: `echo 'No build required'`
   - [ ] Publish directory: `Test`

4. **Variables d'environnement**
   
   Dans **Site settings** → **Environment variables**:
   - [ ] `SMTP_HOST` = `smtp.office365.com` (ou smtp.gmail.com)
   - [ ] `SMTP_PORT` = `587`
   - [ ] `SMTP_USER` = votre email
   - [ ] `SMTP_PASS` = votre mot de passe
   - [ ] `SMTP_FROM` = `La Mie du Coin <noreply@lamieducoin.com>`

5. **Déployer**
   - [ ] Cliquer "Deploy site"
   - [ ] Attendre le déploiement (2-3 minutes)
   - [ ] Vérifier l'URL: `https://votre-site.netlify.app`

### 6. Tests en production

Une fois déployé sur Netlify:

- [ ] Ouvrir le site: `https://votre-site.netlify.app`
- [ ] Tester la navigation entre les pages
- [ ] Vérifier le chargement des produits depuis Supabase
- [ ] Tester l'ajout au panier
- [ ] Passer une commande de test
- [ ] Vérifier la réception de l'email de confirmation
- [ ] Consulter les logs dans Netlify Dashboard → Functions

### 7. Configuration DNS (Optionnel)

Si vous avez un domaine personnalisé:

1. **Ajouter le domaine**
   - [ ] Netlify Dashboard → Domain settings
   - [ ] Add custom domain
   - [ ] Entrer votre domaine: `lamieducoin.com`

2. **Configurer les DNS**
   
   Chez votre registraire (GoDaddy, Namecheap, etc.):
   - [ ] Type A: `@` → `75.2.60.5` (IP Netlify)
   - [ ] Type CNAME: `www` → `votre-site.netlify.app`

3. **HTTPS automatique**
   - [ ] Netlify active automatiquement Let's Encrypt
   - [ ] Attendre la propagation DNS (24-48h max)

## 🔍 Vérifications post-migration

### Backend Node.js ancien (à désactiver)

L'ancien serveur Node.js (`backend/email-api-server.js`) n'est **plus nécessaire** avec Netlify. Les fonctions serverless le remplacent.

- [ ] Arrêter le serveur Node.js s'il tourne
- [ ] Retirer de la documentation les références à `npm run start`
- [ ] Optionnel: Archiver le dossier `backend/` (backup)

### Services mis à jour

Vérifier que ces fichiers utilisent bien les endpoints Netlify:

- [x] `data/js/services/emailService.js`:
  - Endpoint local: `http://localhost:8888/.netlify/functions/send-email`
  - Endpoint prod: `/.netlify/functions/send-email`

### Documentation

- [ ] Mettre à jour le README principal avec les infos Netlify
- [ ] Supprimer les références à l'ancien backend Node.js
- [ ] Ajouter le lien du site en production

## 📊 Monitoring

Après le déploiement, configurer:

- [ ] **Notifications** Netlify (email pour les déploiements)
- [ ] **Analytics** (optionnel, plan payant)
- [ ] **Formulaires** Netlify (optionnel)
- [ ] **Monitoring** des fonctions serverless

## 🆘 Troubleshooting

### Problème: Fonctions ne sont pas déployées

**Solution**: Vérifier que `netlify.toml` est bien dans `Test/` et contient:
```toml
[functions]
  directory = "netlify/functions"
```

### Problème: Variables d'environnement non reconnues

**Solution**: 
1. Vérifier dans Site settings → Environment variables
2. Redéployer le site après les avoir ajoutées

### Problème: Emails ne s'envoient pas

**Solution**:
1. Consulter les logs: Functions → send-email → Logs
2. Tester la connexion: `/.netlify/functions/test-smtp`
3. Vérifier les identifiants SMTP dans les variables d'environnement

## ✨ Avantages de Netlify

✅ **Gratuit** pour usage personnel/petit projet
✅ **HTTPS automatique** (Let's Encrypt)
✅ **CDN global** (déploiement mondial)
✅ **Déploiement continu** (push = auto-deploy)
✅ **Fonctions serverless** (pas besoin de serveur)
✅ **Preview des branches** (test avant merge)
✅ **Rollback facile** en un clic
✅ **Variables d'environnement** sécurisées
✅ **Logs en temps réel** des fonctions

## 📈 Prochaines étapes

Après une migration réussie:

1. **Optimisation**
   - [ ] Activer le cache des assets
   - [ ] Compresser les images
   - [ ] Minifier CSS/JS (si nécessaire)

2. **Sécurité**
   - [ ] Configurer les headers de sécurité
   - [ ] Ajouter rate limiting sur les fonctions
   - [ ] Implémenter CAPTCHA pour le formulaire

3. **Monitoring**
   - [ ] Configurer Google Analytics
   - [ ] Surveiller les erreurs (Sentry)
   - [ ] Analyser les performances (Lighthouse)

---

**🎉 Migration complétée avec succès!**

Pour toute question, consulter:
- [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md) - Guide complet
- [netlify/TEST-LOCAL.md](netlify/TEST-LOCAL.md) - Tests locaux
- [Documentation Netlify](https://docs.netlify.com/)
