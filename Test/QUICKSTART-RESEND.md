# 🚀 Guide de démarrage rapide - Envoi d'emails avec Resend

## ✅ Configuration en 5 étapes

### 1. Créer un compte Resend
1. Allez sur [resend.com](https://resend.com)
2. Créez un compte gratuit
3. Connectez-vous au tableau de bord

### 2. Obtenir une clé API
1. Dans le tableau de bord Resend, allez dans **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez-lui un nom (ex: "La Mie du Coin - Production")
4. Copiez la clé (elle commence par `re_`)
5. ⚠️ **Important**: Conservez cette clé en sécurité, vous ne pourrez plus la voir!

### 3. Configurer le fichier .env (développement local)
```bash
cd Test
cp .env.example .env
```

Éditez le fichier `.env` et ajoutez vos valeurs:
```env
RESEND_API_KEY=re_votre_vraie_cle_api_ici
RESEND_FROM_EMAIL=La Mie du Coin <noreply@lamieducoin.ca>
```

### 4. Installer les dépendances
```bash
npm install
```

### 5. Tester la configuration
```bash
node test-resend.js
```

Si tout fonctionne, vous devriez voir:
```
✅ EMAIL ENVOYÉ AVEC SUCCÈS!
📬 Message ID: [identifiant unique]
```

## 🌐 Déploiement sur Netlify

### Configurer les variables d'environnement

1. Connectez-vous à [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site configuration > Environment variables**
4. Ajoutez les variables:

| Variable | Valeur | Description |
|----------|--------|-------------|
| `RESEND_API_KEY` | `re_...` | Votre clé API Resend |
| `RESEND_FROM_EMAIL` | `La Mie du Coin <noreply@lamieducoin.ca>` | Email expéditeur |

5. Cliquez sur **Save**

### Déployer

```bash
# Option 1: Push sur Git (déploiement automatique)
git add .
git commit -m "Ajout de l'envoi d'emails avec Resend"
git push

# Option 2: Déploiement manuel avec Netlify CLI
netlify deploy --prod
```

## 🔍 Vérifier que tout fonctionne

### En développement local

1. Démarrez le serveur de développement:
```bash
npm run dev
```

2. Ouvrez le site: `http://localhost:8888`

3. Passez une commande de test

4. Vérifiez la console du navigateur pour voir:
```
✅ Email envoyé via Resend
📬 Message ID: [id]
```

### En production

1. Allez sur votre site en production
2. Passez une commande
3. Vérifiez que l'email de confirmation est bien reçu

## 📊 Surveiller les envois

### Tableau de bord Resend

Connectez-vous à [resend.com](https://resend.com) pour voir:
- 📨 Emails envoyés
- ✅ Taux de livraison
- 📈 Statistiques
- 🐛 Logs d'erreurs

## 🆘 Problèmes courants

### "Configuration Resend incomplète"
**Cause**: La clé API n'est pas configurée

**Solution**:
- En local: Vérifiez le fichier `.env`
- Sur Netlify: Vérifiez les variables d'environnement

### "Invalid from address" 
**Cause**: L'adresse email expéditrice n'utilise pas un domaine vérifié

**Solution temporaire** (pour tester):
- Utilisez `onboarding@resend.dev` comme adresse FROM
- ⚠️ Ne fonctionne qu'en mode test

**Solution production**:
- Vérifiez votre domaine dans Resend (voir `RESEND-CONFIGURATION.md`)

### Les emails arrivent dans les spams
**Cause**: Domaine pas encore vérifié ou pas de SPF/DKIM

**Solution**:
- Configurez les enregistrements DNS SPF et DKIM
- Voir le guide complet: `RESEND-CONFIGURATION.md`

## 📚 Documentation

- 📖 [Guide complet de configuration](./RESEND-CONFIGURATION.md)
- 🌐 [Documentation Resend](https://resend.com/docs)
- 💻 [Resend Node.js SDK](https://github.com/resendlabs/resend-node)

## 🎉 C'est prêt!

Votre système d'envoi d'emails est maintenant configuré. Chaque commande passée sur le site enverra automatiquement un email de confirmation au client! 🍞📧
