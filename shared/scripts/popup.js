document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('extensionToggle');
    const toggleLabel = document.getElementById('toggleLabel');
    const status = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    
    // Load current state with retry mechanism
    function loadExtensionState(retryCount = 0) {
        chrome.storage.sync.get(['extensionEnabled'], function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error loading extension state:', chrome.runtime.lastError);
                if (retryCount < 3) {
                    setTimeout(() => loadExtensionState(retryCount + 1), 100);
                    return;
                }
                // Fallback to default state if all retries fail
                result = { extensionEnabled: true };
            }
            
            const isEnabled = result.extensionEnabled !== false; // Default to true
            updateUI(isEnabled);
            toggle.checked = isEnabled;
            
            // Also verify state with background script
            chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
                if (chrome.runtime.lastError) {
                    // In Manifest V3, service worker may not be running, this is normal
                    console.log('Service worker not available, using storage state');
                    return;
                }
                
                if (response && typeof response.enabled === 'boolean') {
                    // If there's a mismatch, use the background script's state
                    if (response.enabled !== isEnabled) {
                        updateUI(response.enabled);
                        toggle.checked = response.enabled;
                        // Update storage to match
                        chrome.storage.sync.set({ extensionEnabled: response.enabled });
                    }
                }
            });
        });
    }
    
    // Initial state load
    loadExtensionState();
    
    // Handle toggle change
    toggle.addEventListener('change', function() {
        const isEnabled = toggle.checked;
        
        // Save state
        chrome.storage.sync.set({ extensionEnabled: isEnabled }, function() {
            updateUI(isEnabled);
            
            // Send message to all YouTube tabs
            chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleExtension',
                        enabled: isEnabled
                    }, function(response) {
                        // Ignore errors from tabs that might not have the content script loaded yet
                        if (chrome.runtime.lastError) {
                            console.log('Tab not ready:', chrome.runtime.lastError.message);
                        }
                    });
                });
            });
            
            chrome.tabs.query({ url: "*://youtube.com/*" }, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleExtension',
                        enabled: isEnabled
                    }, function(response) {
                        // Ignore errors from tabs that might not have the content script loaded yet
                        if (chrome.runtime.lastError) {
                            console.log('Tab not ready:', chrome.runtime.lastError.message);
                        }
                    });
                });
            });
        });
    });
    
    function updateUI(isEnabled) {
        if (isEnabled) {
            toggleLabel.textContent = 'Enabled';
            status.className = 'status enabled';
            statusText.textContent = 'Extension is active';
        } else {
            toggleLabel.textContent = 'Disabled';
            status.className = 'status disabled';
            statusText.textContent = 'Extension is disabled';
        }
    }
});
