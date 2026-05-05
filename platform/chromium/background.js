// Boring YouTube — Background Service Worker (Manifest V3)

// Set default state and open onboarding page on fresh install
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason === 'install') {
        chrome.storage.local.set({
            boringEnabled: false,
            installDate: Date.now(),
            toggleCount: 0,
            ratingPromptDismissed: false
        });
        // Open the welcome/onboarding page in a new tab
        chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html') });
        console.log('Boring YouTube installed — default state: OFF');
    }
});

// Update badge to reflect current state
function updateBadge(enabled) {
    chrome.action.setBadgeText({ text: enabled ? 'ON' : '' });
    chrome.action.setBadgeBackgroundColor({ color: enabled ? '#7B6FA0' : '#888888' });
}

// Sync badge whenever storage changes
chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === 'local' && changes.boringEnabled !== undefined) {
        updateBadge(changes.boringEnabled.newValue === true);
    }
});

// Restore badge on service-worker startup
chrome.storage.local.get(['boringEnabled'], function (result) {
    updateBadge(result.boringEnabled === true);
});
