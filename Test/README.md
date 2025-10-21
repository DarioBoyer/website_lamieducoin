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
├── css/                    # Feuilles de style
│   └── styles.css          # Styles personnalisés (thème boulangerie)
├── js/                     # Scripts JavaScript
│   ├── main.js             # Script principal
│   └── utils.js            # Fonctions utilitaires
├── img/                    # Images du site
├── assets/                 # Ressources additionnelles
│   ├── fonts/              # Polices personnalisées
│   └── icons/              # Icônes personnalisées
├── pages/                  # Pages HTML
│   ├── produits.html       # Catalogue de produits
│   ├── commandes.html      # Système de commandes (structure créée)
│   ├── historique.html     # Histoire de la boulangerie (structure créée)
│   └── contact.html        # Page Contact
└── components/             # Composants réutilisables
    ├── navbar.html         # Barre de navigation
    └── footer.html         # Pied de page
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

### 3. **Page Commandes** (`pages/commandes.html`)
- Structure HTML créée
- Placeholder informatif
- Contacts temporaires pour commander
- **À développer**: Formulaire de commande, panier, paiement

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

### Fichiers du Système
- `js/translations.js` - Dictionnaire de traductions FR/EN
- `Docs/GUIDE-TRADUCTION.md` - Guide complet pour développeurs
- `README-TRADUCTION.md` - Documentation du système
- `test-translation.html` - Page de démonstration

### Statut de Traduction
- ✅ **Page d'accueil** (index.html) - 100% traduite
- ✅ **Navbar** - 100% traduite
- 🔄 **Autres pages** - Structure prête, traduction à compléter

### Utilisation
```html
<!-- Ajouter l'attribut data-i18n aux éléments -->
<h1 data-i18n="home.title">La mie du coin</h1>
<p data-i18n="home.subtitle">Votre amie du coin...</p>
```

Pour plus de détails, consultez `README-TRADUCTION.md` et `Docs/GUIDE-TRADUCTION.md`.

## 🚀 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Variables CSS, Flexbox, Grid, Animations
- **Bootstrap 5.3.2** - Framework CSS responsive
- **Bootstrap Icons 1.11.1** - Bibliothèque d'icônes
- **JavaScript ES6+** - Modules, Fetch API, Observers, i18n
- **Responsive Design** - Adaptatif tous écrans
- **Système i18n** - Traduction FR/EN intégrée

## 📋 Fonctionnalités

### ✅ Implémentées
- Navigation responsive avec liens actifs
- **Système de traduction FR/EN** avec sélecteur de langue
- Hero section animée avec dégradé
- Catalogue de produits complet (30+ produits)
- Page de contact avec formulaire validé
- Composants réutilisables (navbar, footer)
- Animations au scroll (Intersection Observer)
- Smooth scroll pour les ancres
- Design cards avec effets hover
- Footer complet avec informations
- **Persistance de la langue** (localStorage)

### 🚧 À Développer
- Compléter la traduction des pages restantes (produits, contact, commandes, histoire)
- Traduire le footer
- Système de commandes en ligne
- Panier d'achat dynamique
- Intégration paiement en ligne
- Galerie de photos de produits
- Section histoire complète avec contenu
- Blog/Actualités
- Espace client / Connexion
- Système de réservation
- Carte Google Maps
- Détection automatique de la langue du navigateur

## 🛠️ Installation et Utilisation

### Développement local
```bash
# 1. Cloner le repository
git clone [url-du-repo]

# 2. Naviguer dans le dossier Test
cd website_lamieducoin/Test

# 3. Lancer un serveur local (au choix):

# Option A: Live Server (VS Code extension)
# Clic droit sur index.html > "Open with Live Server"

# Option B: Python
python -m http.server 8000

# Option C: Node.js
npx http-server -p 8000

# 4. Ouvrir dans le navigateur
# http://localhost:8000
```

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
