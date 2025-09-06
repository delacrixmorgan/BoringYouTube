document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('extensionToggle');
    const toggleLabel = document.getElementById('toggleLabel');
    const status = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    
    // Force-sync state with content script to prevent state mismatches
    function syncWithContentScript(isEnabled) {
        chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'forceSync',
                    enabled: isEnabled
                });
            });
        });
        
        chrome.tabs.query({ url: "*://youtube.com/*" }, function(tabs) {
            tabs.forEach(tab => {
                chrome.tabs.sendMessage(tab.id, {
                    action: 'forceSync',
                    enabled: isEnabled
                });
            });
        });
    }
    
    // Load current state with retry mechanism
    function loadExtensionState(retryCount = 0) {
        chrome.storage.local.get(['extensionEnabled'], function(result) {
            if (chrome.runtime.lastError) {
                console.error('Error loading extension state:', chrome.runtime.lastError);
                if (retryCount < 3) {
                    setTimeout(() => loadExtensionState(retryCount + 1), 100);
                    return;
                }
                // Fallback to default state if all retries fail
                result = { extensionEnabled: true };
            }
            
            console.log('Loaded storage result:', result);
            // Fix boolean logic - default to true only if undefined, respect explicit false
            const isEnabled = result.extensionEnabled !== undefined ? result.extensionEnabled : true;
            console.log('Extension enabled:', isEnabled);
            updateUI(isEnabled);
            toggle.checked = isEnabled;
            
            // Force-sync with content script to prevent state mismatches
            syncWithContentScript(isEnabled);
            
            // Also verify state with background script
            chrome.runtime.sendMessage({ action: 'getState' }, function(response) {
                if (response && typeof response.enabled === 'boolean') {
                    console.log('Background script state:', response.enabled);
                    // If there's a mismatch, use the background script's state
                    if (response.enabled !== isEnabled) {
                        updateUI(response.enabled);
                        toggle.checked = response.enabled;
                        // Update storage to match
                        chrome.storage.local.set({ extensionEnabled: response.enabled });
                        // Re-sync with content script using correct state
                        syncWithContentScript(response.enabled);
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
        console.log('Toggle changed to:', isEnabled);
        
        // Save state using local storage for Firefox compatibility
        chrome.storage.local.set({ extensionEnabled: isEnabled }, function() {
            if (chrome.runtime.lastError) {
                console.error('Error saving state:', chrome.runtime.lastError);
            } else {
                console.log('State saved successfully:', isEnabled);
            }
            updateUI(isEnabled);
            
            // Send message to all YouTube tabs
            chrome.tabs.query({ url: "*://www.youtube.com/*" }, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleExtension',
                        enabled: isEnabled
                    });
                });
            });
            
            chrome.tabs.query({ url: "*://youtube.com/*" }, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'toggleExtension',
                        enabled: isEnabled
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
