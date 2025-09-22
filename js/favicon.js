// Simple favicon loader
function addFavicon() {
    // Remove any existing favicons
    const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
    existingFavicons.forEach(favicon => favicon.remove());
    
    // Add 32x32 favicon
    const favicon32 = document.createElement('link');
    favicon32.rel = 'icon';
    favicon32.type = 'image/png';
    favicon32.sizes = '32x32';
    favicon32.href = './images/favicon-32x32.png';
    document.head.appendChild(favicon32);
    
    // Add 16x16 favicon
    const favicon16 = document.createElement('link');
    favicon16.rel = 'icon';
    favicon16.type = 'image/png';
    favicon16.sizes = '16x16';
    favicon16.href = './images/favicon-16x16.png';
    document.head.appendChild(favicon16);
    
    // Add shortcut icon for older browsers
    const shortcutIcon = document.createElement('link');
    shortcutIcon.rel = 'shortcut icon';
    shortcutIcon.href = 'images/favicon-32x32.png';
    document.head.appendChild(shortcutIcon);
}

// Run immediately when script loads
addFavicon();
