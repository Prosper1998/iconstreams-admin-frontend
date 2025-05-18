// Check if user is logged in
document.addEventListener("DOMContentLoaded", function() {
    // Dashboard/content/users pages logic
    checkAuthentication();
    loadUserInfo();
    setupSidebarToggle();
    setupAdminUserMenu();
});

// Check if user is authenticated
function checkAuthentication() {
    const user = JSON.parse(sessionStorage.getItem('adminUser'));
    
    if (!user) {
        // Redirect to login page if not authenticated
        window.location.href = 'index.html';
    }
}

// Load user info into the UI
function loadUserInfo() {
    const user = JSON.parse(sessionStorage.getItem('adminUser'));
    const userNameElement = document.getElementById('adminUserName');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.name;
    }
}

// Sidebar toggle functionality
function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const adminSidebar = document.getElementById('adminSidebar');
    const adminMain = document.getElementById('adminMain');
    
    if (sidebarToggle && adminSidebar && adminMain) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('collapsed');
            adminMain.classList.toggle('expanded');
        });
    }
}

// Admin user menu dropdown
function setupAdminUserMenu() {
    const adminUserMenu = document.getElementById('adminUserMenu');
    
    if (adminUserMenu) {
        adminUserMenu.addEventListener('click', function() {
            // Implement dropdown menu display
            console.log('User menu clicked');
            // In a real app, you would toggle a dropdown menu here
        });
    }
}

// Logout functionality
function logoutAdmin() {
    // Clear session storage
    sessionStorage.removeItem('adminUser');
    
    // Redirect to login page
    window.location.href = 'index.html';
}