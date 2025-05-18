document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI
    initSidebar();
    loadAdminUserInfo();
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
        adminUserName.textContent = 'Admin User';
    }
}