// Boring YouTube — Chromium Content Script
// Applies/removes the boring-youtube-active class on <body>
// Uses MutationObserver to handle YouTube's SPA navigation.
// Observer is only active when boring mode is ON, saving system resources.

(function () {
    'use strict';

    const ACTIVE_CLASS = 'boring-youtube-active';
    let boringEnabled  = false;
    let observer       = null;

    // ── Apply or remove boring mode ───────────────────────────
    function applyState(enabled) {
        boringEnabled = enabled;
        if (enabled) {
            document.body.classList.add(ACTIVE_CLASS);
            startObserver(); // Only observe DOM when mode is active
        } else {
            document.body.classList.remove(ACTIVE_CLASS);
            stopObserver(); // Disconnect observer to free system resources
        }
    }

    // ── Load state from storage ───────────────────────────────
    function loadState(retries) {
        retries = retries || 0;
        chrome.storage.local.get(['boringEnabled'], function (result) {
            if (chrome.runtime.lastError) {
                if (retries < 3) {
                    setTimeout(function () { loadState(retries + 1); }, 150);
                }
                return;
            }
            applyState(result.boringEnabled === true);
        });
    }

    // ── Start MutationObserver ────────────────────────────────
    // Keeps the class alive across YouTube's SPA navigations.
    // Only called when boring mode is ON.
    function startObserver() {
        if (observer) return; // Already running

        let lastUrl = location.href;

        observer = new MutationObserver(function () {
            // Re-apply class if YouTube stripped it during SPA navigation
            if (boringEnabled && !document.body.classList.contains(ACTIVE_CLASS)) {
                document.body.classList.add(ACTIVE_CLASS);
            }

            // Detect URL change (YouTube SPA)
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(function () {
                    if (boringEnabled) {
                        document.body.classList.add(ACTIVE_CLASS);
                    }
                }, 300);
            }
        });

        observer.observe(document.body, {
            childList:  true,
            subtree:    true,
            attributes: false
        });
    }

    // ── Stop MutationObserver ─────────────────────────────────
    // Called when boring mode is turned OFF to free system resources.
    function stopObserver() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // ── YouTube SPA navigate-finish event ────────────────────
    window.addEventListener('yt-navigate-finish', function () {
        if (!boringEnabled) return;
        setTimeout(function () {
            document.body.classList.add(ACTIVE_CLASS);
        }, 200);
    });

    // ── Message listener (from popup) ─────────────────────────
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === 'boringToggle') {
            applyState(request.enabled);
        }
    });

    // ── Init ──────────────────────────────────────────────────
    function init() {
        loadState();
        console.log('Boring YouTube content script ready');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
