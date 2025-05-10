// ==UserScript==
// @name         Humble Add Steam Link
// @version      2025-04-12
// @description  为Humble Bundle商品添加Steam商店链接
// @author       mookechee
// @match        https://www.humblebundle.com/*
// @icon         https://cdn.humblebundle.com/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png
// @grant        none
// @compatible   chrome&edge

// ==/UserScript==

(function() {
    const CONFIG = {
        initialDelay: 500,    // 初始等待500ms
        retryInterval: 300,   // 每300ms检查一次
        maxRetries: 5         // 最多重试5次
    };

    let retryCount = 0;

    function initialize() {
        const selector = 'h1[data-entity-kind="product"][data-anchor-name="#human_name"].human_name-view';
        const elements = document.querySelectorAll(selector);

        if (elements.length > 0) {
            processElements(elements);
            startMutationObserver();
        } else if (retryCount < CONFIG.maxRetries) {
            retryCount++;
            setTimeout(initialize, CONFIG.retryInterval);
        }
    }

    function processElements(elements) {
        elements.forEach(element => {
            if (element.dataset.steamLinkProcessed) return;
            element.dataset.steamLinkProcessed = true;

            element.style.textDecoration = 'underline';
            element.style.cursor = 'pointer';

            element.addEventListener('click', function() {
                const searchTerm = encodeURIComponent(element.textContent.trim());
                window.open(`https://store.steampowered.com/search/?term=${searchTerm}`, '_blank');
            });
        });
    }

    function startMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('h1[data-entity-kind="product"]')) {
                        processElements([node]);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 启动流程
    setTimeout(initialize, CONFIG.initialDelay);
})();
