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
        const [configResponse, contactResponse, themeResponse, navigationResponse, blogResponse] = await Promise.all([
            fetch('content/shared/config.json'),
            fetch('content/shared/contact.json'),
            fetch('content/shared/theme.json'),
            fetch('content/shared/navigation.json'),
            fetch('content/shared/blog.json')
        ]);
        
        // Parse JSON data
        siteData.config = await configResponse.json();
        siteData.contact = await contactResponse.json();
        siteData.theme = await themeResponse.json();
        siteData.navigation = await navigationResponse.json();
        siteData.blog = await blogResponse.json();
        
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
        
        // Initialize blog functionality
        setTimeout(() => {
            initializeBlog();
        }, 100);
        
    } catch (error) {
        console.error('Error loading includes:', error);
        // Fallback: show error message or load static content
    }
}

// Populate header with centralized navigation data
function populateHeaderData() {
    if (!siteData.navigation || !siteData.navigation[siteData.currentLang]) return;
    
    const navData = siteData.navigation[siteData.currentLang];
    const isFile = window.location.protocol === 'file:';
    const resolveUrl = (url) => {
        if (!isFile) return url;
        return toRelativeFileUrl(url);
    };
    
    // Update logo link based on current language
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        // Clean URLs on http(s), relative on file://
        logoContainer.href = siteData.currentLang === 'hu' ? (isFile ? 'hu/' : '/hu/') : (isFile ? 'index.html' : '/');
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
                mainLink.href = resolveUrl(item.url);
                mainLink.id = `nav-${item.id}`;
                mainLink.textContent = item.label;
                mainLink.className = 'nav-dropdown-toggle';
                
                const dropdownMenu = document.createElement('div');
                dropdownMenu.className = 'nav-dropdown-menu';
                
                item.dropdown.forEach(dropdownItem => {
                    const dropdownLink = document.createElement('a');
                    dropdownLink.href = resolveUrl(dropdownItem.url);
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
                desktopLink.href = resolveUrl(item.url);
                desktopLink.id = `nav-${item.id}`;
                desktopLink.textContent = item.label;
                desktopLink.className = 'nav-dropdown-toggle';
                
                navContainer.appendChild(desktopLink);
                desktopNav.appendChild(navContainer);
            }
            
            // Mobile navigation (simplified - no dropdown for mobile)
            const mobileLink = document.createElement('a');
            mobileLink.href = resolveUrl(item.url);
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
    normalizeLinksForEnvironment();
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
    const isFile = window.location.protocol === 'file:';
    if (!isFile) {
        // Clean URL behavior on http(s)
        const path = window.location.pathname; // e.g., '/contact', '/hu/contact', '/', '/hu/'
        const isHungarian = path.startsWith('/hu');
        const tail = isHungarian ? path.replace(/^\/hu/, '') : path; // '/contact' or '/'
        if (lang === 'hu' && !isHungarian) {
            const target = tail === '/' ? '/hu/' : `/hu${tail}`;
            window.location.href = target;
        } else if (lang === 'en' && isHungarian) {
            const target = tail || '/';
            window.location.href = target;
        }
        return;
    }
    // File protocol: use relative .html routes
    const pageSlug = getCurrentPageName(); // 'index', 'contact', etc.
    if (lang === 'hu') {
        const target = pageSlug === 'index' ? 'hu/index.html' : `hu/${pageSlug}.html`;
        window.location.href = target;
    } else {
        const target = pageSlug === 'index' ? 'index.html' : `${pageSlug}.html`;
        window.location.href = target;
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
    // Derive a logical page slug from the current path for active nav matching
    const path = window.location.pathname; // '/blog', '/contact', '/', '/hu/tours' or file paths
    const isFile = window.location.protocol === 'file:';
    if (isFile) {
        // For file://, infer from filename
        const filename = path.split('/').pop() || 'index.html';
        const name = filename.split('?')[0].split('#')[0];
        return name.replace(/\.html$/i, '') || 'index';
    }
    const withoutLang = path.replace(/^\/hu\/?/, '/');
    if (withoutLang === '/' || withoutLang === '') return 'index';
    const segments = withoutLang.split('/').filter(Boolean);
    return segments[0]; // first segment as page id (e.g., 'contact')
}
// Normalize internal links to work when opening files directly (file://)
function normalizeLinksForEnvironment() {
    if (window.location.protocol !== 'file:') return;
    const anchors = document.querySelectorAll('a[href]');
    anchors.forEach(a => {
        const href = a.getAttribute('href');
        const normalized = toRelativeFileUrl(href);
        a.setAttribute('href', normalized);
    });
}

// Convert clean/absolute internal links to relative .html for file:// usage
function toRelativeFileUrl(url) {
    if (!url) return url;
    // Leave externals and anchors unchanged
    if (/^(https?:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#')) {
        return url;
    }
    // Split off hash and query
    const [baseAndQuery, hash] = url.split('#');
    const [base, query] = baseAndQuery.split('?');
    let path = base;
    // Remove leading slash for relative
    if (path.startsWith('/')) path = path.slice(1);
    if (path === '') path = 'index.html';
    if (path.endsWith('/')) path += 'index.html';
    // Add .html if missing an extension
    const last = path.split('/').pop();
    if (last && !/\.[a-z0-9]+$/i.test(last)) {
        path += '.html';
    }
    const q = query ? `?${query}` : '';
    const h = hash ? `#${hash}` : '';
    return `${path}${q}${h}`;
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
    const enBtn = document.getElementById('lang-en');
    const huBtn = document.getElementById('lang-hu');
    if (!enBtn || !huBtn) return;
    const isFile = window.location.protocol === 'file:';
    if (!isFile) {
        const path = window.location.pathname; // absolute path
        const isHungarian = path.startsWith('/hu');
        const tail = isHungarian ? path.replace(/^\/hu/, '') : path;
        enBtn.href = isHungarian ? (tail || '/') : (path || '/');
        huBtn.href = isHungarian ? (path || '/hu/') : (tail === '/' ? '/hu/' : `/hu${tail}`);
        return;
    }
    // file:// links with .html
    const slug = getCurrentPageName();
    enBtn.href = slug === 'index' ? 'index.html' : `${slug}.html`;
    huBtn.href = slug === 'index' ? 'hu/index.html' : `hu/${slug}.html`;
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
        
        // Try to load blog data separately if not loaded
        loadBlogDataSeparately();
    }
});

// Load blog data separately if main loadIncludes fails
async function loadBlogDataSeparately() {
    try {
        const blogResponse = await fetch('content/shared/blog.json');
        siteData.blog = await blogResponse.json();
        console.log('Blog data loaded separately:', siteData.blog);
        
        setTimeout(() => {
            initializeBlog();
        }, 100);
    } catch (error) {
        console.error('Error loading blog data separately:', error);
    }
}


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

// Email/contact form utilities moved to js/contact-form.js

// Utility function to get site configuration
function getSiteConfig() {
    return siteData.config ? siteData.config.site : null;
}

// Utility function to get theme data
function getThemeData() {
    return siteData.theme || null;
}

// Scroll to next section function
function scrollToNextSection() {
    const nextSection = document.querySelector('#features');
    if (nextSection) {
        nextSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Blog functionality
function initializeBlog() {
    console.log('Initializing blog...', siteData.blog);
    
    // Populate blog page if we're on it
    if (document.getElementById('blog-grid')) {
        console.log('Found blog-grid, populating blog page...');
        populateBlogPage();
    }
    
    // Populate latest posts on homepage
    if (document.getElementById('latest-posts-grid')) {
        console.log('Found latest-posts-grid, populating latest posts...');
        populateLatestPosts();
    }
}

// Populate blog page with all articles
function populateBlogPage() {
    if (!siteData.blog || !siteData.blog.articles) return;
    
    const blogGrid = document.getElementById('blog-grid');
    const articles = siteData.blog.articles.filter(article => article.published);
    
    // Sort articles by date (newest first)
    articles.sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
    
    blogGrid.innerHTML = articles.map(article => createBlogCard(article, 'full')).join('');
}

// Populate latest posts section on homepage
function populateLatestPosts() {
    console.log('populateLatestPosts called', siteData.blog);
    
    if (!siteData.blog || !siteData.blog.articles) {
        console.error('No blog data available');
        return;
    }
    
    const latestPostsGrid = document.getElementById('latest-posts-grid');
    if (!latestPostsGrid) {
        console.error('latest-posts-grid element not found');
        return;
    }
    
    const articles = siteData.blog.articles.filter(article => article.published);
    console.log('Published articles:', articles);
    
    // Sort articles by date (newest first) and take only 3
    const latestArticles = articles
        .sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date))
        .slice(0, 3);
    
    console.log('Latest articles to display:', latestArticles);
    
    const html = latestArticles.map(article => createBlogCard(article, 'compact')).join('');
    console.log('Generated HTML:', html);
    
    latestPostsGrid.innerHTML = html;
}

// Create blog card HTML
function createBlogCard(article, type = 'full') {
    const category = siteData.blog.categories[article.category];
    const formattedDate = formatDate(article.creation_date);
    
    if (type === 'compact') {
        return `
            <div class="latest-post-card" onclick="window.location.href='blog-article.html?id=${article.id}'">
                <img src="${article.featured_image}" alt="${article.title}" class="latest-post-image" loading="lazy">
                <div class="latest-post-content">
                    <div class="latest-post-meta">
                        <span class="latest-post-category" style="background-color: ${category.color}">${category.name}</span>
                        <span class="latest-post-date">${formattedDate}</span>
                    </div>
                    <h3>${article.title}</h3>
                    <p>${article.short_description}</p>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="blog-card" onclick="window.location.href='blog-article.html?id=${article.id}'">
                <img src="${article.featured_image}" alt="${article.title}" class="blog-card-image" loading="lazy">
                <div class="blog-card-content">
                    <span class="blog-category" style="background-color: ${category.color}">${category.name}</span>
                    <h3>${article.title}</h3>
                    <div class="blog-date">${formattedDate}</div>
                    <p>${article.short_description}</p>
                    <a href="blog-article.html?id=${article.id}" class="blog-read-more">Read More →</a>
                </div>
            </div>
        `;
    }
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load individual article content
function loadArticleContent() {
    if (!siteData.blog || !siteData.blog.articles) return;
    
    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        // Redirect to blog page if no article ID
        window.location.href = 'blog.html';
        return;
    }
    
    // Find the article
    const article = siteData.blog.articles.find(a => a.id === articleId);
    
    if (!article || !article.published) {
        // Redirect to blog page if article not found
        window.location.href = 'blog.html';
        return;
    }
    
    // Get category info
    const category = siteData.blog.categories[article.category];
    const formattedDate = formatDate(article.creation_date);
    
    // Update page title and meta tags
    document.title = `${article.title} - Sailing Billabong`;
    document.getElementById('article-title').content = `${article.title} - Sailing Billabong`;
    document.getElementById('article-description').content = article.short_description;
    document.getElementById('og-title').content = article.title;
    document.getElementById('og-description').content = article.short_description;
    document.getElementById('og-image').content = article.featured_image;
    
    // Update article content
    document.getElementById('breadcrumb-title').textContent = article.title;
    document.getElementById('article-category-display').textContent = category.name;
    document.getElementById('article-category-display').style.backgroundColor = category.color;
    document.getElementById('article-date-display').textContent = formattedDate;
    document.getElementById('article-title-display').textContent = article.title;
    document.getElementById('article-excerpt-display').textContent = article.short_description;
    
    // Update featured image
    const featuredImage = document.getElementById('article-featured-image');
    featuredImage.src = article.featured_image;
    featuredImage.alt = article.title;
    
    // Update article body (placeholder content for now)
    const articleBody = document.getElementById('article-body');
    if (article.content && article.content.trim()) {
        articleBody.innerHTML = article.content;
    } else {
        articleBody.innerHTML = `
            <p>This is a test article for <strong>${article.title}</strong>.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <h2>Adventure Awaits</h2>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            <h3>What to Expect</h3>
            <ul>
                <li>Professional crew and safety equipment</li>
                <li>Comfortable sailing yacht with modern amenities</li>
                <li>Stunning views and pristine waters</li>
                <li>Unforgettable memories with family and friends</li>
            </ul>
            <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
        `;
    }
    
    // Update tags
    const tagsContainer = document.getElementById('article-tags');
    if (article.tags && article.tags.length > 0) {
        tagsContainer.innerHTML = article.tags.map(tag => 
            `<span class="article-tag">#${tag}</span>`
        ).join('');
    } else {
        tagsContainer.style.display = 'none';
    }
}
