/**
 * Order Management System
 * Gestion des commandes clients
 */

class OrderManager {
    constructor() {
        this.orders = [];
        this.documentParameters = null;
        this.orderStatuses = null;
        this.lineStatuses = null;
    }

    /**
     * Génère un GUID (UUID v4)
     * @returns {string} Un GUID unique
     */
    generateGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * Initialise le gestionnaire de commandes
     * Charge les données depuis les fichiers JSON
     */
    async initialize() {
        try {
            // Charger les paramètres de document
            const docParamsResponse = await fetch('../data/document-parameters.json');
            this.documentParameters = await docParamsResponse.json();

            // Charger les commandes existantes
            const ordersResponse = await fetch('../data/orders.json');
            const ordersData = await ordersResponse.json();
            
            this.orders = ordersData.orders || [];
            this.orderStatuses = ordersData.orderStatuses || {};
            this.lineStatuses = ordersData.lineStatuses || {};

            console.log('Order Manager initialized successfully');
        } catch (error) {
            console.error('Error initializing Order Manager:', error);
        }
    }

    /**
     * Crée une nouvelle commande
     * @param {Object} orderData - Données de la commande
     * @returns {Object} La commande créée
     */
    createOrder(orderData) {
        // Récupérer et incrémenter le NextOrderId
        const orderId = this.documentParameters.NextOrderId;
        this.documentParameters.NextOrderId++;

        // Créer la nouvelle commande avec le statut "New"
        const newOrder = {
            orderId: orderId,
            orderGuid: this.generateGuid(),
            customerLastName: orderData.customerLastName || '',
            customerFirstName: orderData.customerFirstName || '',
            email: orderData.email || '',
            phone: orderData.phone || '',
            language: orderData.language || 'fr',
            orderNote: orderData.orderNote || '',
            totalAmount: 0,
            status: 'New',
            scheduledOn: new Date().toISOString(),
            deliveryDate: orderData.deliveryDate || '',
            deposit: orderData.deposit || 0,
            paid: false,
            orderLines: []
        };

        // Ajouter les lignes de commande si présentes
        if (orderData.orderLines && Array.isArray(orderData.orderLines)) {
            orderData.orderLines.forEach(line => {
                this.addOrderLine(newOrder, line, false);
            });
        }

        // Calculer le montant total
        this.calculateOrderTotal(newOrder);

        // Ajouter la commande à la liste
        this.orders.push(newOrder);

        // Sauvegarder dans localStorage
        this.saveOrdersToLocalStorage();

        console.log(`Order ${orderId} created successfully and saved to localStorage`);
        return newOrder;
    }

    /**
     * Ajoute une ligne à une commande existante
     * @param {Object} order - La commande
     * @param {Object} lineData - Données de la ligne
     * @param {boolean} recalculate - Recalculer le total (défaut: true)
     */
    addOrderLine(order, lineData, recalculate = true) {
        const lineTotal = (lineData.quantityOrdered || 0) * (lineData.price || 0);

        const newLine = {
            productId: lineData.productId || '',
            quantityOrdered: lineData.quantityOrdered || 0,
            quantityProduced: 0,
            price: lineData.price || 0,
            lineTotal: lineTotal,
            lineStatus: 'ToDo',
            scheduledOn: lineData.scheduledOn || new Date().toISOString()
        };

        order.orderLines.push(newLine);

        if (recalculate) {
            this.calculateOrderTotal(order);
        }

        console.log(`Line added to order ${order.orderId}`);
    }

    /**
     * Supprime une ligne d'une commande
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne à supprimer
     */
    removeOrderLine(orderId, lineIndex) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        if (lineIndex < 0 || lineIndex >= order.orderLines.length) {
            console.error(`Invalid line index ${lineIndex}`);
            return false;
        }

        order.orderLines.splice(lineIndex, 1);
        this.calculateOrderTotal(order);
        this.saveOrdersToLocalStorage();

        console.log(`Line ${lineIndex} removed from order ${orderId}`);
        return true;
    }

    /**
     * Modifie la quantité d'une ligne de commande
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     * @param {number} newQuantity - Nouvelle quantité
     */
    updateLineQuantity(orderId, lineIndex, newQuantity) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        if (lineIndex < 0 || lineIndex >= order.orderLines.length) {
            console.error(`Invalid line index ${lineIndex}`);
            return false;
        }

        const line = order.orderLines[lineIndex];
        line.quantityOrdered = newQuantity;
        line.lineTotal = line.quantityOrdered * line.price;

        this.calculateOrderTotal(order);
        this.saveOrdersToLocalStorage();

        console.log(`Line ${lineIndex} quantity updated in order ${orderId}`);
        return true;
    }

    /**
     * Modifie les informations d'une commande
     * @param {number} orderId - ID de la commande
     * @param {Object} updates - Propriétés à mettre à jour
     */
    updateOrder(orderId, updates) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        // Mettre à jour les propriétés autorisées
        const allowedFields = [
            'customerLastName', 'customerFirstName', 'email', 'phone',
            'language', 'orderNote', 'deliveryDate', 'deposit', 'paid'
        ];

        allowedFields.forEach(field => {
            if (updates.hasOwnProperty(field)) {
                order[field] = updates[field];
            }
        });

        console.log(`Order ${orderId} updated successfully`);
        return true;
    }

    /**
     * Annule une commande
     * @param {number} orderId - ID de la commande
     * @param {string} cancellationReason - Raison de l'annulation
     */
    cancelOrder(orderId, cancellationReason = '') {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        order.status = 'Cancel';
        order.cancellationReason = cancellationReason;
        order.cancelledOn = new Date().toISOString();

        this.saveOrdersToLocalStorage();
        console.log(`Order ${orderId} cancelled: ${cancellationReason}`);
        return true;
    }

    /**
     * Change le statut d'une commande
     * @param {number} orderId - ID de la commande
     * @param {string} newStatus - Nouveau statut (New, Plan, Production, Completed, Done, Cancel)
     */
    setOrderStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        if (!this.orderStatuses.hasOwnProperty(newStatus)) {
            console.error(`Invalid order status: ${newStatus}`);
            return false;
        }

        order.status = newStatus;
        this.saveOrdersToLocalStorage();
        console.log(`Order ${orderId} status changed to ${newStatus}`);
        return true;
    }

    /**
     * Met la commande au statut "Plan"
     * @param {number} orderId - ID de la commande
     */
    planOrder(orderId) {
        return this.setOrderStatus(orderId, 'Plan');
    }

    /**
     * Met la commande au statut "Production"
     * @param {number} orderId - ID de la commande
     */
    setOrderInProduction(orderId) {
        return this.setOrderStatus(orderId, 'Production');
    }

    /**
     * Met la commande au statut "Completed"
     * @param {number} orderId - ID de la commande
     */
    completeOrder(orderId) {
        return this.setOrderStatus(orderId, 'Completed');
    }

    /**
     * Met la commande au statut "Done"
     * @param {number} orderId - ID de la commande
     */
    markOrderAsDone(orderId) {
        return this.setOrderStatus(orderId, 'Done');
    }

    /**
     * Change le statut d'une ligne de commande
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     * @param {string} newStatus - Nouveau statut (ToDo, Plan, Production, Completed)
     */
    setLineStatus(orderId, lineIndex, newStatus) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        if (lineIndex < 0 || lineIndex >= order.orderLines.length) {
            console.error(`Invalid line index ${lineIndex}`);
            return false;
        }

        if (!this.lineStatuses.hasOwnProperty(newStatus)) {
            console.error(`Invalid line status: ${newStatus}`);
            return false;
        }

        order.orderLines[lineIndex].lineStatus = newStatus;
        this.saveOrdersToLocalStorage();
        console.log(`Order ${orderId} line ${lineIndex} status changed to ${newStatus}`);
        return true;
    }

    /**
     * Met une ligne au statut "Plan"
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     */
    planOrderLine(orderId, lineIndex) {
        return this.setLineStatus(orderId, lineIndex, 'Plan');
    }

    /**
     * Met une ligne au statut "Production"
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     */
    setLineInProduction(orderId, lineIndex) {
        return this.setLineStatus(orderId, lineIndex, 'Production');
    }

    /**
     * Met une ligne au statut "Completed"
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     */
    completeOrderLine(orderId, lineIndex) {
        return this.setLineStatus(orderId, lineIndex, 'Completed');
    }

    /**
     * Met toutes les lignes d'une commande à un statut donné
     * @param {number} orderId - ID de la commande
     * @param {string} newStatus - Nouveau statut
     */
    setAllLinesStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        order.orderLines.forEach((line, index) => {
            this.setLineStatus(orderId, index, newStatus);
        });

        return true;
    }

    /**
     * Met à jour la quantité produite d'une ligne
     * @param {number} orderId - ID de la commande
     * @param {number} lineIndex - Index de la ligne
     * @param {number} quantityProduced - Quantité produite
     */
    updateLineQuantityProduced(orderId, lineIndex, quantityProduced) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return false;
        }

        if (lineIndex < 0 || lineIndex >= order.orderLines.length) {
            console.error(`Invalid line index ${lineIndex}`);
            return false;
        }

        order.orderLines[lineIndex].quantityProduced = quantityProduced;
        console.log(`Order ${orderId} line ${lineIndex} quantity produced updated to ${quantityProduced}`);
        return true;
    }

    /**
     * Calcule le montant total d'une commande
     * @param {Object} order - La commande
     */
    calculateOrderTotal(order) {
        order.totalAmount = order.orderLines.reduce((total, line) => {
            return total + line.lineTotal;
        }, 0);
        
        // Arrondir à 2 décimales
        order.totalAmount = Math.round(order.totalAmount * 100) / 100;
    }

    /**
     * Récupère une commande par son ID
     * @param {number} orderId - ID de la commande
     * @returns {Object|null} La commande ou null si non trouvée
     */
    getOrderById(orderId) {
        return this.orders.find(order => order.orderId === orderId) || null;
    }

    /**
     * Récupère une commande par son GUID
     * @param {string} orderGuid - GUID de la commande
     * @returns {Object|null} La commande ou null si non trouvée
     */
    getOrderByGuid(orderGuid) {
        return this.orders.find(order => order.orderGuid === orderGuid) || null;
    }

    /**
     * Récupère toutes les commandes
     * @returns {Array} Liste des commandes
     */
    getAllOrders() {
        return this.orders;
    }

    /**
     * Récupère les commandes par statut
     * @param {string} status - Statut recherché
     * @returns {Array} Liste des commandes avec ce statut
     */
    getOrdersByStatus(status) {
        return this.orders.filter(order => order.status === status);
    }

    /**
     * Récupère les commandes par client
     * @param {string} email - Email du client
     * @returns {Array} Liste des commandes du client
     */
    getOrdersByCustomer(email) {
        return this.orders.filter(order => order.email === email);
    }

    /**
     * Récupère les commandes par date de livraison
     * @param {string} deliveryDate - Date de livraison (YYYY-MM-DD)
     * @returns {Array} Liste des commandes pour cette date
     */
    getOrdersByDeliveryDate(deliveryDate) {
        return this.orders.filter(order => order.deliveryDate === deliveryDate);
    }

    /**
     * Obtient le statut traduit d'une commande
     * @param {string} status - Code du statut
     * @param {string} language - Langue (fr ou en)
     * @returns {string} Statut traduit
     */
    getOrderStatusLabel(status, language = 'fr') {
        if (this.orderStatuses[status]) {
            return this.orderStatuses[status][language] || status;
        }
        return status;
    }

    /**
     * Obtient le statut traduit d'une ligne
     * @param {string} status - Code du statut
     * @param {string} language - Langue (fr ou en)
     * @returns {string} Statut traduit
     */
    getLineStatusLabel(status, language = 'fr') {
        if (this.lineStatuses[status]) {
            return this.lineStatuses[status][language] || status;
        }
        return status;
    }

    /**
     * Charge les commandes depuis le localStorage
     * @returns {Array} Liste des commandes du localStorage
     */
    loadOrdersFromLocalStorage() {
        try {
            const storedOrders = localStorage.getItem('localOrders');
            if (!storedOrders) return [];
            
            const orders = JSON.parse(storedOrders);
            console.log(`Loaded ${orders.length} orders from localStorage`);
            return orders;
        } catch (error) {
            console.error('Error loading orders from localStorage:', error);
            return [];
        }
    }

    /**
     * Sauvegarde les commandes locales dans le localStorage
     * @returns {boolean} Succès de la sauvegarde
     */
    saveOrdersToLocalStorage() {
        try {
            // Ne sauvegarder que les commandes créées localement (celles qui ne sont pas dans orders.json)
            const localOrders = this.orders.filter(order => {
                // Une commande est locale si son ID est >= 6 (le prochain ID après ceux du fichier JSON)
                return order.orderId >= 6;
            });
            
            localStorage.setItem('localOrders', JSON.stringify(localOrders));
            console.log(`Saved ${localOrders.length} orders to localStorage`);;
            return true;
        } catch (error) {
            console.error('Error saving orders to localStorage:', error);
            return false;
        }
    }

    /**
     * Sauvegarde les données (sauvegarde dans localStorage)
     * @returns {Object} Données à sauvegarder
     */
    saveData() {
        // Sauvegarder dans localStorage
        this.saveOrdersToLocalStorage();
        
        const dataToSave = {
            orderStatuses: this.orderStatuses,
            lineStatuses: this.lineStatuses,
            orders: this.orders,
            savedAt: new Date().toISOString()
        };

        console.log('Data saved to localStorage:', dataToSave);
        
        // En production, vous feriez un appel API ici pour sauvegarder les données
        // fetch('/api/orders', { method: 'POST', body: JSON.stringify(dataToSave) })
        
        return dataToSave;
    }

    /**
     * Sauvegarde les paramètres de document (simulation)
     * @returns {Object} Paramètres à sauvegarder
     */
    saveDocumentParameters() {
        console.log('Document parameters ready to save:', this.documentParameters);
        
        // En production, vous feriez un appel API ici
        // fetch('/api/document-parameters', { method: 'POST', body: JSON.stringify(this.documentParameters) })
        
        return this.documentParameters;
    }

    /**
     * Exporte les données en JSON
     * @returns {string} Données en format JSON
     */
    exportToJSON() {
        return JSON.stringify(this.saveData(), null, 2);
    }

    /**
     * Affiche un résumé d'une commande
     * @param {number} orderId - ID de la commande
     */
    displayOrderSummary(orderId) {
        const order = this.getOrderById(orderId);
        
        if (!order) {
            console.error(`Order ${orderId} not found`);
            return;
        }

        console.log(`
========================================
COMMANDE #${order.orderId}
========================================
GUID: ${order.orderGuid}
Client: ${order.customerFirstName} ${order.customerLastName}
Email: ${order.email}
Téléphone: ${order.phone}
Statut: ${this.getOrderStatusLabel(order.status, order.language)}
Date de livraison: ${order.deliveryDate}
Montant total: ${order.totalAmount.toFixed(2)} $
Accompte: ${order.deposit.toFixed(2)} $
Payé: ${order.paid ? 'Oui' : 'Non'}
Note: ${order.orderNote}

Lignes de commande:
${order.orderLines.map((line, index) => `
  ${index + 1}. Produit: ${line.productId}
     Quantité commandée: ${line.quantityOrdered}
     Quantité produite: ${line.quantityProduced}
     Prix unitaire: ${line.price.toFixed(2)} $
     Total: ${line.lineTotal.toFixed(2)} $
     Statut: ${this.getLineStatusLabel(line.lineStatus, order.language)}
`).join('')}
========================================
        `);
    }
}

// Exporter la classe pour utilisation dans d'autres modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderManager;
}
