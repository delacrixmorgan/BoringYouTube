// Boring YouTube — Popup Script
// Handles UI state, toggle, and communication with content script

document.addEventListener('DOMContentLoaded', function () {
    const toggle     = document.getElementById('extensionToggle');
    const stateEmoji = document.getElementById('stateEmoji');
    const stateText  = document.getElementById('stateText');

    // ── Load persisted state ──────────────────────────────────
    chrome.storage.local.get(['boringEnabled'], function (result) {
        if (chrome.runtime.lastError) {
            console.warn('Boring YouTube: could not read storage —', chrome.runtime.lastError.message);
        }
        // Default: boring mode OFF (YouTube looks normal / colorful)
        const isEnabled = result.boringEnabled === true;
        toggle.checked = isEnabled;
        updateUI(isEnabled);
    });

    // ── Toggle change handler ─────────────────────────────────
    toggle.addEventListener('change', function () {
        const isEnabled = toggle.checked;

        chrome.storage.local.set({ boringEnabled: isEnabled }, function () {
            if (chrome.runtime.lastError) {
                console.warn('Boring YouTube: could not save state —', chrome.runtime.lastError.message);
            }
            updateUI(isEnabled);
        });

        // Notify all YouTube tabs
        const ytPatterns = ['*://www.youtube.com/*', '*://youtube.com/*'];
        ytPatterns.forEach(function (pattern) {
            chrome.tabs.query({ url: pattern }, function (tabs) {
                if (chrome.runtime.lastError) return;
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(
                        tab.id,
                        { action: 'boringToggle', enabled: isEnabled },
                        function () {
                            // Swallow "no receiver" errors — tab may not have content script yet
                            void chrome.runtime.lastError;
                        }
                    );
                });
            });
        });
    });

    // ── Update popup visuals ──────────────────────────────────
    function updateUI(isEnabled) {
        if (isEnabled) {
            stateEmoji.textContent = '🌙';
            stateText.textContent  = 'Boring Mode On';
        } else {
            stateEmoji.textContent = '☀️';
            stateText.textContent  = 'All Colors On';
        }
    }
});
