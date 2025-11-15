# Configuration Resend pour l'envoi d'emails

## 📋 Prérequis

1. Compte Resend créé sur [resend.com](https://resend.com)
2. Domaine vérifié dans Resend (ex: `lamieducoin.ca`)
3. Clé API Resend générée

## 🔧 Configuration Netlify

### 1. Variables d'environnement

Dans les paramètres de votre site Netlify, ajoutez les variables d'environnement suivantes :

#### Production (Netlify Dashboard)
1. Allez dans **Site Configuration > Environment Variables**
2. Ajoutez :
   - `RESEND_API_KEY` : Votre clé API Resend (commence par `re_`)
   - `RESEND_FROM_EMAIL` : L'adresse email expéditrice (ex: `La Mie du Coin <noreply@lamieducoin.ca>`)

#### Développement local (fichier .env)
Créez un fichier `.env` à la racine du dossier `Test/` :

```env
RESEND_API_KEY=re_votre_cle_api_ici
RESEND_FROM_EMAIL=La Mie du Coin <noreply@lamieducoin.ca>
```

⚠️ **Important** : Ajoutez `.env` dans votre `.gitignore` pour ne pas exposer vos clés !

### 2. Package Resend

Le package `resend` doit être installé dans le dossier racine du projet :

```bash
cd Test
npm install resend
```

Vérifiez que `resend` est dans le fichier `package.json` :

```json
{
  "dependencies": {
    "resend": "^latest"
  }
}
```

## 🌐 Configuration du domaine dans Resend

### Étape 1 : Ajouter votre domaine
1. Connectez-vous à [resend.com](https://resend.com)
2. Allez dans **Domains**
3. Cliquez sur **Add Domain**
4. Entrez `lamieducoin.ca`

### Étape 2 : Vérifier le domaine
Resend vous donnera des enregistrements DNS à ajouter :

#### SPF Record
```
Type: TXT
Name: @
Value: v=spf1 include:resend.com ~all
```

#### DKIM Records
```
Type: TXT
Name: resend._domainkey
Value: [fourni par Resend]
```

#### DMARC Record (optionnel mais recommandé)
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@lamieducoin.ca
```

### Étape 3 : Attendez la vérification
La vérification peut prendre quelques minutes à 48 heures.

## 📧 Utilisation

### Format de l'email expéditeur
L'adresse expéditrice doit utiliser votre domaine vérifié :
- ✅ `noreply@lamieducoin.ca`
- ✅ `contact@lamieducoin.ca`
- ✅ `La Mie du Coin <noreply@lamieducoin.ca>`
- ❌ `noreply@gmail.com` (non vérifié)

### Test en développement local

1. Démarrez Netlify Dev :
```bash
cd Test
npm run dev
# ou
netlify dev
```

2. L'endpoint sera disponible à :
```
http://localhost:8888/.netlify/functions/send-email
```

3. Testez une commande sur le site local

## 🔍 Vérification

### Vérifier que la fonction fonctionne

1. Dans la console du navigateur, vous devriez voir :
```
📧 Préparation de l'email de confirmation...
📨 Destinataire: client@example.com
📋 Sujet: Confirmation de commande #123
✅ Email envoyé via Resend
📬 Message ID: [ID unique Resend]
```

2. Dans les logs Netlify Functions :
```
📧 Envoi via Resend: {
  to: 'client@example.com',
  from: 'La Mie du Coin <noreply@lamieducoin.ca>',
  subject: 'Confirmation de commande #123'
}
✅ Email envoyé via Resend: [ID]
```

### Tableau de bord Resend

Connectez-vous à Resend pour voir :
- Les emails envoyés
- Les taux de livraison
- Les erreurs éventuelles
- Les statistiques

## 🐛 Dépannage

### Erreur : "Configuration Resend incomplète"
- Vérifiez que `RESEND_API_KEY` est bien configurée dans Netlify
- En local, vérifiez que le fichier `.env` existe et contient la clé

### Erreur : "Domain not verified"
- Attendez que la vérification DNS soit complète
- Vérifiez les enregistrements DNS dans votre registraire

### Erreur : "Invalid from address"
- L'adresse `from` doit utiliser votre domaine vérifié
- Format : `nom@votredomaine.com`

### Les emails n'arrivent pas
1. Vérifiez les spams/courrier indésirable
2. Consultez le tableau de bord Resend pour voir le statut
3. Vérifiez les enregistrements SPF/DKIM

## 📊 Limites

### Plan gratuit Resend
- **100 emails/jour**
- **3 000 emails/mois**
- Idéal pour démarrer

### Plan payant
Si vous dépassez les limites, consultez les [tarifs Resend](https://resend.com/pricing).

## 🔒 Sécurité

- ✅ Clés API stockées dans les variables d'environnement Netlify
- ✅ Jamais de clés dans le code source
- ✅ `.env` dans `.gitignore`
- ✅ HTTPS obligatoire en production
- ✅ CORS configuré correctement

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Vérification de domaine](https://resend.com/docs/dashboard/domains/introduction)
- [Meilleures pratiques email](https://resend.com/docs/knowledge-base/best-practices)
