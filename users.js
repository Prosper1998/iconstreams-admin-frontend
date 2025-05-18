document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    initSidebar();
    loadAdminUserInfo();
    
    // Load users list
    loadUsersList();
    
    // Set up user filter events
    initUserFilters();
    
    // Set up modal functionality
    initUserModal();
});

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('expanded');
        });
    }
}

function loadAdminUserInfo() {
    const adminUserName = document.getElementById('adminUserName');
    
    if (adminUserName) {
        // In a real app, you would get this from your API using the token
        adminUserName.textContent = 'Admin User';
    }
}

function loadUsersList() {
    // Mock data for users list
    const users = [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            joinedDate: '2025-04-28',
            subscription: 'premium',
            status: 'active',
            role: 'user'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            joinedDate: '2025-04-27',
            subscription: 'basic',
            status: 'active',
            role: 'user'
        },
        {
            id: 3,
            name: 'Michael Johnson',
            email: 'michael@example.com',
            joinedDate: '2025-04-26',
            subscription: 'none',
            status: 'pending',
            role: 'user'
        },
        {
            id: 4,
            name: 'Sarah Williams',
            email: 'sarah@example.com',
            joinedDate: '2025-04-25',
            subscription: 'premium',
            status: 'suspended',
            role: 'user'
        },
        {
            id: 5,
            name: 'Robert Brown',
            email: 'robert@example.com',
            joinedDate: '2025-04-24',
            subscription: 'basic',
            status: 'active',
            role: 'moderator'
        },
        {
            id: 6,
            name: 'Emily Davis',
            email: 'emily@example.com',
            joinedDate: '2025-04-23',
            subscription: 'premium',
            status: 'active',
            role: 'user'
        },
        {
            id: 7,
            name: 'David Wilson',
            email: 'david@example.com',
            joinedDate: '2025-04-22',
            subscription: 'none',
            status: 'banned',
            role: 'user'
        },
        {
            id: 8,
            name: 'Admin User',
            email: 'admin@iconstreaming.com',
            joinedDate: '2025-01-01',
            subscription: 'premium',
            status: 'active',
            role: 'admin'
        }
    ];
    
    displayUsersList(users);
}

function displayUsersList(usersList) {
    const usersListElement = document.getElementById('usersList');
    
    if (usersListElement) {
        usersListElement.innerHTML = usersList.map(user => `
            <tr>
                <td>
                    <input type="checkbox" class="user-checkbox" data-id="${user.id}">
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.joinedDate}</td>
                <td>
                    <span class="admin-badge ${getSubscriptionBadgeClass(user.subscription)}">
                        ${formatSubscription(user.subscription)}
                    </span>
                </td>
                <td>
                    <span class="admin-badge ${getBadgeClass(user.status)}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
                <td>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                <td>
                    <div class="admin-actions">
                        <button class="admin-action-btn" onclick="viewUser(${user.id})" title="View User">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="admin-action-btn" onclick="editUser(${user.id})" title="Edit User">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="admin-action-btn" onclick="deleteUser(${user.id})" title="Delete User">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Set up select all checkbox
        const selectAllCheckbox = document.getElementById('selectAllUsers');
        if (selectAllCheckbox) {
            selectAllCheckbox.addEventListener('change', function() {
                const userCheckboxes = document.querySelectorAll('.user-checkbox');
                userCheckboxes.forEach(checkbox => {
                    checkbox.checked = this.checked;
                });
            });
        }
    }
}

function initUserFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const roleFilter = document.getElementById('roleFilter');
    const userSearch = document.getElementById('userSearch');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
    
    if (roleFilter) {
        roleFilter.addEventListener('change', applyFilters);
    }
    
    if (userSearch) {
        userSearch.addEventListener('input', applyFilters);
    }
}

function applyFilters() {
    // In a real application, you would call your API with the filter parameters
    // For now, we'll just reload the users with the mock data
    loadUsersList();
}

function initUserModal() {
    const addUserBtn = document.getElementById('addUserBtn');
    const closeUserModal = document.getElementById('closeUserModal');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userModal = document.getElementById('userModal');
    const userForm = document.getElementById('userForm');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            // Clear form and show modal
            userForm.reset();
            document.getElementById('userModalTitle').textContent = 'Add New User';
            // Password is required for new users
            document.getElementById('userPassword').setAttribute('required', 'required');
            userModal.style.display = 'block';
        });
    }
    
    if (closeUserModal) {
        closeUserModal.addEventListener('click', function() {
            userModal.style.display = 'none';
        });
    }
    
    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', function() {
            userModal.style.display = 'none';
        });
    }
    
    // Handle form submission
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // In a real application, you would send this data to your API
            // For now, we'll just log it
            const formData = new FormData(userForm);
            const userData = {};
            
            formData.forEach((value, key) => {
                userData[key] = value;
            });
            
            console.log('User Data:', userData);
            alert('User saved successfully!');
            userModal.style.display = 'none';
            
            // Reload users list
            loadUsersList();
        });
    }
}

function getBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'active':
            return 'success';
        case 'pending':
            return 'warning';
        case 'suspended':
            return 'info';
        case 'banned':
            return 'danger';
        default:
            return '';
    }
}

function getSubscriptionBadgeClass(subscription) {
    switch(subscription.toLowerCase()) {
        case 'premium':
            return 'success';
        case 'basic':
            return 'info';
        case 'none':
        default:
            return '';
    }
}

function formatSubscription(subscription) {
    switch(subscription.toLowerCase()) {
        case 'premium':
            return 'Premium';
        case 'basic':
            return 'Basic';
        case 'none':
        default:
            return 'None';
    }
}

function viewUser(userId) {
    // In a real application, you would redirect to the user details page
    console.log(`Viewing user with ID: ${userId}`);
    // For now, just show an alert
    alert(`Viewing user details for ID: ${userId}`);
}

function editUser(userId) {
    console.log(`Editing user with ID: ${userId}`);
    
    // In a real app, you would fetch the user data from your API
    // For now, we'll just show the modal with mock data
    document.getElementById('userModalTitle').textContent = 'Edit User';
    
    // Password is not required when editing
    document.getElementById('userPassword').removeAttribute('required');
    
    // Set form fields (this would come from your API in a real app)
    document.getElementById('userName').value = 'John Doe';
    document.getElementById('userEmail').value = 'john@example.com';
    document.getElementById('userPhone').value = '+1234567890';
    document.getElementById('userRole').value = 'user';
    document.getElementById('userStatus').value = 'active';
    document.getElementById('userSubscription').value = 'premium';
    
    // Show the modal
    document.getElementById('userModal').style.display = 'block';
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        // In a real application, you would call your API to delete the user
        console.log(`Deleting user with ID: ${userId}`);
        
        // Update the UI (in a real app, this would happen after API confirmation)
        alert('User deleted successfully!');
        loadUsersList();
    }
}