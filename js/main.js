// Sailing Billabong - Main JavaScript

// Global data storage for centralized content
let siteData = {
    config: null,
    contact: null,
    theme: null,
    navigation: null,
    currentLang: 'en'
};

// Load all centralized JSON files and includes
async function loadIncludes() {
    try {
        // Determine current language
        siteData.currentLang = window.location.pathname.includes('/hu/') ? 'hu' : 'en';
        
        // Load all JSON configuration files in parallel
        const [configResponse, contactResponse, themeResponse, navigationResponse] = await Promise.all([
            fetch('content/shared/config.json'),
            fetch('content/shared/contact.json'),
            fetch('content/shared/theme.json'),
            fetch('content/shared/navigation.json')
        ]);
        
        // Parse JSON data
        siteData.config = await configResponse.json();
        siteData.contact = await contactResponse.json();
        siteData.theme = await themeResponse.json();
        siteData.navigation = await navigationResponse.json();
        
        // Load header and footer HTML
        const [headerResponse, footerResponse] = await Promise.all([
            fetch('includes/header.html'),
            fetch('includes/footer.html')
        ]);
        
        const headerHTML = await headerResponse.text();
        const footerHTML = await footerResponse.text();
        
        // Insert HTML and populate with data
        document.getElementById('header').innerHTML = headerHTML;
        document.getElementById('footer').innerHTML = footerHTML;
        
        // Populate header and footer with centralized data
        populateHeaderData();
        populateFooterData();
        
        // Initialize other functions after includes are loaded
        initializeAfterLoad();
        
    } catch (error) {
        console.error('Error loading includes:', error);
        // Fallback: show error message or load static content
    }
}

// Populate header with centralized navigation data
function populateHeaderData() {
    if (!siteData.navigation || !siteData.navigation[siteData.currentLang]) return;
    
    const navData = siteData.navigation[siteData.currentLang];
    
    // Update logo link based on current language
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        if (siteData.currentLang === 'hu') {
            logoContainer.href = '../index.html'; // Go back to root from /hu/ directory
        } else {
            logoContainer.href = 'index.html'; // Stay in root directory
        }
    }
    
    // Update main navigation
    const desktopNav = document.querySelector('.nav');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (desktopNav && mobileNav) {
        // Clear existing navigation
        desktopNav.innerHTML = '';
        mobileNav.innerHTML = '';
        
        // Populate navigation items
        navData.main_nav.forEach(item => {
            // Desktop navigation
            if (item.dropdown) {
                // Create dropdown container
                const dropdownContainer = document.createElement('div');
                dropdownContainer.className = 'nav-dropdown';
                
                const mainLink = document.createElement('a');
                mainLink.href = item.url;
                mainLink.id = `nav-${item.id}`;
                mainLink.textContent = item.label + ' ▼';
                mainLink.className = 'nav-dropdown-toggle';
                
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'nav-dropdown-menu';
                
                item.dropdown.forEach(dropdownItem => {
                    const dropdownLink = document.createElement('a');
                    dropdownLink.href = dropdownItem.url;
                    dropdownLink.textContent = dropdownItem.label;
                    dropdownMenu.appendChild(dropdownLink);
                });
                
                dropdownContainer.appendChild(mainLink);
                dropdownContainer.appendChild(dropdownMenu);
                desktopNav.appendChild(dropdownContainer);
            } else {
                // Use nav-dropdown class for consistency, but without dropdown functionality
                const navContainer = document.createElement('div');
                navContainer.className = 'nav-dropdown';
                
                const desktopLink = document.createElement('a');
                desktopLink.href = item.url;
                desktopLink.id = `nav-${item.id}`;
                desktopLink.textContent = item.label;
                desktopLink.className = 'nav-dropdown-toggle';
                
                navContainer.appendChild(desktopLink);
                desktopNav.appendChild(navContainer);
            }
            
            // Mobile navigation (simplified - no dropdown for mobile)
            const mobileLink = document.createElement('a');
            mobileLink.href = item.url;
            mobileLink.id = `mobile-nav-${item.id}`;
            mobileLink.textContent = item.label;
            mobileNav.appendChild(mobileLink);
            
            // Add dropdown items to mobile menu
            if (item.dropdown) {
                item.dropdown.forEach(dropdownItem => {
                    const mobileDropdownLink = document.createElement('a');
                    mobileDropdownLink.href = dropdownItem.url;
                    mobileDropdownLink.textContent = `• ${dropdownItem.label}`;
                    mobileDropdownLink.style.paddingLeft = '2rem';
                    mobileDropdownLink.style.fontSize = '0.9rem';
                    mobileNav.appendChild(mobileDropdownLink);
                });
            }
        });
        
        // Set active states for navigation items
        setActiveNavItem();
    }
    
    // Update language switcher
    const langSwitcher = navData.language_switcher;
    const enBtn = document.getElementById('lang-en');
    const huBtn = document.getElementById('lang-hu');
    
    if (enBtn && huBtn) {
        if (siteData.currentLang === 'hu') {
            huBtn.classList.add('active');
            enBtn.classList.remove('active');
        } else {
            enBtn.classList.add('active');
            huBtn.classList.remove('active');
        }
    }
}

// Populate footer with centralized contact and social data
function populateFooterData() {
    if (!siteData.contact) return;
    
    const contact = siteData.contact.contact;
    const social = siteData.contact.social;
    
    // Update contact information
    const emailElements = document.querySelectorAll('[data-contact="email"]');
    const phoneElements = document.querySelectorAll('[data-contact="phone"]');
    
    emailElements.forEach(el => {
        if (el.tagName === 'A') {
            el.href = `mailto:${contact.email}`;
            el.textContent = `Email: ${contact.email}`;
        } else {
            el.textContent = `Email: ${contact.email}`;
        }
    });
    
    phoneElements.forEach(el => {
        if (el.tagName === 'A') {
            el.href = `tel:${contact.phone}`;
            el.textContent = `Phone: ${contact.phone}`;
        } else {
            el.textContent = `Phone: ${contact.phone}`;
        }
    });
    
    // Update social links
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer && social) {
        socialContainer.innerHTML = '';
        
        Object.values(social).forEach(platform => {
            const link = document.createElement('a');
            link.href = platform.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'social-link';
            link.textContent = platform.icon;
            link.title = platform.handle;
            socialContainer.appendChild(link);
        });
    }
}

// Initialize functions after includes are loaded
function initializeAfterLoad() {
    initHeaderScroll();
    initMobileMenu();
    initLanguageSwitcher();
    initSmoothScrolling();
    initLinkableHeaders();
    setActiveNavItem();
    setCurrentLanguage();
    initializeEmailJS(); // Initialize EmailJS functionality
}

// Header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            
            // Change hamburger icon
            const icon = mobileMenuBtn.querySelector('i') || mobileMenuBtn;
            if (mobileNav.classList.contains('active')) {
                icon.innerHTML = '✕';
            } else {
                icon.innerHTML = '☰';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
}

// Language switcher
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetLang = btn.dataset.lang;
            switchLanguage(targetLang);
        });
    });
}

// Switch language function
function switchLanguage(lang) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isHungarian = window.location.pathname.includes('/hu/');
    
    if (lang === 'hu' && !isHungarian) {
        // Switch to Hungarian
        window.location.href = `/hu/${currentPage}`;
    } else if (lang === 'en' && isHungarian) {
        // Switch to English
        const englishPath = currentPage === 'index.html' ? '/' : `/${currentPage}`;
        window.location.href = englishPath;
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize linkable headers functionality
function initLinkableHeaders() {
    const linkableHeaders = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
    
    linkableHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            e.preventDefault();
            const headerId = header.getAttribute('id');
            const currentUrl = window.location.href.split('#')[0];
            const linkUrl = `${currentUrl}#${headerId}`;
            
            // Update URL without scrolling
            history.pushState(null, null, `#${headerId}`);
            
            // Copy link to clipboard (modern browsers)
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(linkUrl).then(() => {
                    showLinkCopiedNotification(header);
                }).catch(() => {
                    // Fallback: just update URL
                    console.log('Link copied to URL bar');
                });
            } else {
                // Fallback for older browsers
                console.log('Link available in URL bar');
            }
        });
        
        // Add title attribute for accessibility
        header.setAttribute('title', 'Click to copy link to this section');
    });
}

// Show a brief notification that link was copied
function showLinkCopiedNotification(element) {
    const notification = document.createElement('div');
    notification.textContent = 'Link copied!';
    notification.style.cssText = `
        position: absolute;
        background: var(--navy-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
    `;
    
    element.style.position = 'relative';
    element.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// Set active navigation item based on current page
function setActiveNavItem() {
    if (!siteData.navigation || !siteData.navigation[siteData.currentLang]) return;
    
    const navData = siteData.navigation[siteData.currentLang];
    const currentPage = getCurrentPageName();
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav a, .nav-dropdown, .mobile-nav a').forEach(item => {
        item.classList.remove('active');
    });
    
    // Set active state for matching navigation items
    navData.main_nav.forEach(item => {
        const isActive = item.active_pages && item.active_pages.includes(currentPage);
        
        if (isActive) {
            // Handle dropdown items
            if (item.dropdown) {
                const dropdownContainer = document.querySelector(`#nav-${item.id}`);
                if (dropdownContainer && dropdownContainer.closest('.nav-dropdown')) {
                    dropdownContainer.closest('.nav-dropdown').classList.add('active');
                }
            } else {
                // Handle regular nav items
                const navItem = document.querySelector(`#nav-${item.id}`);
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
            
            // Handle mobile nav
            const mobileNavItem = document.querySelector(`#mobile-nav-${item.id}`);
            if (mobileNavItem) {
                mobileNavItem.classList.add('active');
            }
        }
    });
}

// Get current page name for active state matching
function getCurrentPageName() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Handle different cases
    if (!filename || filename === '' || filename === '/') {
        return 'index.html';
    }
    
    // Remove query parameters and hash
    return filename.split('?')[0].split('#')[0];
}

// Set current language button as active
function setCurrentLanguage() {
    const isHungarian = window.location.pathname.includes('/hu/');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Remove active class from all language buttons
    langButtons.forEach(btn => btn.classList.remove('active'));
    
    // Set active language button
    const activeLangBtn = document.getElementById(isHungarian ? 'lang-hu' : 'lang-en');
    if (activeLangBtn) {
        activeLangBtn.classList.add('active');
    }
    
    // Update language button links
    updateLanguageLinks();
}

// Update language button links based on current page
function updateLanguageLinks() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isHungarian = window.location.pathname.includes('/hu/');
    
    const enBtn = document.getElementById('lang-en');
    const huBtn = document.getElementById('lang-hu');
    
    if (enBtn && huBtn) {
        if (isHungarian) {
            // Currently on Hungarian page, EN should go to English version
            enBtn.href = `../${currentPage}`;
            huBtn.href = currentPage;
        } else {
            // Currently on English page, HU should go to Hungarian version
            enBtn.href = currentPage;
            huBtn.href = `hu/${currentPage}`;
        }
    }
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have header/footer placeholders, if so load includes
    const headerPlaceholder = document.getElementById('header');
    const footerPlaceholder = document.getElementById('footer');
    
    if (headerPlaceholder || footerPlaceholder) {
        // Load dynamic includes
        loadIncludes();
    } else {
        // Initialize everything directly (static content)
        initializeAfterLoad();
    }
});


// Utility function for loading content dynamically (for future use)
async function loadContent(contentFile) {
    try {
        const response = await fetch(contentFile);
        const content = await response.json();
        return content;
    } catch (error) {
        console.error('Error loading content:', error);
        return null;
    }
}

// Utility function to get centralized data
function getSiteData(key) {
    return siteData[key] || null;
}

// Utility function to get current language navigation data
function getCurrentNavData() {
    return siteData.navigation ? siteData.navigation[siteData.currentLang] : null;
}

// Utility function to get contact information
function getContactInfo() {
    return siteData.contact ? siteData.contact.contact : null;
}

// Utility function to get social media links
function getSocialLinks() {
    return siteData.contact ? siteData.contact.social : null;
}

// EmailJS functionality
function initializeEmailJS() {
    // Initialize EmailJS with public key from config
    if (siteData.config && siteData.config.emailjs) {
        emailjs.init(siteData.config.emailjs.public_key);
        
        // Set up contact form handler
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
    }
}

// Handle contact form submission
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('form-status');
    
    // Disable submit button and show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        // Get form data
        const formData = new FormData(form);
        
        // Prepare template parameters with website variable
        const templateParams = {
            from_name: formData.get('from_name'),
            from_email: formData.get('from_email'),
            subject: formData.get('subject') || 'Contact Form Submission',
            message: formData.get('message'),
            website: siteData.config.emailjs.website_name || 'Sailing Billabong', // Automatically filled website variable
            to_email: siteData.contact.contact.email
        };
        
        // Send email using EmailJS
        const response = await emailjs.send(
            siteData.config.emailjs.service_id,
            siteData.config.emailjs.template_id,
            templateParams
        );
        
        // Show success message
        showFormStatus('success', 'Message sent successfully! We\'ll get back to you soon.');
        form.reset();
        
    } catch (error) {
        console.error('EmailJS Error:', error);
        showFormStatus('error', 'Failed to send message. Please try again or contact us directly.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

// Show form status message
function showFormStatus(type, message) {
    const statusDiv = document.getElementById('form-status');
    if (!statusDiv) return;
    
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    
    if (type === 'success') {
        statusDiv.style.backgroundColor = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        statusDiv.style.backgroundColor = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.border = '1px solid #f5c6cb';
    }
    
    // Hide status message after 5 seconds
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 5000);
}

// Utility function to get site configuration
function getSiteConfig() {
    return siteData.config ? siteData.config.site : null;
}

// Utility function to get theme data
function getThemeData() {
    return siteData.theme || null;
}
