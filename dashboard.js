document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthentication();
    
    // Initialize sidebar toggle
    initSidebar();
    
    // Load dashboard data - Using the HTML default values
    // We won't overwrite them unless we want to fetch from an API
    // loadDashboardData();
    
    // Load dynamic data for tables
    loadRecentUsers();
    loadLatestVideos();
    
    // Load admin user info
    loadAdminUserInfo();
    setupAdminUserMenu();

    // Log to confirm the script is running
    console.log('Dashboard initialization complete');
});

// Check if user is authenticated
function checkAuthentication() {
    const user = JSON.parse(sessionStorage.getItem('adminUser'));
    
    if (!user) {
        console.log('No authenticated user found');
        // Redirect to login page if not authenticated
        window.location.href = 'index.html';
    } else {
        console.log('User authenticated:', user.name);
    }
}

function initSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');
    
    if (sidebarToggle && adminSidebar && adminMain) {
        sidebarToggle.addEventListener('click', function() {
            console.log('Sidebar toggle clicked');
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('expanded');
        });
    } else {
        console.error('Sidebar elements not found');
    }
}

function loadRecentUsers() {
    // Mock data for recent users - We'll match the HTML structure
    const users = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com', dateJoined: '2025-05-05', status: 'active' },
        { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', dateJoined: '2025-05-04', status: 'active' },
        { id: 3, name: 'Robert Johnson', email: 'robert.j@example.com', dateJoined: '2025-05-03', status: 'pending' }
    ];
    
    const recentUsersTable = document.getElementById('recentUsers');
    
    if (recentUsersTable) {
        console.log('Loading recent users data');
        recentUsersTable.innerHTML = users.map(user => `
            <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${formatDate(user.dateJoined)}</td>
                <td><span class="admin-badge ${getBadgeClass(user.status)}">${capitalizeFirstLetter(user.status)}</span></td>
                <td>
                    <div class="admin-actions">
                        <button class="admin-action-btn"><i class="fas fa-eye"></i></button>
                        <button class="admin-action-btn"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } else {
        console.error('Recent users table element not found');
    }
}

function loadLatestVideos() {
    // Mock data for latest videos - Matching the HTML structure
    const videos = [
        { 
            id: 1, 
            title: 'Epic Adventure Film', 
            category: 'Adventure', 
            uploadDate: '2025-05-05', 
            views: 3200, 
            status: 'published' 
        },
        { 
            id: 2, 
            title: 'Mystery Thriller', 
            category: 'Thriller', 
            uploadDate: '2025-05-04', 
            views: 1700, 
            status: 'published' 
        },
        { 
            id: 3, 
            title: 'Comedy Special', 
            category: 'Comedy', 
            uploadDate: '2025-05-03', 
            views: 2400, 
            status: 'draft' 
        }
    ];
    
    const latestVideosTable = document.getElementById('latestVideos');
    
    if (latestVideosTable) {
        console.log('Loading latest videos data');
        latestVideosTable.innerHTML = videos.map(video => `
            <tr>
                <td><div style="width:60px;height:40px;background:#333;border-radius:4px;"></div></td>
                <td>${video.title}</td>
                <td>${video.category}</td>
                <td>${formatDate(video.uploadDate)}</td>
                <td>${formatViewCount(video.views)}</td>
                <td><span class="admin-badge ${getBadgeClass(video.status)}">${capitalizeFirstLetter(video.status)}</span></td>
                <td>
                    <div class="admin-actions">
                        <button class="admin-action-btn"><i class="fas fa-eye"></i></button>
                        <button class="admin-action-btn"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } else {
        console.error('Latest videos table element not found');
    }
}

function loadAdminUserInfo() {
    const user = JSON.parse(sessionStorage.getItem('adminUser'));
    const adminUserName = document.getElementById('adminUserName');
    
    if (adminUserName && user) {
        console.log('Loading admin user info:', user.name);
        adminUserName.textContent = user.name;
    } else if (adminUserName) {
        console.log('No user data found, keeping default admin name');
    } else {
        console.error('Admin user name element not found');
    }
}

// Admin user menu dropdown
function setupAdminUserMenu() {
    const adminUserMenu = document.getElementById('adminUserMenu');
    
    if (adminUserMenu) {
        adminUserMenu.addEventListener('click', function() {
            console.log('User menu clicked');
            
            // Check if dropdown already exists
            const existingDropdown = document.querySelector('.admin-dropdown-menu');
            
            if (existingDropdown) {
                // Remove dropdown if it exists
                existingDropdown.remove();
            } else {
                // Create and append dropdown
                const dropdown = document.createElement('div');
                dropdown.className = 'admin-dropdown-menu';
                dropdown.innerHTML = `
                    <a href="settings.html">Settings</a>
                    <a href="#" onclick="logoutAdmin()">Logout</a>
                `;
                
                // Style the dropdown
                dropdown.style.position = 'absolute';
                dropdown.style.top = '100%';
                dropdown.style.right = '0';
                dropdown.style.backgroundColor = '#1E1E1E';
                dropdown.style.borderRadius = '8px';
                dropdown.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                dropdown.style.minWidth = '180px';
                dropdown.style.zIndex = '1000';
                dropdown.style.marginTop = '0.5rem';
                dropdown.style.overflow = 'hidden';
                
                // Style the links
                const links = dropdown.querySelectorAll('a');
                links.forEach(link => {
                    link.style.display = 'block';
                    link.style.padding = '0.75rem 1rem';
                    link.style.color = '#FFFFFF';
                    link.style.textDecoration = 'none';
                });
                
                adminUserMenu.style.position = 'relative';
                adminUserMenu.appendChild(dropdown);
                
                // Close dropdown when clicking outside
                document.addEventListener('click', function closeDropdown(e) {
                    if (!adminUserMenu.contains(e.target)) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }
        });
    } else {
        console.error('Admin user menu element not found');
    }
}

// Utility Functions
function getBadgeClass(status) {
    switch(status.toLowerCase()) {
        case 'active':
        case 'published':
            return 'success';
        case 'pending':
            return 'warning';
        case 'suspended':
        case 'draft':
            return 'info';
        case 'banned':
        case 'deleted':
            return 'danger';
        default:
            return '';
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Simple function implementations for the action buttons
function viewUser(userId) {
    console.log(`Viewing user with ID: ${userId}`);
}

function editUser(userId) {
    console.log(`Editing user with ID: ${userId}`);
}

function viewVideo(videoId) {
    console.log(`Viewing video with ID: ${videoId}`);
}

function editVideo(videoId) {
    console.log(`Editing video with ID: ${videoId}`);
}

// Logout function
function logoutAdmin() {
    console.log("Logging out...");
    // Clear session storage
    sessionStorage.removeItem('adminUser');
    
    // Redirect to login page
    window.location.href = 'index.html';
}