// Background script for Boring YouTube extension
// Handles state management and communication

// Initialize extension state
function initializeExtensionState() {
    chrome.storage.sync.get(['extensionEnabled'], function(result) {
        // If no value is stored, set default to true
        if (result.extensionEnabled === undefined) {
            chrome.storage.sync.set({ extensionEnabled: true }, function() {
                console.log('Boring YouTube extension state initialized to enabled');
            });
        }
    });
}

chrome.runtime.onInstalled.addListener(function() {
    // Set default state to enabled
    chrome.storage.sync.set({ extensionEnabled: true });
    console.log('Boring YouTube extension installed');
});

// Ensure state is initialized on startup
chrome.runtime.onStartup.addListener(function() {
    initializeExtensionState();
    console.log('Boring YouTube extension startup - state checked');
});

// Also initialize immediately when background script loads
initializeExtensionState();

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'getState') {
        chrome.storage.sync.get(['extensionEnabled'], function(result) {
            // Ensure we always return a boolean value, defaulting to true
            const isEnabled = result.extensionEnabled !== false;
            sendResponse({ enabled: isEnabled });
        });
        return true; // Keep message channel open for async response
    }
});

// Optional: Update icon based on state (for visual feedback)
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'sync' && changes.extensionEnabled) {
        const isEnabled = changes.extensionEnabled.newValue;
        
        // You can update the icon here if you have different icon states
        // For now, we'll keep the same icon regardless of state
        console.log('Extension state changed:', isEnabled ? 'enabled' : 'disabled');
    }
});
