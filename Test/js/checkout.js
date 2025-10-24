/**
 * Checkout Management System
 * Gestion du processus de commande
 */

class CheckoutManager {
    constructor() {
        this.orderManager = null;
        this.currentLang = localStorage.getItem('language') || 'fr';
    }

    /**
     * Obtenir une traduction
     */
    t(key) {
        if (typeof translations === 'undefined') return key;
        const keys = key.split('.');
        let value = translations[this.currentLang];
        
        for (const k of keys) {
            value = value?.[k];
        }
        
        return value || key;
    }

    /**
     * Initialiser le gestionnaire de commandes
     */
    async initialize() {
        try {
            // Créer une instance du gestionnaire de commandes
            this.orderManager = new OrderManager();
            await this.orderManager.initialize();
            console.log('Checkout manager initialized');
            return true;
        } catch (error) {
            console.error('Error initializing checkout manager:', error);
            return false;
        }
    }

    /**
     * Afficher le formulaire de checkout
     */
    showCheckoutForm() {
        const cartItems = cart.getItems();
        
        if (cartItems.length === 0) {
            alert(this.t('orders.emptyCart'));
            return;
        }

        const total = cart.getTotal();
        
        // Créer le modal de checkout
        const modal = this.createCheckoutModal(cartItems, total);
        document.body.appendChild(modal);
        
        // Afficher le modal
        setTimeout(() => modal.classList.add('show'), 10);
        document.body.style.overflow = 'hidden';
    }

    /**
     * Créer le modal de checkout
     */
    createCheckoutModal(cartItems, total) {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        modal.id = 'checkout-modal';
        
        const itemsHtml = cartItems.map(item => `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom">
                <div>
                    <div>${item.icon} ${item.name}</div>
                    <small class="text-muted">${item.quantity} × ${item.price.toFixed(2)} $</small>
                </div>
                <strong>${(item.quantity * item.price).toFixed(2)} $</strong>
            </div>
        `).join('');

        // Calculer la date minimale (3 jours à partir d'aujourd'hui)
        const minDeliveryDate = new Date();
        minDeliveryDate.setDate(minDeliveryDate.getDate() + 3);
        const minDate = minDeliveryDate.toISOString().split('T')[0];

        modal.innerHTML = `
            <div class="checkout-modal-content">
                <div class="checkout-modal-header">
                    <h3><i class="bi bi-cart-check"></i> ${this.t('orders.checkoutTitle')}</h3>
                    <button class="checkout-modal-close" id="close-checkout-modal" aria-label="${this.t('orders.btnContinueShopping')}">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="checkout-modal-body">
                    <div class="row">
                        <!-- Order Summary -->
                        <div class="col-lg-5 mb-4">
                            <h5 class="mb-3"><i class="bi bi-list-check"></i> ${this.t('orders.orderSummary')}</h5>
                            <div class="order-summary-box p-3 bg-light rounded">
                                ${itemsHtml}
                                <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                    <strong>${this.t('orders.total')}:</strong>
                                    <strong class="h5 mb-0 text-primary">${total.toFixed(2)} $</strong>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Customer Information Form -->
                        <div class="col-lg-7">
                            <h5 class="mb-3"><i class="bi bi-person-circle"></i> ${this.t('orders.customerInfo')}</h5>
                            <form id="checkout-form">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="checkout-firstname" class="form-label">
                                            ${this.t('orders.firstName')} <span class="text-danger">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="checkout-firstname" 
                                            required
                                            autocomplete="given-name"
                                        >
                                        <div class="invalid-feedback">${this.t('orders.fieldRequired')}</div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="checkout-lastname" class="form-label">
                                            ${this.t('orders.lastName')} <span class="text-danger">*</span>
                                        </label>
                                        <input 
                                            type="text" 
                                            class="form-control" 
                                            id="checkout-lastname" 
                                            required
                                            autocomplete="family-name"
                                        >
                                        <div class="invalid-feedback">${this.t('orders.fieldRequired')}</div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="checkout-email" class="form-label">
                                        ${this.t('orders.email')} <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="email" 
                                        class="form-control" 
                                        id="checkout-email" 
                                        required
                                        autocomplete="email"
                                    >
                                    <div class="invalid-feedback">${this.t('orders.invalidEmail')}</div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="checkout-phone" class="form-label">
                                        ${this.t('orders.phone')} <span class="text-danger">*</span>
                                    </label>
                                    <input 
                                        type="tel" 
                                        class="form-control" 
                                        id="checkout-phone" 
                                        required
                                        autocomplete="tel"
                                        placeholder="514-555-1234"
                                    >
                                    <div class="invalid-feedback">${this.t('orders.invalidPhone')}</div>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="checkout-delivery-date" class="form-label">
                                        ${this.t('orders.deliveryDate')}
                                    </label>
                                    <input 
                                        type="date" 
                                        class="form-control" 
                                        id="checkout-delivery-date"
                                        min="${minDate}"
                                    >
                                </div>
                                
                                <div class="mb-3">
                                    <label for="checkout-note" class="form-label">
                                        ${this.t('orders.orderNote')}
                                    </label>
                                    <textarea 
                                        class="form-control" 
                                        id="checkout-note" 
                                        rows="3"
                                        placeholder="${this.t('tracking.commentPlaceholder')}"
                                    ></textarea>
                                </div>
                                
                                <div class="d-grid gap-2">
                                    <button type="submit" class="btn btn-primary btn-lg">
                                        <i class="bi bi-check-circle"></i> ${this.t('orders.btnPlaceOrder')}
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary" id="btn-continue-shopping">
                                        <i class="bi bi-arrow-left"></i> ${this.t('orders.btnContinueShopping')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Ajouter les gestionnaires d'événements
        this.attachCheckoutEventListeners(modal);
        
        return modal;
    }

    /**
     * Attacher les gestionnaires d'événements du modal de checkout
     */
    attachCheckoutEventListeners(modal) {
        // Fermer le modal
        const closeBtn = modal.querySelector('#close-checkout-modal');
        const continueBtn = modal.querySelector('#btn-continue-shopping');
        
        const closeModal = () => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            setTimeout(() => modal.remove(), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        continueBtn.addEventListener('click', closeModal);
        
        // Fermer en cliquant sur le fond
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Soumettre le formulaire
        const form = modal.querySelector('#checkout-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCheckoutSubmit(form, modal);
        });
        
        // Validation en temps réel
        const emailInput = modal.querySelector('#checkout-email');
        emailInput.addEventListener('blur', () => {
            this.validateEmail(emailInput);
        });
        
        const phoneInput = modal.querySelector('#checkout-phone');
        phoneInput.addEventListener('blur', () => {
            this.validatePhone(phoneInput);
        });
    }

    /**
     * Valider l'email
     */
    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            input.classList.add('is-invalid');
            return false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        }
    }

    /**
     * Valider le téléphone
     */
    validatePhone(input) {
        // Format québécois: 514-555-1234 ou (514) 555-1234 ou 5145551234
        const phoneRegex = /^(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
        if (!phoneRegex.test(input.value)) {
            input.classList.add('is-invalid');
            return false;
        } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            return true;
        }
    }

    /**
     * Gérer la soumission du formulaire de checkout
     */
    async handleCheckoutSubmit(form, modal) {
        // Valider le formulaire
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        // Valider email et téléphone
        const emailInput = form.querySelector('#checkout-email');
        const phoneInput = form.querySelector('#checkout-phone');
        
        if (!this.validateEmail(emailInput) || !this.validatePhone(phoneInput)) {
            return;
        }
        
        // Collecter les données
        const formData = {
            customerFirstName: form.querySelector('#checkout-firstname').value.trim(),
            customerLastName: form.querySelector('#checkout-lastname').value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            orderNote: form.querySelector('#checkout-note').value.trim(),
            deliveryDate: form.querySelector('#checkout-delivery-date').value || '',
            language: this.currentLang
        };
        
        // Préparer les lignes de commande
        const cartItems = cart.getItems();
        formData.orderLines = cartItems.map(item => ({
            productId: item.id,
            quantityOrdered: item.quantity,
            price: item.price
        }));
        
        // Créer la commande
        try {
            // Initialiser le gestionnaire si nécessaire
            if (!this.orderManager) {
                await this.initialize();
            }
            
            const newOrder = this.orderManager.createOrder(formData);
            
            // Sauvegarder (en production, cela ferait un appel API)
            console.log('Order created:', newOrder);
            
            // Vider le panier
            cart.clearCart();
            
            // Fermer le modal de checkout
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
            
            // Afficher le modal de succès
            this.showSuccessModal(newOrder);
            
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Une erreur est survenue lors de la création de la commande. Veuillez réessayer.');
        }
    }

    /**
     * Afficher le modal de succès
     */
    showSuccessModal(order) {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal show';
        modal.id = 'success-modal';
        
        const trackingUrl = `suivi-commande.html?order=${order.orderGuid}`;
        
        modal.innerHTML = `
            <div class="checkout-modal-content">
                <div class="checkout-modal-body text-center py-5">
                    <div class="success-icon mb-4">
                        <i class="bi bi-check-circle-fill text-success" style="font-size: 5rem;"></i>
                    </div>
                    <h2 class="mb-3">${this.t('orders.orderSuccess')}</h2>
                    <p class="lead mb-4">${this.t('orders.orderSuccessMessage')}</p>
                    
                    <div class="alert alert-info mb-4">
                        <strong>${this.t('orders.orderNumber')}:</strong> #${order.orderId}
                    </div>
                    
                    <p class="text-muted mb-4">
                        ${this.currentLang === 'fr' 
                            ? 'Un courriel de confirmation a été envoyé à' 
                            : 'A confirmation email has been sent to'} 
                        <strong>${order.email}</strong>
                    </p>
                    
                    <div class="d-grid gap-2 col-md-6 mx-auto">
                        <a href="${trackingUrl}" class="btn btn-primary btn-lg">
                            <i class="bi bi-geo-alt"></i> ${this.t('orders.trackOrder')}
                        </a>
                        <a href="../index.html" class="btn btn-outline-secondary">
                            <i class="bi bi-house"></i> ${this.t('orders.backToHome')}
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    }
}

// Créer une instance globale du gestionnaire de checkout
const checkoutManager = new CheckoutManager();

// Fonction globale pour ouvrir le checkout
function openCheckout() {
    checkoutManager.showCheckoutForm();
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    checkoutManager.initialize();
});
