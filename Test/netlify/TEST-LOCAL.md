# 🧪 Guide de test local Netlify Functions

## Démarrage rapide

### 1. Installer les dépendances

```powershell
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du dossier `Test`:

```powershell
Copy-Item .env.example .env
```

Éditez `.env` avec vos identifiants SMTP.

### 3. Démarrer Netlify Dev

```powershell
npm run dev
```

Le serveur démarre sur `http://localhost:8888`

## 🧪 Tester les fonctions

### Option 1: Via le navigateur

Ouvrez `http://localhost:8888` et utilisez la console (F12):

```javascript
// Test de connexion SMTP
fetch('/.netlify/functions/test-smtp', {
    method: 'POST'
})
.then(r => r.json())
.then(console.log);

// Envoi d'email de test
fetch('/.netlify/functions/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: {
            to: 'votre-email@exemple.com',
            subject: 'Test Netlify Functions',
            html: '<h1>Ça marche!</h1><p>Email envoyé depuis Netlify Dev</p>',
            text: 'Ça marche! Email envoyé depuis Netlify Dev'
        }
    })
})
.then(r => r.json())
.then(console.log);

// Vérifier la config SMTP
fetch('/.netlify/functions/get-smtp-config')
.then(r => r.json())
.then(console.log);
```

### Option 2: Via PowerShell (Invoke-RestMethod)

```powershell
# Test SMTP
Invoke-RestMethod -Uri "http://localhost:8888/.netlify/functions/test-smtp" -Method POST

# Envoyer un email
$body = @{
    email = @{
        to = "votre-email@exemple.com"
        subject = "Test PowerShell"
        html = "<h1>Test</h1><p>Email depuis PowerShell</p>"
        text = "Test - Email depuis PowerShell"
    }
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8888/.netlify/functions/send-email" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

# Vérifier la config
Invoke-RestMethod -Uri "http://localhost:8888/.netlify/functions/get-smtp-config"
```

### Option 3: Via curl (si disponible)

```bash
# Test SMTP
curl -X POST http://localhost:8888/.netlify/functions/test-smtp

# Envoyer un email
curl -X POST http://localhost:8888/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": {
      "to": "votre-email@exemple.com",
      "subject": "Test curl",
      "html": "<h1>Test</h1>",
      "text": "Test"
    }
  }'
```

## 📋 Endpoints disponibles

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/.netlify/functions/send-email` | POST | Envoie un email via SMTP |
| `/.netlify/functions/test-smtp` | POST | Teste la connexion SMTP |
| `/.netlify/functions/get-smtp-config` | GET | Récupère la config SMTP (sans mots de passe) |

## 🐛 Dépannage

### Port 8888 déjà utilisé

```powershell
netlify dev --port 9999
```

### Les fonctions ne sont pas détectées

Vérifiez que `netlify.toml` existe et contient:

```toml
[functions]
  directory = "netlify/functions"
```

### Variables d'environnement non chargées

1. Vérifiez que `.env` existe dans `Test/`
2. Redémarrez `npm run dev`
3. Les variables doivent être en MAJUSCULES

### Erreur d'authentification SMTP

**Gmail**: Utilisez un mot de passe d'application
**Office365**: Utilisez votre email complet comme username

## 📊 Logs

Les logs des fonctions s'affichent dans le terminal où vous avez lancé `npm run dev`.

Format:
```
◈ [function-name] Response with status 200 in 123 ms
```

## 🔄 Rechargement automatique

Netlify Dev détecte automatiquement les changements:
- ✅ Modifications HTML/CSS/JS → Rechargement automatique
- ✅ Modifications des fonctions → Redémarrage automatique
- ✅ Modifications `.env` → Redémarrage manuel requis

## 🚀 Prêt pour la production?

Une fois les tests locaux réussis:

```powershell
# Déployer sur Netlify
npm run deploy
```

N'oubliez pas de configurer les variables d'environnement dans Netlify Dashboard!
