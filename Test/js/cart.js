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
     * Charger les produits depuis le JSON
     */
    async loadProducts() {
        try {
            const response = await fetch('../data/products.json');
            const data = await response.json();
            // Filtrer uniquement les produits disponibles et de type "retail"
            this.products = data.products.filter(p => p.available && p.productType === 'retail');
            console.log(`${this.products.length} produits chargés pour le panier`);
            return this.products;
        } catch (error) {
            console.error('Erreur lors du chargement des produits:', error);
            return [];
        }
    }

    /**
     * Obtenir un produit par son ID
     */
    getProduct(productId) {
        return this.products.find(p => p.id === productId);
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
