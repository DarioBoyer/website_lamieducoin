/**
 * Gestion du panier d'achat - La mie du coin
 */

class ShoppingCart {
    constructor() {
        this.items = this.loadCart();
        this.products = [];
        this.currentLang = localStorage.getItem('language') || 'fr';
    }

    /**
     * Obtenir une traduction
     */
    getTranslation(key) {
        if (typeof translations === 'undefined') return key;
        const keys = key.split('.');
        let value = translations[this.currentLang];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    }

    /**
     * Charger le panier depuis localStorage
     */
    loadCart() {
        const saved = localStorage.getItem('shoppingCart');
        return saved ? JSON.parse(saved) : [];
    }

    /**
     * Sauvegarder le panier dans localStorage
     */
    saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(this.items));
        this.updateCartDisplay();
        
        // Mettre à jour le panier mobile si la fonction existe
        if (typeof updateMobileCart === 'function') {
            updateMobileCart();
        }
    }

    /**
     * Ajouter un produit au panier
     */
    addItem(productId, quantity = 1) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId: productId,
                quantity: quantity,
                price: product.price
            });
        }

        this.saveCart();
        const message = this.currentLang === 'fr' 
            ? `${product.title[this.currentLang]} ajouté au panier!`
            : `${product.title[this.currentLang]} added to cart!`;
        this.showNotification(message);
    }

    /**
     * Modifier la quantité d'un produit
     */
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    /**
     * Retirer un produit du panier
     */
    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveCart();
    }

    /**
     * Vider le panier
     */
    clearCart() {
        this.items = [];
        this.saveCart();
    }

    /**
     * Calculer le total
     */
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Obtenir le nombre total d'articles
     */
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    /**
     * Alias pour getTotalItems (compatibilité)
     */
    getItemCount() {
        return this.getTotalItems();
    }

    /**
     * Obtenir tous les items du panier avec les détails des produits
     */
    getItems() {
        return this.items.map(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (!product) return null;
            
            return {
                id: item.productId,
                name: product.title[this.currentLang],
                icon: product.icon,
                price: item.price,
                quantity: item.quantity
            };
        }).filter(item => item !== null);
    }

    /**
     * Charger les produits depuis le JSON
     */
    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            // Filtrer uniquement les produits disponibles et de type "retail"
            this.products = data.products.filter(p => p.available && p.productType === 'retail');
            return this.products;
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            return [];
        }
    }

    /**
     * Afficher les produits disponibles
     */
    displayProducts() {
        const container = document.getElementById('products-list');
        if (!container) return;

        container.innerHTML = '';

        // Grouper par catégories
        const categories = {};
        this.products.forEach(product => {
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

        categoryOrder.forEach(categoryId => {
            const products = categories[categoryId];
            if (!products || products.length === 0) return;

            // Trier par titre
            products.sort((a, b) => 
                a.title[this.currentLang].localeCompare(b.title[this.currentLang])
            );

            // Créer la section de catégorie
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section mb-5';
            
            const categoryProduct = products[0];
            const uniqueId = `collapse-${categoryId}`;
            categorySection.innerHTML = `
                <h3 class="category-title mb-3" onclick="toggleCategory('${uniqueId}', this)">
                    <span>
                        <span class="category-icon">${categoryProduct.icon}</span>
                        ${this.getCategoryName(categoryId)}
                    </span>
                    <span class="category-toggle">
                        <i class="bi bi-chevron-down"></i>
                    </span>
                </h3>
                <div class="category-products collapse show" id="${uniqueId}">
                    <div class="row g-4" id="category-${categoryId}"></div>
                </div>
            `;

            container.appendChild(categorySection);

            const productsContainer = categorySection.querySelector(`#category-${categoryId}`);

            products.forEach(product => {
                const productCard = this.createProductCard(product);
                productsContainer.appendChild(productCard);
            });
        });
    }

    /**
     * Créer une carte produit
     */
    createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        const featuredText = this.currentLang === 'fr' ? '⭐ Populaire' : '⭐ Popular';
        const featured = product.featured ? `<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-2">${featuredText}</span>` : '';
        const addToCartText = this.currentLang === 'fr' ? 'Ajouter au panier' : 'Add to cart';
        const quantityText = this.currentLang === 'fr' ? 'Quantité' : 'Quantity';

        col.innerHTML = `
            <div class="card product-card h-100 shadow-sm">
                ${featured}
                <div class="card-body">
                    <div class="product-icon text-center mb-3">${product.icon}</div>
                    <h5 class="card-title text-center">${product.title[this.currentLang]}</h5>
                    <p class="card-text text-muted small">${product.description[this.currentLang]}</p>
                    <div class="product-details mb-3">
                        <small class="text-muted">
                            <i class="bi bi-box"></i> ${product.weight}
                        </small>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="product-price h5 mb-0">${product.price.toFixed(2)} $</span>
                        <small class="text-muted">/ ${this.getUnitTranslation(product.unit)}</small>
                    </div>
                    <div class="input-group mb-2">
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.decrementQuantity('${product.id}')" title="${quantityText}">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control text-center" id="qty-${product.id}" value="1" min="1" max="99" aria-label="${quantityText}">
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.incrementQuantity('${product.id}')" title="${quantityText}">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <button class="btn btn-primary w-100" onclick="cart.addToCart('${product.id}')">
                        <i class="bi bi-cart-plus"></i> ${addToCartText}
                    </button>
                </div>
            </div>
        `;

        return col;
    }

    /**
     * Obtenir le nom de catégorie traduit
     */
    getCategoryName(categoryId) {
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
        return categoryNames[this.currentLang][categoryId] || categoryId;
    }

    /**
     * Traduire les unités
     */
    getUnitTranslation(unit) {
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
        return units[this.currentLang][unit] || unit;
    }

    /**
     * Incrémenter la quantité
     */
    incrementQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input) {
            input.value = Math.min(99, parseInt(input.value) + 1);
        }
    }

    /**
     * Décrémenter la quantité
     */
    decrementQuantity(productId) {
        const input = document.getElementById(`qty-${productId}`);
        if (input) {
            input.value = Math.max(1, parseInt(input.value) - 1);
        }
    }

    /**
     * Ajouter au panier depuis l'interface
     */
    addToCart(productId) {
        const input = document.getElementById(`qty-${productId}`);
        const quantity = input ? parseInt(input.value) : 1;
        this.addItem(productId, quantity);
        
        // Réinitialiser la quantité
        if (input) input.value = 1;
    }

    /**
     * Mettre à jour l'affichage du panier
     */
    updateCartDisplay() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const emptyCart = document.getElementById('empty-cart');
        const cartContent = document.getElementById('cart-content');

        if (!cartItems) return;

        // Mettre à jour le compteur
        const totalItems = this.getTotalItems();
        if (cartCount) {
            if (totalItems > 0) {
                cartCount.textContent = `(${totalItems})`;
                cartCount.style.display = 'inline';
            } else {
                cartCount.style.display = 'none';
            }
        }

        // Afficher/masquer message panier vide
        if (this.items.length === 0) {
            if (emptyCart) emptyCart.style.display = 'block';
            if (cartContent) cartContent.style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';

        // Afficher les articles
        cartItems.innerHTML = '';
        this.items.forEach(item => {
            const product = this.products.find(p => p.id === item.productId);
            if (!product) return;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded';
            itemElement.innerHTML = `
                <div class="flex-grow-1">
                    <h6 class="mb-1">${product.icon} ${product.title[this.currentLang]}</h6>
                    <small class="text-muted">${product.price.toFixed(2)} $ × ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <div class="input-group input-group-sm" style="width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" 
                               onchange="cart.updateQuantity('${item.productId}', parseInt(this.value))" min="0">
                        <button class="btn btn-outline-secondary" type="button" onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <strong class="text-primary" style="min-width: 80px; text-align: right;">
                        ${(product.price * item.quantity).toFixed(2)} $
                    </strong>
                    <button class="btn btn-sm btn-outline-danger" onclick="cart.removeItem('${item.productId}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });

        // Mettre à jour le total
        const total = this.getTotal();
        if (cartTotal) {
            cartTotal.textContent = total.toFixed(2);
        }
    }

    /**
     * Afficher une notification
     */
    showNotification(message) {
        // Créer la notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            ${message}
        `;
        document.body.appendChild(notification);

        // Animer
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Retirer après 3 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Initialiser le panier
     */
    async init() {
        await this.loadProducts();
        this.displayProducts();
        this.updateCartDisplay();

        // Écouter les changements de langue
        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.language;
            this.displayProducts();
            this.updateCartDisplay();
            
            // Mettre à jour les éléments statiques avec data-i18n
            if (typeof updateTranslations === 'function') {
                updateTranslations();
            }
        });
    }
}

// Créer une instance globale du panier
const cart = new ShoppingCart();

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});
