/**
 * Sidebar Manager - Handles sidebar functionality across all pages
 * Provides consistent behavior and styling for the attendance system sidebar
 */

class SidebarManager {
  constructor() {
    this.currentPage = this.getCurrentPage();
    this.sidebarContainer = document.getElementById('sidebar-container');
    this.init();
  }

  /**
   * Initialize the sidebar
   */
  init() {
    this.loadSidebar();
    this.setupEventListeners();
    this.setActivePage();
  }

  /**
   * Get current page name from URL
   */
  getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '');
    return page || 'dashboard';
  }

  /**
   * Load sidebar content
   */
  async loadSidebar() {
    try {
      const response = await fetch('sidebar.html');
      if (!response.ok) {
        throw new Error('Failed to load sidebar');
      }
      const html = await response.text();
      this.sidebarContainer.innerHTML = html;
      
      // Re-initialize after loading
      this.setupEventListeners();
      this.setActivePage();
      if (typeof setupSidebarSubscriptionButtons === 'function') {
        setupSidebarSubscriptionButtons();
      }
    } catch (error) {
      console.error('Error loading sidebar:', error);
      this.showFallbackSidebar();
    }
  }

  /**
   * Show fallback sidebar if loading fails
   */
  showFallbackSidebar() {
    this.sidebarContainer.innerHTML = `
      <aside class="sidenav bg-white navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3" id="sidenav-main">
        <div class="sidenav-header">
          <a class="navbar-brand m-0" href="dashboard.html">
            <span class="font-weight-bold text-primary">سیستم حضور و غیاب</span>
          </a>
        </div>
        <hr class="horizontal dark mt-0">
        <div class="collapse navbar-collapse w-auto h-auto" id="sidenav-collapse-main">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link text-dark" href="dashboard.html">
                <div class="icon icon-shape icon-sm border-radius-md text-center ms-2 d-flex align-items-center justify-content-center">
                  <i class="fas fa-tachometer-alt" style="color: #17a2b8 !important; opacity: 1 !important; font-size: 1rem !important;"></i>
                </div>
                <span class="nav-link-text me-1">داشبورد</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link text-dark" href="users.html">
                <div class="icon icon-shape icon-sm border-radius-md text-center ms-2 d-flex align-items-center justify-content-center">
                  <i class="fas fa-users" style="color: #28a745 !important; opacity: 1 !important; font-size: 1rem !important;"></i>
                </div>
                <span class="nav-link-text me-1">مدیریت کاربران</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="px-3 pb-3 mt-auto">
          <button class="btn btn-outline-danger btn-sm w-100" onclick="logout()">
            <i class="fas fa-sign-out-alt me-1"></i>
            خروج
          </button>
        </div>
      </aside>
    `;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mobile sidebar toggle
    const iconSidenav = document.getElementById('iconSidenav');
    if (iconSidenav) {
      iconSidenav.addEventListener('click', () => {
        document.body.classList.toggle('g-sidenav-pinned');
        document.body.classList.toggle('g-sidenav-hidden');
      });
    }

    // Logout button
    const logoutBtn = document.querySelector('.btn-outline-danger');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  /**
   * Set active page in navigation
   */
  setActivePage() {
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
      const page = link.getAttribute('data-page');
      if (page === this.currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Logout function
   */
  logout() {
    // Clear local storage
    localStorage.removeItem('token');
    
    // Redirect to login page
    window.location.href = 'login.html';
  }

  /**
   * Toggle sidebar on mobile
   */
  toggleSidebar() {
    document.body.classList.toggle('g-sidenav-pinned');
    document.body.classList.toggle('g-sidenav-hidden');
  }

  /**
   * Close sidebar on mobile
   */
  closeSidebar() {
    document.body.classList.remove('g-sidenav-pinned');
    document.body.classList.add('g-sidenav-hidden');
  }

  /**
   * Open sidebar on mobile
   */
  openSidebar() {
    document.body.classList.add('g-sidenav-pinned');
    document.body.classList.remove('g-sidenav-hidden');
  }
}

// Initialize sidebar manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.sidebarManager = new SidebarManager();
});

// Global logout function
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SidebarManager;
} 