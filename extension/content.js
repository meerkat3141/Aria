// Prevent multiple injections of the content script on the same page
if (!window.ariaAssistInjected) {
    window.ariaAssistInjected = true;

    // Feature state tracking
    let lineReaderEl = null;
    let isLineReaderActive = false;

    let loupeEl = null;
    let isLoupeActive = false;

    let isTTSActive = false;

    // Initialize and track the Line Reader DOM element
    function initLineReader() {
        if (!lineReaderEl) {
            lineReaderEl = document.createElement('div');
            lineReaderEl.id = 'aria-assist-line-reader';
            document.body.appendChild(lineReaderEl);
            
            document.addEventListener('mousemove', (e) => {
                if (isLineReaderActive && lineReaderEl) {
                    lineReaderEl.style.top = e.clientY + 'px';
                }
            });
        }
    }

    // Initialize the Hover Loupe (Text Magnifier) DOM element
    function initLoupe() {
        if (!loupeEl) {
            loupeEl = document.createElement('div');
            loupeEl.id = 'aria-assist-loupe';
            document.body.appendChild(loupeEl);

            document.addEventListener('mousemove', (e) => {
                if (isLoupeActive && loupeEl) {
                    // Position loupe slightly below and to the right of cursor
                    loupeEl.style.left = (e.clientX + 20) + 'px';
                    loupeEl.style.top = (e.clientY + 20) + 'px';

                    let target = e.target;
                    
                    // Check if element has direct text nodes with content
                    let hasDirectText = false;
                    if (target.childNodes) {
                        for (let i = 0; i < target.childNodes.length; i++) {
                            if (target.childNodes[i].nodeType === 3 && target.childNodes[i].nodeValue.trim().length > 0) {
                                hasDirectText = true;
                                break;
                            }
                        }
                    }

                    // If it's a text-containing element, button, link, or label
                    let validTags = ['BUTTON', 'A', 'LABEL', 'H1', 'H2', 'H3', 'P', 'SPAN', 'LI'];
                    if (hasDirectText || validTags.includes(target.tagName)) {
                        let text = target.innerText || target.textContent || '';
                        let trimmed = text.trim();
                        if (trimmed && target.tagName !== 'BODY' && target.tagName !== 'HTML') {
                            loupeEl.textContent = trimmed.substring(0, 150) + (trimmed.length > 150 ? '...' : '');
                            loupeEl.style.display = 'block';
                            return; // Exit here if we showed it
                        }
                    }
                    
                    // Otherwise hide it
                    loupeEl.style.display = 'none';
                }
            });
        }
    }

    // Setup Text-to-Speech listener to trigger on mouseup selection
    document.addEventListener('mouseup', () => {
        if (!isTTSActive) return;
        
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            window.speechSynthesis.cancel(); 
            
            const utterance = new SpeechSynthesisUtterance(selectedText);
            utterance.rate = 0.9; 
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    });

    // Listen for toggle commands from the extension popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "toggleFeature") {
            const { feature, state, value } = request;

            switch(feature) {
                case 'linereader':
                    isLineReaderActive = state;
                    initLineReader();
                    lineReaderEl.style.display = state ? 'block' : 'none';
                    break;
                
                case 'loupe':
                    isLoupeActive = state;
                    initLoupe();
                    loupeEl.style.display = 'none'; // reset on toggle
                    break;
                
                case 'tts':
                    isTTSActive = state;
                    if (!state) {
                        window.speechSynthesis.cancel();
                    }
                    break;
                
                case 'contrast':
                    // Reset all
                    document.documentElement.classList.remove('aria-assist-contrast-dark', 'aria-assist-contrast-invert', 'aria-assist-contrast-grayscale');
                    if (state && value && value !== 'none') {
                        document.documentElement.classList.add(`aria-assist-contrast-${value}`);
                    }
                    break;

                case 'dyslexia':
                    if (state) {
                        document.documentElement.classList.add('aria-assist-dyslexia');
                    } else {
                        document.documentElement.classList.remove('aria-assist-dyslexia');
                    }
                    break;
            }
        }
    });
}
