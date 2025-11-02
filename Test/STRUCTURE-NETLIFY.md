# 📁 Structure du projet - La Mie du Coin avec Netlify

## 🗂️ Vue d'ensemble

```
Test/
├── 📄 Configuration Netlify
│   ├── netlify.toml                      # Configuration principale Netlify
│   ├── package.json                      # Dépendances Node.js
│   ├── .env.example                      # Template variables d'environnement
│   ├── .env                              # Variables d'environnement (SENSIBLE - gitignored)
│   └── .gitignore                        # Fichiers à ne pas commiter
│
├── 🔧 Fonctions Serverless (Netlify Functions)
│   └── netlify/
│       ├── functions/
│       │   ├── send-email.js             # Envoi d'emails via SMTP
│       │   ├── test-smtp.js              # Test de connexion SMTP
│       │   └── get-smtp-config.js        # Récupération config sécurisée
│       └── TEST-LOCAL.md                 # Guide de test local
│
├── 📚 Documentation
│   ├── README.md                         # Documentation principale
│   ├── NETLIFY-DEPLOYMENT.md             # Guide de déploiement Netlify
│   ├── MIGRATION-NETLIFY.md              # Checklist de migration
│   ├── SUMMARY.md                        # Résumé du projet
│   ├── GUIDE-PANIER-RAPIDE.md            # Guide du panier
│   └── README-TRADUCTION.md              # Documentation traduction
│
├── 🌐 Pages HTML
│   ├── index.html                        # Page d'accueil
│   ├── pages/
│   │   ├── orders.html                   # Page de commandes (panier)
│   │   ├── produits.html                 # Catalogue produits
│   │   ├── contact.html                  # Page contact
│   │   └── historique.html               # Histoire (à compléter)
│   └── pagesadmin/
│       └── smtp-config.html              # Configuration SMTP admin
│
├── 🎨 Styles CSS
│   ├── css/
│   │   ├── styles.css                    # Styles principaux
│   │   ├── cart.css                      # Styles du panier
│   │   └── orders.css                    # Styles page commandes
│   └── Livre/
│       └── styles.css                    # Styles livre de recettes
│
├── ⚙️ JavaScript Frontend
│   ├── js/
│   │   ├── main.js                       # Script principal
│   │   ├── utils.js                      # Fonctions utilitaires
│   │   ├── cart.js                       # Gestion du panier
│   │   ├── checkout.js                   # Processus de commande
│   │   ├── orders-display.js             # Affichage produits
│   │   ├── products.js                   # Gestion produits (Supabase)
│   │   └── translations.js               # Système de traduction FR/EN
│   └── data/js/
│       ├── config/
│       │   └── database.js               # Configuration Supabase
│       └── services/
│           ├── emailService.js           # Service emails (adapté Netlify)
│           ├── orderService.js           # Gestion commandes
│           ├── productService.js         # Service produits Supabase
│           ├── categoryService.js        # Service catégories
│           └── parametersService.js      # Service paramètres SMTP
│
├── 📊 Données
│   ├── data/
│   │   ├── products.json                 # Base de données produits (legacy)
│   │   └── README-PRODUCTS.md            # Documentation produits
│   └── backend/
│       ├── init-parameters-table.sql     # Script SQL Supabase
│       ├── FIX-RLS-ERRORS.md             # Guide résolution erreurs
│       ├── README.md                     # Documentation backend (legacy)
│       ├── email-api-server.js           # Serveur Node.js (LEGACY - remplacé par Netlify)
│       └── package.json                  # Dépendances backend (legacy)
│
├── 🖼️ Assets
│   ├── img/                              # Images du site
│   ├── assets/
│   │   ├── fonts/                        # Polices personnalisées
│   │   └── icons/                        # Icônes
│   └── Livre/
│       └── Guides/                       # Images guides de recettes
│
├── 📦 Composants Réutilisables
│   └── components/
│       ├── navbar.html                   # Barre de navigation
│       └── footer.html                   # Pied de page
│
├── 🚀 Scripts de démarrage
│   ├── start-netlify-dev.ps1             # Démarrage Netlify Dev (PowerShell)
│   ├── start-server.ps1                  # Serveur local simple (PowerShell)
│   └── start-server.bat                  # Serveur local simple (Batch)
│
└── 📖 Livre de recettes (bonus)
    └── Livre/
        ├── index.html                    # Index du livre
        ├── Recettes/                     # Recettes de pain
        ├── Guides/                       # Guides de fabrication
        ├── Techniques/                   # Techniques de boulangerie
        └── Astuces/                      # Trucs et astuces
```

## 🔑 Fichiers clés pour Netlify

### Configuration essentielle
| Fichier | Description | Localisation |
|---------|-------------|--------------|
| `netlify.toml` | Configuration Netlify (build, fonctions, redirections) | Racine Test/ |
| `package.json` | Dépendances Node.js (nodemailer) | Racine Test/ |
| `.env` | Variables d'environnement locales (SENSIBLE) | Racine Test/ |
| `.gitignore` | Fichiers à exclure de Git | Racine Test/ |

### Fonctions serverless
| Fonction | Endpoint | Description |
|----------|----------|-------------|
| `send-email.js` | `POST /.netlify/functions/send-email` | Envoie un email via SMTP |
| `test-smtp.js` | `POST /.netlify/functions/test-smtp` | Teste la connexion SMTP |
| `get-smtp-config.js` | `GET /.netlify/functions/get-smtp-config` | Récupère la config (sans mots de passe) |

### Services frontend adaptés
| Service | Description | Changements |
|---------|-------------|-------------|
| `emailService.js` | Service d'envoi d'emails | ✅ Adapté pour Netlify Functions |
| `orderService.js` | Gestion des commandes | Aucun changement requis |
| `productService.js` | Récupération produits Supabase | Aucun changement requis |

## 📋 Variables d'environnement requises

### Fichier .env (développement local)
```env
# SMTP Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=votre-email@domaine.com
SMTP_PASS=votre-mot-de-passe
SMTP_FROM=La Mie du Coin <noreply@lamieducoin.com>

# Supabase (optionnel dans .env, déjà dans database.js)
SUPABASE_URL=https://mtuimnyoimiqhuyidyjv.supabase.co
SUPABASE_ANON_KEY=votre_cle_anon
```

### Netlify Dashboard (production)
À configurer dans **Site settings → Environment variables**:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`

## 🚦 Flux de données

### Commande client → Email de confirmation

```
1. Client remplit formulaire
   ↓
2. checkout.js valide les données
   ↓
3. orderService.js enregistre dans Supabase
   ↓
4. emailService.js prépare l'email
   ↓
5. Appel POST /.netlify/functions/send-email
   ↓
6. Fonction Netlify envoie via SMTP (nodemailer)
   ↓
7. Client reçoit email de confirmation
```

### Chargement des produits

```
1. Page orders.html charge
   ↓
2. orders-display.js s'initialise
   ↓
3. Appel productService.js
   ↓
4. Requête Supabase (table Products)
   ↓
5. Filtrage (status=Active, available=true)
   ↓
6. Affichage dynamique des cartes produits
```

## 📊 Technologies utilisées

### Frontend
- **HTML5** - Structure sémantique
- **CSS3** - Styles modernes avec variables
- **JavaScript ES6+** - Modules, Classes, Async/Await
- **Bootstrap 5.3.2** - Framework CSS responsive
- **Bootstrap Icons 1.11.1** - Icônes

### Backend/Services
- **Netlify Functions** - Fonctions serverless (remplace Node.js)
- **Node.js 18+** - Runtime des fonctions
- **Nodemailer 6.9.7** - Envoi d'emails SMTP
- **Supabase** - Base de données PostgreSQL cloud
- **Supabase JS v2** - Client JavaScript officiel

### Infrastructure
- **Netlify** - Hébergement + CDN + Functions
- **Supabase** - Database as a Service
- **Git/GitHub** - Contrôle de version
- **npm** - Gestionnaire de paquets

## 🔄 Changements par rapport à l'ancien système

### ✅ Avant (Backend Node.js)
```
Test/
├── backend/
│   ├── email-api-server.js    # Serveur Express + Nodemailer
│   └── package.json           # Dépendances backend
└── data/js/services/
    └── emailService.js        # Appelait http://localhost:3001
```

**Problèmes**:
- ❌ Nécessite un serveur Node.js toujours actif
- ❌ Complexité de déploiement
- ❌ Coûts d'hébergement serveur
- ❌ Gestion de la scalabilité

### ✅ Après (Netlify Functions)
```
Test/
├── netlify/
│   └── functions/
│       └── send-email.js      # Fonction serverless
├── netlify.toml               # Configuration
└── data/js/services/
    └── emailService.js        # Appelle /.netlify/functions/send-email
```

**Avantages**:
- ✅ Serverless (pas de serveur à gérer)
- ✅ Déploiement automatique (git push)
- ✅ Gratuit (plan Netlify gratuit généreux)
- ✅ Scalabilité automatique
- ✅ HTTPS automatique
- ✅ CDN global

## 🎯 Fichiers à ignorer dans Git

Ajoutés dans `.gitignore`:
```
.env                    # Variables d'environnement sensibles
node_modules/           # Dépendances Node.js
.netlify/               # Fichiers de build Netlify
*.log                   # Fichiers de logs
```

## 📝 Commandes utiles

```powershell
# Installation des dépendances
npm install

# Démarrage local avec Netlify Dev
npm run dev
# OU
.\start-netlify-dev.ps1

# Déploiement en production
npm run deploy

# Test des fonctions en local
curl -X POST http://localhost:8888/.netlify/functions/test-smtp
```

## 🔐 Sécurité

### Données sensibles
- ✅ `.env` dans `.gitignore` (jamais commité)
- ✅ Variables d'environnement cryptées dans Netlify
- ✅ Mots de passe SMTP jamais exposés au frontend
- ✅ HTTPS automatique (Let's Encrypt)

### Bonnes pratiques
- ✅ Validation des données côté serveur (fonctions)
- ✅ CORS configuré pour les fonctions
- ✅ Headers de sécurité dans `netlify.toml`
- ✅ RLS activé sur Supabase

## 📚 Documentation associée

| Document | Description |
|----------|-------------|
| [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md) | Guide complet de déploiement |
| [MIGRATION-NETLIFY.md](MIGRATION-NETLIFY.md) | Checklist de migration |
| [netlify/TEST-LOCAL.md](netlify/TEST-LOCAL.md) | Guide de test local |
| [backend/FIX-RLS-ERRORS.md](backend/FIX-RLS-ERRORS.md) | Résolution erreurs Supabase |

---

**Dernière mise à jour**: 2 novembre 2025
**Version**: 2.0.0 (Migration Netlify)
