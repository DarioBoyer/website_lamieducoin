# 🚀 Démarrage Rapide - Netlify

## ⚡ En 5 minutes

### 1. Installation (2 min)

```powershell
# Naviguer dans le dossier
cd Test

# Installer les dépendances
npm install

# Créer le fichier .env
Copy-Item .env.example .env

# Éditer .env avec vos identifiants SMTP
notepad .env
```

### 2. Configuration .env (1 min)

Remplissez dans `.env`:

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=votre-email@domaine.com
SMTP_PASS=votre-mot-de-passe
```

💡 **Gmail**: Utilisez un [mot de passe d'application](https://myaccount.google.com/apppasswords)

### 3. Démarrage (1 min)

```powershell
# Lancer Netlify Dev
npm run dev

# OU utiliser le script
.\start-netlify-dev.ps1
```

### 4. Test (1 min)

Ouvrez: http://localhost:8888

Dans la console (F12):
```javascript
// Tester l'envoi d'email
fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: {
            to: 'votre-email@exemple.com',
            subject: 'Test Netlify',
            html: '<h1>Ça marche!</h1>',
            text: 'Ça marche!'
        }
    })
})
.then(r => r.json())
.then(console.log);
```

### 5. Déploiement sur Netlify

#### Via interface web:
1. https://app.netlify.com → **Add new site**
2. Connecter GitHub → Choisir le repo
3. Base directory: `Test`
4. Deploy!

#### Configurer les variables d'environnement:
Site settings → Environment variables → Ajouter:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

## 🎯 URLs importantes

**Local:**
- Site: http://localhost:8888
- Commandes: http://localhost:8888/pages/orders.html
- Config SMTP: http://localhost:8888/pagesadmin/smtp-config.html

**Production:**
- https://votre-site.netlify.app

## 📋 Fonctions disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/.netlify/functions/send-email` | POST | Envoyer un email |
| `/.netlify/functions/test-smtp` | POST | Tester SMTP |
| `/.netlify/functions/get-smtp-config` | GET | Voir config |

## 🆘 Problèmes courants

**Port 8888 occupé?**
```powershell
netlify dev --port 9999
```

**Variables d'env non chargées?**
- Vérifier que `.env` existe
- Redémarrer `npm run dev`

**Emails non envoyés?**
- Tester avec `/.netlify/functions/test-smtp`
- Consulter les logs du terminal

## 📚 Documentation complète

- [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md) - Guide complet
- [MIGRATION-NETLIFY.md](MIGRATION-NETLIFY.md) - Checklist
- [STRUCTURE-NETLIFY.md](STRUCTURE-NETLIFY.md) - Architecture

---

**🎉 C'est tout! Vous êtes prêt!**
