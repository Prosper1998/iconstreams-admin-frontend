const API_BASE_URL = "https://iconstreams-backend.onrender.com";;

document.addEventListener('DOMContentLoaded', function () {
  initSidebar();
  loadAdminUserInfo();
  loadContentList();
  initContentFilters();
  initContentModal();
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

async function loadContentList() {
  try {
    const token = sessionStorage.getItem('adminToken');
    const response = await fetch(`${API_BASE_URL}/api/content`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const content = await response.json();
    displayContentList(content);
  } catch (error) {
    console.error('Error loading content:', error);
    displayContentList([]);
  }
}

function displayContentList(contentList) {
  const contentListElement = document.getElementById('contentList');

  if (contentListElement) {
    contentListElement.innerHTML = contentList.map(item => `
      <tr>
        <td><input type="checkbox" class="content-checkbox" data-id="${item._id}"></td>
        <td><img src="${item.thumbnail}" alt="${item.title}" width="100" height="60" style="object-fit: cover; border-radius: 4px;"></td>
        <td>${item.title}</td>
        <td>${item.category}</td>
        <td>${new Date(item.uploadDate).toLocaleDateString()}</td>
        <td>${item.views.toLocaleString()}</td>
        <td><span class="admin-badge ${getBadgeClass(item.status)}">${capitalize(item.status)}</span></td>
        <td>
          <div class="admin-actions">
            <button class="admin-action-btn" onclick="viewContent('${item._id}')"><i class="fas fa-eye"></i></button>
            <button class="admin-action-btn" onclick="editContent('${item._id}')"><i class="fas fa-edit"></i></button>
            <button class="admin-action-btn" onclick="deleteContent('${item._id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');

    const selectAllCheckbox = document.getElementById('selectAllContent');
    if (selectAllCheckbox) {
      selectAllCheckbox.addEventListener('change', function () {
        document.querySelectorAll('.content-checkbox').forEach(cb => cb.checked = this.checked);
      });
    }
  }
}

function initContentFilters() {
  const categoryFilter = document.getElementById('categoryFilter');
  const statusFilter = document.getElementById('statusFilter');
  const contentSearch = document.getElementById('contentSearch');

  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (contentSearch) contentSearch.addEventListener('input', applyFilters);
}

async function applyFilters() {
  const category = document.getElementById('categoryFilter').value;
  const status = document.getElementById('statusFilter').value;
  const search = document.getElementById('contentSearch').value.toLowerCase();

  try {
    const token = sessionStorage.getItem('adminToken');
    const res = await fetch(`${API_BASE_URL}/api/content`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    let content = await res.json();
    if (category !== 'all') content = content.filter(c => c.category.toLowerCase() === category);
    if (status !== 'all') content = content.filter(c => c.status.toLowerCase() === status);
    if (search) content = content.filter(c => c.title.toLowerCase().includes(search));
    displayContentList(content);
  } catch (e) {
    console.error('Filter error:', e);
  }
}

function initContentModal() {
  const addBtn = document.getElementById('addContentBtn');
  const closeBtn = document.getElementById('closeContentModal');
  const cancelBtn = document.getElementById('cancelContentBtn');
  const modal = document.getElementById('contentModal');
  const form = document.getElementById('contentForm');

  if (addBtn) addBtn.addEventListener('click', () => {
    form.reset();
    modal.style.display = 'block';
    document.getElementById('contentModalTitle').textContent = 'Add New Content';
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.style.display = 'none');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const token = sessionStorage.getItem('adminToken');

    try {
      const response = await fetch(`${API_BASE_URL}/api/content`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Content saved successfully!');
        modal.style.display = 'none';
        loadContentList();
      } else {
        alert(result.message || 'Error saving content');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      alert('Error saving content');
    }
  });

  document.querySelectorAll('input[type="file"]').forEach(input => {
    const fileSelectBtn = input.nextElementSibling;
    const fileNameSpan = fileSelectBtn.nextElementSibling;
    fileSelectBtn.addEventListener('click', () => input.click());
    input.addEventListener('change', () => {
      if (input.files.length > 0) {
        fileNameSpan.textContent = input.files[0].name;
        if (input.id === 'contentThumbnail') {
          const reader = new FileReader();
          reader.onload = e => document.getElementById('thumbnailPreview').innerHTML = `<img src="${e.target.result}" alt="Thumbnail Preview">`;
          reader.readAsDataURL(input.files[0]);
        }
      } else {
        fileNameSpan.textContent = 'No file selected';
        if (input.id === 'contentThumbnail') {
          document.getElementById('thumbnailPreview').innerHTML = '';
        }
      }
    });
  });
}

function getBadgeClass(status) {
  switch (status.toLowerCase()) {
    case 'published': return 'success';
    case 'pending': return 'warning';
    case 'draft': return 'info';
    case 'deleted': return 'danger';
    default: return '';
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function viewContent(contentId) {
  console.log(`Viewing content: ${contentId}`);
}

async function editContent(contentId) {
  try {
    const token = sessionStorage.getItem('adminToken');
    const res = await fetch(`${API_BASE_URL}/api/content/${contentId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const content = await res.json();

    document.getElementById('contentModalTitle').textContent = 'Edit Content';
    document.getElementById('contentTitle').value = content.title;
    document.getElementById('contentCategory').value = content.category;
    document.getElementById('contentDescription').value = content.description;
    document.getElementById('contentStatus').value = content.status;
    document.getElementById('contentVisibility').value = content.visibility;
    document.getElementById('contentTags').value = content.tags.join(', ');
    document.getElementById('publishDate').value = content.publishDate.split('T')[0];
    document.getElementById('releaseYear').value = content.releaseYear;
    document.getElementById('duration').value = content.duration;
    document.getElementById('thumbnailPreview').innerHTML = `<img src="${content.thumbnail}" alt="Thumbnail Preview">`;

    document.getElementById('contentModal').style.display = 'block';

    document.getElementById('contentForm').onsubmit = async function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      try {
        const updateRes = await fetch(`${API_BASE_URL}/api/content/${contentId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
        });
        const result = await updateRes.json();
        if (updateRes.ok) {
          alert('Content updated successfully!');
          document.getElementById('contentModal').style.display = 'none';
          loadContentList();
        } else {
          alert(result.message || 'Error updating content');
        }
      } catch (err) {
        console.error('Error updating content:', err);
        alert('Error updating content');
      }
    };
  } catch (err) {
    console.error('Error loading content:', err);
    alert('Error loading content');
  }
}

async function deleteContent(contentId) {
  if (!confirm('Are you sure you want to delete this content?')) return;
  try {
    const token = sessionStorage.getItem('adminToken');
    const res = await fetch(`${API_BASE_URL}/api/content/${contentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await res.json();
    if (res.ok) {
      alert('Content deleted successfully!');
      loadContentList();
    } else {
      alert(result.message || 'Error deleting content');
    }
  } catch (err) {
    console.error('Error deleting content:', err);
    alert('Error deleting content');
  }
}
