# La mie du coin - Site Web de Boulangerie Artisanale 🍞

## 🎯 Description

Site web moderne pour **"La mie du coin"**, une boulangerie artisanale de pain frais. Le jeu de mot "La mie du coin" fait référence à "L'amie du coin", créant une signature sympathique et mémorable.

Ce dossier **Test** permet la conception et le test du site avant sa mise en production.

## 📁 Structure du Projet

```
Test/
├── index.html              # Page d'accueil
├── CNAME                   # Configuration du domaine
├── README.md               # Ce fichier
├── SUMMARY.md              # Résumé détaillé du projet
├── GUIDE-PANIER-RAPIDE.md  # Guide de démarrage du panier
├── validate_cart.py        # Script de validation du panier
├── css/                    # Feuilles de style
│   ├── styles.css          # Styles personnalisés (thème boulangerie)
│   └── cart.css            # Styles du panier d'achat
├── js/                     # Scripts JavaScript
│   ├── main.js             # Script principal
│   ├── utils.js            # Fonctions utilitaires
│   ├── products.js         # Gestion dynamique des produits
│   ├── translations.js     # Système de traduction FR/EN
│   └── cart.js             # Logique du panier d'achat
├── data/                   # Données
│   ├── products.json       # Base de données des produits
│   └── README-PRODUCTS.md  # Documentation des produits
├── img/                    # Images du site
├── assets/                 # Ressources additionnelles
│   ├── fonts/              # Polices personnalisées
│   └── icons/              # Icônes personnalisées
├── pages/                  # Pages HTML
│   ├── produits.html       # Catalogue de produits
│   ├── commandes.html      # Système de commandes avec panier
│   ├── historique.html     # Histoire de la boulangerie (structure créée)
│   └── contact.html        # Page Contact
├── components/             # Composants réutilisables
│   ├── navbar.html         # Barre de navigation
│   └── footer.html         # Pied de page
└── Docs/                   # Documentation
    ├── GUIDE-TRADUCTION.md # Guide du système de traduction
    └── README-PANIER.md    # Documentation complète du panier
```

## 🎨 Pages du Site

### 1. **Page d'accueil** (`index.html`)
- Hero section avec image de fond
- Présentation des valeurs: Artisanal, Frais du jour, Passion
- Aperçu des catégories de produits
- Appel à l'action pour commander

### 2. **Page Produits** (`pages/produits.html`)
Catalogue complet organisé par catégories:
- 🍞 **Pains de Base** (8 produits) - Pain blanc, baguettes, pains intégraux
- 🌰 **Pains Spécialisés** (7 produits) - Pain aux noix, au fromage, sous-marin
- 🥐 **Viennoiseries** (3 produits) - Croissants, pains au chocolat, brioche
- 🥨 **Pains en Forme** (5 produits) - Bagels, bretzels
- 🌾 **Options Sans Gluten** (3 produits)
- 🇮🇹 **Spécialités Méditerranéennes** (2 produits) - Focaccia, fougasse

### 3. **Page Commandes** (`pages/commandes.html`) - 🆕 SYSTÈME DE PANIER COMPLET
Système de panier d'achat fonctionnel avec:
- **Affichage dynamique** de tous les produits disponibles (28 produits)
- **Ajout au panier** avec quantité personnalisable (1-99)
- **Gestion du panier**:
  - Modification de quantité
  - Suppression d'articles
  - Vidage complet
  - Compteur en temps réel
- **Calcul automatique du total** avant taxes
- **Persistance** des données (localStorage)
- **Notifications** visuelles lors des actions
- **Interface responsive** avec panier sticky sur desktop
- **Support multilingue** FR/EN complet
- Badge "Populaire" sur produits vedettes
- Informations sur commande minimum et ramassage

**À développer**:
- Intégration système de paiement (Stripe/Square)
- Formulaire coordonnées client
- Choix date/heure de ramassage
- Confirmation par email

### 4. **Page Histoire** (`pages/historique.html`)
- Structure HTML créée
- Placeholder pour le contenu futur
- **À développer**: Histoire de la boulangerie, photos, témoignages

### 5. **Page Contact** (`pages/contact.html`)
- Formulaire de contact fonctionnel
- Coordonnées complètes (adresse, téléphone, courriel)
- Heures d'ouverture
- Liens réseaux sociaux

## 🎨 Thème et Design

### Palette de couleurs
- **Primaire**: `#8B4513` (Brun chocolat - SaddleBrown)
- **Primaire claire**: `#D2691E` (Orange brun - Chocolate)
- **Secondaire**: `#F4A460` (Beige sable - SandyBrown)
- **Accent**: `#FFD700` (Or)
- **Fond**: `#FEFAF0` (Crème)

### Caractéristiques du design
- Design moderne et chaleureux avec des couleurs relatant le blé, la nature, les grands espaces, l'air frais, la légèreté
- Responsive (mobile-first)
- Animations fluides au scroll
- Effets hover sur les cartes
- Icônes Bootstrap intégrées
- Typographie système optimisée

## 🌐 Système de Traduction Multilingue

Le site dispose d'un **système de traduction FR/EN complet** :

### Fonctionnalités
- **Sélecteur de langue** dans la barre de navigation (FR/EN)
- **Traduction instantanée** sans rechargement de page
- **Persistance** de la préférence linguistique (localStorage)
- **~80+ clés de traduction** disponibles
- **Page de test** dédiée (`test-translation.html`)
- **Intégration avec le panier** - Produits traduits automatiquement

### Fichiers du Système
- `js/translations.js` - Dictionnaire de traductions FR/EN
- `Docs/GUIDE-TRADUCTION.md` - Guide complet pour développeurs
- `README-TRADUCTION.md` - Documentation du système
- `test-translation.html` - Page de démonstration

### Statut de Traduction
- ✅ **Page d'accueil** (index.html) - 100% traduite
- ✅ **Navbar** - 100% traduite
- ✅ **Page Commandes** - Produits 100% traduits
- 🔄 **Autres pages** - Structure prête, traduction à compléter

### Utilisation
```html
<!-- Ajouter l'attribut data-i18n aux éléments -->
<h1 data-i18n="home.title">La mie du coin</h1>
<p data-i18n="home.subtitle">Votre amie du coin...</p>
```

Pour plus de détails, consultez `README-TRADUCTION.md` et `Docs/GUIDE-TRADUCTION.md`.

## 🛒 Système de Panier d'Achat

Le site dispose maintenant d'un **système de panier d'achat complet et fonctionnel** :

### Fonctionnalités du Panier
- **Chargement dynamique** des produits depuis JSON
- **Ajout au panier** avec sélection de quantité
- **Modification** des quantités dans le panier
- **Suppression** de produits individuels
- **Calcul automatique** du sous-total avant taxes
- **Persistance** via localStorage
- **Notifications** visuelles d'ajout
- **Design responsive** avec panier sticky
- **Support multilingue** FR/EN

### Fichiers du Système
- `js/cart.js` - Classe ShoppingCart et logique complète (~460 lignes)
- `css/cart.css` - Styles du panier et des produits (~300 lignes)
- `data/products.json` - Base de données de 28 produits
- `Docs/README-PANIER.md` - Documentation complète
- `GUIDE-PANIER-RAPIDE.md` - Guide de démarrage rapide
- `validate_cart.py` - Script de validation

### Démarrage Rapide
```bash
# 1. Lancer le serveur
python -m http.server 8000

# 2. Ouvrir la page des commandes
http://localhost:8000/pages/commandes.html

# 3. Consulter le guide
Voir GUIDE-PANIER-RAPIDE.md
```

### Architecture
```javascript
class ShoppingCart {
    addItem(productId, quantity)      // Ajouter au panier
    updateQuantity(productId, qty)    // Modifier quantité
    removeItem(productId)             // Retirer produit
    clearCart()                       // Vider panier
    getTotal()                        // Obtenir total
}
```

Pour plus de détails, consultez `Docs/README-PANIER.md`.

## 🚀 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Variables CSS, Flexbox, Grid, Animations
- **Bootstrap 5.3.2** - Framework CSS responsive
- **Bootstrap Icons 1.11.1** - Bibliothèque d'icônes
- **JavaScript ES6+** - Classes, Modules, Fetch API, Observers, i18n
- **Supabase** - Base de données PostgreSQL cloud (🆕 NOUVEAU)
- **Supabase JS v2** - Client JavaScript officiel
- **JSON** - Base de données locale des produits (legacy)
- **LocalStorage** - Persistance du panier et des préférences
- **Responsive Design** - Adaptatif tous écrans
- **Système i18n** - Traduction FR/EN intégrée
- **Architecture MVC** - Séparation logique/présentation

## 🗄️ Intégration Supabase - 🆕 NOUVEAU

Le site est maintenant connecté à **Supabase** pour une gestion dynamique des produits en temps réel!

### Fonctionnalités Supabase
- **Connexion automatique** à la base de données cloud
- **Chargement dynamique** des produits depuis PostgreSQL
- **Filtrage intelligent** (status='Active', available=true)
- **Tri automatique** (produits vedettes en premier)
- **Support multilingue** (FR/EN)
- **Gestion des catégories** depuis la BD
- **Service Layer** pour isolation de la logique

### Architecture
```
Test/
├── js/
│   ├── config/
│   │   └── database.js          # 🆕 Configuration Supabase
│   ├── services/
│   │   ├── productService.js    # 🆕 Service produits
│   │   └── categoryService.js   # 🆕 Service catégories
│   └── products.js               # ✏️ Réécrit pour Supabase
└── pages/
    ├── produits.html             # ✏️ Intégration Supabase
    └── test-supabase-produits.html # 🆕 Page de test
```

### Tables Supabase
1. **Products** - Tous les produits (28+)
   - id, code, categoryId
   - title_fr, title_en
   - description_fr, description_en
   - price, currency, unit
   - icon, image, weight
   - allergens[], ingredients[]
   - available, featured, status

2. **BreadCategory** - Catégories de produits
   - id, NameFR, NameEN
   - DescriptionFR, DescriptionEN
   - icon

### Scripts de Test
```bash
# Lancer la page de test Supabase
.\lancer-test-produits.ps1   # PowerShell
# ou
.\lancer-test-produits.bat   # Batch

# Puis choisir:
# 1. Page produits complète
# 2. Page de test Supabase (recommandé pour déboguer)
```

### Documentation Supabase
- **`RESUME-MODIFICATIONS-PRODUITS.md`** - Vue d'ensemble complète
- **`pages/PRODUITS-README.md`** - Documentation technique détaillée
- **`pages/GUIDE-TEST-PRODUITS.md`** - Procédures de test
- **`pages/APERCU-VISUEL.md`** - Mockups et design
- **`DEMARRAGE-RAPIDE-PRODUITS.md`** - Guide de démarrage

### URLs de Test
```
Page produits Supabase:
http://localhost:8000/pages/produits.html

Page de test interactive:
http://localhost:8000/pages/test-supabase-produits.html
```

## 📋 Fonctionnalités

### ✅ Implémentées
- Navigation responsive avec liens actifs
- **Système de traduction FR/EN** avec sélecteur de langue
- **Intégration Supabase complète** 🆕 NOUVEAU
  - Connexion base de données cloud PostgreSQL
  - Chargement dynamique des produits
  - Gestion des catégories depuis la BD
  - Services isolés (productService, categoryService)
  - Page de test interactive
  - Documentation complète
- **Système de panier d'achat complet**
  - Ajout/modification/suppression de produits
  - Calcul du total en temps réel
  - Persistance via localStorage
  - Interface responsive
- Hero section animée avec dégradé
- Catalogue de produits complet (28 produits)
- Chargement dynamique depuis JSON ou Supabase
- Page de contact avec formulaire validé
- Composants réutilisables (navbar, footer)
- Animations au scroll (Intersection Observer)
- Smooth scroll pour les ancres
- Design cards avec effets hover
- Footer complet avec informations
- **Persistance de la langue** (localStorage)
- **Notifications visuelles** pour les actions
- **Compteur d'articles** dans le panier
- **Badge "Vedette"** pour produits mis en avant

### 🚧 À Développer
- Compléter la traduction des pages restantes
- Intégration système de paiement (Stripe/Square)
- Formulaire de coordonnées client
- Choix date/heure de ramassage
- Système de commandes en ligne complet
- Galerie de photos de produits
- Section histoire complète avec contenu
- Blog/Actualités
- Espace client / Connexion
- Système de réservation
- Carte Google Maps
- Détection automatique de la langue du navigateur
- Calcul des taxes (TPS + TVQ)
- Code promo / Rabais
- Email de confirmation de commande

## 🛠️ Installation et Utilisation

### Développement local
```bash
# 1. Cloner le repository
git clone [url-du-repo]

# 2. Naviguer dans le dossier Test
cd website_lamieducoin/Test

# 3. (Optionnel) Valider l'installation du panier
python validate_cart.py

# 4. Lancer un serveur local (au choix):

# Option A: Live Server (VS Code extension)
# Clic droit sur index.html > "Open with Live Server"

# Option B: Python
python -m http.server 8000

# Option C: Node.js
npx http-server -p 8000

# 5. Ouvrir dans le navigateur
# http://localhost:8000
```

### ⚠️ Important
Un **serveur local est OBLIGATOIRE** pour:
- Charger les composants navbar/footer (CORS)
- Charger la base de données JSON des produits
- Faire fonctionner le système de panier

### Pages à Tester
- **Accueil**: http://localhost:8000/index.html
- **Produits**: http://localhost:8000/pages/produits.html
- **Commandes (Panier)**: http://localhost:8000/pages/commandes.html
- **Contact**: http://localhost:8000/pages/contact.html
- **Test Traduction**: http://localhost:8000/test-translation.html

### Aucune installation de dépendances nécessaire
Le site utilise des CDN pour Bootstrap et les icônes.

## 📱 Responsive Design

Le site est optimisé pour tous les écrans:
- 📱 **Mobile** (320px - 767px)
- 📱 **Tablette** (768px - 1023px)
- 💻 **Desktop** (1024px - 1439px)
- 🖥️ **Large Desktop** (1440px+)

## 🎯 Roadmap - Prochaines Étapes

### Phase 1 - Contenu (Court terme)
- [ ] Ajouter images réelles de produits
- [ ] Compléter la page Histoire
- [ ] Créer une galerie photo
- [ ] Ajouter témoignages clients
- [ ] Rédiger descriptions détaillées produits

### Phase 2 - Fonctionnalités (Moyen terme)
- [ ] Développer le système de commandes
- [ ] Créer le panier d'achat
- [ ] Intégrer système de paiement (Stripe/Square)
- [ ] Ajouter notifications email
- [ ] Système de gestion des stocks

### Phase 3 - Optimisation (Long terme)
- [ ] Optimisation SEO
- [ ] Performance (Lighthouse 90+)
- [ ] Accessibilité WCAG 2.1 AA
- [ ] PWA (Progressive Web App)
- [ ] Analytics (Google Analytics)
- [ ] Tests automatisés

## 📞 Informations de Contact

**La mie du coin**
- 📍 123 Rue du Coin, Montréal, QC H1A 1A1
- 📞 (555) 123-4567
- 📧 info@lamieducoin.ca
- 🕐 Lun-Ven: 7h00 - 19h00 | Sam-Dim: 8h00 - 17h00

## 🔧 Notes Techniques

- Tous les liens sont relatifs pour faciliter le déploiement
- Les composants navbar/footer sont chargés via Fetch API
- Un serveur local est requis pour le développement (CORS)
- Les formulaires utilisent validation HTML5 + Bootstrap
- Les animations sont optimisées (will-change, transform)

## 📄 Licence

© 2025 La mie du coin. Tous droits réservés.

---

*Fait avec ❤️ et passion pour le pain artisanal*
