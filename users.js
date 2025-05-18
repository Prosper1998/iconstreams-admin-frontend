const API_BASE_URL = 'https://your-render-backend-url.com'; // Replace this

document.addEventListener('DOMContentLoaded', function () {
    initSidebar();
    loadAdminUserInfo();
    loadUsersList();
    initUserFilters();
    initUserModal();
});

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
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

async function loadUsersList() {
    const token = sessionStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const users = await res.json();
        displayUsersList(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        displayUsersList([]);
    }
}

function displayUsersList(users) {
    const usersListElement = document.getElementById('usersList');

    if (usersListElement) {
        usersListElement.innerHTML = users.map(user => `
            <tr>
                <td><input type="checkbox" class="user-checkbox" data-id="${user._id}"></td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td><span class="admin-badge ${getSubscriptionBadgeClass(user.subscription || 'none')}">${formatSubscription(user.subscription || 'none')}</span></td>
                <td><span class="admin-badge ${getBadgeClass(user.status)}">${capitalize(user.status)}</span></td>
                <td>${capitalize(user.role || 'user')}</td>
                <td>
                    <div class="admin-actions">
                        <button class="admin-action-btn" onclick="viewUser('${user._id}')"><i class="fas fa-eye"></i></button>
                        <button class="admin-action-btn" onclick="editUser('${user._id}')"><i class="fas fa-edit"></i></button>
                        <button class="admin-action-btn" onclick="deleteUser('${user._id}')"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
}

function initUserFilters() {
    document.getElementById('statusFilter')?.addEventListener('change', loadUsersList);
    document.getElementById('roleFilter')?.addEventListener('change', loadUsersList);
    document.getElementById('userSearch')?.addEventListener('input', loadUsersList);
}

function initUserModal() {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');

    document.getElementById('addUserBtn')?.addEventListener('click', () => {
        form.reset();
        document.getElementById('userModalTitle').textContent = 'Add New User';
        document.getElementById('userPassword').required = true;
        modal.style.display = 'block';
    });

    document.getElementById('closeUserModal')?.addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('cancelUserBtn')?.addEventListener('click', () => modal.style.display = 'none');

    form?.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const token = sessionStorage.getItem('adminToken');

        try {
            const res = await fetch(`${API_BASE_URL}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            if (res.ok) {
                alert('User saved successfully!');
                modal.style.display = 'none';
                loadUsersList();
            } else {
                alert(result.message || 'Error saving user');
            }
        } catch (err) {
            console.error('Error saving user:', err);
            alert('Error saving user');
        }
    });
}

async function viewUser(userId) {
    console.log('View user:', userId);
    // You could redirect to a user details page if desired
}

async function editUser(userId) {
    const token = sessionStorage.getItem('adminToken');
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const user = await res.json();

        document.getElementById('userModalTitle').textContent = 'Edit User';
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPhone').value = user.phone || '';
        document.getElementById('userRole').value = user.role;
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userSubscription').value = user.subscription || 'none';
        document.getElementById('userPassword').removeAttribute('required');

        document.getElementById('userModal').style.display = 'block';

        document.getElementById('userForm').onsubmit = async function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const updatedData = Object.fromEntries(formData.entries());

            try {
                const updateRes = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                });

                const result = await updateRes.json();
                if (updateRes.ok) {
                    alert('User updated successfully!');
                    document.getElementById('userModal').style.display = 'none';
                    loadUsersList();
                } else {
                    alert(result.message || 'Error updating user');
                }
            } catch (err) {
                console.error('Error updating user:', err);
                alert('Error updating user');
            }
        };
    } catch (err) {
        console.error('Error loading user:', err);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const token = sessionStorage.getItem('adminToken');

    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await res.json();
        if (res.ok) {
            alert('User deleted successfully');
            loadUsersList();
        } else {
            alert(result.message || 'Error deleting user');
        }
    } catch (err) {
        console.error('Error deleting user:', err);
    }
}

function getBadgeClass(status) {
    switch (status?.toLowerCase()) {
        case 'active': return 'success';
        case 'pending': return 'warning';
        case 'suspended': return 'info';
        case 'banned': return 'danger';
        default: return '';
    }
}

function getSubscriptionBadgeClass(subscription) {
    switch (subscription?.toLowerCase()) {
        case 'premium': return 'success';
        case 'basic': return 'info';
        default: return '';
    }
}

function formatSubscription(sub) {
    return capitalize(sub || 'none');
}

function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}
