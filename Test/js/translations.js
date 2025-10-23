// Fichier de traductions - La mie du coin
// Support FR (Français) et EN (English)

const translations = {
    fr: {
        // Navigation
        nav: {
            home: 'Accueil',
            products: 'Produits',
            orders: 'Commandes',
            history: 'Notre Histoire',
            contact: 'Contact'
        },
        
        // Page d'accueil
        home: {
            title: 'La mie du coin',
            subtitle: 'Votre amie du coin pour du pain artisanal fraîchement préparé',
            tagline: "L'art de la boulangerie traditionnelle, le goût de l'authenticité",
            btnProducts: 'Nos Produits',
            btnOrder: 'Commander',
            
            // Features
            feature1Title: 'Artisanal',
            feature1Desc: 'Pains faits à la main avec des ingrédients de qualité supérieure',
            feature2Title: 'Frais du jour',
            feature2Desc: 'Produits fraîchement préparés chaque matin selon les traditions',
            feature3Title: 'Passion',
            feature3Desc: 'Un savoir-faire transmis avec amour et dévouement',
            
            // Catégories
            specialtiesTitle: 'Nos Spécialités',
            specialtiesSubtitle: 'Découvrez notre sélection de pains artisanaux',
            
            category1Title: 'Pains de Base',
            category1Desc: 'Pains blancs, baguettes, pains de campagne',
            category2Title: 'Pains Spécialisés',
            category2Desc: 'Pains aux noix, au fromage, et plus',
            category3Title: 'Viennoiseries',
            category3Desc: 'Croissants, brioches, pains au chocolat',
            category4Title: 'Pains en Forme',
            category4Desc: 'Bagels, bretzels, et autres formes',
            
            btnDiscover: 'Découvrir',
            
            // CTA
            ctaTitle: 'Commandez dès aujourd\'hui!',
            ctaSubtitle: 'Passez votre commande en ligne et venez la chercher fraîche',
            btnOrderNow: 'Commander maintenant'
        },
        
        // Page Produits
        products: {
            title: 'Nos Produits',
            subtitle: 'Découvrez notre gamme complète de pains artisanaux',
            
            // Catégories
            basicBreads: 'Pains de Base',
            specialtyBreads: 'Pains Spécialisés',
            pastries: 'Viennoiseries',
            shapedBreads: 'Pains en Forme',
            glutenFree: 'Options Sans Gluten',
            mediterranean: 'Spécialités Méditerranéennes',
            
            // CTA
            ctaTitle: 'Prêt à commander?',
            ctaSubtitle: 'Passez votre commande dès maintenant',
            btnOrder: 'Commander'
        },
        
        // Page Commandes
        orders: {
            title: 'Commandes',
            subtitle: 'Faites votre sélection et ajoutez au panier',
            availableProducts: 'Nos Produits Disponibles',
            availableProductsDesc: 'Sélectionnez vos produits préférés et ajoutez-les à votre panier. Tous nos produits sont préparés frais chaque jour avec des ingrédients de qualité.',
            myCart: 'Mon Panier',
            emptyCart: 'Votre panier est vide',
            emptyCartDesc: 'Commencez à ajouter des produits!',
            clearCart: 'Vider le panier',
            clearCartConfirm: 'Voulez-vous vraiment vider le panier?',
            total: 'Total',
            noTaxes: 'Pas de taxes!',
            noTaxesDesc: 'Les produits de boulangerie sont exempts de taxes au Québec.',
            infoTitle: 'Informations',
            minOrder: 'Commande minimum: 10.00 $',
            freePickup: 'Ramassage en magasin gratuit',
            freshDaily: 'Produits frais du jour',
            securePayment: 'Paiement sécurisé',
            checkout: 'Passer la commande',
            addToCart: 'Ajouter au panier',
            quantity: 'Quantité',
            
            // Checkout form
            checkoutTitle: 'Finaliser votre commande',
            checkoutSubtitle: 'Vérifiez votre commande et complétez vos informations',
            orderSummary: 'Résumé de la commande',
            customerInfo: 'Vos informations',
            lastName: 'Nom',
            firstName: 'Prénom',
            email: 'Courriel',
            phone: 'Téléphone',
            orderNote: 'Note (optionnel)',
            deliveryDate: 'Date de livraison souhaitée',
            required: 'Obligatoire',
            btnContinueShopping: 'Continuer mes achats',
            btnPlaceOrder: 'Passer la commande',
            orderSuccess: 'Commande réussie!',
            orderSuccessMessage: 'Votre commande a été créée avec succès.',
            orderNumber: 'Numéro de commande',
            trackOrder: 'Suivre ma commande',
            backToHome: 'Retour à l\'accueil',
            fieldRequired: 'Ce champ est obligatoire',
            invalidEmail: 'Adresse courriel invalide',
            invalidPhone: 'Numéro de téléphone invalide',
            devWarning: 'Système en développement',
            devWarningDesc: 'Le système de paiement en ligne est actuellement en développement. Pour passer commande dès maintenant, veuillez nous contacter directement au',
            or: 'ou par courriel à',
            comingSoon: 'Système de commande en ligne',
            comingSoonDesc: 'Notre système de commande en ligne est en cours de développement. En attendant, vous pouvez nous contacter directement pour passer commande.',
            contactUs: 'Contactez-nous pour commander',
            phone: 'Téléphone',
            email: 'Courriel',
            btnContact: 'Page Contact'
        },
        
        // Page Histoire
        history: {
            title: 'Notre Histoire',
            comingSoon: 'Notre histoire arrive bientôt',
            comingSoonDesc: 'Cette page est en cours de rédaction. Revenez bientôt pour découvrir l\'histoire de La mie du coin!',
            preview: 'Aperçu',
            previewDesc: 'Depuis nos débuts, nous nous consacrons à l\'art de la boulangerie artisanale, en perpétuant les traditions tout en innovant pour offrir à nos clients les meilleurs produits.',
            btnProducts: 'Voir nos produits'
        },
        
        // Page Contact
        contact: {
            title: 'Contactez-nous',
            subtitle: 'Nous serions ravis de vous entendre',
            formTitle: 'Envoyez-nous un message',
            
            // Formulaire
            labelName: 'Nom complet',
            placeholderName: 'Jean Dupont',
            labelEmail: 'Adresse courriel',
            placeholderEmail: 'jean.dupont@example.com',
            labelSubject: 'Sujet',
            placeholderSubject: 'Votre sujet',
            labelMessage: 'Message',
            placeholderMessage: 'Écrivez votre message ici...',
            btnSend: 'Envoyer le message',
            
            // Informations
            infoTitle: 'Informations de Contact',
            address: 'Adresse',
            phone: 'Téléphone',
            email: 'Courriel',
            hours: 'Heures d\'ouverture',
            weekdays: 'Lun - Ven',
            weekend: 'Sam - Dim',
            followUs: 'Suivez-nous'
        },
        
        // Footer
        footer: {
            about: 'À propos',
            aboutDesc: 'Boulangerie artisanale offrant des pains frais et délicieux préparés avec passion.',
            quickLinks: 'Liens Rapides',
            contactInfo: 'Coordonnées',
            address: '123 Rue du Coin, Montréal, QC H1A 1A1',
            hours: 'Heures d\'ouverture',
            weekdays: 'Lun - Ven: 7h00 - 19h00',
            weekend: 'Sam - Dim: 8h00 - 17h00',
            followUs: 'Suivez-nous',
            copyright: '© 2025 La mie du coin. Tous droits réservés.',
            madeWith: 'Fait avec',
            and: 'et',
            forBread: 'passion pour le pain artisanal'
        },
        
        // Order Tracking
        tracking: {
            loading: 'Chargement de votre commande...',
            notFoundTitle: 'Commande introuvable',
            notFoundMessage: 'Désolé, nous n\'avons pas trouvé de commande correspondant à ce numéro.',
            notFoundHelp: 'Veuillez vérifier le lien que vous avez reçu par courriel ou contactez-nous pour obtenir de l\'aide.',
            btnHome: 'Retour à l\'accueil',
            btnContact: 'Nous contacter',
            orderTitle: 'Commande',
            orderDate: 'Commandé le',
            statusTitle: 'Statut de votre commande',
            statusReceived: 'Commande reçue',
            statusReceivedDesc: 'Votre commande a été enregistrée',
            statusPlanned: 'Planifiée',
            statusPlannedDesc: 'Production prévue le',
            statusProduction: 'En production',
            statusProductionDesc: 'Votre commande est en cours de préparation',
            statusReady: 'Prête pour récupération',
            statusReadyDesc: 'Votre commande vous attend',
            statusDone: 'Récupérée',
            statusDoneDesc: 'Merci de votre confiance!',
            productionMessage: 'Votre commande est actuellement en production. Nos artisans boulangers travaillent avec soin sur vos produits.',
            totalItems: 'Articles au total',
            completedItems: 'Complétés',
            inProgressItems: 'En cours',
            pendingItems: 'En attente',
            overallProgress: 'Progression globale',
            completed: 'complété',
            cancelledMessage: 'Cette commande a été annulée. Si vous avez des questions, n\'hésitez pas à nous contacter.',
            deliveryDate: 'Date de livraison prévue',
            orderDetailsTitle: 'Détails de la commande',
            noteTitle: 'Note',
            summaryTitle: 'Résumé',
            subtotal: 'Sous-total',
            deposit: 'Dépôt',
            total: 'Total',
            paymentPaid: 'Payé',
            paymentUnpaid: 'Non payé',
            contactInfoTitle: 'Vos informations',
            commentsTitle: 'Laisser un commentaire',
            commentsDesc: 'Vous avez une question ou une demande spéciale concernant votre commande? Faites-le nous savoir!',
            commentPlaceholder: 'Votre message...',
            btnSendComment: 'Envoyer le commentaire',
            commentSuccess: 'Merci pour votre message! Nous vous répondrons dans les plus brefs délais.',
            btnPrint: 'Imprimer'
        }
    },
    
    en: {
        // Navigation
        nav: {
            home: 'Home',
            products: 'Products',
            orders: 'Orders',
            history: 'Our Story',
            contact: 'Contact'
        },
        
        // Homepage
        home: {
            title: 'The Corner Crumb',
            subtitle: 'Your friendly neighborhood artisan bread bakery',
            tagline: 'The art of traditional baking, the taste of authenticity',
            btnProducts: 'Our Products',
            btnOrder: 'Order',
            
            // Features
            feature1Title: 'Artisanal',
            feature1Desc: 'Hand-crafted breads with premium quality ingredients',
            feature2Title: 'Fresh Daily',
            feature2Desc: 'Products freshly prepared every morning following traditions',
            feature3Title: 'Passion',
            feature3Desc: 'Expertise passed down with love and dedication',
            
            // Categories
            specialtiesTitle: 'Our Specialties',
            specialtiesSubtitle: 'Discover our selection of artisan breads',
            
            category1Title: 'Basic Breads',
            category1Desc: 'White breads, baguettes, country loaves',
            category2Title: 'Specialty Breads',
            category2Desc: 'Nut breads, cheese breads, and more',
            category3Title: 'Pastries',
            category3Desc: 'Croissants, brioches, chocolate pastries',
            category4Title: 'Shaped Breads',
            category4Desc: 'Bagels, pretzels, and other shapes',
            
            btnDiscover: 'Discover',
            
            // CTA
            ctaTitle: 'Order today!',
            ctaSubtitle: 'Place your order online and pick it up fresh',
            btnOrderNow: 'Order now'
        },
        
        // Products Page
        products: {
            title: 'Our Products',
            subtitle: 'Discover our complete range of artisan breads',
            
            // Categories
            basicBreads: 'Basic Breads',
            specialtyBreads: 'Specialty Breads',
            pastries: 'Pastries',
            shapedBreads: 'Shaped Breads',
            glutenFree: 'Gluten-Free Options',
            mediterranean: 'Mediterranean Specialties',
            
            // CTA
            ctaTitle: 'Ready to order?',
            ctaSubtitle: 'Place your order now',
            btnOrder: 'Order'
        },
        
        // Orders Page
        orders: {
            title: 'Orders',
            subtitle: 'Make your selection and add to cart',
            availableProducts: 'Our Available Products',
            availableProductsDesc: 'Select your favorite products and add them to your cart. All our products are prepared fresh daily with quality ingredients.',
            myCart: 'My Cart',
            emptyCart: 'Your cart is empty',
            emptyCartDesc: 'Start adding products!',
            clearCart: 'Clear cart',
            clearCartConfirm: 'Do you really want to empty the cart?',
            total: 'Total',
            noTaxes: 'No taxes!',
            noTaxesDesc: 'Bakery products are tax-exempt in Quebec.',
            infoTitle: 'Information',
            minOrder: 'Minimum order: $10.00',
            freePickup: 'Free in-store pickup',
            freshDaily: 'Fresh daily products',
            securePayment: 'Secure payment',
            checkout: 'Place order',
            addToCart: 'Add to cart',
            quantity: 'Quantity',
            
            // Checkout form
            checkoutTitle: 'Complete your order',
            checkoutSubtitle: 'Review your order and complete your information',
            orderSummary: 'Order summary',
            customerInfo: 'Your information',
            lastName: 'Last name',
            firstName: 'First name',
            email: 'Email',
            phone: 'Phone',
            orderNote: 'Note (optional)',
            deliveryDate: 'Desired delivery date',
            required: 'Required',
            btnContinueShopping: 'Continue shopping',
            btnPlaceOrder: 'Place order',
            orderSuccess: 'Order successful!',
            orderSuccessMessage: 'Your order has been created successfully.',
            orderNumber: 'Order number',
            trackOrder: 'Track my order',
            backToHome: 'Back to home',
            fieldRequired: 'This field is required',
            invalidEmail: 'Invalid email address',
            invalidPhone: 'Invalid phone number',
            devWarning: 'System in development',
            devWarningDesc: 'The online payment system is currently under development. To place an order now, please contact us directly at',
            or: 'or by email at',
            comingSoon: 'Online Ordering System',
            comingSoonDesc: 'Our online ordering system is currently under development. In the meantime, you can contact us directly to place an order.',
            contactUs: 'Contact us to order',
            phone: 'Phone',
            email: 'Email',
            btnContact: 'Contact Page'
        },
        
        // History Page
        history: {
            title: 'Our Story',
            comingSoon: 'Our story coming soon',
            comingSoonDesc: 'This page is currently being written. Come back soon to discover the story of The Corner Crumb!',
            preview: 'Preview',
            previewDesc: 'Since our beginnings, we have dedicated ourselves to the art of artisan baking, perpetuating traditions while innovating to offer our customers the best products.',
            btnProducts: 'View our products'
        },
        
        // Contact Page
        contact: {
            title: 'Contact Us',
            subtitle: 'We would love to hear from you',
            formTitle: 'Send us a message',
            
            // Form
            labelName: 'Full Name',
            placeholderName: 'John Doe',
            labelEmail: 'Email Address',
            placeholderEmail: 'john.doe@example.com',
            labelSubject: 'Subject',
            placeholderSubject: 'Your subject',
            labelMessage: 'Message',
            placeholderMessage: 'Write your message here...',
            btnSend: 'Send Message',
            
            // Information
            infoTitle: 'Contact Information',
            address: 'Address',
            phone: 'Phone',
            email: 'Email',
            hours: 'Opening Hours',
            weekdays: 'Mon - Fri',
            weekend: 'Sat - Sun',
            followUs: 'Follow Us'
        },
        
        // Footer
        footer: {
            about: 'About',
            aboutDesc: 'Artisan bakery offering fresh and delicious breads prepared with passion.',
            quickLinks: 'Quick Links',
            contactInfo: 'Contact Info',
            address: '123 Corner Street, Montreal, QC H1A 1A1',
            hours: 'Opening Hours',
            weekdays: 'Mon - Fri: 7:00 AM - 7:00 PM',
            weekend: 'Sat - Sun: 8:00 AM - 5:00 PM',
            followUs: 'Follow Us',
            copyright: '© 2025 The Corner Crumb. All rights reserved.',
            madeWith: 'Made with',
            and: 'and',
            forBread: 'passion for artisan bread'
        },
        
        // Order Tracking
        tracking: {
            loading: 'Loading your order...',
            notFoundTitle: 'Order not found',
            notFoundMessage: 'Sorry, we couldn\'t find an order matching this number.',
            notFoundHelp: 'Please check the link you received by email or contact us for assistance.',
            btnHome: 'Back to home',
            btnContact: 'Contact us',
            orderTitle: 'Order',
            orderDate: 'Ordered on',
            statusTitle: 'Your order status',
            statusReceived: 'Order received',
            statusReceivedDesc: 'Your order has been registered',
            statusPlanned: 'Planned',
            statusPlannedDesc: 'Production scheduled for',
            statusProduction: 'In production',
            statusProductionDesc: 'Your order is being prepared',
            statusReady: 'Ready for pickup',
            statusReadyDesc: 'Your order is waiting for you',
            statusDone: 'Picked up',
            statusDoneDesc: 'Thank you for your trust!',
            productionMessage: 'Your order is currently in production. Our artisan bakers are carefully working on your products.',
            totalItems: 'Total items',
            completedItems: 'Completed',
            inProgressItems: 'In progress',
            pendingItems: 'Pending',
            overallProgress: 'Overall progress',
            completed: 'completed',
            cancelledMessage: 'This order has been cancelled. If you have any questions, please don\'t hesitate to contact us.',
            deliveryDate: 'Expected delivery date',
            orderDetailsTitle: 'Order details',
            noteTitle: 'Note',
            summaryTitle: 'Summary',
            subtotal: 'Subtotal',
            deposit: 'Deposit',
            total: 'Total',
            paymentPaid: 'Paid',
            paymentUnpaid: 'Unpaid',
            contactInfoTitle: 'Your information',
            commentsTitle: 'Leave a comment',
            commentsDesc: 'Do you have a question or special request about your order? Let us know!',
            commentPlaceholder: 'Your message...',
            btnSendComment: 'Send comment',
            commentSuccess: 'Thank you for your message! We will respond as soon as possible.',
            btnPrint: 'Print'
        }
    }
};

// Fonction pour obtenir la langue courante
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'fr';
}

// Fonction pour définir la langue
function setLanguage(lang) {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updatePageContent();
    
    // Déclencher un événement personnalisé pour notifier le changement de langue
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
}

// Fonction pour obtenir une traduction
function t(key) {
    const lang = getCurrentLanguage();
    const keys = key.split('.');
    let value = translations[lang];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    return value || key;
}

// Fonction pour mettre à jour le contenu de la page
function updatePageContent() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            element.placeholder = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Mettre à jour les attributs alt et title
    const altElements = document.querySelectorAll('[data-i18n-alt]');
    altElements.forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        element.alt = t(key);
    });
    
    const titleElements = document.querySelectorAll('[data-i18n-title]');
    titleElements.forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        element.title = t(key);
    });
    
    // Mettre à jour les boutons de langue
    updateLanguageButtons();
}

// Fonction pour mettre à jour l'apparence des boutons de langue
function updateLanguageButtons() {
    const currentLang = getCurrentLanguage();
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Définir la langue initiale
    const currentLang = getCurrentLanguage();
    document.documentElement.lang = currentLang;
    
    // Mettre à jour le contenu
    updatePageContent();
    
    // Ajouter les écouteurs d'événements aux boutons de langue
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
        });
    });
});
