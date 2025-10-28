// Admin Orders Management - JavaScript

// Global variables
let allOrders = [];
let filteredOrders = [];
let currentSort = { field: 'orderId', direction: 'asc' };
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
        await loadOrders();
        setupEventListeners();
        applyFilters();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Erreur lors du chargement des commandes');
    }
}

// Load orders from JSON file and localStorage
async function loadOrders() {
    try {
        const response = await fetch('../data/orders.json');
        if (!response.ok) throw new Error('Failed to load orders');
        
        const data = await response.json();
        let jsonOrders = data.orders || [];
        
        // Load local orders from localStorage
        let localOrders = [];
        try {
            const storedOrders = localStorage.getItem('localOrders');
            if (storedOrders) {
                localOrders = JSON.parse(storedOrders);
                console.log(`Loaded ${localOrders.length} orders from localStorage`);
            }
        } catch (error) {
            console.error('Error loading local orders:', error);
        }
        
        // Merge orders from JSON file and localStorage
        allOrders = [...jsonOrders, ...localOrders];
        
        console.log(`Loaded ${allOrders.length} orders (${jsonOrders.length} from JSON, ${localOrders.length} local)`);
    } catch (error) {
        console.error('Error loading orders:', error);
        throw error;
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
        btn.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });
    
    // Table sorting
    const sortableHeaders = document.querySelectorAll('.sortable');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            sortTable(this.dataset.sort);
        });
    });
    
    // Print button in modal
    const printBtn = document.getElementById('printOrder');
    printBtn.addEventListener('click', printOrder);
}

// Apply filters to orders
function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;
    
    filteredOrders = allOrders.filter(order => {
        // Status filter
        if (statusFilter === 'active') {
            if (!activeStatuses.includes(order.status)) return false;
        } else if (statusFilter !== 'all' && order.status !== statusFilter) {
            return false;
        }
        
        // Date filter
        if (dateFilter) {
            const orderDate = order.deliveryDate.split('T')[0];
            if (orderDate !== dateFilter) return false;
        }
        
        // Search filter
        if (searchTerm) {
            const customerName = `${order.customerFirstName} ${order.customerLastName}`.toLowerCase();
            const email = (order.email || '').toLowerCase();
            const phone = (order.phone || '').toLowerCase();
            const orderId = order.orderId.toString();
            
            if (!customerName.includes(searchTerm) && 
                !email.includes(searchTerm) && 
                !phone.includes(searchTerm) &&
                !orderId.includes(searchTerm)) {
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
    
    document.getElementById('stat-new').textContent = stats.new;
    document.getElementById('stat-plan').textContent = stats.plan;
    document.getElementById('stat-production').textContent = stats.production;
    document.getElementById('stat-total').textContent = stats.total;
}

// Sort orders
function sortOrders() {
    filteredOrders.sort((a, b) => {
        let aVal, bVal;
        
        switch (currentSort.field) {
            case 'orderId':
                aVal = a.orderId;
                bVal = b.orderId;
                break;
            case 'customer':
                aVal = `${a.customerLastName} ${a.customerFirstName}`.toLowerCase();
                bVal = `${b.customerLastName} ${b.customerFirstName}`.toLowerCase();
                break;
            case 'deliveryDate':
                aVal = new Date(a.deliveryDate);
                bVal = new Date(b.deliveryDate);
                break;
            case 'itemCount':
                aVal = a.orderLines.length;
                bVal = b.orderLines.length;
                break;
            case 'totalAmount':
                aVal = a.totalAmount;
                bVal = b.totalAmount;
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
    sortedHeader.classList.add(`sort-${currentSort.direction}`);
    
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
    
    document.getElementById('orderCount').textContent = filteredOrders.length;
}

// Render table view
function renderTableView() {
    const tbody = document.getElementById('ordersTableBody');
    
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
        const itemCount = order.orderLines.length;
        const totalQty = order.orderLines.reduce((sum, line) => sum + line.quantityOrdered, 0);
        const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
        
        return `
            <tr class="fade-in">
                <td class="fw-bold">#${order.orderId}</td>
                <td>
                    <div class="fw-semibold">${order.customerLastName} ${order.customerFirstName}</div>
                    <small class="text-muted">${order.language === 'fr' ? '🇫🇷' : '🇬🇧'}</small>
                </td>
                <td>
                    <div>${formatDate(order.deliveryDate)}</div>
                    <small class="text-muted">${formatTime(order.scheduledOn)}</small>
                </td>
                <td>
                    <span class="badge bg-secondary">${itemCount} item${itemCount > 1 ? 's' : ''}</span>
                    <small class="text-muted d-block">${totalQty} unité${totalQty > 1 ? 's' : ''}</small>
                </td>
                <td>
                    <div class="fw-bold">${formatCurrency(order.totalAmount)}</div>
                    ${order.paid ? 
                        '<small class="payment-status payment-paid"><i class="bi bi-check-circle-fill"></i> Payé</small>' :
                        '<small class="payment-status payment-unpaid"><i class="bi bi-exclamation-circle-fill"></i> Non payé</small>'
                    }
                </td>
                <td>
                    <span class="status-badge status-${order.status}">
                        <i class="bi bi-${statusInfo.icon}"></i>
                        ${statusInfo.label}
                    </span>
                </td>
                <td>
                    <div class="small">
                        <div><i class="bi bi-envelope"></i> ${order.email}</div>
                        <div><i class="bi bi-telephone"></i> ${order.phone}</div>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn" onclick="showOrderDetail(${order.orderId})">
                        <i class="bi bi-eye"></i> Voir
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Render cards view
function renderCardsView() {
    const container = document.getElementById('ordersCardsContainer');
    
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
        const itemCount = order.orderLines.length;
        const totalQty = order.orderLines.reduce((sum, line) => sum + line.quantityOrdered, 0);
        const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
        
        return `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="card order-card fade-in">
                    <div class="order-card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">Commande #${order.orderId}</h6>
                            <span class="badge bg-light text-dark">${order.language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
                        </div>
                    </div>
                    <div class="order-card-body">
                        <div class="order-info-row">
                            <span class="order-info-label">Client</span>
                            <span class="order-info-value fw-semibold">${order.customerLastName} ${order.customerFirstName}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Livraison</span>
                            <span class="order-info-value">${formatDate(order.deliveryDate)}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Items</span>
                            <span class="order-info-value">
                                <span class="badge bg-secondary">${itemCount}</span>
                                <small class="text-muted ms-1">(${totalQty} unités)</small>
                            </span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Montant</span>
                            <span class="order-info-value fw-bold">${formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Paiement</span>
                            <span class="order-info-value">
                                ${order.paid ? 
                                    '<span class="payment-status payment-paid"><i class="bi bi-check-circle-fill"></i> Payé</span>' :
                                    '<span class="payment-status payment-unpaid"><i class="bi bi-exclamation-circle-fill"></i> Non payé</span>'
                                }
                            </span>
                        </div>
                        <div class="order-info-row">
                            <span class="order-info-label">Statut</span>
                            <span class="order-info-value">
                                <span class="status-badge status-${order.status}">
                                    <i class="bi bi-${statusInfo.icon}"></i>
                                    ${statusInfo.label}
                                </span>
                            </span>
                        </div>
                        <div class="mt-3">
                            <button class="btn btn-primary btn-sm w-100" onclick="showOrderDetail(${order.orderId})">
                                <i class="bi bi-eye"></i> Voir les détails
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
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) return;
    
    const statusInfo = orderStatuses[order.status] || { label: order.status, icon: 'question-circle' };
    const itemCount = order.orderLines.length;
    const totalQty = order.orderLines.reduce((sum, line) => sum + line.quantityOrdered, 0);
    
    const content = `
        <!-- Customer Info -->
        <div class="order-detail-section">
            <h6><i class="bi bi-person-circle"></i> Informations Client</h6>
            <div class="detail-row">
                <span class="detail-label">Nom complet:</span>
                <span class="detail-value">${order.customerFirstName} ${order.customerLastName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${order.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Téléphone:</span>
                <span class="detail-value">${order.phone}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Langue:</span>
                <span class="detail-value">${order.language === 'fr' ? 'Français 🇫🇷' : 'English 🇬🇧'}</span>
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
                <span class="detail-value fw-bold">#${order.orderId}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">GUID:</span>
                <span class="detail-value"><small>${order.orderGuid}</small></span>
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
                <span class="detail-value fw-bold fs-5">${formatCurrency(order.totalAmount)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Dépôt:</span>
                <span class="detail-value">${formatCurrency(order.deposit)}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Solde restant:</span>
                <span class="detail-value">${formatCurrency(order.totalAmount - order.deposit)}</span>
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
                        ${order.orderLines.map(line => {
                            const lineStatusInfo = getLineStatusInfo(line.lineStatus);
                            return `
                                <tr>
                                    <td>${formatProductName(line.productId)}</td>
                                    <td class="text-center">${line.quantityOrdered}</td>
                                    <td class="text-center">
                                        <span class="${line.quantityProduced === line.quantityOrdered ? 'text-success' : 'text-warning'} fw-semibold">
                                            ${line.quantityProduced}
                                        </span>
                                    </td>
                                    <td class="text-end">${formatCurrency(line.price)}</td>
                                    <td class="text-end fw-semibold">${formatCurrency(line.lineTotal)}</td>
                                    <td>
                                        <span class="badge bg-${lineStatusInfo.color}">
                                            ${lineStatusInfo.label}
                                        </span>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                    <tfoot>
                        <tr class="table-light">
                            <td colspan="4" class="text-end fw-bold">Total:</td>
                            <td class="text-end fw-bold">${formatCurrency(order.totalAmount)}</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    
    document.getElementById('orderDetailContent').innerHTML = content;
    
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
        tableView.classList.remove('d-none');
        cardsView.classList.add('d-none');
    } else {
        tableView.classList.add('d-none');
        cardsView.classList.remove('d-none');
    }
    
    renderOrders();
}

// Reset all filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = 'active';
    document.getElementById('dateFilter').value = '';
    applyFilters();
}

// Print current order
function printOrder() {
    window.print();
}

// Export Functions

// Export all orders as JSON
function exportAllOrdersJSON() {
    const dataToExport = {
        exportDate: new Date().toISOString(),
        totalOrders: allOrders.length,
        orders: allOrders
    };
    
    downloadJSON(dataToExport, `toutes-commandes-${getTodayDate()}.json`);
    
    // Show success message
    showSuccess(`${allOrders.length} commandes exportées avec succès`);
}

// Export only local orders (from localStorage)
function exportLocalOrdersJSON() {
    const localOrders = JSON.parse(localStorage.getItem('localOrders') || '[]');
    
    if (localOrders.length === 0) {
        alert('Aucune commande locale à exporter');
        return;
    }
    
    const dataToExport = {
        exportDate: new Date().toISOString(),
        totalOrders: localOrders.length,
        orders: localOrders
    };
    
    downloadJSON(dataToExport, `commandes-locales-${getTodayDate()}.json`);
    
    // Show success message
    showSuccess(`${localOrders.length} commandes locales exportées avec succès`);
}

// Download JSON file
function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Show success message
function showSuccess(message) {
    // Create a temporary toast/alert
    const toast = document.createElement('div');
    toast.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Format time
function formatTime(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-CA', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Format product name
function formatProductName(productId) {
    return productId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
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
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-5">
                <i class="bi bi-exclamation-triangle fs-1 text-danger"></i>
                <p class="mt-3 text-danger">${message}</p>
            </td>
        </tr>
    `;
}
