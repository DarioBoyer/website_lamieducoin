// Admin Dashboard JavaScript

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    initializeEventListeners();
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

// Load statistics
async function loadStatistics() {
    try {
        // Fetch orders from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Calculate statistics
        const newOrders = orders.filter(o => o.status === 'New').length;
        const readyOrders = orders.filter(o => o.status === 'Completed').length;
        
        // Get today's date for production calculation
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter(o => {
            const deliveryDate = new Date(o.deliveryDate).toISOString().split('T')[0];
            return deliveryDate === today && (o.status === 'Plan' || o.status === 'Production');
        });
        
        let todayProductionCount = 0;
        todayOrders.forEach(order => {
            todayProductionCount += order.items?.length || 0;
        });
        
        // Update UI
        document.getElementById('stat-new-orders').textContent = newOrders;
        document.getElementById('stat-today-production').textContent = todayProductionCount;
        document.getElementById('stat-ready-orders').textContent = readyOrders;
        document.getElementById('stat-low-stock').textContent = '0'; // Placeholder for inventory system
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load today's tasks
async function loadTodayTasks() {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const today = new Date().toISOString().split('T')[0];
        
        const tasks = [];
        
        // Task: New orders to plan
        const newOrders = orders.filter(o => o.status === 'New');
        if (newOrders.length > 0) {
            tasks.push({
                id: 'plan-orders',
                text: `Planifier ${newOrders.length} nouvelle(s) commande(s)`,
                priority: 'high',
                link: 'gestion-commandes.html?status=New',
                completed: false
            });
        }
        
        // Task: Today's production
        const todayProduction = orders.filter(o => {
            const deliveryDate = new Date(o.deliveryDate).toISOString().split('T')[0];
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
        const readyOrders = orders.filter(o => o.status === 'Completed');
        if (readyOrders.length > 0) {
            tasks.push({
                id: 'ready-pickup',
                text: `${readyOrders.length} commande(s) prête(s) pour récupération`,
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
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        
        // Check for orders needing attention
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        orders.forEach(order => {
            const deliveryDate = new Date(order.deliveryDate);
            
            // Alert for tomorrow's deliveries not in production
            if (deliveryDate.toDateString() === tomorrow.toDateString() && 
                order.status !== 'Production' && order.status !== 'Completed' && order.status !== 'Done') {
                alerts.push({
                    type: 'warning',
                    icon: 'bi-exclamation-triangle-fill',
                    message: `Commande #${order.orderId} pour demain n'est pas en production`,
                    time: 'Maintenant'
                });
            }
            
            // Alert for overdue orders
            if (deliveryDate < now && order.status !== 'Completed' && order.status !== 'Done') {
                alerts.push({
                    type: 'danger',
                    icon: 'bi-exclamation-circle-fill',
                    message: `Commande #${order.orderId} est en retard!`,
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
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        // Get orders for the next 7 days
        const upcomingOrders = orders
            .filter(order => {
                const deliveryDate = new Date(order.deliveryDate);
                return deliveryDate >= today && 
                       deliveryDate <= nextWeek && 
                       order.status !== 'Done' && 
                       order.status !== 'Cancel';
            })
            .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
            .slice(0, 5); // Show only next 5 deliveries
        
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
        const itemCount = order.items?.length || 0;
        
        return `
            <tr>
                <td>${formatDate(order.deliveryDate)}</td>
                <td><strong>#${order.orderId}</strong></td>
                <td>${order.firstName} ${order.lastName}</td>
                <td>${itemCount} article${itemCount > 1 ? 's' : ''}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <a href="gestion-commandes.html?order=${order.orderId}" 
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
    loadUpcomingDeliveries
};
