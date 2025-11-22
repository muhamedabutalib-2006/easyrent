// Global login state
let currentUser = null;
let isAdmin = false;

// Navigation
function goToSearch() {
    showPage('search');
}

function goToProperty(id) {
    showPage('property-details');
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) {
            link.classList.add('active');
        }
    });

    // Load user data if user dashboard
    if (pageId === 'user-dashboard') {
        loadUserData();
    }

    // Load user data if profile page
    if (pageId === 'profile') {
        loadProfileData();
    }

    window.scrollTo(0, 0);
}

// Mobile Menu
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
});

document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Admin Menu Toggle
const adminMenuBtn = document.getElementById('adminMenuBtn');
const userMenuBtn = document.getElementById('userMenuBtn');

if (adminMenuBtn) {
    const adminSidebar = adminMenuBtn.closest('.page').querySelector('.admin-sidebar');
    adminMenuBtn.addEventListener('click', () => {
        adminSidebar.classList.toggle('active');
    });
}

if (userMenuBtn) {
    const userSidebar = userMenuBtn.closest('.page').querySelector('.admin-sidebar');
    userMenuBtn.addEventListener('click', () => {
        userSidebar.classList.toggle('active');
    });
}

// Close sidebar buttons
const adminSidebarClose = document.getElementById('adminSidebarClose');
const userSidebarClose = document.getElementById('userSidebarClose');

if (adminSidebarClose) {
    const adminSidebar = adminSidebarClose.closest('.admin-sidebar');
    adminSidebarClose.addEventListener('click', () => {
        adminSidebar.classList.remove('active');
    });
}

if (userSidebarClose) {
    const userSidebar = userSidebarClose.closest('.admin-sidebar');
    userSidebarClose.addEventListener('click', () => {
        userSidebar.classList.remove('active');
    });
}

// Close sidebar on click outside
document.addEventListener('click', (e) => {
    const adminSidebar = document.querySelector('#admin-dashboard .admin-sidebar');
    const userSidebar = document.querySelector('#user-dashboard .admin-sidebar');
    if (adminSidebar && adminSidebar.classList.contains('active') && !adminSidebar.contains(e.target) && !(adminMenuBtn && adminMenuBtn.contains(e.target))) {
        adminSidebar.classList.remove('active');
    }
    if (userSidebar && userSidebar.classList.contains('active') && !userSidebar.contains(e.target) && !(userMenuBtn && userMenuBtn.contains(e.target))) {
        userSidebar.classList.remove('active');
    }
});

// Navigation Links
document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            const pageId = href.substring(1);
            showPage(pageId);
        }
    });
});

// Gallery
function changeMainImage(img) {
    document.getElementById('mainImage').src = img.src.replace('w=400', 'w=1200');
}

// Modals
function showViewingModal() {
    document.getElementById('viewingModal').classList.add('active');
}

function showInquiryModal() {
    document.getElementById('inquiryModal').classList.add('active');
}

function showAddPropertyModal() {
    document.getElementById('addPropertyModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function submitViewing() {
    alert('Viewing request submitted successfully! We will contact you soon.');
    closeModal('viewingModal');
}

function submitInquiry() {
    alert('Inquiry sent successfully! We will get back to you shortly.');
    closeModal('inquiryModal');
}

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Contact Form
function submitContact(e) {
    e.preventDefault();
    alert('Thank you for contacting us! We will respond to your message shortly.');
    e.target.reset();
}

// Login & Register
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Get stored user data
    const storedUser = JSON.parse(localStorage.getItem('easyrent_user'));

    // Check if user exists and password matches, OR allow demo login
    if ((storedUser && storedUser.email === email && storedUser.password === password) ||
        (email === 'user@easyrent.com' && password === 'user123')) {

        // If demo login and no stored user, create the demo user
        if (!storedUser && email === 'user@easyrent.com' && password === 'user123') {
            const demoUser = {
                name: 'Demo User',
                email: 'user@easyrent.com',
                phone: '01123456789',
                password: 'user123',
                location: '',
                district: '',
                address: '',
                bio: ''
            };
            localStorage.setItem('easyrent_user', JSON.stringify(demoUser));
            alert('Login successful! Welcome to EasyRent, Demo User!');
            currentUser = demoUser;
        } else if (storedUser) {
            alert('Login successful! Welcome back to EasyRent, ' + storedUser.name + '!');
            currentUser = storedUser;
        }

        isAdmin = false;
        updateNavState();
        showPage('home');
    } else {
        alert('Invalid email or password. Please try again or register first.');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match! Please try again.');
        return;
    }

    // Validate phone number (Egyptian format)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid Egyptian phone number (01XXXXXXXXX)');
        return;
    }

    // Check if user already exists
    const existingUser = localStorage.getItem('easyrent_user');
    if (existingUser) {
        const user = JSON.parse(existingUser);
        if (user.email === email) {
            alert('An account with this email already exists. Please try logging in instead.');
            return;
        }
    }

    if (name && email && phone && password) {
        // Store user data
        const userData = {
            name: name,
            email: email,
            phone: phone,
            password: password
        };
        localStorage.setItem('easyrent_user', JSON.stringify(userData));

        alert('Registration successful! Welcome to EasyRent, ' + name + '!');
        showPage('home');
    }
}

// Admin Login
function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Demo admin credentials
    if (email === 'admin@easyrent.com' && password === 'admin123') {
        alert('Admin login successful! Redirecting to dashboard...');
        currentUser = { name: 'Admin User', email: email };
        isAdmin = true;
        updateNavState();
        showPage('admin-dashboard');
    } else {
        alert('Invalid admin credentials! Please try again.\n\nDemo credentials:\nEmail: admin@easyrent.com\nPassword: admin123');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('You have been logged out successfully.');
        currentUser = null;
        isAdmin = false;
        updateNavState();
        showPage('home');
    }
}

// Admin Sections
function showAdminSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.admin-nav-link').classList.add('active');

    // Update sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Update title and show section
    const titles = {
        'dashboard': 'Dashboard Overview',
        'properties': 'Property Management',
        'inquiries': 'Inquiry Management',
        'tenants': 'Tenant Management',
        'settings': 'Settings'
    };

    document.getElementById('adminTitle').textContent = titles[sectionName];
    document.getElementById(sectionName + 'Section').classList.add('active');
}

// Settings Tabs
function showSettingsTab(tabName) {
    // Update navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.tab-btn').classList.add('active');

    // Update content
    document.querySelectorAll('.settings-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

// Change Admin Password
function changeAdminPassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentAdminPassword').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;

    // Simple validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all password fields.');
        return;
    }

    if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
    }

    if (currentPassword !== 'admin123') {
        alert('Current password is incorrect!');
        return;
    }

    alert('Admin password changed successfully! New password: ' + newPassword);
    // Reset form
    document.getElementById('currentAdminPassword').value = '';
    document.getElementById('newAdminPassword').value = '';
    document.getElementById('confirmAdminPassword').value = '';
}

// User Dashboard Sections
function showUserSection(sectionName) {
    // Update navigation
    document.querySelectorAll('#user-dashboard .admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.admin-nav-link').classList.add('active');

    // Update sections
    document.querySelectorAll('#user-dashboard .admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Update title and show section
    const titles = {
        'profile': 'My Profile',
        'inquiries': 'My Inquiries',
        'saved': 'Saved Properties',
        'applications': 'My Applications'
    };

    document.getElementById('userTitle').textContent = titles[sectionName];
    document.getElementById(sectionName + 'Section').classList.add('active');
}

// User logout
function userLogout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('You have been logged out successfully.');
        currentUser = null;
        isAdmin = false;
        localStorage.removeItem('easyrent_user');
        updateNavState();
        showPage('home');
    }
}

// User Dashboard Sections
function showUserSection(sectionName) {
    // Update navigation
    document.querySelectorAll('#user-dashboard .admin-nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.closest('.admin-nav-link').classList.add('active');

    // Update sections
    document.querySelectorAll('#user-dashboard .admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Update title and show section
    const titles = {
        'profile': 'My Profile',
        'inquiries': 'My Inquiries',
        'saved': 'Saved Properties',
        'applications': 'My Applications'
    };

    document.getElementById('userTitle').textContent = titles[sectionName];
    document.getElementById(sectionName + 'Section').classList.add('active');
}

// Update Profile
function updateProfile(e) {
    e.preventDefault();

    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const location = document.querySelector('#profileForm select').value;
    const district = document.querySelector('#profileForm input[placeholder="e.g., Zamalek"]').value;
    const address = document.querySelector('#profileForm input[placeholder="Street address"]').value;
    const bio = document.getElementById('editBio').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Get stored user data
    const storedUser = JSON.parse(localStorage.getItem('easyrent_user'));

    if (!storedUser) {
        alert('User data not found. Please login again.');
        return;
    }

    // Validate current password
    if (currentPassword) {
        if (currentPassword !== storedUser.password) {
            alert('Current password is incorrect.');
            return;
        }

        // If changing password
        if (newPassword) {
            if (newPassword !== confirmNewPassword) {
                alert('New passwords do not match.');
                return;
            }
            storedUser.password = newPassword;
        }
    }

    // Update user data
    storedUser.name = name;
    storedUser.email = email;
    storedUser.phone = phone;
    storedUser.location = location;
    storedUser.district = district;
    storedUser.address = address;
    storedUser.bio = bio;

    // Save updated data
    localStorage.setItem('easyrent_user', JSON.stringify(storedUser));

    // Update display
    document.getElementById('userNameDisplay').textContent = name;

    alert('Profile updated successfully!');
    e.target.reset();
}

// Handle profile icon click - go to profile page
const profileIcon = document.getElementById('profile-icon');

if (profileIcon) {
    profileIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('user-dashboard');
    });
}

// Go to dashboard based on user type
function goToDashboard() {
    if (isAdmin) {
        showPage('admin-dashboard');
    } else if (currentUser) {
        showPage('user-dashboard');
    } else {
        showPage('user-login');
    }
}

// Update navbar state based on login status
function updateNavState() {
    const authLinks = document.querySelectorAll('.auth-link');
    const profileMenu = document.getElementById('profile-menu');
    const mobileAuthLinks = document.querySelectorAll('.mobile-link.auth-link');
    const mobileProfileSection = document.getElementById('mobile-profile-section');

    if (currentUser || isAdmin) {
        // Hide register and login links
        authLinks.forEach(link => link.style.display = 'none');
        mobileAuthLinks.forEach(link => link.style.display = 'none');
        // Show profile menu
        if (profileMenu) profileMenu.style.display = 'flex';
        if (mobileProfileSection) mobileProfileSection.style.display = 'block';
    } else {
        // Show register and login links
        authLinks.forEach(link => link.style.display = 'block');
        mobileAuthLinks.forEach(link => link.style.display = 'block');
        // Hide profile menu
        if (profileMenu) profileMenu.style.display = 'none';
        if (mobileProfileSection) mobileProfileSection.style.display = 'none';
    }
}

// Handle logout
// Handle logout
// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('You have been logged out successfully.');
        currentUser = null;
        isAdmin = false;
        localStorage.removeItem('easyrent_user');  // Clear stored user data
        updateNavState();
        
        // Close mobile menu
        const mobileMenuElement = document.getElementById('mobileMenu');
        if (mobileMenuElement) {
            mobileMenuElement.classList.remove('active');
        }
        
        // Click on home link in navbar
        const homeLink = document.querySelector('a[href="#home"].nav-link');
        if (homeLink) {
            homeLink.click();
        } else {
            // Fallback to showPage if home link not found
            showPage('home');
        }
    }
}

// Load user data when dashboard loads
function loadUserData() {
    const storedUser = JSON.parse(localStorage.getItem('easyrent_user'));
    if (storedUser) {
        document.getElementById('editName').value = storedUser.name || '';
        document.getElementById('editEmail').value = storedUser.email || '';
        document.getElementById('editPhone').value = storedUser.phone || '';
        document.getElementById('editBio').value = storedUser.bio || '';
        document.getElementById('userNameDisplay').textContent = storedUser.name || 'User';

        // Populate location select
        const locationSelect = document.querySelector('#profileForm select');
        if (locationSelect && storedUser.location) {
            locationSelect.value = storedUser.location;
        }

        // Populate district and address
        const districtInput = document.querySelector('#profileForm input[placeholder="e.g., Zamalek"]');
        const addressInput = document.querySelector('#profileForm input[placeholder="Street address"]');
        if (districtInput) districtInput.value = storedUser.district || '';
        if (addressInput) addressInput.value = storedUser.address || '';
    }
}

// Load user data when profile page loads
function loadProfileData() {
    const storedUser = JSON.parse(localStorage.getItem('easyrent_user'));
    if (storedUser) {
        document.getElementById('editNameProfile').value = storedUser.name || '';
        document.getElementById('editEmailProfile').value = storedUser.email || '';
        document.getElementById('editPhoneProfile').value = storedUser.phone || '';
        document.getElementById('editBioProfile').value = storedUser.bio || '';
        document.getElementById('profileUserNameDisplay').textContent = storedUser.name || 'User';

        // Populate location select
        const locationSelect = document.getElementById('editLocationProfile');
        if (locationSelect) locationSelect.value = storedUser.location || '';

        // Populate district and address
        const districtInput = document.getElementById('editDistrictProfile');
        const addressInput = document.getElementById('editAddressProfile');
        if (districtInput) districtInput.value = storedUser.district || '';
        if (addressInput) addressInput.value = storedUser.address || '';
    }
}

// Initialize nav state on load
document.addEventListener('DOMContentLoaded', () => {
    // Clear any stored login state to ensure user starts logged out
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem('easyrent_user');

    updateNavState();
    
    // Add click handler for mobile profile icon
    const mobileProfileIcon = document.getElementById('mobile-profile-icon');
    if (mobileProfileIcon) {
        mobileProfileIcon.addEventListener('click', () => {
            goToDashboard();
            mobileMenu.classList.remove('active');
        });
    }
});