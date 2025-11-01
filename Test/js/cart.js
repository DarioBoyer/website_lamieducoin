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
        const product = this.getProduct(productId);
        if (!product) {
            console.error('Produit non trouvé:', productId);
            return;
        }

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
            const product = this.getProduct(item.productId);
            if (!product) return null;
            
            return {
                id: item.productId,
                name: product.title[this.currentLang],
                icon: product.icon,
                price: item.price,
                quantity: item.quantity,
                total: item.price * item.quantity
            };
        }).filter(item => item !== null);
    }

    /**
     * Charger les produits depuis Supabase
     */
    async loadProducts() {
        try {
            // Essayer de charger depuis Supabase si disponible
            if (typeof supabase !== 'undefined' && typeof window.supabaseClient !== 'undefined') {
                console.log('🔄 Chargement des produits depuis Supabase pour le panier');
                const { data, error } = await window.supabaseClient
                    .from('Products')
                    .select('*')
                    .eq('productType', 'retail')
                    .eq('available', true)
                    .eq('status', 'Active');

                if (error) throw error;
                
                // Convertir les produits Supabase au format attendu par le panier
                this.products = data.map(p => ({
                    id: p.code, // Utiliser le code comme ID
                    title: {
                        fr: p.title_fr,
                        en: p.title_en
                    },
                    icon: p.icon,
                    price: p.price,
                    unit: p.unit,
                    weight: p.weight ? `${p.weight}${p.weightUnit}` : '',
                    available: p.available,
                    productType: p.productType
                }));
                
                console.log(`✅ ${this.products.length} produits chargés depuis Supabase pour le panier`);
                return this.products;
            }
            
            // Fallback: charger depuis le JSON
            console.log('📂 Chargement des produits depuis products.json (fallback)');
            const response = await fetch('../data/products.json');
            const data = await response.json();
            // Filtrer uniquement les produits disponibles et de type "retail"
            this.products = data.products.filter(p => p.available && p.productType === 'retail');
            console.log(`${this.products.length} produits chargés pour le panier`);
            return this.products;
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            // En cas d'erreur, essayer le fallback JSON
            try {
                const response = await fetch('../data/products.json');
                const data = await response.json();
                this.products = data.products.filter(p => p.available && p.productType === 'retail');
                return this.products;
            } catch (fallbackError) {
                console.error('Erreur lors du chargement du fallback:', fallbackError);
                return [];
            }
        }
    }

    /**
     * Obtenir un produit par son ID
     */
    getProduct(productId) {
        return this.products.find(p => p.id === productId);
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
        const cartTotalSection = document.getElementById('cart-total-section');

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
            if (cartTotalSection) cartTotalSection.style.display = 'none';
            return;
        }

        if (emptyCart) emptyCart.style.display = 'none';
        if (cartContent) cartContent.style.display = 'block';
        if (cartTotalSection) cartTotalSection.style.display = 'block';

        // Afficher les articles
        cartItems.innerHTML = '';
        this.items.forEach(item => {
            const product = this.getProduct(item.productId);
            if (!product) return;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item mb-2 p-2 border rounded bg-white';
            itemElement.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div class="flex-grow-1">
                        <h6 class="mb-1 small fw-bold">${product.icon} ${product.title[this.currentLang]}</h6>
                        <small class="text-muted">${product.price.toFixed(2)} $ × ${item.quantity}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-danger p-1" onclick="cart.removeItem('${item.productId}')" 
                            title="${this.currentLang === 'fr' ? 'Retirer' : 'Remove'}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <div class="input-group input-group-sm" style="max-width: 120px;">
                        <button class="btn btn-outline-secondary py-0 px-2" type="button" onclick="cart.updateQuantity('${item.productId}', ${item.quantity - 1})">
                            <i class="bi bi-dash"></i>
                        </button>
                        <input type="number" class="form-control text-center py-0" value="${item.quantity}" 
                               onchange="cart.updateQuantity('${item.productId}', parseInt(this.value))" min="0" style="max-width: 50px;">
                        <button class="btn btn-outline-secondary py-0 px-2" type="button" onclick="cart.updateQuantity('${item.productId}', ${item.quantity + 1})">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                    <strong class="text-success">
                        ${(product.price * item.quantity).toFixed(2)} $
                    </strong>
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
        this.updateCartDisplay();

        // Écouter les changements de langue
        window.addEventListener('languageChanged', (e) => {
            this.currentLang = e.detail.language;
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
