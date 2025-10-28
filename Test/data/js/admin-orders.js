// Admin Orders Management - JavaScript
import dbConnection from './config/database.js';
import orderService from './services/orderService.js';

// Global variables
let allOrders = [];
let filteredOrders = [];
let currentSort = { field: 'id', direction: 'desc' };
let currentView = 'table';

// Order statuses configuration
const orderStatuses = {
    'New': { label: 'Reçu', icon: 'inbox-fill' },
    'Plan': { label: 'Planifié', icon: 'calendar-check' },
    'Production': { label: 'En production', icon: 'gear-fill' },
    'Completed': { label: 'Prête', icon: 'check-circle-fill' },
    'Done': { label: 'Récupéré', icon: 'bag-check-fill' },
    'Cancel': { label: 'Annulé', icon: 'x-circle-fill' }
};

const activeStatuses = ['New', 'Plan', 'Production'];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    try {
        // Initialize database connection
        await dbConnection.init();
        console.log('✅ Database initialized for orders management');
        
        // Load orders and setup UI
        await loadOrders();
        setupEventListeners();
    } catch (error) {
        console.error('❌ Error initializing orders management:', error);
        showError('Erreur lors de l\'initialisation de la page');
    }
}

// Load orders from Supabase
async function loadOrders() {
    try {
        // Load all orders from Supabase
        const orders = await orderService.getAllOrders();
        
        // Load order lines for each order
        for (const order of orders) {
            try {
                order.orderLines = await orderService.getOrderLines(order.id);
            } catch (error) {
                console.error(`Error loading lines for order ${order.id}:`, error);
                order.orderLines = [];
            }
        }
        
        allOrders = orders;
        console.log(`✅ Loaded ${allOrders.length} orders from Supabase`);
        
        // Apply filters and render
        applyFilters();
    } catch (error) {
        console.error('Error loading orders from Supabase:', error);
        showError('Erreur lors du chargement des commandes');
        allOrders = [];
        applyFilters();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', applyFilters);
    
    // Date filter
    const dateFilter = document.getElementById('dateFilter');
    dateFilter.addEventListener('change', applyFilters);
    
    // Reset filters button
    const resetBtn = document.getElementById('resetFilters');
    resetBtn.addEventListener('click', resetFilters);
    
    // View toggle buttons
    const viewButtons = document.querySelectorAll('[data-view]');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    
    // Table sorting
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => sortTable(header.dataset.sort));
    });
    
    // Print button in modal
    const printBtn = document.getElementById('printOrder');
    if (printBtn) {
        printBtn.addEventListener('click', printOrder);
    }
}

// Apply filters to orders
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (!searchInput || !statusFilter || !dateFilter) {
        console.error('Filter elements not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const dateValue = dateFilter.value;
    
    filteredOrders = allOrders.filter(order => {
        // Status filter
        if (statusValue === 'active') {
            if (!activeStatuses.includes(order.status)) return false;
        } else if (statusValue !== 'all' && order.status !== statusValue) {
            return false;
        }
        
        // Date filter
        if (dateValue && order.deliveryDate) {
            const orderDate = order.deliveryDate.split('T')[0];
            if (orderDate !== dateValue) return false;
        }
        
        // Search filter
        if (searchTerm) {
            const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.toLowerCase();
            const email = (order.email || '').toLowerCase();
            const phone = (order.phone || '').toLowerCase();
            const orderId = order.id.toString();
            const guidId = (order.GuidId || '').toLowerCase();
            
            if (!customerName.includes(searchTerm) && 
                !email.includes(searchTerm) && 
                !phone.includes(searchTerm) &&
                !orderId.includes(searchTerm) &&
                !guidId.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    updateStatistics();
    sortOrders();
    renderOrders();
}

// Update statistics cards
function updateStatistics() {
    const stats = {
        new: 0,
        plan: 0,
        production: 0,
        total: 0
    };
    
    allOrders.forEach(order => {
        if (activeStatuses.includes(order.status)) {
            stats.total++;
            if (order.status === 'New') stats.new++;
            if (order.status === 'Plan') stats.plan++;
            if (order.status === 'Production') stats.production++;
        }
    });
    
    const statNew = document.getElementById('stat-new');
    const statPlan = document.getElementById('stat-plan');
    const statProduction = document.getElementById('stat-production');
    const statTotal = document.getElementById('stat-total');
    
    if (statNew) statNew.textContent = stats.new;
    if (statPlan) statPlan.textContent = stats.plan;
    if (statProduction) statProduction.textContent = stats.production;
    if (statTotal) statTotal.textContent = stats.total;
}

// Sort orders
function sortOrders() {
    filteredOrders.sort((a, b) => {
        let aVal, bVal;
        
        switch (currentSort.field) {
            case 'id':
                aVal = a.id;
                bVal = b.id;
                break;
            case 'customer':
                aVal = `${a.customerLastName || ''} ${a.customerFirstName || ''}`.toLowerCase();
                bVal = `${b.customerLastName || ''} ${b.customerFirstName || ''}`.toLowerCase();
                break;
            case 'deliveryDate':
                aVal = new Date(a.deliveryDate || 0);
                bVal = new Date(b.deliveryDate || 0);
                break;
            case 'itemCount':
                aVal = a.orderLines?.length || 0;
                bVal = b.orderLines?.length || 0;
                break;
            case 'totalAmount':
                aVal = a.totalAmount || 0;
                bVal = b.totalAmount || 0;
                break;
            case 'status':
                aVal = a.status;
                bVal = b.status;
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });
}

// Sort table by column
function sortTable(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    
    // Update UI
    document.querySelectorAll('.sortable').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    const sortedHeader = document.querySelector(`[data-sort="${field}"]`);
    if (sortedHeader) {
        sortedHeader.classList.add(`sort-${currentSort.direction}`);
    }
    
    sortOrders();
    renderOrders();
}

// Render orders based on current view
function renderOrders() {
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardsView();
    }
    
    const orderCount = document.getElementById('orderCount');
    if (orderCount) {
        orderCount.textContent = filteredOrders.length;
    }
}

// Render table view
function renderTableView() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-5">
                    <i class="bi bi-inbox fs-1 text-muted"></i>
                    <p class="mt-3 text-muted">Aucune commande trouvée</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = filteredOrders.map(order => {
        const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
        const itemCount = order.orderLines?.length || 0;
        const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim();
        const orderRef = order.id;
        
        return `
            <tr>
                <td><strong>#${orderRef}</strong></td>
                <td>${customerName}</td>
                <td>${order.email || 'N/A'}</td>
                <td>${order.phone || 'N/A'}</td>
                <td>${formatDate(order.deliveryDate)}</td>
                <td>${itemCount}</td>
                <td>${formatCurrency(order.totalAmount || 0)}</td>
                <td>
                    <span class="status-badge status-${order.status}">
                        <i class="bi bi-${statusInfo.icon}"></i>
                        ${statusInfo.label}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="showOrderDetail(${orderRef})">
                        <i class="bi bi-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render cards view
function renderCardsView() {
    const container = document.getElementById('ordersCardsContainer');
    if (!container) return;
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="mt-3 text-muted">Aucune commande trouvée</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredOrders.map(order => {
        const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
        const itemCount = order.orderLines?.length || 0;
        const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim();
        const orderRef = order.id;
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card order-card">
                    <div class="order-card-header">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="mb-1">Commande #${orderRef}</h6>
                                <small>${formatDate(order.deliveryDate)}</small>
                            </div>
                            <span class="status-badge status-${order.status}">
                                <i class="bi bi-${statusInfo.icon}"></i>
                                ${statusInfo.label}
                            </span>
                        </div>
                    </div>
                    <div class="order-card-body">
                        <div class="order-info-row">
                            <span class="order-info-label">Client:</span>
                            <span class="order-info-value">${customerName}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Email:</span>
                            <span class="order-info-value">${order.email || 'N/A'}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Téléphone:</span>
                            <span class="order-info-value">${order.phone || 'N/A'}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Articles:</span>
                            <span class="order-info-value">${itemCount}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Total:</span>
                            <span class="order-info-value fw-bold">${formatCurrency(order.totalAmount || 0)}</span>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-primary w-100" onclick="showOrderDetail(${orderRef})">
                                <i class="bi bi-eye"></i> Voir détails
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Show order detail modal
function showOrderDetail(orderId) {
    const order = allOrders.find(o => o.id === parseInt(orderId));
    if (!order) {
        console.error(`Order ${orderId} not found`);
        return;
    }
    
    const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
    const itemCount = order.orderLines?.length || 0;
    const totalQty = order.orderLines?.reduce((sum, line) => sum + (line.quantityOrdered || 0), 0) || 0;
    const orderRef = order.id;
    
    const content = `
        <!-- Customer Info -->
        <div class="order-detail-section">
            <h6><i class="bi bi-person-circle"></i> Informations Client</h6>
            <div class="detail-row">
                <span class="detail-label">Nom complet:</span>
                <span class="detail-value">${order.customerFirstName || ''} ${order.customerLastName || ''}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${order.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Téléphone:</span>
                <span class="detail-value">${order.phone || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Langue:</span>
                <span class="detail-value">${order.language === 'EN' ? 'English 🇬🇧' : 'Français 🇫🇷'}</span>
            </div>
            ${order.orderNote ? `
                <div class="detail-row">
                    <span class="detail-label">Note:</span>
                    <span class="detail-value fst-italic">"${order.orderNote}"</span>
                </div>
            ` : ''}
        </div>
        
        <!-- Order Info -->
        <div class="order-detail-section">
            <h6><i class="bi bi-receipt"></i> Informations Commande</h6>
            <div class="detail-row">
                <span class="detail-label">Numéro:</span>
                <span class="detail-value fw-bold">#${orderRef}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">GUID:</span>
                <span class="detail-value"><small>${order.GuidId || 'N/A'}</small></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Statut:</span>
                <span class="detail-value">
                    <span class="status-badge status-${order.status}">
                        <i class="bi bi-${statusInfo.icon}"></i>
                        ${statusInfo.label}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date de livraison:</span>
                <span class="detail-value">${formatDate(order.deliveryDate)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Heure prévue:</span>
                <span class="detail-value">${formatTime(order.scheduledOn)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Nombre d'items:</span>
                <span class="detail-value">${itemCount} (${totalQty} unités)</span>
            </div>
        </div>
        
        <!-- Payment Info -->
        <div class="order-detail-section">
            <h6><i class="bi bi-credit-card"></i> Informations Paiement</h6>
            <div class="detail-row">
                <span class="detail-label">Montant total:</span>
                <span class="detail-value fw-bold fs-5">${formatCurrency(order.totalAmount || 0)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Dépôt:</span>
                <span class="detail-value">${formatCurrency(order.deposit || 0)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Solde restant:</span>
                <span class="detail-value">${formatCurrency((order.totalAmount || 0) - (order.deposit || 0))}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Statut paiement:</span>
                <span class="detail-value">
                    ${order.paid ? 
                        '<span class="badge bg-success"><i class="bi bi-check-circle-fill"></i> Payé</span>' :
                        '<span class="badge bg-warning text-dark"><i class="bi bi-exclamation-circle-fill"></i> Non payé</span>'
                    }
                </span>
            </div>
        </div>
        
        <!-- Order Lines -->
        <div class="order-detail-section">
            <h6><i class="bi bi-basket"></i> Articles de la Commande</h6>
            <div class="table-responsive">
                <table class="table table-sm order-lines-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th class="text-center">Qté Cmd</th>
                            <th class="text-center">Qté Prod</th>
                            <th class="text-end">Prix Unit.</th>
                            <th class="text-end">Total</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(order.orderLines || []).map(line => `
                            <tr>
                                <td>
                                    <i class="bi bi-${line.Products?.icon || 'basket'}"></i>
                                    ${line.Products?.title_fr || line.productId}
                                </td>
                                <td class="text-center">${line.quantityOrdered || 0}</td>
                                <td class="text-center">${line.quantityProduced || 0}</td>
                                <td class="text-end">${formatCurrency(line.unitPrice || 0)}</td>
                                <td class="text-end">${formatCurrency((line.quantityOrdered || 0) * (line.unitPrice || 0))}</td>
                                <td>
                                    <span class="badge bg-${getLineStatusInfo(line.lineStatus).color}">
                                        ${getLineStatusInfo(line.lineStatus).label}
                                    </span>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="table-light">
                            <td colspan="4" class="text-end fw-bold">Total:</td>
                            <td class="text-end fw-bold">${formatCurrency(order.totalAmount || 0)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    
    const modalContent = document.getElementById('orderDetailContent');
    if (modalContent) {
        modalContent.innerHTML = content;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();
    
    // Store current order for printing
    window.currentOrderForPrint = order;
}

// Get line status info
function getLineStatusInfo(status) {
    const statusMap = {
        'ToDo': { label: 'À faire', color: 'secondary' },
        'Plan': { label: 'Planifié', color: 'warning' },
        'Production': { label: 'En production', color: 'info' },
        'Completed': { label: 'Complété', color: 'success' }
    };
    return statusMap[status] || { label: status, color: 'secondary' };
}

// Switch view (table/cards)
function switchView(view) {
    currentView = view;
    
    // Update button states
    document.querySelectorAll('[data-view]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    // Toggle views
    const tableView = document.getElementById('tableView');
    const cardsView = document.getElementById('cardsView');
    
    if (view === 'table') {
        tableView?.classList.remove('d-none');
        cardsView?.classList.add('d-none');
    } else {
        tableView?.classList.add('d-none');
        cardsView?.classList.remove('d-none');
    }
    
    renderOrders();
}

// Reset all filters
function resetFilters() {
    const searchInput = document.getElementById('searchInput');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    if (searchInput) searchInput.value = '';
    if (statusFilter) statusFilter.value = 'active';
    if (dateFilter) dateFilter.value = '';
    
    applyFilters();
}

// Print current order
function printOrder() {
    window.print();
}

// Export Functions

// Export all orders as JSON
function exportAllOrdersJSON() {
    const dataStr = JSON.stringify(allOrders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `orders_all_${getTodayDate()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess(`${allOrders.length} commandes exportées`);
}

// Export only today's orders
function exportLocalOrdersJSON() {
    const today = getTodayDate();
    const localOrders = allOrders.filter(order => {
        const createdDate = order.created_at ? order.created_at.split('T')[0] : null;
        return createdDate === today;
    });
    
    if (localOrders.length === 0) {
        showError('Aucune commande créée aujourd\'hui');
        return;
    }
    
    const dataStr = JSON.stringify(localOrders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `orders_today_${today}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showSuccess(`${localOrders.length} commande(s) d'aujourd'hui exportée(s)`);
}

// Download JSON file
function downloadJSON(data, filename) {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', filename);
    linkElement.click();
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Show success message
function showSuccess(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success border-0';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-check-circle-fill me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    // Add to page and show
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove after hiding
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Utility Functions

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-CA', {
        style: 'currency',
        currency: 'CAD'
    }).format(amount);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('fr-CA', options);
}

// Format time
function formatTime(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
}

// Format product name
function formatProductName(productId) {
    // This could be enhanced to look up product names from a products table
    return `Produit #${productId}`;
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-danger border-0';
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, { delay: 5000 });
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Make functions available globally for onclick handlers
window.showOrderDetail = showOrderDetail;
window.exportAllOrdersJSON = exportAllOrdersJSON;
window.exportLocalOrdersJSON = exportLocalOrdersJSON;
