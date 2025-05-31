const API_BASE_URL = 'https://iconstreams-backend.onrender.com' ; // Replace with actual Render backend URL

document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    loadAdminUserInfo();
    loadSubscriptionsList(); // ← New function to fetch subscriptions from API
});

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('expanded');
        });
    }
}

function loadAdminUserInfo() {
    const adminUserName = document.getElementById('adminUserName');
    const user = JSON.parse(sessionStorage.getItem('adminUser'));

    if (adminUserName && user) {
        adminUserName.textContent = user.name;
    }
}

async function loadSubscriptionsList() {
    const token = sessionStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_BASE_URL}/api/subscriptions`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const subscriptions = await res.json();
        displaySubscriptions(subscriptions);
    } catch (err) {
        console.error('Failed to fetch subscriptions:', err);
    }
}

function displaySubscriptions(subscriptions) {
    const tableBody = document.getElementById('subscriptionsList');
    if (!tableBody) return;

    tableBody.innerHTML = subscriptions.map(sub => `
        <tr>
            <td>${sub.user?.name || 'Unknown'}</td>
            <td>${sub.plan}</td>
            <td>${new Date(sub.startDate).toLocaleDateString()}</td>
            <td>${new Date(sub.endDate).toLocaleDateString()}</td>
            <td>
                <span class="admin-badge ${sub.active ? 'success' : 'danger'}">
                    ${sub.active ? 'Active' : 'Inactive'}
                </span>
            </td>
        </tr>
    `).join('');
}
