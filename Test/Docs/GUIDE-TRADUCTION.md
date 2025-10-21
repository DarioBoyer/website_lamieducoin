# 🌐 Guide de Traduction - La mie du coin

## Vue d'ensemble

Le site "La mie du coin" supporte maintenant **deux langues** :
- 🇫🇷 **Français (FR)** - Langue par défaut
- 🇬🇧 **Anglais (EN)**

Le système de traduction est basé sur JavaScript et utilise `localStorage` pour mémoriser la préférence linguistique de l'utilisateur.

---

## 🎯 Fonctionnalités

### Sélecteur de Langue
- Deux boutons **FR** et **EN** dans la barre de navigation
- Bouton actif surligné en couleur primaire
- Changement de langue instantané sans rechargement de page
- Préférence sauvegardée dans le navigateur

### Traductions Automatiques
- Navigation (menu)
- Contenu des pages (titres, descriptions, boutons)
- Placeholders de formulaires
- Footer

---

## 📁 Fichiers Concernés

### Fichiers JavaScript
1. **`js/translations.js`** - Fichier principal contenant :
   - Dictionnaire de traductions (FR/EN)
   - Fonctions de gestion de langue
   - Système de mise à jour automatique

### Fichiers HTML Modifiés
Tous les fichiers HTML doivent inclure le script de traduction :
```html
<script src="js/translations.js"></script>
```

### Fichiers de Composants
- `components/navbar.html` - Inclut les boutons FR/EN
- `components/footer.html` - Sera mis à jour avec attributs de traduction

---

## 🔧 Comment Utiliser les Traductions

### 1. Ajouter l'Attribut `data-i18n`

Pour rendre un élément traduisible, ajoutez l'attribut `data-i18n` avec la clé de traduction :

```html
<h1 data-i18n="home.title">La mie du coin</h1>
<p data-i18n="home.subtitle">Votre amie du coin...</p>
<button data-i18n="home.btnOrder">Commander</button>
```

### 2. Pour les Placeholders

Pour les champs de formulaire, utilisez `data-i18n` sur l'input :

```html
<input type="text" data-i18n="contact.placeholderName" placeholder="Jean Dupont">
```

### 3. Pour les Attributs Alt et Title

Pour traduire les attributs `alt` et `title` :

```html
<img data-i18n-alt="image.altText" alt="Description de l'image">
<button data-i18n-title="button.tooltip" title="Cliquez ici">Action</button>
```

---

## 📖 Structure des Clés de Traduction

Les clés de traduction suivent une structure hiérarchique :

```
section.element
```

### Exemples de Sections

#### Navigation (`nav`)
```javascript
nav.home          // Accueil / Home
nav.products      // Produits / Products
nav.orders        // Commandes / Orders
nav.history       // Notre Histoire / Our Story
nav.contact       // Contact / Contact
```

#### Page d'Accueil (`home`)
```javascript
home.title        // Titre principal
home.subtitle     // Sous-titre
home.feature1Title // Titre de la première caractéristique
home.btnOrder     // Bouton "Commander"
```

#### Page Produits (`products`)
```javascript
products.title
products.basicBreads
products.specialtyBreads
// etc.
```

#### Page Contact (`contact`)
```javascript
contact.title
contact.labelName
contact.placeholderEmail
// etc.
```

#### Footer (`footer`)
```javascript
footer.about
footer.quickLinks
footer.copyright
// etc.
```

---

## ➕ Ajouter une Nouvelle Traduction

### Étape 1 : Ajouter la clé dans `translations.js`

```javascript
const translations = {
    fr: {
        maSection: {
            monTexte: 'Texte en français'
        }
    },
    en: {
        maSection: {
            monTexte: 'Text in English'
        }
    }
};
```

### Étape 2 : Utiliser dans le HTML

```html
<p data-i18n="maSection.monTexte">Texte en français</p>
```

**Note :** Le texte dans le HTML sera automatiquement remplacé par la traduction.

---

## 🔄 Comment Fonctionne le Système

### Initialisation
1. Au chargement de la page, le script vérifie la langue dans `localStorage`
2. Si aucune langue n'est définie, le français (FR) est utilisé par défaut
3. L'attribut `lang` du HTML est mis à jour : `<html lang="fr">` ou `<html lang="en">`

### Changement de Langue
1. L'utilisateur clique sur FR ou EN
2. La nouvelle langue est sauvegardée dans `localStorage`
3. Tous les éléments avec `data-i18n` sont mis à jour automatiquement
4. Les boutons de langue sont mis à jour visuellement

### Persistance
- La langue choisie est mémorisée dans le navigateur
- Elle persiste entre les sessions
- Elle s'applique à toutes les pages du site

---

## 🎨 Personnalisation du Sélecteur

### CSS des Boutons de Langue

Les styles sont définis dans `css/styles.css` :

```css
.lang-btn {
    min-width: 45px;
    font-weight: 600;
    font-size: 0.875rem;
    /* ... */
}

.lang-btn.active {
    background-color: var(--primary-color) !important;
    color: white !important;
}
```

### Modifier l'Apparence

Pour changer l'apparence des boutons, modifiez la section `.lang-btn` dans `styles.css`.

---

## 📱 Responsive Design

Sur mobile (< 992px), les boutons de langue :
- Se centrent horizontalement
- Ajoutent une marge supérieure
- Restent côte à côte

```css
@media (max-width: 991px) {
    .language-switcher {
        margin-top: 1rem;
        justify-content: center;
    }
}
```

---

## 🌍 Ajouter une Nouvelle Langue (ex: Espagnol)

### 1. Ajouter au Dictionnaire

Dans `js/translations.js`, ajoutez une section `es` :

```javascript
const translations = {
    fr: { /* ... */ },
    en: { /* ... */ },
    es: {
        nav: {
            home: 'Inicio',
            products: 'Productos',
            // ...
        },
        // ...
    }
};
```

### 2. Ajouter le Bouton

Dans `navbar.html` et `index.html` :

```html
<button class="lang-btn btn btn-sm btn-outline-primary" data-lang="es" title="Español">ES</button>
```

### 3. Mettre à Jour le CSS (si nécessaire)

Ajuster les styles si plus de 2 boutons :

```css
.lang-btn {
    min-width: 40px; /* Réduire la largeur */
}
```

---

## ✅ Checklist de Traduction

Lorsque vous ajoutez une nouvelle page :

- [ ] Inclure `<script src="js/translations.js"></script>`
- [ ] Ajouter les boutons FR/EN dans la navbar
- [ ] Ajouter `data-i18n` sur tous les textes traduisibles
- [ ] Créer les clés de traduction dans `translations.js` (FR et EN)
- [ ] Tester le changement de langue
- [ ] Vérifier les placeholders de formulaires
- [ ] Vérifier la mise en page (texte plus long en anglais, etc.)

---

## 🐛 Dépannage

### La langue ne change pas
- Vérifiez que `translations.js` est bien inclus
- Vérifiez la console pour les erreurs JavaScript
- Assurez-vous que l'attribut `data-i18n` correspond à une clé existante

### Certains textes ne sont pas traduits
- Vérifiez que l'élément a l'attribut `data-i18n`
- Vérifiez que la clé existe dans les deux langues (FR et EN)
- Vérifiez l'orthographe de la clé

### Le bouton de langue n'est pas surligné
- Vérifiez que la classe `.active` est appliquée
- Vérifiez les styles CSS pour `.lang-btn.active`

---

## 📊 Statistique Actuelle

### Sections Traduites
- ✅ Navigation (5 liens)
- ✅ Page d'accueil complète
- ✅ Page produits (titres de sections)
- ✅ Page commandes
- ✅ Page histoire
- ✅ Page contact (formulaire + infos)
- ✅ Footer

### Clés de Traduction
- **Total :** ~80+ clés
- **Langues :** 2 (FR, EN)
- **Couverture :** 100% des pages principales

---

## 🔮 Prochaines Étapes

### À Faire
1. Traduire les noms de produits (optionnel)
2. Traduire les prix en format local ($ CAD vs $ USD)
3. Ajouter d'autres langues (ES, DE, etc.)
4. Détection automatique de la langue du navigateur
5. Bouton de détection "Auto"

### Améliorations Possibles
- Animation lors du changement de langue
- Indicateur de langue dans l'URL (ex: `/fr/`, `/en/`)
- Traduction des métadonnées (meta descriptions, titles)
- Support RTL (Right-to-Left) pour arabe, hébreu, etc.

---

## 📞 Support

Pour toute question sur le système de traduction, référez-vous à ce guide ou consultez :
- `js/translations.js` - Code source des traductions
- `css/styles.css` - Styles du sélecteur de langue

---

*Guide créé avec ❤️ pour La mie du coin - The Corner Crumb*
