/**
 * Gestion de l'affichage des produits pour les clients
 * Affiche les produits par catégorie avec possibilité de replier/déplier
 */

import dbConnection from '../data/js/config/database.js';
import productService from '../data/js/services/productService.js';
import categoryService from '../data/js/services/categoryService.js';

// État global
let allProducts = [];
let allCategories = [];
let collapsedCategories = new Set();

/**
 * Initialisation de la page
 */
async function init() {
    try {
        console.log('🔄 Initialisation de la page produits...');
        
        // Initialiser la connexion à la base de données
        await dbConnection.init();
        
        // Vérifier la connexion
        const isConnected = await dbConnection.checkConnection();
        if (!isConnected) {
            showError('Impossible de se connecter à la base de données. Veuillez réessayer plus tard.');
            return;
        }

        // Afficher le loader
        showLoading(true);
        
        // Charger les catégories et produits
        await Promise.all([
            loadCategories(),
            loadProducts()
        ]);
        
        // Afficher les produits
        displayProductsByCategory();
        
        // Écouter les changements de langue
        window.addEventListener('languageChanged', () => {
            console.log('🌐 Changement de langue détecté - Rafraîchissement de l\'affichage');
            displayProductsByCategory();
        });
        
        showLoading(false);
        console.log('✅ Page produits initialisée avec succès');
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Une erreur est survenue lors du chargement des produits.');
        showLoading(false);
    }
}

/**
 * Charge toutes les catégories
 */
async function loadCategories() {
    try {
        allCategories = await categoryService.getAllCategories();
        console.log(`📂 ${allCategories.length} catégories chargées`);
    } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
        // Catégories par défaut en cas d'erreur
        allCategories = [
            { id: 'pains-base', NameFR: 'Pains de base', NameEN: 'Basic Breads', icon: '🍞' },
            { id: 'pains-specialite', NameFR: 'Pains spécialisés', NameEN: 'Specialty Breads', icon: '🥖' },
            { id: 'viennoiseries', NameFR: 'Viennoiseries', NameEN: 'Pastries', icon: '🥐' },
            { id: 'sans-gluten', NameFR: 'Sans gluten', NameEN: 'Gluten-Free', icon: '🌾' }
        ];
    }
}

/**
 * Charge tous les produits disponibles
 */
async function loadProducts() {
    try {
        // Charger uniquement les produits disponibles et actifs
        allProducts = await productService.getAllProducts({
            available: true,
            status: 'Active'
        });
        console.log(`🍞 ${allProducts.length} produits chargés`);
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        allProducts = [];
        throw error;
    }
}

/**
 * Affiche les produits organisés par catégorie
 */
function displayProductsByCategory() {
    const container = document.getElementById('products-main');
    
    if (!allProducts || allProducts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-basket display-1 text-muted"></i>
                <h3 class="mt-4" data-i18n="products.noProducts">Aucun produit disponible pour le moment</h3>
                <p class="text-muted" data-i18n="products.checkBackSoon">Revenez bientôt pour découvrir nos nouveautés!</p>
            </div>
        `;
        return;
    }
    
    // Grouper les produits par catégorie
    const productsByCategory = {};
    allProducts.forEach(product => {
        if (!productsByCategory[product.categoryId]) {
            productsByCategory[product.categoryId] = [];
        }
        productsByCategory[product.categoryId].push(product);
    });
    
    // Générer le HTML pour chaque catégorie
    let html = '<div class="products-container">';
    
    allCategories.forEach(category => {
        const categoryProducts = productsByCategory[category.id];
        
        // Ignorer les catégories sans produits
        if (!categoryProducts || categoryProducts.length === 0) {
            return;
        }
        
        const isCollapsed = collapsedCategories.has(category.id);
        const categoryName = getCurrentLanguage() === 'fr' ? category.NameFR : category.NameEN;
        
        html += `
            <div class="category-section mb-5" data-category="${category.id}">
                <div class="category-header" onclick="toggleCategory('${category.id}')">
                    <h2 class="category-title">
                        <span class="category-icon">${category.icon || '📦'}</span>
                        <span class="category-name">${categoryName}</span>
                        <span class="product-count badge bg-primary ms-2">${categoryProducts.length}</span>
                    </h2>
                    <button class="toggle-btn" aria-label="Toggle category">
                        <i class="bi bi-chevron-${isCollapsed ? 'down' : 'up'}"></i>
                    </button>
                </div>
                <div class="category-products ${isCollapsed ? 'collapsed' : ''}">
                    <div class="row g-4">
                        ${categoryProducts.map(product => createProductCard(product)).join('')}
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Ajouter le CTA à la fin
    html += `
        <section class="text-center my-5 p-5 bg-light rounded cta-section">
            <h3 class="fw-bold mb-3" data-i18n="products.readyToOrder">Prêt à commander?</h3>
            <p class="lead mb-4" data-i18n="products.orderNow">Passez votre commande dès maintenant et venez la chercher fraîche!</p>
            <a href="commandes.html" class="btn btn-primary btn-lg px-5 py-3">
                <i class="bi bi-cart-check"></i> <span data-i18n="products.orderButton">Passer une commande</span>
            </a>
        </section>
    `;
    
    container.innerHTML = html;
}

/**
 * Crée une carte produit
 */
function createProductCard(product) {
    const currentLang = getCurrentLanguage();
    const title = currentLang === 'fr' ? product.title_fr : product.title_en;
    const description = currentLang === 'fr' ? product.description_fr : product.description_en;
    const price = product.price.toFixed(2);
    const weight = product.weight ? `${product.weight}${product.weightUnit}` : '';
    
    // Badge pour les produits en vedette
    const featuredText = currentLang === 'fr' ? 'Vedette' : 'Featured';
    const featuredBadge = product.featured ? 
        `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
            <i class="bi bi-star-fill"></i> ${featuredText}
        </span>` : '';
    
    // Indicateur de disponibilité en inventaire
    const availableText = currentLang === 'fr' ? 'Disponible' : 'Available';
    const onOrderText = currentLang === 'fr' ? 'Sur commande' : 'On order';
    
    const stockIndicator = product.inventoryQuantity > 0 ? 
        `<span class="stock-indicator text-success">
            <i class="bi bi-check-circle-fill"></i> ${availableText}
        </span>` : 
        `<span class="stock-indicator text-warning">
            <i class="bi bi-clock-fill"></i> ${onOrderText}
        </span>`;
    
    // Construire le chemin de l'image
    let imageSrc = '';
    if (product.image) {
        // Convertir le chemin de la BD en chemin relatif pour la page
        imageSrc = product.image.startsWith('/') ? '..' + product.image : product.image;
    }
    
    return `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div class="product-card h-100">
                ${featuredBadge}
                <div class="product-image">
                    ${product.image ? 
                        `<img src="${imageSrc}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                         <div class="product-icon-large" style="display: none;">${product.icon}</div>` :
                        `<div class="product-icon-large">${product.icon}</div>`
                    }
                </div>
                <div class="product-body">
                    <h3 class="product-title">${product.icon} ${title}</h3>
                    ${description ? `<p class="product-description">${description}</p>` : ''}
                    
                    <div class="product-details">
                        ${weight ? `
                            <div class="product-weight">
                                <i class="bi bi-basket"></i> ${weight}
                            </div>
                        ` : ''}
                        
                        ${product.allergens && product.allergens.length > 0 ? `
                            <div class="product-allergens">
                                <i class="bi bi-exclamation-triangle"></i> 
                                <small>${currentLang === 'fr' ? 'Allergènes' : 'Allergens'}: ${product.allergens.join(', ')}</small>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="product-footer">
                        <div class="product-price">
                            <span class="price">${price}</span>
                            <span class="currency">${product.currency === 'CDN' ? '$' : product.currency}</span>
                        </div>
                        ${stockIndicator}
                    </div>
                    
                    <button class="btn btn-primary w-100 mt-3" onclick="addToCart('${product.code}')">
                        <i class="bi bi-cart-plus"></i> ${currentLang === 'fr' ? 'Ajouter au panier' : 'Add to cart'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Toggle l'affichage d'une catégorie
 */
function toggleCategory(categoryId) {
    const categorySection = document.querySelector(`[data-category="${categoryId}"]`);
    const productsContainer = categorySection.querySelector('.category-products');
    const toggleIcon = categorySection.querySelector('.toggle-btn i');
    
    if (collapsedCategories.has(categoryId)) {
        collapsedCategories.delete(categoryId);
        productsContainer.classList.remove('collapsed');
        toggleIcon.className = 'bi bi-chevron-up';
    } else {
        collapsedCategories.add(categoryId);
        productsContainer.classList.add('collapsed');
        toggleIcon.className = 'bi bi-chevron-down';
    }
}

/**
 * Ajoute un produit au panier
 */
function addToCart(productCode) {
    // Cette fonction sera implémentée avec le système de panier existant
    console.log('Ajout au panier:', productCode);
    
    // Afficher une confirmation
    showNotification('✅ Produit ajouté au panier!');
    
    // TODO: Intégrer avec le système de panier existant (cart.js)
}

/**
 * Obtient la langue courante
 */
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'fr';
}

/**
 * Affiche/masque le loader
 */
function showLoading(show) {
    const loader = document.getElementById('loading-spinner');
    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
    } else if (show) {
        // Créer le loader s'il n'existe pas
        const loaderHtml = `
            <div id="loading-spinner" style="display: flex; justify-content: center; align-items: center; min-height: 400px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                </div>
            </div>
        `;
        document.getElementById('products-main').innerHTML = loaderHtml;
    }
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    const container = document.getElementById('products-main');
    container.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> ${message}
        </div>
    `;
}

/**
 * Affiche une notification temporaire
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'toast-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Exposer les fonctions globalement
window.toggleCategory = toggleCategory;
window.addToCart = addToCart;

// Initialiser au chargement de la page
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
