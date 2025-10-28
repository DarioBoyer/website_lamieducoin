// Admin Production Management - JavaScript
/**
 * Gestion de la production
 * Planification et suivi des commandes en production
 */

import dbConnection from '../config/database.js';
import orderService from './services/orderService.js';

// Global variables
let allOrders = [];
let allOrderLines = [];
let selectedDate = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    try {
        // Initialize database connection
        await dbConnection.init();
        console.log('✅ Connexion à la base de données établie');

        // Load initial data
        await loadProductionData();

        // Setup event listeners
        setupEventListeners();

        // Set today's date as default
        const today = getTodayDate();
        document.getElementById('dateFilter').value = today;
        selectedDate = today;

        // Load today's production
        await loadProductionSchedule(today);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        showError('Erreur lors de l\'initialisation de l\'application');
    }
}

// Load all production data
async function loadProductionData() {
    try {
        // Load all orders with their lines
        const orders = await orderService.getAllOrders();
        
        // Get detailed order lines for all orders
        const ordersWithLines = await Promise.all(
            orders.map(async (order) => {
                const orderWithLines = await orderService.getOrderWithLines(order.id);
                return orderWithLines;
            })
        );

        allOrders = ordersWithLines;
        
        // Flatten all order lines
        allOrderLines = allOrders.flatMap(order => 
            (order.OrdersLines || []).map(line => ({
                ...line,
                orderInfo: {
                    id: order.id,
                    GuidId: order.GuidId,
                    customerLastName: order.customerLastName,
                    customerFirstName: order.customerFirstName,
                    deliveryDate: order.deliveryDate,
                    status: order.status,
                    scheduledOn: order.scheduledOn
                }
            }))
        );

        console.log('✅ Données de production chargées:', allOrders.length, 'commandes');
        
        // Update statistics
        updateStatistics();
        
        // Load new orders to schedule
        loadNewOrders();

    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        throw error;
    }
}

// Update statistics cards
function updateStatistics() {
    const stats = {
        unscheduled: 0,
        scheduled: 0,
        today: 0,
        completed: 0
    };

    const today = getTodayDate();

    allOrderLines.forEach(line => {
        if (!line.scheduledOn) {
            stats.unscheduled++;
        } else {
            stats.scheduled++;
            
            const lineDate = line.scheduledOn.split('T')[0];
            if (lineDate === today) {
                stats.today++;
            }
        }

        if (line.lineStatus === 'Completed') {
            stats.completed++;
        }
    });

    document.getElementById('stat-unscheduled').textContent = stats.unscheduled;
    document.getElementById('stat-scheduled').textContent = stats.scheduled;
    document.getElementById('stat-today').textContent = stats.today;
    document.getElementById('stat-completed').textContent = stats.completed;
}

// Load new orders that need scheduling
function loadNewOrders() {
    const newOrders = allOrders.filter(order => order.status === 'New');
    
    const container = document.getElementById('newOrdersContainer');
    const countBadge = document.getElementById('newOrdersCount');
    
    countBadge.textContent = newOrders.length;

    if (newOrders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-check-circle fs-1"></i>
                <p class="mt-2">Aucune nouvelle commande à planifier</p>
            </div>
        `;
        return;
    }

    container.innerHTML = newOrders.map(order => {
        const itemCount = order.OrdersLines?.length || 0;
        const totalQty = order.OrdersLines?.reduce((sum, line) => sum + (line.quantityOrdered || 0), 0) || 0;
        
        return `
            <div class="card order-card status-new mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h6 class="mb-1">
                                <i class="bi bi-person-circle"></i> 
                                ${order.customerLastName} ${order.customerFirstName}
                            </h6>
                            <small class="text-muted">
                                <i class="bi bi-hash"></i> Commande #${order.id}
                            </small>
                            ${order.deliveryDate ? `
                                <br><small class="text-muted">
                                    <i class="bi bi-calendar-event"></i> Livraison: ${formatDate(order.deliveryDate)}
                                </small>
                            ` : ''}
                        </div>
                        <div class="col-md-3">
                            <div class="text-center">
                                <h5 class="mb-0 text-primary">${totalQty}</h5>
                                <small class="text-muted">${itemCount} produit(s)</small>
                            </div>
                        </div>
                        <div class="col-md-3 text-end">
                            <button class="btn btn-schedule" onclick="openScheduleModal(${order.id})">
                                <i class="bi bi-calendar-plus"></i> Planifier
                            </button>
                        </div>
                    </div>
                    ${order.OrdersLines && order.OrdersLines.length > 0 ? `
                        <hr class="my-2">
                        <div class="small text-muted">
                            ${order.OrdersLines.map(line => `
                                <span class="badge bg-secondary me-1">
                                    ${line.Products?.title_fr || line.productId} (${line.quantityOrdered})
                                </span>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Load production schedule for a specific date
async function loadProductionSchedule(date) {
    const container = document.getElementById('productionScheduleContainer');
    
    if (!date) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-calendar-x fs-1"></i>
                <p class="mt-2">Sélectionnez une date</p>
            </div>
        `;
        return;
    }

    // Filter lines scheduled for this date
    const scheduledLines = allOrderLines.filter(line => {
        if (!line.scheduledOn) return false;
        const lineDate = line.scheduledOn.split('T')[0];
        return lineDate === date;
    });

    if (scheduledLines.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-calendar-x"></i>
                <p>Aucune production planifiée pour cette date</p>
            </div>
        `;
        return;
    }

    // Group by order
    const orderGroups = {};
    scheduledLines.forEach(line => {
        const orderId = line.orderInfo.id;
        if (!orderGroups[orderId]) {
            orderGroups[orderId] = {
                order: line.orderInfo,
                lines: []
            };
        }
        orderGroups[orderId].lines.push(line);
    });

    const today = getTodayDate();
    const isToday = date === today;

    container.innerHTML = `
        <div class="day-section">
            <div class="day-header ${isToday ? 'today' : ''}">
                <div>
                    <h4 class="mb-0">
                        <i class="bi bi-calendar3"></i> 
                        ${formatDate(date)}
                        ${isToday ? '<span class="badge bg-light text-dark ms-2">Aujourd\'hui</span>' : ''}
                    </h4>
                    <small>${scheduledLines.length} article(s) à produire</small>
                </div>
                <div>
                    <input type="checkbox" class="select-all-day form-check-input me-2" id="selectAllDay">
                    <label class="form-check-label me-3" for="selectAllDay">Tout sélectionner</label>
                    <button class="btn btn-mark-complete btn-sm" onclick="markSelectedAsCompleted()">
                        <i class="bi bi-check-circle"></i> Marquer comme produit
                    </button>
                </div>
            </div>
            <div class="day-content">
                ${Object.values(orderGroups).map(group => `
                    <div class="card mb-3">
                        <div class="card-header bg-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>
                                        <i class="bi bi-person-circle"></i> 
                                        ${group.order.customerLastName} ${group.order.customerFirstName}
                                    </strong>
                                    <span class="ms-2 text-muted">
                                        #${group.order.id}
                                    </span>
                                    ${group.order.deliveryDate ? `
                                        <span class="ms-2">
                                            <i class="bi bi-calendar-event"></i> 
                                            ${formatDate(group.order.deliveryDate)}
                                        </span>
                                    ` : ''}
                                </div>
                                <span class="status-badge status-${group.order.status.toLowerCase()}">
                                    ${getStatusLabel(group.order.status)}
                                </span>
                            </div>
                        </div>
                        <div class="card-body p-0">
                            <table class="table production-table mb-0">
                                <thead>
                                    <tr>
                                        <th style="width: 50px;">
                                            <input type="checkbox" class="form-check-input select-order" 
                                                   data-order-id="${group.order.id}">
                                        </th>
                                        <th>Produit</th>
                                        <th style="width: 120px;">Quantité</th>
                                        <th style="width: 120px;">Produit</th>
                                        <th style="width: 100px;">Heure</th>
                                        <th style="width: 100px;">Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${group.lines.map(line => {
                                        const isCompleted = line.lineStatus === 'Completed';
                                        return `
                                            <tr class="production-item ${isCompleted ? 'completed' : ''}" 
                                                data-line-id="${line.id}">
                                                <td>
                                                    <input type="checkbox" class="form-check-input line-checkbox" 
                                                           data-line-id="${line.id}" 
                                                           data-order-id="${group.order.id}"
                                                           ${isCompleted ? 'disabled' : ''}>
                                                </td>
                                                <td>
                                                    <i class="bi bi-${line.Products?.icon || 'basket'} me-2"></i>
                                                    ${line.Products?.title_fr || line.productId}
                                                </td>
                                                <td>
                                                    <strong>${line.quantityOrdered}</strong> 
                                                    ${line.Products?.unit || 'unité(s)'}
                                                </td>
                                                <td>
                                                    ${isCompleted ? 
                                                        `<span class="text-success">${line.quantityProduced || line.quantityOrdered}</span>` : 
                                                        `<span class="text-muted">0</span>`
                                                    }
                                                </td>
                                                <td>
                                                    <small class="text-muted">
                                                        ${formatTime(line.scheduledOn)}
                                                    </small>
                                                </td>
                                                <td>
                                                    ${isCompleted ? 
                                                        '<span class="badge bg-success"><i class="bi bi-check"></i> Fait</span>' : 
                                                        '<span class="badge bg-warning">En attente</span>'
                                                    }
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Setup checkboxes
    setupDayCheckboxes();
}

// Setup event listeners
function setupEventListeners() {
    // Date filter
    const dateFilter = document.getElementById('dateFilter');
    dateFilter.addEventListener('change', async (e) => {
        selectedDate = e.target.value;
        await loadProductionSchedule(selectedDate);
    });

    // Schedule form
    const confirmSchedule = document.getElementById('confirmSchedule');
    confirmSchedule.addEventListener('click', handleScheduleSubmit);
}

// Setup checkbox behaviors for a day
function setupDayCheckboxes() {
    // Select all day checkbox
    const selectAllDay = document.getElementById('selectAllDay');
    if (selectAllDay) {
        selectAllDay.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.line-checkbox:not([disabled])');
            checkboxes.forEach(cb => cb.checked = e.target.checked);
        });
    }

    // Select all order checkboxes
    const orderCheckboxes = document.querySelectorAll('.select-order');
    orderCheckboxes.forEach(cb => {
        cb.addEventListener('change', (e) => {
            const orderId = e.target.dataset.orderId;
            const lineCheckboxes = document.querySelectorAll(`.line-checkbox[data-order-id="${orderId}"]:not([disabled])`);
            lineCheckboxes.forEach(lineCb => lineCb.checked = e.target.checked);
        });
    });
}

// Open schedule modal
function openScheduleModal(orderId) {
    const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    document.getElementById('scheduleOrderId').value = orderId;
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('scheduledDate').value = tomorrow.toISOString().split('T')[0];
    
    modal.show();
}

// Handle schedule submission
async function handleScheduleSubmit() {
    const orderId = parseInt(document.getElementById('scheduleOrderId').value);
    const date = document.getElementById('scheduledDate').value;
    const time = document.getElementById('scheduledTime').value;

    if (!orderId || !date || !time) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    const scheduledOn = `${date}T${time}:00`;

    try {
        // Get the order
        const order = allOrders.find(o => o.id === orderId);
        if (!order) {
            showError('Commande non trouvée');
            return;
        }

        // Update all lines with the scheduled date
        const updatePromises = order.OrdersLines.map(line => 
            orderService.updateOrderLine(line.id, { 
                scheduledOn: scheduledOn,
                lineStatus: 'Plan'
            })
        );

        await Promise.all(updatePromises);

        // Update order status to Plan
        await orderService.updateOrderStatus(orderId, 'Plan');

        // Update order's scheduledOn to the furthest date (in this case, all lines have same date)
        await orderService.updateOrder(orderId, { scheduledOn: scheduledOn });

        showSuccess('Production planifiée avec succès');

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('scheduleModal'));
        modal.hide();

        // Reload data
        await loadProductionData();
        if (selectedDate) {
            await loadProductionSchedule(selectedDate);
        }

    } catch (error) {
        console.error('Erreur lors de la planification:', error);
        showError('Erreur lors de la planification de la production');
    }
}

// Mark selected items as completed
async function markSelectedAsCompleted() {
    const selectedCheckboxes = document.querySelectorAll('.line-checkbox:checked');
    
    if (selectedCheckboxes.length === 0) {
        showError('Veuillez sélectionner au moins un article');
        return;
    }

    const lineIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.lineId));
    const affectedOrders = new Set(Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.orderId)));

    try {
        // Update each line
        const updatePromises = lineIds.map(async (lineId) => {
            const line = allOrderLines.find(l => l.id === lineId);
            if (!line) return;

            await orderService.updateOrderLine(lineId, {
                lineStatus: 'Completed',
                quantityProduced: line.quantityOrdered
            });
        });

        await Promise.all(updatePromises);

        // Check each affected order to see if all lines are completed
        for (const orderId of affectedOrders) {
            await checkAndUpdateOrderStatus(orderId);
        }

        showSuccess(`${lineIds.length} article(s) marqué(s) comme produit(s)`);

        // Reload data
        await loadProductionData();
        if (selectedDate) {
            await loadProductionSchedule(selectedDate);
        }

    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        showError('Erreur lors de la mise à jour de la production');
    }
}

// Check if all lines of an order are completed and update order status
async function checkAndUpdateOrderStatus(orderId) {
    try {
        const orderWithLines = await orderService.getOrderWithLines(orderId);
        
        if (!orderWithLines || !orderWithLines.OrdersLines) return;

        const allCompleted = orderWithLines.OrdersLines.every(line => line.lineStatus === 'Completed');

        if (allCompleted && orderWithLines.status !== 'Completed') {
            await orderService.updateOrderStatus(orderId, 'Completed');
            console.log(`✅ Commande #${orderId} marquée comme complétée`);
        }

    } catch (error) {
        console.error(`Erreur lors de la vérification de la commande #${orderId}:`, error);
    }
}

// Utility Functions

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-CA', options);
}

// Format time
function formatTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Get status label
function getStatusLabel(status) {
    const statusLabels = {
        'New': 'Reçu',
        'Plan': 'Planifié',
        'Production': 'En production',
        'Completed': 'Prête',
        'Done': 'Récupéré',
        'Cancel': 'Annulé'
    };
    return statusLabels[status] || status;
}

// Show success message
function showSuccess(message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = 'toast-' + Date.now();
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle-fill me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Show error message
function showError(message) {
    const toastContainer = document.querySelector('.toast-container');
    const toastId = 'toast-' + Date.now();
    
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { autohide: true, delay: 5000 });
    toast.show();
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Make functions available globally for onclick handlers
window.openScheduleModal = openScheduleModal;
window.markSelectedAsCompleted = markSelectedAsCompleted;
