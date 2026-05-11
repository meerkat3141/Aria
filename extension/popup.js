document.addEventListener('DOMContentLoaded', () => {
    const toggles = ['linereader', 'loupe', 'tts', 'dyslexia'];
    const selects = ['contrast'];

    // Load saved states
    chrome.storage.local.get([...toggles, ...selects], (result) => {
        toggles.forEach(feature => {
            const toggle = document.getElementById(`toggle-${feature}`);
            if (toggle) {
                toggle.checked = result[feature] || false;
                updateItemStyle(feature, toggle.checked);
            }
        });
        
        selects.forEach(feature => {
            const select = document.getElementById(`select-${feature}`);
            if (select) {
                select.value = result[feature] || 'none';
                updateItemStyle(feature, select.value !== 'none');
            }
        });
    });

    // Helper to send messages
    function notifyContentScript(feature, state, value = null) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0] && tabs[0].id) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    files: ['content.js']
                }, () => {
                    chrome.scripting.insertCSS({
                        target: {tabId: tabs[0].id},
                        files: ['styles.css']
                    }, () => {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            action: "toggleFeature",
                            feature: feature,
                            state: state,
                            value: value
                        }).catch(() => {});
                    });
                });
            }
        });
    }

    // Add event listeners for toggles
    toggles.forEach(feature => {
        const toggle = document.getElementById(`toggle-${feature}`);
        if (!toggle) return;
        toggle.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            
            const update = {};
            update[feature] = isChecked;
            chrome.storage.local.set(update);
            
            updateItemStyle(feature, isChecked);
            notifyContentScript(feature, isChecked);
        });
    });

    // Add event listeners for selects
    selects.forEach(feature => {
        const select = document.getElementById(`select-${feature}`);
        if (!select) return;
        select.addEventListener('change', (e) => {
            const val = e.target.value;
            
            const update = {};
            update[feature] = val;
            chrome.storage.local.set(update);
            
            updateItemStyle(feature, val !== 'none');
            notifyContentScript(feature, val !== 'none', val);
        });
    });

    function updateItemStyle(feature, isActive) {
        const item = document.getElementById(`item-${feature}`);
        if (!item) return;
        if (isActive) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    }
});
