// ===== SAILING BILLABONG UNIVERSAL TRACKING SCRIPT =====
// This script handles Google Analytics, Facebook Pixel, and GDPR-compliant cookie consent

(function() {
    'use strict';
    
    // Configuration - Get tracking IDs from centralized config (will be loaded by main.js)
    let FACEBOOK_PIXEL_ID = 'YOUR_PIXEL_ID_HERE'; // Fallback value
    let GOOGLE_ANALYTICS_ID = 'G-XXXXXXXXXX'; // Fallback value
    
    // Update tracking IDs from centralized config if available
    function updateTrackingIds() {
        if (window.siteData && window.siteData.config && window.siteData.config.tracking) {
            const tracking = window.siteData.config.tracking;
            GOOGLE_ANALYTICS_ID = tracking.gtag_config || GOOGLE_ANALYTICS_ID;
            FACEBOOK_PIXEL_ID = tracking.facebook_pixel || FACEBOOK_PIXEL_ID;
        }
    }
    const SCRIPT_BASE_PATH = getScriptBasePath();
    
    // Determine the base path for loading other scripts
    function getScriptBasePath() {
        const isInSubdirectory = window.location.pathname.includes('/hu/') || window.location.pathname.includes('/blog/');
        return isInSubdirectory ? '../js/' : 'js/';
    }
    
    // Initialize Google Analytics 4
    function initGoogleAnalytics() {
        updateTrackingIds(); // Update IDs from centralized config
        console.log('📊 Loading Google Analytics script...');
        
        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
        document.head.appendChild(script);
        
        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', GOOGLE_ANALYTICS_ID, {
            anonymize_ip: true, // GDPR compliance
            cookie_flags: 'SameSite=None;Secure'
        });
        
        // Make gtag globally available
        window.gtag = gtag;
        console.log('📊 Google Analytics initialized');
    }
    
    // Initialize Facebook Pixel
    function initFacebookPixel() {
        updateTrackingIds(); // Update IDs from centralized config
        // Facebook Pixel Base Code
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');

        // Initialize with pixel ID
        fbq('init', FACEBOOK_PIXEL_ID);
        fbq('track', 'PageView');
        
        // Add noscript fallback
        const noscript = document.createElement('noscript');
        noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1" />`;
        document.body.appendChild(noscript);
    }
    
    // Track page-specific events
    function trackPageEvents() {
        const currentPage = getCurrentPageName();
        const pagePath = window.location.pathname;
        
        // Facebook Pixel events
        switch(currentPage) {
            case 'home':
                fbq('track', 'ViewContent', {
                    content_type: 'homepage',
                    content_name: 'Homepage - Sailing Billabong'
                });
                break;
                
            case 'about':
                fbq('track', 'ViewContent', {
                    content_type: 'about',
                    content_name: 'About & Gallery'
                });
                break;
                
            case 'tours':
                fbq('track', 'ViewContent', {
                    content_type: 'tours',
                    content_name: 'Sailing Tours'
                });
                break;
                
            case 'contact':
                fbq('track', 'ViewContent', {
                    content_type: 'contact',
                    content_name: 'Contact & Booking'
                });
                break;
                
            case 'blog':
                fbq('track', 'ViewContent', {
                    content_type: 'blog',
                    content_name: 'Blog'
                });
                break;
                
            default:
                if (pagePath.includes('/blog/')) {
                    fbq('track', 'ViewContent', {
                        content_type: 'blog_post',
                        content_name: document.title
                    });
                }
        }
        
        // Google Analytics tracking
        if (window.gtag) {
            console.log('📊 Sending GA4 events...');
            
            // Enhanced page view tracking
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                content_group1: currentPage // Custom dimension for page type
            });
            
            // Track specific page types with custom events
            switch(currentPage) {
                case 'tours':
                    gtag('event', 'view_tours', {
                        event_category: 'engagement',
                        event_label: 'tours_page',
                        value: 1
                    });
                    break;
                    
                case 'contact':
                    gtag('event', 'view_contact', {
                        event_category: 'engagement',
                        event_label: 'contact_page',
                        value: 2
                    });
                    break;
                    
                case 'about':
                    gtag('event', 'view_about', {
                        event_category: 'engagement',
                        event_label: 'about_page'
                    });
                    break;
                    
                case 'blog':
                    gtag('event', 'view_blog', {
                        event_category: 'engagement',
                        event_label: 'blog_page'
                    });
                    break;
            }
        }
    }
    
    // Get current page name
    function getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        const pageMap = {
            'index.html': 'home',
            '': 'home',
            'about.html': 'about',
            'tours.html': 'tours',
            'contact.html': 'contact',
            'blog.html': 'blog'
        };
        
        return pageMap[filename] || 'other';
    }
    
    // Initialize cookie consent banner
    function initCookieConsent() {
        // Add cookie consent styles
        const styles = `
            .cookie-consent-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(10px);
                border-top: 1px solid #e5e7eb;
                box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease;
                padding: 1rem 0;
            }
            
            .cookie-consent-banner.show {
                transform: translateY(0);
            }
            
            .cookie-consent-banner.hide {
                transform: translateY(100%);
            }
            
            .cookie-consent-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1rem;
                display: flex;
                align-items: center;
                gap: 2rem;
                flex-wrap: wrap;
            }
            
            .cookie-consent-text {
                flex: 1;
                min-width: 300px;
            }
            
            .cookie-consent-text h3 {
                color: var(--navy-primary);
                font-size: 1.25rem;
                margin-bottom: 0.5rem;
            }
            
            .cookie-consent-text p {
                color: var(--text-body);
                font-size: 0.9rem;
                line-height: 1.5;
                margin: 0;
            }
            
            .cookie-consent-buttons {
                display: flex;
                gap: 0.75rem;
                flex-wrap: wrap;
            }
            
            .cookie-consent-buttons .btn {
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
                white-space: nowrap;
                border-radius: 50px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
                border: 2px solid transparent;
                cursor: pointer;
                text-align: center;
            }
            
            .cookie-consent-buttons .btn-primary {
                background: var(--navy-primary);
                color: white;
                box-shadow: var(--shadow-medium);
            }
            
            .cookie-consent-buttons .btn-primary:hover {
                background: var(--navy-light);
                transform: translateY(-2px);
            }
            
            .cookie-consent-buttons .btn-outline {
                background: transparent;
                color: var(--navy-primary);
                border: 2px solid var(--navy-primary);
            }
            
            .cookie-consent-buttons .btn-outline:hover {
                background: var(--navy-primary);
                color: white;
                transform: translateY(-2px);
            }
            
            .cookie-consent-buttons .btn-secondary {
                background: var(--grey-light);
                color: var(--text-body);
                border: 2px solid var(--grey-medium);
            }
            
            .cookie-consent-buttons .btn-secondary:hover {
                background: var(--light-blue);
                border-color: var(--navy-light);
                transform: translateY(-2px);
            }
            
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                padding: 1rem;
            }
            
            .cookie-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .cookie-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            
            .cookie-modal.show .cookie-modal-content {
                transform: translateY(0);
            }
            
            .cookie-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .cookie-modal-header h2 {
                color: var(--navy-primary);
                font-size: 1.5rem;
                margin: 0;
            }
            
            .cookie-modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-muted);
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .cookie-modal-close:hover {
                color: var(--text-body);
            }
            
            .cookie-modal-body {
                padding: 1.5rem;
            }
            
            .cookie-category {
                margin-bottom: 2rem;
            }
            
            .cookie-category h3 {
                color: var(--text-body);
                font-size: 1.1rem;
                margin-bottom: 0.5rem;
            }
            
            .cookie-category p {
                color: var(--text-muted);
                font-size: 0.9rem;
                margin-bottom: 1rem;
                line-height: 1.5;
            }
            
            .cookie-toggle {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                cursor: pointer;
                font-size: 0.9rem;
                color: var(--text-body);
            }
            
            .cookie-toggle input[type="checkbox"] {
                display: none;
            }
            
            .cookie-slider {
                width: 50px;
                height: 26px;
                background: var(--grey-medium);
                border-radius: 13px;
                position: relative;
                transition: background 0.3s ease;
            }
            
            .cookie-slider::before {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 22px;
                height: 22px;
                background: white;
                border-radius: 50%;
                transition: transform 0.3s ease;
            }
            
            .cookie-toggle input[type="checkbox"]:checked + .cookie-slider {
                background: var(--navy-primary);
            }
            
            .cookie-toggle input[type="checkbox"]:checked + .cookie-slider::before {
                transform: translateX(24px);
            }
            
            .cookie-toggle input[type="checkbox"]:disabled + .cookie-slider {
                background: var(--grey-medium);
                cursor: not-allowed;
            }
            
            .cookie-modal-footer {
                padding: 1.5rem;
                border-top: 1px solid #e5e7eb;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            
            @media (max-width: 768px) {
                .cookie-consent-content {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
                
                .cookie-consent-buttons {
                    justify-content: center;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        // Check if consent already given
        if (getCookieConsent() !== null) {
            return;
        }
        
        // Create banner - English version
        const bannerHTML = `
            <div id="cookie-consent-banner" class="cookie-consent-banner">
                <div class="cookie-consent-content">
                    <div class="cookie-consent-text">
                        <h3>Cookie Notice</h3>
                        <p>This website uses cookies to improve user experience and for marketing data collection. By continuing, you accept the use of cookies. <a href="privacy-policy.html" style="color: var(--navy-primary); text-decoration: underline;">Learn more</a></p>
                    </div>
                    <div class="cookie-consent-buttons">
                        <button id="cookie-accept" class="btn btn-primary">Understood</button>
                        <button id="cookie-settings" class="btn btn-secondary">Settings</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        
        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
        document.getElementById('cookie-settings').addEventListener('click', showCookieSettings);
        
        // Show banner
        setTimeout(() => {
            const banner = document.getElementById('cookie-consent-banner');
            if (banner) {
                banner.classList.add('show');
            }
        }, 500);
    }
    
    // Cookie consent functions
    function acceptCookies() {
        console.log('🍪 User accepted all cookies');
        setCookieConsent({
            necessary: true,
            marketing: true
        });
        hideBanner();
        initGoogleAnalytics();
        initFacebookPixel();
        setTimeout(() => {
            trackPageEvents();
        }, 100);
    }
    
    function showCookieSettings() {
        const modalHTML = `
            <div id="cookie-settings-modal" class="cookie-modal">
                <div class="cookie-modal-content">
                    <div class="cookie-modal-header">
                        <h2>Cookie Settings</h2>
                        <button id="close-cookie-modal" class="cookie-modal-close">&times;</button>
                    </div>
                    <div class="cookie-modal-body">
                        <div class="cookie-category">
                            <h3>Necessary Cookies</h3>
                            <p>These cookies are essential for the website to function properly and cannot be disabled.</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-slider"></span>
                                Necessary cookies (always active)
                            </label>
                        </div>
                        <div class="cookie-category">
                            <h3>Analytics and Marketing Cookies</h3>
                            <p>These cookies help us understand website usage and enable relevant advertising.</p>
                            <label class="cookie-toggle">
                                <input type="checkbox" id="marketing-cookies" checked>
                                <span class="cookie-slider"></span>
                                Google Analytics and Facebook Pixel
                            </label>
                        </div>
                    </div>
                    <div class="cookie-modal-footer">
                        <button id="save-cookie-settings" class="btn btn-primary">Save Settings</button>
                        <button id="accept-all-modal" class="btn btn-outline">Accept All</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add event listeners
        document.getElementById('close-cookie-modal').addEventListener('click', closeCookieModal);
        document.getElementById('save-cookie-settings').addEventListener('click', saveCookieSettings);
        document.getElementById('accept-all-modal').addEventListener('click', acceptAllFromModal);

        // Show modal
        setTimeout(() => {
            const modal = document.getElementById('cookie-settings-modal');
            if (modal) {
                modal.classList.add('show');
            }
        }, 100);
    }
    
    function closeCookieModal() {
        const modal = document.getElementById('cookie-settings-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    function saveCookieSettings() {
        const marketingEnabled = document.getElementById('marketing-cookies').checked;
        
        console.log('⚙️ Saving cookie settings - Marketing enabled:', marketingEnabled);
        setCookieConsent({
            necessary: true,
            marketing: marketingEnabled
        });
        
        if (marketingEnabled) {
            initGoogleAnalytics();
            initFacebookPixel();
            setTimeout(() => {
                trackPageEvents();
            }, 100);
        }
        
        closeCookieModal();
        hideBanner();
    }
    
    function acceptAllFromModal() {
        document.getElementById('marketing-cookies').checked = true;
        saveCookieSettings();
    }
    
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => banner.remove(), 300);
        }
    }
    
    function setCookieConsent(consent) {
        const consentData = {
            timestamp: new Date().toISOString(),
            consent: consent
        };
        localStorage.setItem('sailingbillabong_cookie_consent', JSON.stringify(consentData));
    }
    
    function getCookieConsent() {
        try {
            const stored = localStorage.getItem('sailingbillabong_cookie_consent');
            if (stored) {
                const data = JSON.parse(stored);
                return data.consent;
            }
        } catch (e) {
            console.error('Error reading cookie consent:', e);
        }
        return null;
    }
    
    // Initialize everything when DOM is ready
    function init() {
        const consent = getCookieConsent();
        
        console.log('🚀 Sailing Billabong Tracking initialized');
        console.log('🍪 Current cookie consent status:', consent);
        
        if (consent && typeof consent === 'object' && consent.marketing) {
            console.log('✅ User has consented to marketing, initializing tracking...');
            initGoogleAnalytics();
            initFacebookPixel();
            setTimeout(() => {
                trackPageEvents();
            }, 100);
        } else if (consent === null) {
            console.log('❓ No consent decision yet, showing banner...');
            initCookieConsent();
        } else {
            console.log('❌ User has not consented to marketing tracking');
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Export for external use
    window.SailingBillabongTracking = {
        initFacebookPixel,
        trackPageEvents,
        getCookieConsent,
        setCookieConsent
    };
})();
