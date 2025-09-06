// Boring YouTube - Content Script
// Handles dynamic content loading and fullscreen detection

(function() {
    'use strict';
    
    let isFullscreen = false;
    let observer = null;
    let extensionEnabled = true; // Global extension state
    
    // CSS class to disable greyscale
    const DISABLE_GREYSCALE_CLASS = 'boring-youtube-disabled';
    const EXTENSION_DISABLED_CLASS = 'boring-youtube-extension-disabled';
    
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
            .${DISABLE_GREYSCALE_CLASS} .ytd-reel-item-renderer img,
            .${EXTENSION_DISABLED_CLASS} img[src*="hqdefault.jpg"],
            .${EXTENSION_DISABLED_CLASS} img[src*="mqdefault.jpg"],
            .${EXTENSION_DISABLED_CLASS} img[src*="sddefault.jpg"],
            .${EXTENSION_DISABLED_CLASS} img[src*="maxresdefault.jpg"],
            .${EXTENSION_DISABLED_CLASS} img[src*="default.jpg"],
            .${EXTENSION_DISABLED_CLASS} ytd-thumbnail img,
            .${EXTENSION_DISABLED_CLASS} yt-img-shadow img,
            .${EXTENSION_DISABLED_CLASS} .ytd-thumbnail img,
            .${EXTENSION_DISABLED_CLASS} .yt-simple-endpoint img[src*="youtube"],
            .${EXTENSION_DISABLED_CLASS} #thumbnail img,
            .${EXTENSION_DISABLED_CLASS} ytd-video-preview img,
            .${EXTENSION_DISABLED_CLASS} ytd-rich-item-renderer img,
            .${EXTENSION_DISABLED_CLASS} ytd-compact-video-renderer img,
            .${EXTENSION_DISABLED_CLASS} ytd-grid-video-renderer img,
            .${EXTENSION_DISABLED_CLASS} ytd-video-renderer img,
            .${EXTENSION_DISABLED_CLASS} ytd-playlist-thumbnail img,
            .${EXTENSION_DISABLED_CLASS} ytd-channel-avatar img,
            .${EXTENSION_DISABLED_CLASS} .ytd-playlist-panel-video-renderer img,
            .${EXTENSION_DISABLED_CLASS} .ytd-compact-playlist-renderer img,
            .${EXTENSION_DISABLED_CLASS} .ytd-shelf-renderer img,
            .${EXTENSION_DISABLED_CLASS} ytd-shorts-lockup-view-model img,
            .${EXTENSION_DISABLED_CLASS} .ytd-reel-item-renderer img {
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
    
    // Toggle extension enabled/disabled state
    function toggleExtension(enabled) {
        extensionEnabled = enabled;
        if (enabled) {
            document.body.classList.remove(EXTENSION_DISABLED_CLASS);
            // Re-check fullscreen state to apply correct greyscale
            checkFullscreenState();
        } else {
            document.body.classList.add(EXTENSION_DISABLED_CLASS);
        }
        console.log('Boring YouTube extension', enabled ? 'enabled' : 'disabled');
    }
    
    // Get extension state from storage with retry mechanism
    function getExtensionState(retryCount = 0) {
        chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
            if (chrome.runtime.lastError) {
                console.error('Error getting extension state:', chrome.runtime.lastError);
                if (retryCount < 3) {
                    setTimeout(() => getExtensionState(retryCount + 1), 200);
                    return;
                }
                // Fallback to enabled state if all retries fail
                toggleExtension(true);
                return;
            }
            
            if (response && typeof response.enabled === 'boolean') {
                toggleExtension(response.enabled);
            } else {
                // Fallback: try to get state directly from storage
                chrome.storage.local.get(['extensionEnabled'], function(result) {
                    if (chrome.runtime.lastError) {
                        console.error('Error accessing storage:', chrome.runtime.lastError);
                        toggleExtension(true); // Default to enabled
                    } else {
                        console.log('Content script: Direct storage result:', result);
                        // Fix boolean logic - default to true only if undefined, respect explicit false
                        const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
                        console.log('Content script: Setting enabled state:', isEnabled);
                        toggleExtension(isEnabled);
                    }
                });
            }
        });
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
        
        // Get initial extension state
        getExtensionState();
        
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
    
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'toggleExtension') {
            toggleExtension(request.enabled);
        } else if (request.action === 'forceSync') {
            // Force-sync state to prevent mismatches (Firefox fix)
            toggleExtension(request.enabled);
        }
    });
    
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
