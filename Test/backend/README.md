# Backend API - Service d'envoi d'emails

Ce serveur Node.js gère l'envoi d'emails via SMTP pour les confirmations de commandes.

## 🚀 Installation

```powershell
cd backend
npm install
```

## ⚙️ Configuration

Avant de démarrer le serveur, configurez les paramètres SMTP dans l'interface admin:
1. Ouvrez `pagesadmin/smtp-config.html` dans votre navigateur
2. Remplissez les paramètres SMTP:
   - **Serveur SMTP**: smtp.office365.com (Office365) ou smtp.gmail.com (Gmail)
   - **Port**: 587 (TLS)
   - **Compte**: votre adresse email complète
   - **Mot de passe**: votre mot de passe ou mot de passe d'application
   - **Email expéditeur**: adresse email qui apparaîtra comme expéditeur

### Configuration Office365
```
Serveur: smtp.office365.com
Port: 587
Compte: votre-email@votredomaine.com
```

### Configuration Gmail
**Important**: Gmail nécessite un "Mot de passe d'application" (App Password)

1. Activez la validation en deux étapes sur votre compte Google
2. Générez un mot de passe d'application: https://myaccount.google.com/apppasswords
3. Utilisez ce mot de passe dans la configuration

```
Serveur: smtp.gmail.com
Port: 587
Compte: votre-email@gmail.com
Mot de passe: [mot de passe d'application à 16 caractères]
```

## 🏃 Démarrage

```powershell
node email-api-server.js
```

Le serveur démarre sur `http://localhost:3001`

## 🧪 Test de connexion SMTP

Pour tester la connexion SMTP sans envoyer d'email:

```powershell
# Avec curl (si disponible)
curl -X POST http://localhost:3001/api/test-smtp

# Avec PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/test-smtp" -Method POST
```

## 📡 Endpoints API

### POST /api/send-email
Envoie un email via SMTP

**Request Body:**
```json
{
  "smtp": {
    "host": "smtp.office365.com",
    "port": 587,
    "secure": false,
    "auth": {
      "user": "your-email@domain.com",
      "pass": "your-password"
    }
  },
  "email": {
    "from": "La Mie du Coin <noreply@lamieducoin.com>",
    "to": "customer@example.com",
    "subject": "Confirmation de commande",
    "html": "<html>...</html>",
    "text": "Version texte..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "<unique-message-id@smtp.server>"
}
```

### POST /api/test-smtp
Teste la connexion SMTP

**Response:**
```json
{
  "success": true,
  "message": "Connexion SMTP réussie"
}
```

### GET /api/health
Vérifie l'état du serveur

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔒 Sécurité

- Les mots de passe SMTP sont chiffrés dans la base de données
- CORS activé pour permettre les requêtes du frontend
- En production, utilisez HTTPS et limitez les origines CORS

## 🐛 Dépannage

### Erreur: "Invalid login" (Office365)
- Vérifiez que l'authentification moderne est activée
- Utilisez l'adresse email complète comme nom d'utilisateur

### Erreur: "Username and Password not accepted" (Gmail)
- Activez la validation en deux étapes
- Utilisez un mot de passe d'application (App Password)
- N'utilisez PAS votre mot de passe Gmail normal

### Le serveur ne démarre pas
```powershell
# Vérifiez que le port 3001 n'est pas déjà utilisé
netstat -ano | findstr :3001

# Ou utilisez un autre port en modifiant email-api-server.js:
# const PORT = 3002;
```

### L'email n'est pas envoyé
1. Vérifiez les logs du serveur backend
2. Testez la connexion SMTP avec `/api/test-smtp`
3. Vérifiez que les paramètres SMTP sont corrects dans Supabase
4. Consultez la console du navigateur pour les erreurs

## 📝 Logs

Le serveur affiche les logs suivants:
- ✅ Email envoyé avec succès
- ❌ Erreur d'envoi d'email
- 🔌 Connexion SMTP testée
- ⚠️ Erreurs de connexion SMTP

## 🚢 Déploiement en production

1. Utilisez des variables d'environnement pour la configuration
2. Activez HTTPS
3. Limitez les origines CORS à votre domaine
4. Utilisez PM2 ou un gestionnaire de processus
5. Configurez un reverse proxy (nginx, Apache)

```powershell
# Installation de PM2
npm install -g pm2

# Démarrage avec PM2
pm2 start email-api-server.js --name "email-api"

# Sauvegarde de la configuration
pm2 save
pm2 startup
```
