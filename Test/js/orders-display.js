/**
 * Affichage des produits pour la page de commandes
 * Utilise Supabase pour charger les produits de type Retail
 */

// Configuration Supabase
const SUPABASE_URL = 'https://mtuimnyoimiqhuyidyjv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10dWltbnlvaW1pcWh1eWlkeWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNjc3NjksImV4cCI6MjA3Njg0Mzc2OX0.SuB-0Kwaakff6pbZhKgWbGaAfL9h_NWaRBR9rNnaMIw';

(function() {
    'use strict';

    let supabaseClient = null;
    let currentLanguage = 'fr';
    let allProducts = [];
    let allCategories = [];

    /**
     * Initialisation
     */
    async function init() {
        try {
            // Récupérer la langue
            currentLanguage = localStorage.getItem('language') || 'fr';
            
            // Initialiser Supabase
            if (typeof supabase !== 'undefined') {
                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                // Exposer le client globalement pour le panier
                window.supabaseClient = supabaseClient;
                console.log('✅ Client Supabase initialisé pour les commandes');
            } else {
                throw new Error('La bibliothèque Supabase n\'est pas chargée');
            }
            
            // Charger les catégories et produits
            await Promise.all([
                loadCategories(),
                loadProducts()
            ]);
            
            // Afficher les produits
            displayProducts();
            
            // Écouter les changements de langue
            window.addEventListener('languageChanged', (e) => {
                currentLanguage = e.detail.language;
                displayProducts();
            });
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            showError();
        }
    }

    /**
     * Charger les catégories depuis Supabase
     */
    async function loadCategories() {
        try {
            const { data, error } = await supabaseClient
                .from('BreadCategory')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            
            allCategories = data || [];
            console.log(`📂 ${allCategories.length} catégories chargées`);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            // Catégories par défaut en cas d'erreur
            allCategories = [
                { id: 'pains-base', NameFR: 'Pains de Base', NameEN: 'Basic Breads', icon: '🍞' },
                { id: 'pains-specialite', NameFR: 'Pains Spécialisés', NameEN: 'Specialty Breads', icon: '🥖' },
                { id: 'viennoiseries', NameFR: 'Viennoiseries', NameEN: 'Pastries', icon: '🥐' },
                { id: 'sans-gluten', NameFR: 'Sans Gluten', NameEN: 'Gluten-Free', icon: '🌾' }
            ];
        }
    }

    /**
     * Charger les produits depuis Supabase
     * Uniquement les produits de type Retail, disponibles et actifs
     */
    async function loadProducts() {
        try {
            const { data, error } = await supabaseClient
                .from('Products')
                .select('*')
                .eq('productType', 'retail')
                .eq('available', true)
                .eq('status', 'Active')
                .order('categoryId', { ascending: true })
                .order('title_fr', { ascending: true });

            if (error) throw error;
            
            allProducts = data || [];
            console.log(`🍞 ${allProducts.length} produits retail chargés`);
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            allProducts = [];
            throw error;
        }
    }

    /**
     * Afficher les produits groupés par catégorie
     */
    function displayProducts() {
        const container = document.getElementById('products-list');
        if (!container) return;

        if (allProducts.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    ${currentLanguage === 'fr' ? 'Aucun produit disponible pour le moment.' : 'No products available at the moment.'}
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

        // Générer le HTML
        let html = '';
        
        allCategories.forEach(category => {
            const categoryProducts = productsByCategory[category.id];
            
            // Ignorer les catégories sans produits
            if (!categoryProducts || categoryProducts.length === 0) {
                return;
            }

            const categoryName = currentLanguage === 'fr' ? category.NameFR : category.NameEN;
            const uniqueId = `collapse-${category.id}`;

            html += `
                <div class="category-section mb-4">
                    <h3 class="category-title mb-3" onclick="toggleCategory('${uniqueId}', this)">
                        <span>
                            <span class="category-icon">${category.icon || '📦'}</span>
                            ${categoryName}
                            <span class="badge bg-primary ms-2">${categoryProducts.length}</span>
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
    }

    /**
     * Créer une carte produit pour les commandes
     */
    function createProductCard(product) {
        const title = currentLanguage === 'fr' ? product.title_fr : product.title_en;
        const description = currentLanguage === 'fr' ? product.description_fr : product.description_en;
        const price = product.price.toFixed(2);
        const weight = product.weight ? `${product.weight}${product.weightUnit}` : '';
        
        // Badge pour les produits en vedette
        const featuredText = currentLanguage === 'fr' ? 'Populaire' : 'Popular';
        const featuredBadge = product.featured ? 
            `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">
                ⭐ ${featuredText}
            </span>` : '';

        // Construire le chemin de l'image
        let imageSrc = '';
        let imageHtml = '';
        if (product.image) {
            // Convertir le chemin de la BD en chemin relatif pour la page
            imageSrc = product.image.startsWith('/') ? '..' + product.image : product.image;
            imageHtml = `
                <div class="product-image-small me-2">
                    <img src="${imageSrc}" alt="${title}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='inline';">
                    <span class="product-icon-fallback" style="display: none;">${product.icon}</span>
                </div>
            `;
        } else {
            imageHtml = `<div class="product-icon-small me-2">${product.icon}</div>`;
        }

        // Traductions
        const unitText = getUnitTranslation(product.unit);
        const qtyLabel = currentLanguage === 'fr' ? 'Quantité' : 'Quantity';
        const decreaseLabel = currentLanguage === 'fr' ? 'Diminuer' : 'Decrease';
        const increaseLabel = currentLanguage === 'fr' ? 'Augmenter' : 'Increase';
        const addLabel = currentLanguage === 'fr' ? 'Ajouter' : 'Add';

        return `
            <div class="col-md-6">
                <div class="card product-card-compact h-100 border shadow-sm">
                    ${featuredBadge}
                    <div class="card-body p-3">
                        <div class="row g-2 align-items-center">
                            <!-- Icône/Image et info -->
                            <div class="col-8">
                                <div class="d-flex align-items-start gap-2">
                                    ${imageHtml}
                                    <div>
                                        <h5 class="card-title mb-1 fs-6 fw-bold">${product.icon} ${title}</h5>
                                        ${description ? `<p class="card-text text-muted small mb-2">${description}</p>` : ''}
                                        ${weight ? `
                                            <div class="text-muted small">
                                                <i class="bi bi-box"></i> ${weight}
                                            </div>
                                        ` : ''}
                                        ${product.allergens && product.allergens.length > 0 ? `
                                            <div class="text-warning small">
                                                <i class="bi bi-exclamation-triangle"></i> 
                                                ${currentLanguage === 'fr' ? 'Allergènes' : 'Allergens'}: ${product.allergens.join(', ')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Prix -->
                            <div class="col-4 text-end">
                                <div class="product-price-compact fw-bold text-success mb-1">
                                    ${price} $
                                </div>
                                <small class="text-muted">/ ${unitText}</small>
                            </div>
                        </div>
                        
                        <!-- Quantité et bouton ajout -->
                        <div class="row g-2 mt-2 align-items-center">
                            <div class="col-5">
                                <div class="input-group input-group-sm">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="decrementQuantity('${product.code}')" title="${decreaseLabel}">
                                        <i class="bi bi-dash"></i>
                                    </button>
                                    <input type="number" class="form-control text-center" 
                                           id="qty-${product.code}" value="1" min="1" max="99" 
                                           aria-label="${qtyLabel}">
                                    <button class="btn btn-outline-secondary" type="button" 
                                            onclick="incrementQuantity('${product.code}')" title="${increaseLabel}">
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="col-7">
                                <button class="btn btn-primary btn-sm w-100" onclick="addToCartFromOrders('${product.code}', '${product.id}')">
                                    <i class="bi bi-cart-plus"></i> ${addLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
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
                'bag': 'sac',
                'dozen': 'douzaine'
            },
            'en': {
                'loaf': 'loaf',
                'piece': 'piece',
                'pack of 6': 'pack of 6',
                'bag': 'bag',
                'dozen': 'dozen'
            }
        };
        return units[currentLanguage]?.[unit] || unit;
    }

    /**
     * Afficher un message d'erreur
     */
    function showError() {
        const container = document.getElementById('products-list');
        if (container) {
            const message = currentLanguage === 'fr' 
                ? 'Erreur lors du chargement des produits. Veuillez réessayer plus tard.'
                : 'Error loading products. Please try again later.';
            
            container.innerHTML = `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> ${message}
                </div>
            `;
        }
    }

    /**
     * Incrémenter la quantité
     */
    window.incrementQuantity = function(productCode) {
        const input = document.getElementById(`qty-${productCode}`);
        if (input) {
            input.value = Math.min(99, parseInt(input.value || 1) + 1);
        }
    };

    /**
     * Décrémenter la quantité
     */
    window.decrementQuantity = function(productCode) {
        const input = document.getElementById(`qty-${productCode}`);
        if (input) {
            input.value = Math.max(1, parseInt(input.value || 1) - 1);
        }
    };

    /**
     * Ajouter au panier depuis la page de commandes
     * Note: Le panier utilise le code du produit comme identifiant
     */
    window.addToCartFromOrders = function(productCode, productId) {
        const input = document.getElementById(`qty-${productCode}`);
        const quantity = input ? parseInt(input.value || 1) : 1;
        
        // Trouver le produit dans notre liste
        const product = allProducts.find(p => p.code === productCode);
        if (!product) {
            console.error('Produit non trouvé:', productCode);
            return;
        }
        
        // Créer un objet produit compatible avec le panier existant
        const cartProduct = {
            id: productCode, // Le panier utilise le code comme ID
            title: {
                fr: product.title_fr,
                en: product.title_en
            },
            icon: product.icon,
            price: product.price
        };
        
        // Si le panier global existe, l'utiliser
        if (typeof cart !== 'undefined' && typeof cart.addItem === 'function') {
            // Temporairement ajouter le produit à la liste des produits du panier
            if (!cart.products.find(p => p.id === productCode)) {
                cart.products.push(cartProduct);
            }
            cart.addItem(productCode, quantity);
            // Réinitialiser la quantité
            if (input) input.value = 1;
        } else {
            console.error('Le système de panier n\'est pas disponible');
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
