// Boring YouTube - Content Script
// Handles dynamic content loading and fullscreen detection

(function() {
    'use strict';
    
    let isFullscreen = false;
    let observer = null;
    
    // CSS class to disable greyscale
    const DISABLE_GREYSCALE_CLASS = 'boring-youtube-disabled';
    
    // Add CSS to disable greyscale when needed
    function addDisableGreyscaleCSS() {
        if (document.getElementById('boring-youtube-disable-css')) return;
        
        const style = document.createElement('style');
        style.id = 'boring-youtube-disable-css';
        style.textContent = `
            .${DISABLE_GREYSCALE_CLASS} img[src*="hqdefault.jpg"],
            .${DISABLE_GREYSCALE_CLASS} img[src*="mqdefault.jpg"],
            .${DISABLE_GREYSCALE_CLASS} img[src*="sddefault.jpg"],
            .${DISABLE_GREYSCALE_CLASS} img[src*="maxresdefault.jpg"],
            .${DISABLE_GREYSCALE_CLASS} img[src*="default.jpg"],
            .${DISABLE_GREYSCALE_CLASS} ytd-thumbnail img,
            .${DISABLE_GREYSCALE_CLASS} yt-img-shadow img,
            .${DISABLE_GREYSCALE_CLASS} .ytd-thumbnail img,
            .${DISABLE_GREYSCALE_CLASS} .yt-simple-endpoint img[src*="youtube"],
            .${DISABLE_GREYSCALE_CLASS} #thumbnail img,
            .${DISABLE_GREYSCALE_CLASS} ytd-video-preview img,
            .${DISABLE_GREYSCALE_CLASS} ytd-rich-item-renderer img,
            .${DISABLE_GREYSCALE_CLASS} ytd-compact-video-renderer img,
            .${DISABLE_GREYSCALE_CLASS} ytd-grid-video-renderer img,
            .${DISABLE_GREYSCALE_CLASS} ytd-video-renderer img,
            .${DISABLE_GREYSCALE_CLASS} ytd-playlist-thumbnail img,
            .${DISABLE_GREYSCALE_CLASS} ytd-channel-avatar img,
            .${DISABLE_GREYSCALE_CLASS} .ytd-playlist-panel-video-renderer img,
            .${DISABLE_GREYSCALE_CLASS} .ytd-compact-playlist-renderer img,
            .${DISABLE_GREYSCALE_CLASS} .ytd-shelf-renderer img,
            .${DISABLE_GREYSCALE_CLASS} ytd-shorts-lockup-view-model img,
            .${DISABLE_GREYSCALE_CLASS} .ytd-reel-item-renderer img {
                filter: none !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Toggle greyscale based on fullscreen state
    function toggleGreyscale(disable) {
        if (disable) {
            document.body.classList.add(DISABLE_GREYSCALE_CLASS);
        } else {
            document.body.classList.remove(DISABLE_GREYSCALE_CLASS);
        }
    }
    
    // Check if we're in fullscreen mode
    function checkFullscreenState() {
        const wasFullscreen = isFullscreen;
        isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            document.querySelector('.ytp-fullscreen') ||
            document.querySelector('.html5-video-player.ytp-fullscreen')
        );
        
        if (wasFullscreen !== isFullscreen) {
            toggleGreyscale(isFullscreen);
        }
    }
    
    // Handle YouTube's dynamic content loading
    function handleDynamicContent() {
        // YouTube loads content dynamically, so we need to observe changes
        if (observer) {
            observer.disconnect();
        }
        
        observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            
            mutations.forEach((mutation) => {
                // Check if new nodes were added that might contain thumbnails
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node contains thumbnail-related elements
                            if (node.querySelector && (
                                node.querySelector('ytd-thumbnail') ||
                                node.querySelector('yt-img-shadow') ||
                                node.querySelector('img[src*="youtube"]') ||
                                node.matches('ytd-thumbnail') ||
                                node.matches('yt-img-shadow') ||
                                node.matches('img[src*="youtube"]')
                            )) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                
                // Check for class changes that might indicate fullscreen
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                    shouldCheck = true;
                }
            });
            
            if (shouldCheck) {
                // Small delay to ensure DOM is updated
                setTimeout(checkFullscreenState, 100);
            }
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    
    // Initialize the extension
    function init() {
        // Add the disable CSS
        addDisableGreyscaleCSS();
        
        // Initial fullscreen check
        checkFullscreenState();
        
        // Set up dynamic content handling
        handleDynamicContent();
        
        // Listen for fullscreen events
        document.addEventListener('fullscreenchange', checkFullscreenState);
        document.addEventListener('webkitfullscreenchange', checkFullscreenState);
        document.addEventListener('mozfullscreenchange', checkFullscreenState);
        document.addEventListener('MSFullscreenChange', checkFullscreenState);
        
        // Also listen for YouTube's custom events
        window.addEventListener('yt-navigate-finish', () => {
            setTimeout(checkFullscreenState, 500);
        });
        
        // Periodic check as backup
        setInterval(checkFullscreenState, 1000);
        
        console.log('Boring YouTube extension loaded');
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Handle page navigation in YouTube's SPA
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                checkFullscreenState();
                handleDynamicContent();
            }, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();
