/**
 * Affichage des produits pour la page de commandes
 * Version simplifiée avec quantité et ajout au panier
 */

(function() {
    'use strict';

    let currentLanguage = 'fr';

    /**
     * Initialisation
     */
    async function init() {
        // Récupérer la langue
        currentLanguage = localStorage.getItem('language') || 'fr';
        
        // Charger les produits
        await loadAndDisplayProducts();
        
        // Écouter les changements de langue
        window.addEventListener('languageChanged', (e) => {
            currentLanguage = e.detail.language;
            loadAndDisplayProducts();
        });
    }

    /**
     * Charger et afficher les produits
     */
    async function loadAndDisplayProducts() {
        const container = document.getElementById('products-list');
        if (!container) return;

        try {
            // Charger les produits depuis le JSON
            const response = await fetch('../data/products.json');
            if (!response.ok) throw new Error('Erreur de chargement des produits');
            
            const data = await response.json();
            const products = data.products.filter(p => p.available && p.productType === 'retail');

            // Grouper par catégories
            const categories = {};
            products.forEach(product => {
                if (!categories[product.category]) {
                    categories[product.category] = [];
                }
                categories[product.category].push(product);
            });

            // Ordre des catégories
            const categoryOrder = [
                'pains-base',
                'pains-specialises',
                'viennoiseries',
                'pains-forme',
                'sans-gluten',
                'pains-mediterraneens'
            ];

            // Générer le HTML
            let html = '';
            
            categoryOrder.forEach(categoryId => {
                const categoryProducts = categories[categoryId];
                if (!categoryProducts || categoryProducts.length === 0) return;

                // Trier par titre
                categoryProducts.sort((a, b) => 
                    a.title[currentLanguage].localeCompare(b.title[currentLanguage])
                );

                const categoryName = getCategoryName(categoryId);
                const uniqueId = `collapse-${categoryId}`;

                html += `
                    <div class="category-section mb-4">
                        <h3 class="category-title mb-3" onclick="toggleCategory('${uniqueId}', this)">
                            <span>
                                <span class="category-icon">${categoryProducts[0].icon}</span>
                                ${categoryName}
                            </span>
                            <span class="category-toggle">
                                <i class="bi bi-chevron-down"></i>
                            </span>
                        </h3>
                        <div class="category-products show" id="${uniqueId}">
                            <div class="row g-3">
                                ${categoryProducts.map(product => createProductCard(product)).join('')}
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html;

        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> 
                    ${currentLanguage === 'fr' ? 'Erreur lors du chargement des produits' : 'Error loading products'}
                </div>
            `;
        }
    }

    /**
     * Créer une carte produit simplifiée pour les commandes
     */
    function createProductCard(product) {
        const featuredBadge = product.featured ? 
            `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                ⭐ ${currentLanguage === 'fr' ? 'Populaire' : 'Popular'}
            </span>` : '';

        return `
            <div class="col-md-6">
                <div class="card product-card-compact h-100 border shadow-sm">
                    ${featuredBadge}
                    <div class="card-body p-3">
                        <div class="row g-2 align-items-center">
                            <!-- Icône et info -->
                            <div class="col-8">
                                <div class="d-flex align-items-start gap-2">
                                    <div class="product-icon-small">${product.icon}</div>
                                    <div>
                                        <h5 class="card-title mb-1 fs-6 fw-bold">${product.title[currentLanguage]}</h5>
                                        <p class="card-text text-muted small mb-2">${product.description[currentLanguage]}</p>
                                        <div class="text-muted small">
                                            <i class="bi bi-box"></i> ${product.weight}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Prix -->
                            <div class="col-4 text-end">
                                <div class="product-price-compact fw-bold text-success mb-1">
                                    ${product.price.toFixed(2)} $
                                </div>
                                <small class="text-muted">/ ${getUnitTranslation(product.unit)}</small>
                            </div>
                        </div>
                        
                        <!-- Quantité et bouton ajout -->
                        <div class="row g-2 mt-2 align-items-center">
                            <div class="col-5">
                                <div class="input-group input-group-sm">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="decrementQuantity('${product.id}')" title="${currentLanguage === 'fr' ? 'Diminuer' : 'Decrease'}">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <input type="number" class="form-control text-center" 
                                           id="qty-${product.id}" value="1" min="1" max="99" 
                                           aria-label="${currentLanguage === 'fr' ? 'Quantité' : 'Quantity'}">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="incrementQuantity('${product.id}')" title="${currentLanguage === 'fr' ? 'Augmenter' : 'Increase'}">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-7">
                                <button class="btn btn-primary btn-sm w-100" onclick="addToCart('${product.id}')">
                                    <i class="bi bi-cart-plus"></i> ${currentLanguage === 'fr' ? 'Ajouter' : 'Add'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Obtenir le nom de catégorie traduit
     */
    function getCategoryName(categoryId) {
        const categoryNames = {
            'fr': {
                'pains-base': 'Pains de Base',
                'pains-specialises': 'Pains Spécialisés',
                'viennoiseries': 'Viennoiseries',
                'pains-forme': 'Pains en Forme',
                'sans-gluten': 'Options Sans Gluten',
                'pains-mediterraneens': 'Spécialités Méditerranéennes'
            },
            'en': {
                'pains-base': 'Basic Breads',
                'pains-specialises': 'Specialty Breads',
                'viennoiseries': 'Pastries',
                'pains-forme': 'Shaped Breads',
                'sans-gluten': 'Gluten-Free Options',
                'pains-mediterraneens': 'Mediterranean Specialties'
            }
        };
        return categoryNames[currentLanguage][categoryId] || categoryId;
    }

    /**
     * Traduire les unités
     */
    function getUnitTranslation(unit) {
        const units = {
            'fr': {
                'loaf': 'pain',
                'piece': 'pièce',
                'pack of 6': 'paquet de 6',
                'bag': 'sac'
            },
            'en': {
                'loaf': 'loaf',
                'piece': 'piece',
                'pack of 6': 'pack of 6',
                'bag': 'bag'
            }
        };
        return units[currentLanguage][unit] || unit;
    }

    /**
     * Incrémenter la quantité
     */
    window.incrementQuantity = function(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input) {
            input.value = Math.min(99, parseInt(input.value || 1) + 1);
        }
    };

    /**
     * Décrémenter la quantité
     */
    window.decrementQuantity = function(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input) {
            input.value = Math.max(1, parseInt(input.value || 1) - 1);
        }
    };

    /**
     * Ajouter au panier
     */
    window.addToCart = function(productId) {
        const input = document.getElementById(`qty-${productId}`);
        const quantity = input ? parseInt(input.value || 1) : 1;
        
        if (typeof cart !== 'undefined') {
            cart.addItem(productId, quantity);
            // Réinitialiser la quantité
            if (input) input.value = 1;
        }
    };

    /**
     * Toggle catégorie
     */
    window.toggleCategory = function(categoryId, titleElement) {
        const categoryDiv = document.getElementById(categoryId);
        const toggle = titleElement.querySelector('.category-toggle i');
        
        if (categoryDiv.classList.contains('show')) {
            categoryDiv.classList.remove('show');
            toggle.classList.remove('bi-chevron-down');
            toggle.classList.add('bi-chevron-right');
        } else {
            categoryDiv.classList.add('show');
            toggle.classList.remove('bi-chevron-right');
            toggle.classList.add('bi-chevron-down');
        }
    };

    /**
     * Confirmer le vidage du panier
     */
    window.clearCartConfirm = function() {
        const message = currentLanguage === 'fr' 
            ? 'Voulez-vous vraiment vider le panier?' 
            : 'Do you really want to empty the cart?';
        
        if (confirm(message)) {
            if (typeof cart !== 'undefined') {
                cart.clearCart();
            }
        }
    };

    // Initialiser au chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
