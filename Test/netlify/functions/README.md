# 📡 Fonctions Netlify - La Mie du Coin

## 🎯 Fonctions disponibles

### ✉️ send-email.js
**Endpoint**: `/.netlify/functions/send-email`  
**Méthode**: `POST`

Envoie un email via Resend.

**Paramètres (JSON)**:
```json
{
  "email": {
    "from": "La Mie du Coin <noreply@lamieducoin.ca>",
    "to": "client@example.com",
    "subject": "Confirmation de commande",
    "html": "<html>...</html>",
    "text": "Version texte brut",
    "cc": ["optionnel@example.com"],
    "bcc": ["optionnel@example.com"],
    "replyTo": ["optionnel@example.com"]
  }
}
```

**Réponse succès**:
```json
{
  "success": true,
  "messageId": "abc123...",
  "timestamp": "2025-11-14T12:00:00.000Z"
}
```

**Réponse erreur**:
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

**Variables d'environnement requises**:
- `RESEND_API_KEY` : Clé API Resend
- `RESEND_FROM_EMAIL` : Email expéditeur (optionnel)

---

### 🧪 test-resend.js
**Endpoint**: `/.netlify/functions/test-resend`  
**Méthode**: `GET`

Vérifie la configuration Resend.

**Réponse succès**:
```json
{
  "success": true,
  "message": "Configuration Resend valide",
  "config": {
    "apiKeyConfigured": true,
    "fromEmail": "La Mie du Coin <noreply@lamieducoin.ca>",
    "apiKeyPreview": "re_1234567..."
  },
  "info": {
    "service": "Resend",
    "ready": true,
    "timestamp": "2025-11-14T12:00:00.000Z"
  }
}
```

**Variables d'environnement requises**:
- `RESEND_API_KEY` : Clé API Resend

---

## 🔧 Développement

### Tester localement avec Netlify Dev

```bash
# Démarrer le serveur de développement
npm run dev

# Les fonctions seront disponibles sur:
# http://localhost:8888/.netlify/functions/[nom-fonction]
```

### Exemple de test avec curl

```bash
# Tester la configuration
curl http://localhost:8888/.netlify/functions/test-resend

# Envoyer un email de test
curl -X POST http://localhost:8888/.netlify/functions/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": {
      "to": "test@example.com",
      "subject": "Test",
      "html": "<h1>Test</h1>"
    }
  }'
```

## 📝 Notes

- Toutes les fonctions utilisent CORS (`Access-Control-Allow-Origin: *`)
- Les fonctions supportent les requêtes OPTIONS pour CORS preflight
- Les erreurs en mode développement incluent la stack trace
- En production, seul le message d'erreur est retourné

## 🔗 Ressources

- [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Documentation Resend](https://resend.com/docs)
