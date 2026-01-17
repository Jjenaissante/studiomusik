/**
 * StudioMusik Jjenaissante - Main JavaScript
 * Version: 2.0
 * Updated: Jan 06, 2026
 * 
 * This file contains all common JavaScript functions used across the system
 */

// Global variables
let currentUser = null;
let studiosData = [];
let bookingsData = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check authentication status
    checkAuthStatus();
    
    // Initialize common features
    initializeNavigation();
    initializeModals();
    initializeForms();
    
    // Page-specific initializations
    const currentPage = getCurrentPage();
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'profile':
            initializeProfilePage();
            break;
        case 'admin':
            initializeAdminPage();
            break;
        case 'calendar':
            initializeCalendarPage();
            break;
        case 'studio-detail':
            initializeStudioDetailPage();
            break;
        case 'history':
            initializeHistoryPage();
            break;
    }
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().split('.')[0];
    return filename || 'index';
}

// ============================
// AUTHENTICATION FUNCTIONS
// ============================

/**
 * Check if user is authenticated
 */
async function checkAuthStatus() {
    try {
        const response = await fetch('api.php?endpoint=me');
        const result = await response.json();
        
        if (result.success) {
            currentUser = result.user;
            updateAuthSection();
        }
        return result.success;
    } catch (error) {
        console.log('User not logged in');
        return false;
    }
}

/**
 * Update authentication section in navigation
 */
function updateAuthSection() {
    const authSection = document.getElementById('auth-section');
    if (!authSection) return;
    
    if (currentUser) {
        authSection.innerHTML = `
            <div class="nav-link user-profile" onclick="window.location.href='profile.html'">
                <i class="fas fa-user-circle"></i>
                <span>${currentUser.nama_user}</span>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <a href="login.html" class="nav-link login-btn">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
        `;
    }
}

/**
 * Logout user
 */
async function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        try {
            await fetch('auth.php?action=logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}

// ============================
// NAVIGATION FUNCTIONS
// ============================

/**
 * Initialize navigation
 */
function initializeNavigation() {
    // Mobile menu toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (navMenu) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });
}

// ============================
// MODAL FUNCTIONS
// ============================

/**
 * Initialize modals
 */
function initializeModals() {
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
}

/**
 * Show modal
 */
function showModal(title, content) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (modal && modalTitle && modalBody) {
        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        modal.classList.add('active');
    }
}

/**
 * Close modal
 */
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ============================
// FORM FUNCTIONS
// ============================

/**
 * Initialize forms
 */
function initializeForms() {
    // Add form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
    
    // Add input formatting
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', formatPhoneNumber);
    });
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    const form = e.target;
    
    // Basic validation
    if (!validateForm(form)) {
        e.preventDefault();
        return false;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Memproses...';
    }
}

/**
 * Validate form
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Field ini wajib diisi');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    return isValid;
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ef4444';
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

/**
 * Format phone number input
 */
function formatPhoneNumber(e) {
    let value = e.target.value.replace(/[^\d]/g, '');
    if (value.startsWith('0')) {
        value = value.substring(0, 15);
    }
    e.target.value = value;
}

// ============================
// UTILITY FUNCTIONS
// ============================

/**
 * Show loading spinner
 */
function showLoading(element) {
    element.innerHTML = '<span class="loading"></span>';
    element.disabled = true;
}

/**
 * Hide loading spinner
 */
function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format time
 */
function formatTime(timeString) {
    return timeString.substring(0, 5);
}

/**
 * Get status label
 */
function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'confirmed': 'Terkonfirmasi',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return labels[status] || status;
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
    const classes = {
        'pending': 'status-pending',
        'confirmed': 'status-confirmed',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-default';
}

/**
 * Generate unique ID
 */
function generateId(prefix = '', length = 5) {
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return prefix + result;
}

/**
 * Show alert
 */
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const alertContainer = document.getElementById('alert-container') || document.body;
    alertContainer.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

/**
 * Show success message
 */
function showSuccess(message) {
    showAlert(message, 'success');
}

/**
 * Show error message
 */
function showError(message) {
    showAlert(message, 'error');
}

/**
 * Show warning message
 */
function showWarning(message) {
    showAlert(message, 'warning');
}

/**
 * Show info message
 */
function showInfo(message) {
    showAlert(message, 'info');
}

// ============================
// PAGE-SPECIFIC INITIALIZATIONS
// ============================

/**
 * Initialize home page
 */
function initializeHomePage() {
    // Load studios if on homepage
    if (typeof loadStudios === 'function') {
        loadStudios();
    }
}

/**
 * Initialize profile page
 */
function initializeProfilePage() {
    // Load profile data if on profile page
    if (typeof loadProfileData === 'function') {
        loadProfileData();
    }
}

/**
 * Initialize admin page
 */
function initializeAdminPage() {
    // Load admin dashboard if on admin page
    if (typeof loadDashboardStats === 'function') {
        loadDashboardStats();
    }
}

/**
 * Initialize calendar page
 */
function initializeCalendarPage() {
    // Load calendar if on calendar page
    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }
}

/**
 * Initialize studio detail page
 */
function initializeStudioDetailPage() {
    // Load studio data if on studio detail page
    if (typeof loadStudioData === 'function') {
        loadStudioData();
    }
}

/**
 * Initialize history page
 */
function initializeHistoryPage() {
    // Load history if on history page
    if (typeof loadUserHistory === 'function') {
        loadUserHistory();
    }
}

// ============================
// EVENT LISTENERS
// ============================

// Handle window scroll for navbar
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
});

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh user data when page becomes visible
        checkAuthStatus();
    }
});

// ============================
// CSS LOADER (if style.css not available)
// ============================

/**
 * Load CSS if not available
 */
function loadCSS() {
    if (!document.querySelector('link[href*="style.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'style.css';
        document.head.appendChild(link);
    }
}

// Load CSS on page load
loadCSS();

// ============================
// ERROR HANDLING
// ============================

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    // In production, you might want to send this to a logging service
});

// Promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// ============================
// PERFORMANCE MONITORING
// ============================

// Monitor page load time
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Export functions for global use
window.StudioMusik = {
    // Authentication
    checkAuthStatus,
    logout,
    
    // Modals
    showModal,
    closeModal,
    
    // Forms
    validateForm,
    showFieldError,
    clearFieldError,
    
    // Utilities
    formatCurrency,
    formatDate,
    formatTime,
    getStatusLabel,
    getStatusBadgeClass,
    generateId,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Loading
    showLoading,
    hideLoading
};

console.log('StudioMusik Jjenaissante - Main JavaScript loaded successfully!');