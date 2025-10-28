/**
 * Gestion de l'affichage des produits pour les clients
 * Charge les produits depuis Supabase et les affiche de manière attractive
 */

import dbConnection from '../data/js/config/database.js';
import productService from '../data/js/services/productService.js';
import categoryService from '../data/js/categoryService.js';

// État global
let allProducts = [];
let allCategories = [];
let currentLanguage = localStorage.getItem('language') || 'fr';

// Mapping des catégories avec leurs sections HTML
const CATEGORY_SECTIONS = {
    'pains-base': 'pains-base',
    'pains-specialite': 'pains-specialises',
    'viennoiseries': 'viennoiseries',
    'pains-forme': 'pains-forme',
    'sans-gluten': 'sans-gluten',
    'pains-mediterraneens': 'pains-mediterraneens'
};

/**
 * Initialisation et chargement des produits
 */
async function loadProducts() {
    try {
        console.log('🔄 Chargement des produits depuis Supabase...');
        
        // Afficher l'indicateur de chargement
        showLoadingState(true);
        
        // Initialiser la connexion à la base de données
        await dbConnection.init();
        
        // Vérifier la connexion
        const isConnected = await dbConnection.checkConnection();
        if (!isConnected) {
            throw new Error('Impossible de se connecter à la base de données');
        }
        
        // Charger les catégories et les produits en parallèle
        // Filtrer uniquement les produits Active et Inactive
        [allCategories, allProducts] = await Promise.all([
            categoryService.getAllCategories(),
            productService.getAllProducts({ status: 'Active' })
        ]);
        
        // Ajouter les produits Inactive
        const inactiveProducts = await productService.getAllProducts({ status: 'Inactive' });
        allProducts = [...allProducts, ...inactiveProducts];
        
        console.log('✅ Produits chargés:', allProducts.length);
        console.log('✅ Catégories chargées:', allCategories.length);
        
        // Afficher les produits
        displayProducts();
        
        showLoadingState(false);
        
    } catch (error) {
        console.error('❌ Erreur lors du chargement des produits:', error);
        showError('Une erreur est survenue lors du chargement des produits. Veuillez réessayer plus tard.');
        showLoadingState(false);
    }
}

/**
 * Affiche tous les produits groupés par catégorie
 */
function displayProducts() {
    if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Aucun produit à afficher');
        showEmptyState();
        return;
    }

    console.log('🎨 Affichage des produits...');
    
    // Mettre à jour la langue courante
    currentLanguage = localStorage.getItem('language') || 'fr';
    
    // Filtrer uniquement les produits Active ou Inactive
    const filteredProducts = allProducts.filter(p => 
        p.status === 'Active' || p.status === 'Inactive'
    );
    
    console.log(`📊 Produits filtrés: ${filteredProducts.length} (Active/Inactive uniquement)`);
    
    // Grouper les produits par catégorie
    const productsByCategory = groupProductsByCategory(filteredProducts);
    
    // Récupérer le conteneur principal
    const mainContainer = document.getElementById('products-main');
    if (!mainContainer) {
        console.error('❌ Conteneur principal non trouvé');
        return;
    }
    
    // Vider les sections existantes (sauf le Call to Action)
    const sections = mainContainer.querySelectorAll('section:not(.text-center)');
    sections.forEach(section => section.remove());
    
    // Afficher chaque catégorie dynamiquement
    allCategories.forEach(category => {
        const categoryProducts = productsByCategory[category.id] || [];
        // Filtrer pour n'afficher que les produits Active et disponibles
        const availableProducts = categoryProducts.filter(p => p.status === 'Active' && p.available);
        
        if (availableProducts.length > 0) {
            createAndDisplayCategorySection(category, categoryProducts);
        }
    });
    
    console.log('✅ Affichage terminé');
}

/**
 * Groupe les produits par catégorie
 */
function groupProductsByCategory(products) {
    const grouped = {};
    
    products.forEach(product => {
        if (!grouped[product.categoryId]) {
            grouped[product.categoryId] = [];
        }
        grouped[product.categoryId].push(product);
    });
    
    return grouped;
}

/**
 * Crée et affiche une section de catégorie
 */
function createAndDisplayCategorySection(category, products) {
    // Créer la section
    const section = document.createElement('section');
    section.id = category.id;
    section.className = 'mb-5';
    
    // Créer le titre de la section
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title mb-4';
    
    const categoryName = currentLanguage === 'fr' ? category.NameFR : category.NameEN;
    const categoryDesc = currentLanguage === 'fr' ? category.DescriptionFR : category.DescriptionEN;
    
    sectionTitle.innerHTML = `
        <h2 class="display-6 fw-bold">${category.icon || '🍞'} ${categoryName}</h2>
        <p class="text-muted">${categoryDesc || ''}</p>
    `;
    
    section.appendChild(sectionTitle);
    
    // Créer le conteneur de produits
    const productsContainer = document.createElement('div');
    productsContainer.className = 'row g-4';
    
    // Filtrer pour afficher uniquement les produits Active et disponibles
    const displayProducts = products.filter(p => p.status === 'Active' && p.available);
    
    // Trier les produits : vedettes d'abord, puis par titre
    const sortedProducts = displayProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const titleA = (currentLanguage === 'fr' ? a.title_fr : a.title_en).toLowerCase();
        const titleB = (currentLanguage === 'fr' ? b.title_fr : b.title_en).toLowerCase();
        return titleA.localeCompare(titleB);
    });
    
    // Ajouter les cartes de produits
    sortedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
    
    section.appendChild(productsContainer);
    
    // Insérer la section avant le Call to Action
    const mainContainer = document.getElementById('products-main');
    const callToAction = mainContainer.querySelector('section.text-center');
    mainContainer.insertBefore(section, callToAction);
}

/**
 * Affiche une catégorie avec ses produits
 */
function displayCategory(category, products) {
    const sectionId = CATEGORY_SECTIONS[category.id];
    const section = document.getElementById(sectionId);
    
    if (!section) {
        console.warn(`Section ${sectionId} non trouvée pour la catégorie ${category.id}`);
        return;
    }
    
    // Si aucun produit disponible (Active), masquer la section
    const availableProducts = products.filter(p => p.status === 'Active' && p.available);
    if (!availableProducts || availableProducts.length === 0) {
        section.style.display = 'none';
        return;
    }
    
    section.style.display = 'block';
    
    // Mettre à jour le titre et la description
    const titleElement = section.querySelector('.section-title h2');
    const descriptionElement = section.querySelector('.section-title p');
    
    if (titleElement) {
        const categoryName = currentLanguage === 'fr' ? category.NameFR : category.NameEN;
        titleElement.innerHTML = `${category.icon || '🍞'} ${categoryName}`;
    }
    
    if (descriptionElement) {
        const categoryDesc = currentLanguage === 'fr' ? category.DescriptionFR : category.DescriptionEN;
        descriptionElement.textContent = categoryDesc || '';
    }
    
    // Obtenir ou créer le conteneur de produits
    let productsContainer = section.querySelector('.row.g-4');
    if (!productsContainer) {
        productsContainer = document.createElement('div');
        productsContainer.className = 'row g-4';
        section.appendChild(productsContainer);
    }
    
    // Vider le conteneur
    productsContainer.innerHTML = '';
    
    // Filtrer pour afficher uniquement les produits Active et disponibles
    const displayProducts = products.filter(p => p.status === 'Active' && p.available);
    
    // Trier les produits : vedettes d'abord, puis par titre
    const sortedProducts = displayProducts.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        const titleA = (currentLanguage === 'fr' ? a.title_fr : a.title_en).toLowerCase();
        const titleB = (currentLanguage === 'fr' ? b.title_fr : b.title_en).toLowerCase();
        return titleA.localeCompare(titleB);
    });
    
    // Ajouter les cartes de produits
    sortedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

/**
 * Crée une carte de produit
 */
function createProductCard(product) {
    const col = document.createElement('div');
    
    // Adapter la largeur selon la catégorie
    if (product.categoryId === 'pains-mediterraneens') {
        col.className = 'col-md-6';
    } else {
        col.className = 'col-md-6 col-lg-4';
    }
    
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Ajouter la classe featured si applicable
    if (product.featured) {
        card.classList.add('featured');
    }
    
    // Icône du produit
    const icon = document.createElement('div');
    icon.className = 'product-icon';
    icon.textContent = product.icon || '🍞';
    
    // Titre du produit
    const title = document.createElement('h4');
    const productTitle = currentLanguage === 'fr' ? product.title_fr : product.title_en;
    title.textContent = productTitle;
    
    // Badge vedette (si applicable)
    if (product.featured) {
        const featuredBadge = document.createElement('div');
        featuredBadge.className = 'product-featured-badge';
        featuredBadge.innerHTML = '⭐ ' + (currentLanguage === 'fr' ? 'Vedette' : 'Featured');
        card.appendChild(featuredBadge);
    }
    
    // Description du produit
    const description = document.createElement('p');
    const productDesc = currentLanguage === 'fr' ? product.description_fr : product.description_en;
    description.className = 'product-description';
    description.textContent = productDesc;
    
    // Prix du produit
    const priceDiv = document.createElement('div');
    priceDiv.className = 'product-price';
    
    let priceText = `${product.price.toFixed(2)} ${product.currency || 'CDN'}`;
    
    // Ajouter l'unité si nécessaire
    const unitTranslations = {
        'loaf': { fr: '', en: '' },
        'piece': { fr: '/ pièce', en: '/ piece' },
        'pack of 6': { fr: '/ paquet de 6', en: '/ pack of 6' },
        'bag': { fr: '/ sac', en: '/ bag' }
    };
    
    if (product.unit && unitTranslations[product.unit]) {
        const unitText = unitTranslations[product.unit][currentLanguage];
        if (unitText) {
            priceText += ` ${unitText}`;
        }
    }
    
    priceDiv.textContent = priceText;
    
    // Informations supplémentaires (poids, allergènes)
    const infoDiv = document.createElement('div');
    infoDiv.className = 'product-info mt-3';
    
    // Poids
    if (product.weight && product.weight > 0) {
        const weightSpan = document.createElement('small');
        weightSpan.className = 'text-muted d-block';
        weightSpan.innerHTML = `<i class="bi bi-box"></i> ${product.weight} ${product.weightUnit || 'g'}`;
        infoDiv.appendChild(weightSpan);
    }
    
    // Allergènes
    if (product.allergens && product.allergens.length > 0) {
        const allergensSpan = document.createElement('small');
        allergensSpan.className = 'text-warning d-block mt-1';
        const allergensList = product.allergens.join(', ');
        allergensSpan.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${currentLanguage === 'fr' ? 'Allergènes' : 'Allergens'}: ${allergensList}`;
        infoDiv.appendChild(allergensSpan);
    }
    
    // Bouton commander (optionnel)
    const orderButton = document.createElement('button');
    orderButton.className = 'btn btn-primary btn-sm mt-3 w-100';
    orderButton.innerHTML = '<i class="bi bi-cart-plus"></i> ' + (currentLanguage === 'fr' ? 'Commander' : 'Order');
    orderButton.onclick = () => addToOrder(product);
    
    // Assembler la carte
    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(priceDiv);
    card.appendChild(infoDiv);
    card.appendChild(orderButton);
    
    col.appendChild(card);
    return col;
}

/**
 * Ajoute un produit à la commande (à implémenter avec le système de panier)
 */
function addToOrder(product) {
    console.log('Ajout au panier:', product);
    // TODO: Intégrer avec le système de panier existant
    alert((currentLanguage === 'fr' ? 'Produit ajouté au panier!' : 'Product added to cart!'));
}

/**
 * Affiche un état de chargement
 */
function showLoadingState(show) {
    const sections = document.querySelectorAll('#products-main section');
    sections.forEach(section => {
        if (show) {
            const productsContainer = section.querySelector('.row.g-4');
            if (productsContainer) {
                productsContainer.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Chargement...</span>
                        </div>
                        <p class="mt-3 text-muted">${currentLanguage === 'fr' ? 'Chargement des produits...' : 'Loading products...'}</p>
                    </div>
                `;
            }
        }
    });
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    const main = document.getElementById('products-main');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger text-center my-5';
    errorDiv.innerHTML = `
        <i class="bi bi-exclamation-circle fs-1 d-block mb-3"></i>
        <h4>${currentLanguage === 'fr' ? 'Erreur' : 'Error'}</h4>
        <p>${message}</p>
        <button class="btn btn-primary mt-3" onclick="location.reload()">
            ${currentLanguage === 'fr' ? 'Réessayer' : 'Try Again'}
        </button>
    `;
    main.prepend(errorDiv);
}

/**
 * Affiche un état vide
 */
function showEmptyState() {
    const main = document.getElementById('products-main');
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'alert alert-info text-center my-5';
    emptyDiv.innerHTML = `
        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
        <h4>${currentLanguage === 'fr' ? 'Aucun produit disponible' : 'No products available'}</h4>
        <p>${currentLanguage === 'fr' ? 'Revenez bientôt pour découvrir nos nouveautés!' : 'Come back soon to discover our new products!'}</p>
    `;
    main.prepend(emptyDiv);
}

/**
 * Met à jour l'affichage lors d'un changement de langue
 */
function updateProductsLanguage() {
    const newLanguage = localStorage.getItem('language') || 'fr';
    if (newLanguage !== currentLanguage) {
        currentLanguage = newLanguage;
        displayProducts();
    }
}

// Écouter les changements de langue
window.addEventListener('languageChanged', updateProductsLanguage);

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

// Exposer pour rafraîchissement manuel
window.refreshProducts = loadProducts;
