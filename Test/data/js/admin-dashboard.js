// Admin Dashboard JavaScript
import dbConnection from './config/database.js';
import orderService from './services/orderService.js';

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Initialize database connection
        await dbConnection.init();
        console.log('✅ Database initialized for dashboard');
        
        // Load dashboard data
        await loadDashboardData();
        initializeEventListeners();
    } catch (error) {
        console.error('❌ Error initializing dashboard:', error);
        displayConnectionError();
    }
});

// Load all dashboard data
async function loadDashboardData() {
    await Promise.all([
        loadStatistics(),
        loadTodayTasks(),
        loadAlerts(),
        loadUpcomingDeliveries()
    ]);
}

// Get count of orders by status (generic function)
function getOrderCountByStatus(orders, status) {
    if (!Array.isArray(orders)) {
        return 0;
    }
    return orders.filter(order => order.status === status).length;
}

// Load all orders from Supabase
async function loadAllOrders() {
    try {
        const orders = await orderService.getAllOrders();
        return orders || [];
    } catch (error) {
        console.error('Error loading orders from Supabase:', error);
        return [];
    }
}

// Load statistics
async function loadStatistics() {
    try {
        // Load all orders
        const orders = await loadAllOrders();
        
        // Calculate statistics using generic function
        const newOrders = getOrderCountByStatus(orders, 'New');
        const readyOrders = getOrderCountByStatus(orders, 'Completed');
        
        // Get today's date for production calculation
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => {
            const deliveryDate = o.deliveryDate ? new Date(o.deliveryDate).toISOString().split('T')[0] : null;
            return deliveryDate === today && (o.status === 'Plan' || o.status === 'Production');
        });
        
        // Count items from order lines
        let todayProductionCount = 0;
        for (const order of todayOrders) {
            try {
                const lines = await orderService.getOrderLines(order.id);
                todayProductionCount += lines.length;
            } catch (error) {
                console.error(`Error loading lines for order ${order.id}:`, error);
            }
        }
        
        // Update UI
        document.getElementById('stat-new-orders').textContent = newOrders;
        document.getElementById('stat-today-production').textContent = todayProductionCount;
        document.getElementById('stat-ready-orders').textContent = readyOrders;
        document.getElementById('stat-low-stock').textContent = '0'; // Placeholder for inventory system
    } catch (error) {
        console.error('Error loading statistics:', error);
        // Display 0 on error
        document.getElementById('stat-new-orders').textContent = '0';
        document.getElementById('stat-today-production').textContent = '0';
        document.getElementById('stat-ready-orders').textContent = '0';
        document.getElementById('stat-low-stock').textContent = '0';
    }
}

// Load today's tasks
async function loadTodayTasks() {
    try {
        const orders = await loadAllOrders();
        const today = new Date().toISOString().split('T')[0];
        
        const tasks = [];
        
        // Task: New orders to plan
        const newOrdersCount = getOrderCountByStatus(orders, 'New');
        if (newOrdersCount > 0) {
            tasks.push({
                id: 'plan-orders',
                text: `Planifier ${newOrdersCount} nouvelle(s) commande(s)`,
                priority: 'high',
                link: 'gestion-commandes.html?status=New',
                completed: false
            });
        }
        
        // Task: Today's production
        const todayProduction = orders.filter(o => {
            const deliveryDate = o.deliveryDate ? new Date(o.deliveryDate).toISOString().split('T')[0] : null;
            return deliveryDate === today && o.status === 'Plan';
        });
        if (todayProduction.length > 0) {
            tasks.push({
                id: 'start-production',
                text: `Démarrer la production pour ${todayProduction.length} commande(s)`,
                priority: 'high',
                link: 'gestion-production.html',
                completed: false
            });
        }
        
        // Task: Ready for pickup
        const readyOrdersCount = getOrderCountByStatus(orders, 'Completed');
        if (readyOrdersCount > 0) {
            tasks.push({
                id: 'ready-pickup',
                text: `${readyOrdersCount} commande(s) prête(s) pour récupération`,
                priority: 'medium',
                link: 'gestion-commandes.html?status=Completed',
                completed: false
            });
        }
        
        renderTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('todayTasks').innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-exclamation-circle fs-1"></i>
                <p class="mt-2">Erreur lors du chargement des tâches</p>
            </div>
        `;
    }
}

// Render tasks
function renderTasks(tasks) {
    const container = document.getElementById('todayTasks');
    
    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <p class="mt-2">Toutes les tâches sont complétées!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="list-group-item priority-${task.priority}">
            <div class="d-flex align-items-center">
                <input type="checkbox" id="task-${task.id}" 
                       ${task.completed ? 'checked' : ''}>
                <div class="flex-grow-1 ms-3">
                    <div class="task-text">${task.text}</div>
                </div>
                <a href="${task.link}" class="btn btn-sm btn-outline-primary">
                    <i class="bi bi-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

// Load alerts and notifications
async function loadAlerts() {
    try {
        const alerts = [];
        const orders = await loadAllOrders();
        
        // Check for orders needing attention
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        orders.forEach(order => {
            if (!order.deliveryDate) return;
            
            const deliveryDate = new Date(order.deliveryDate);
            const orderRef = order.GuidId || order.id;
            
            // Alert for tomorrow's deliveries not in production
            if (deliveryDate.toDateString() === tomorrow.toDateString() && 
                order.status !== 'Production' && order.status !== 'Completed' && order.status !== 'Done') {
                alerts.push({
                    type: 'warning',
                    icon: 'bi-exclamation-triangle-fill',
                    message: `Commande #${orderRef} pour demain n'est pas en production`,
                    time: 'Maintenant'
                });
            }
            
            // Alert for overdue orders
            if (deliveryDate < now && order.status !== 'Completed' && order.status !== 'Done') {
                alerts.push({
                    type: 'danger',
                    icon: 'bi-exclamation-circle-fill',
                    message: `Commande #${orderRef} est en retard!`,
                    time: 'Urgent'
                });
            }
        });
        
        renderAlerts(alerts);
    } catch (error) {
        console.error('Error loading alerts:', error);
    }
}

// Render alerts
function renderAlerts(alerts) {
    const container = document.getElementById('alerts');
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-check-circle fs-1 text-success"></i>
                <p class="mt-2">Aucune alerte pour le moment</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item alert-${alert.type}">
            <div class="d-flex align-items-start">
                <i class="bi ${alert.icon} me-2 mt-1"></i>
                <div class="flex-grow-1">
                    <div>${alert.message}</div>
                    <small class="text-muted">${alert.time}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Load upcoming deliveries
async function loadUpcomingDeliveries() {
    try {
        const orders = await loadAllOrders();
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Get orders for the next 7 days
        const upcomingOrders = orders
            .filter(order => {
                if (!order.deliveryDate) return false;
                const deliveryDate = new Date(order.deliveryDate);
                return deliveryDate >= today && 
                       deliveryDate <= nextWeek && 
                       order.status !== 'Done' && 
                       order.status !== 'Cancel';
            })
            .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
            .slice(0, 5); // Show only next 5 deliveries
        
        // Load order lines for each order
        for (const order of upcomingOrders) {
            try {
                order.orderLines = await orderService.getOrderLines(order.id);
            } catch (error) {
                console.error(`Error loading lines for order ${order.id}:`, error);
                order.orderLines = [];
            }
        }
        
        renderUpcomingDeliveries(upcomingOrders);
    } catch (error) {
        console.error('Error loading upcoming deliveries:', error);
    }
}

// Render upcoming deliveries
function renderUpcomingDeliveries(orders) {
    const tbody = document.getElementById('upcomingDeliveries');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    <i class="bi bi-calendar-x"></i> Aucune livraison prévue
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map(order => {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const itemCount = order.orderLines?.length || 0;
        const orderRef = order.id;//order.GuidId || order.id;
        const customerName = `${order.customerFirstName || ''} ${order.customerLastName || ''}`.trim();
        
        return `
            <tr>
                <td>${formatDate(order.deliveryDate)}</td>
                <td><strong>#${orderRef}</strong></td>
                <td>${customerName}</td>
                <td>${itemCount} article${itemCount > 1 ? 's' : ''}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <a href="gestion-commandes.html?order=${orderRef}" 
                       class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-eye"></i> Détails
                    </a>
                </td>
            </tr>
        `;
    }).join('');
}

// Helper Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('fr-CA', options);
}

function getStatusClass(status) {
    const statusMap = {
        'New': 'status-new',
        'Plan': 'status-plan',
        'Production': 'status-production',
        'Completed': 'status-completed',
        'Done': 'status-done'
    };
    return statusMap[status] || 'status-new';
}

function getStatusText(status) {
    const statusMap = {
        'New': 'Nouvelle',
        'Plan': 'Planifiée',
        'Production': 'En Production',
        'Completed': 'Prête',
        'Done': 'Récupérée',
        'Cancel': 'Annulée'
    };
    return statusMap[status] || status;
}

// Display connection error
function displayConnectionError() {
    const containers = ['todayTasks', 'alerts', 'upcomingDeliveries'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle fs-1"></i>
                    <p class="mt-2">Erreur de connexion à la base de données</p>
                </div>
            `;
        }
    });
}

// Initialize event listeners
function initializeEventListeners() {
    // Auto-refresh every 5 minutes
    setInterval(() => {
        loadDashboardData();
    }, 300000);
}

// Export functions for use in other scripts
window.dashboardAPI = {
    refresh: loadDashboardData,
    loadStatistics,
    loadTasks: loadTodayTasks,
    loadAlerts,
    loadUpcomingDeliveries,
    getOrderCountByStatus,
    loadAllOrders
};
