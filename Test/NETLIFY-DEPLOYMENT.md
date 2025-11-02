# 🚀 Déploiement sur Netlify - La Mie du Coin

Ce guide explique comment déployer le site sur Netlify avec les fonctions serverless pour l'envoi d'emails.

## 📋 Prérequis

- Compte Netlify (gratuit): https://app.netlify.com
- Compte GitHub avec le repository
- Identifiants SMTP (Office365 ou Gmail)

## 🔧 Installation locale

### 1. Installer les dépendances

```powershell
cd Test
npm install
```

### 2. Créer le fichier .env

Copiez `.env.example` en `.env` et remplissez vos identifiants:

```powershell
Copy-Item .env.example .env
```

Éditez `.env`:
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=votre-email@domaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=La Mie du Coin <noreply@lamieducoin.com>
```

**Pour Gmail**, utilisez un mot de passe d'application:
1. Activez la validation en 2 étapes
2. Générez un mot de passe: https://myaccount.google.com/apppasswords
3. Utilisez ce mot de passe dans `SMTP_PASS`

### 3. Tester localement avec Netlify Dev

```powershell
npm run dev
```

Le site sera accessible sur `http://localhost:8888`

Les fonctions serverless seront disponibles:
- `http://localhost:8888/.netlify/functions/send-email`
- `http://localhost:8888/.netlify/functions/test-smtp`

## 🌐 Déploiement sur Netlify

### Option A: Via l'interface Netlify (Recommandé)

#### 1. Connecter le repository

1. Allez sur https://app.netlify.com
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Sélectionnez **GitHub**
4. Choisissez votre repository `website_lamieducoin`
5. Configurez le déploiement:
   - **Base directory**: `Test`
   - **Build command**: `echo 'No build required'`
   - **Publish directory**: `Test`

#### 2. Configurer les variables d'environnement

Dans **Site settings** → **Environment variables** → **Add a variable**:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `SMTP_HOST` | `smtp.office365.com` | Serveur SMTP |
| `SMTP_PORT` | `587` | Port SMTP (TLS) |
| `SMTP_USER` | `votre-email@domaine.com` | Compte email |
| `SMTP_PASS` | `votre-mot-de-passe` | Mot de passe ou App Password |
| `SMTP_FROM` | `La Mie du Coin <noreply@lamieducoin.com>` | Email expéditeur |

**⚠️ Important**: Les variables d'environnement sont cryptées et sécurisées dans Netlify.

#### 3. Déployer

Cliquez sur **"Deploy site"**. Netlify va:
- 📦 Cloner votre repository
- 🔨 Construire le site (si nécessaire)
- 🚀 Déployer sur le CDN global
- ⚡ Activer les fonctions serverless

Votre site sera accessible sur: `https://votre-site.netlify.app`

#### 4. Configurer un domaine personnalisé (Optionnel)

Dans **Domain settings** → **Add custom domain**:
1. Entrez votre domaine: `lamieducoin.com`
2. Suivez les instructions pour configurer les DNS
3. Netlify activera automatiquement HTTPS

### Option B: Via Netlify CLI

#### 1. Installer Netlify CLI

```powershell
npm install -g netlify-cli
```

#### 2. Authentification

```powershell
netlify login
```

#### 3. Initialiser le site

```powershell
cd Test
netlify init
```

Suivez les instructions:
- **Create & configure a new site**: Oui
- **Team**: Sélectionnez votre équipe
- **Site name**: `lamieducoin` (ou autre)
- **Build command**: Laissez vide
- **Directory to deploy**: `.` (dossier courant)

#### 4. Configurer les variables d'environnement

```powershell
netlify env:set SMTP_HOST "smtp.office365.com"
netlify env:set SMTP_PORT "587"
netlify env:set SMTP_USER "votre-email@domaine.com"
netlify env:set SMTP_PASS "votre-mot-de-passe"
netlify env:set SMTP_FROM "La Mie du Coin <noreply@lamieducoin.com>"
```

#### 5. Déployer

```powershell
# Déploiement en production
npm run deploy

# OU avec Netlify CLI
netlify deploy --prod
```

## 🧪 Tester l'envoi d'emails

### Test via la console du navigateur

Ouvrez la console (F12) et testez:

```javascript
// Tester la connexion SMTP
fetch('/.netlify/functions/test-smtp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
})
.then(r => r.json())
.then(console.log);

// Envoyer un email de test
fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: {
            to: 'test@exemple.com',
            subject: 'Test depuis Netlify',
            html: '<h1>Email de test</h1><p>Ça fonctionne!</p>',
            text: 'Email de test - Ça fonctionne!'
        }
    })
})
.then(r => r.json())
.then(console.log);
```

### Test avec une vraie commande

1. Ouvrez la page de commandes: `https://votre-site.netlify.app/pages/orders.html`
2. Ajoutez des produits au panier
3. Passez une commande avec votre email
4. Vérifiez votre boîte de réception

## 📊 Monitoring et logs

### Consulter les logs des fonctions

Dans Netlify Dashboard:
1. Allez dans **Functions**
2. Cliquez sur `send-email` ou `test-smtp`
3. Consultez les **logs en temps réel**

### Voir les déploiements

Dans **Deploys**:
- Historique de tous les déploiements
- Logs de build
- Preview des branches

### Analytics (Plan payant)

Activez **Analytics** pour:
- Statistiques de trafic
- Performance du site
- Erreurs et monitoring

## 🔒 Sécurité

### Bonnes pratiques

✅ **À faire:**
- Utiliser des variables d'environnement pour les secrets
- Activer HTTPS (automatique sur Netlify)
- Limiter les origines CORS si nécessaire
- Utiliser des mots de passe d'application pour Gmail
- Surveiller les logs des fonctions

❌ **À ne PAS faire:**
- Commiter le fichier `.env` dans Git
- Exposer les identifiants SMTP dans le code frontend
- Utiliser votre mot de passe Gmail principal
- Laisser les variables d'environnement vides

### Protection contre le spam

Pour éviter l'abus des fonctions serverless:

1. **Rate limiting**: Ajoutez une limite dans la fonction
2. **CAPTCHA**: Intégrez Google reCAPTCHA
3. **Validation**: Vérifiez les données côté serveur

## 🆘 Dépannage

### Erreur: "Configuration SMTP incomplète"

**Solution**: Vérifiez les variables d'environnement dans Netlify Dashboard

### Erreur: "EAUTH" (Authentification échouée)

**Gmail**: Utilisez un mot de passe d'application
**Office365**: Vérifiez que l'authentification moderne est activée

### Les fonctions ne sont pas déployées

**Solution**: Vérifiez que `netlify.toml` est bien à la racine du dossier `Test`

### Erreur 404 sur les fonctions

**Solution**: Les fonctions sont dans `netlify/functions/`, pas `Test/netlify/functions/`

### Les emails ne sont pas envoyés

1. Consultez les logs dans **Functions** → **send-email**
2. Testez avec `test-smtp` d'abord
3. Vérifiez les variables d'environnement
4. Testez en local avec `npm run dev`

## 📚 Ressources

- [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)

## 🎯 Prochaines étapes

Après le déploiement:

1. ✅ Configurer un domaine personnalisé
2. ✅ Tester l'envoi d'emails en production
3. ✅ Configurer les paramètres SMTP dans Supabase
4. ✅ Activer HTTPS (automatique)
5. ✅ Surveiller les logs et performances
6. ✅ Optimiser les images et assets
7. ✅ Configurer les formulaires Netlify (optionnel)

---

**Support**: Si vous rencontrez des problèmes, consultez les logs dans Netlify Dashboard ou ouvrez une issue sur GitHub.
