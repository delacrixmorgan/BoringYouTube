// Boring YouTube — Popup Script

document.addEventListener('DOMContentLoaded', function () {
    const toggle    = document.getElementById('extensionToggle');
    const stateText = document.getElementById('stateText');
    const stateEmoji = document.getElementById('stateEmoji');
    const rateBtn   = document.getElementById('rateBtn');

    // ── Constants ─────────────────────────────────────────────
    const STORAGE_KEY      = 'boringEnabled';
    const TOGGLE_COUNT_KEY = 'toggleCount';
    const INSTALL_DATE_KEY = 'installDate';
    const DISMISSED_KEY    = 'ratingPromptDismissed';
    const REVIEW_THRESHOLD_TOGGLES = 10;
    const REVIEW_THRESHOLD_DAYS    = 3;
    const THREE_DAYS_MS = REVIEW_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

    // ── Load initial state ────────────────────────────────────
    chrome.storage.local.get(
        [STORAGE_KEY, TOGGLE_COUNT_KEY, INSTALL_DATE_KEY, DISMISSED_KEY],
        function (result) {
            if (chrome.runtime.lastError) {
                console.error('Boring YouTube: storage read error', chrome.runtime.lastError);
                return;
            }

            const isEnabled = result[STORAGE_KEY] === true;
            toggle.checked = isEnabled;
            updateUI(isEnabled);
            checkRatingPrompt(result);
        }
    );

    // ── Handle toggle change ──────────────────────────────────
    toggle.addEventListener('change', function () {
        const isEnabled = toggle.checked;

        // Read current toggle count, increment, then save both state and count
        chrome.storage.local.get([TOGGLE_COUNT_KEY], function (result) {
            const newCount = (result[TOGGLE_COUNT_KEY] || 0) + 1;

            chrome.storage.local.set({
                [STORAGE_KEY]: isEnabled,
                [TOGGLE_COUNT_KEY]: newCount
            }, function () {
                updateUI(isEnabled);
                notifyYouTubeTabs(isEnabled);

                // Check if we should surface the review prompt now
                chrome.storage.local.get(
                    [INSTALL_DATE_KEY, DISMISSED_KEY],
                    function (stored) {
                        checkRatingPrompt({
                            [TOGGLE_COUNT_KEY]: newCount,
                            [INSTALL_DATE_KEY]: stored[INSTALL_DATE_KEY],
                            [DISMISSED_KEY]:    stored[DISMISSED_KEY]
                        });
                    }
                );
            });
        });
    });

    // ── Update popup UI ───────────────────────────────────────
    function updateUI(isEnabled) {
        if (isEnabled) {
            stateEmoji.textContent = '🌙';
            stateText.textContent  = 'Boring Mode On';
        } else {
            stateEmoji.textContent = '☀️';
            stateText.textContent  = 'All Colors On';
        }
    }

    // ── Notify all YouTube tabs of the new state ──────────────
    function notifyYouTubeTabs(isEnabled) {
        const patterns = ['*://www.youtube.com/*', '*://youtube.com/*'];
        patterns.forEach(function (pattern) {
            chrome.tabs.query({ url: pattern }, function (tabs) {
                tabs.forEach(function (tab) {
                    chrome.tabs.sendMessage(
                        tab.id,
                        { action: 'boringToggle', enabled: isEnabled },
                        function () {
                            if (chrome.runtime.lastError) {
                                // Normal — tab may not have the content script yet
                            }
                        }
                    );
                });
            });
        });
    }

    // ── Smart review prompt ───────────────────────────────────
    // Show the "Rate" button only after 10 toggles OR 3 days since install,
    // and only if the user has not already dismissed/clicked it.
    function checkRatingPrompt(data) {
        if (!rateBtn) return;
        if (data[DISMISSED_KEY]) return;

        const toggleCount   = data[TOGGLE_COUNT_KEY] || 0;
        const installDate   = data[INSTALL_DATE_KEY]  || Date.now();
        const daysSinceInstall = Date.now() - installDate;

        const shouldShow =
            toggleCount >= REVIEW_THRESHOLD_TOGGLES ||
            daysSinceInstall >= THREE_DAYS_MS;

        if (shouldShow) {
            rateBtn.classList.add('rate-btn--visible');
        }
    }

    // ── Mark prompt as dismissed when user clicks it ──────────
    if (rateBtn) {
        rateBtn.addEventListener('click', function () {
            chrome.storage.local.set({ [DISMISSED_KEY]: true });
        });
    }
});
