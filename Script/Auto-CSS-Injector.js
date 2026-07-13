// ==UserScript==
// @name         Auto CSS Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接修改 CSS
// @author       ianian.__.cy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.js
// @run-at       document-start
// @connect      ianian-cy.com
// ==/UserScript==



(function() {
    'use strict';

    const sitecssmap = {
        // 'google.com': 'https://www.xxx.com/google.css',
        // 'youtube.com': 'https://www.xxx.com/youtube.css',
        // 'facebook.com': 'https://www.xxx.com/facebook.css',
        // ==================== Google
        'gemini.google.com': 'https://ianian-cy.com/Web-Style/Gemini.css',
        'aistudio.google.com': 'https://ianian-cy.com/Web-Style/Aistudio-Google.css',
        'colab.research.google.com': 'https://ianian-cy.com/Web-Style/Google-Colab.css',
        'youtube.com': 'https://ianian-cy.com/Web-Style/Youtube.css',
        'google,com' : 'https://ianian-cy.com/Web-Style/Google-Search.css',
        // ====================
        'claude.ai' : 'https://ianian-cy.com/Web-Style/Claude.css',
        'platform.claude.com' : 'https://ianian-cy.com/Web-Style/platform.claude.css',
        // ====================

        'theguardian.com': 'https://ianian-cy.com/Web-Style/The-Guardian.css',
        'theage.com.au': 'https://ianian-cy.com/Web-Style/The-Age.css',
        'grok.com': 'https://ianian-cy.com/Web-Style/Grok.css',
        'blog.csdn.net': 'https://ianian-cy.com/Web-Style/blog_csdn.css',
        'perplexity.ai': 'https://ianian-cy.com/Web-Style/perplexity.css',
        'www.perplexity.ai/search/': 'https://ianian-cy.com/Web-Style/perplexity.css',
        '881903.com': 'https://ianian-cy.com/Web-Style/881903.css',
        'ieltsonlinetests.com': 'https://ianian-cy.com/Web-Style/ieltsonlinetests.css',
        'missav.ai': 'https://ianian-cy.com/Web-Style/MissAI.css',
        'thesaurus.com': 'https://ianian-cy.com/Web-Style/thesaurus.css',
        'web.telegram.org': 'https://ianian-cy.com/Web-Style/Telegram.css',
        'learn.adelaide.edu.au': 'https://ianian-cy.com/Web-Style/Learn-Adelaide.css',
        'hk01.com': 'https://ianian-cy.com/Web-Style/hk01.css',
        'wordlayouts.com': 'https://ianian-cy.com/Web-Style/hk01.css',
        'terraink.app': 'https://ianian-cy.com/Web-Style/terraink.css'
    };

    const currenthost = window.location.hostname.replace(/^www\./, '');
    /* --------------------
    for (const [site, cssurl] of Object.entries(sitecssmap)) {
        if (currenthost.includes(site)) {
            // 用 GM_xmlhttpRequest 去攞 CSS 內容
            GM_xmlhttpRequest({
                method: 'GET',
                url: cssurl,
                onload: function(response) {
                    if (response.status === 200) {
                        // 用 GM_addStyle 注入 CSS
                        GM_addStyle(response.responseText);
                    }
                },
                onerror: function(error) {
                    console.error('無法載入 CSS:', cssurl, error);
                }
            });
            break;
        }
    }
     -------------------- */
    for (const [site, cssurl] of Object.entries(sitecssmap)) {
        if (currenthost.includes(site)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssurl;
            link.setAttribute('data-injected-by', 'auto-css-injector');
            (document.head || document.documentElement).appendChild(link);
            break;
        }
    }
    for (const [site, cssurl] of Object.entries(sitecssmap)) {
        if (currenthost.includes(site)) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cssurl,
                onload: function(response) {
                    if (response.status === 200) {
                        // 提取檔名
                        const filename = cssurl.split('/').pop();

                        // 加上 sourceURL 註釋,令 DevTools 將佢當成獨立檔案
                        const cssWithSourceMap = `${response.responseText}\n\n/*# sourceURL=${cssurl} */`;

                        GM_addStyle(cssWithSourceMap);
                        console.log('✅ CSS injected as virtual file:', filename);
                    }
                },
                onerror: function(error) {
                    console.error('❌ 無法載入 CSS:', cssurl, error);
                }
            });
            break;
        }
    }
})();
