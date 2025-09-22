// Sailing Billabong - Main JavaScript

// Load header and footer from separate files
async function loadIncludes() {
    try {
        // Load header
        const headerResponse = await fetch('includes/header.html');
        const headerHTML = await headerResponse.text();
        document.getElementById('header').innerHTML = headerHTML;
        
        // Load footer
        const footerResponse = await fetch('includes/footer.html');
        const footerHTML = await footerResponse.text();
        document.getElementById('footer').innerHTML = footerHTML;
        
        // Initialize other functions after includes are loaded
        initializeAfterLoad();
        
    } catch (error) {
        console.error('Error loading includes:', error);
        // Fallback: show error message or load static content
    }
}

// Initialize functions after includes are loaded
function initializeAfterLoad() {
    initHeaderScroll();
    initMobileMenu();
    initLanguageSwitcher();
    initSmoothScrolling();
    setActiveNavItem();
    setCurrentLanguage();
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

// Set active navigation item based on current page
function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const isHungarian = window.location.pathname.includes('/hu/');
    
    // Remove active class from all nav items
    const navLinks = document.querySelectorAll('.nav a, .mobile-nav a');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Determine which nav item should be active
    let activeNavId = '';
    switch(currentPage) {
        case 'index.html':
        case '':
            activeNavId = 'home';
            break;
        case 'about.html':
            activeNavId = 'about';
            break;
        case 'tours.html':
            activeNavId = 'tours';
            break;
        case 'contact.html':
            activeNavId = 'contact';
            break;
        case 'blog.html':
            activeNavId = 'blog';
            break;
    }
    
    // Set active class for desktop and mobile nav
    if (activeNavId) {
        const desktopNav = document.getElementById(`nav-${activeNavId}`);
        const mobileNav = document.getElementById(`mobile-nav-${activeNavId}`);
        
        if (desktopNav) desktopNav.classList.add('active');
        if (mobileNav) mobileNav.classList.add('active');
    }
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
