// ==UserScript==
// @name         Auto CSS Injector
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  直接修改 CSS
// @author       ianian.__.cy
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-start
// @connect      raw.githubusercontent.com
// @connect      cdn.jsdelivr.net
// @updateURL    https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.user.js
// @downloadURL  https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.user.js
// ==/UserScript==

(function () {
    'use strict';
    // ---- GM API 跨平台 wrapper ----
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            const api = (typeof GM !== 'undefined' && GM.xmlHttpRequest)
                ? GM.xmlHttpRequest          // Safari Tampermonkey / iOS Userscripts
                : GM_xmlhttpRequest;         // Chrome Tampermonkey
            api({
                    method: 'GET',
                    url: url,
                    onload: (r) => r.status === 200
                        ? resolve(r.responseText)
                        : reject(new Error('HTTP ' + r.status)),
                    onerror: (e) => reject(e)
                });
        });
    }

    const BASE = 'https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/StyleSheet/';

    const sitecssmap = {
        // ==================== Google
        'gemini.google.com': 'Gemini.css',
        'aistudio.google.com': 'Aistudio-Google.css',
        'colab.research.google.com': 'Google-Colab.css',
        'youtube.com': 'Youtube.css',
        'google,com' : 'Google-Search.css',
        // ====================
        'claude.ai' : 'Claude.css',
        'platform.claude.com' : 'platform.claude.css',
        // ====================
        'theguardian.com': 'The-Guardian.css',
        'theage.com.au': 'The-Age.css',
        'grok.com': 'Grok.css',
        'blog.csdn.net': 'blog_csdn.css',
        'perplexity.ai': 'perplexity.css',
        'www.perplexity.ai/search/': 'perplexity.css',
        '881903.com': '881903.css',
        'ieltsonlinetests.com': 'ieltsonlinetests.css',
        'missav.ai': 'MissAI.css',
        'thesaurus.com': 'thesaurus.css',
        'web.telegram.org': 'Telegram.css',
        'learn.adelaide.edu.au': 'Learn-Adelaide.css',
        'hk01.com': 'hk01.css',
        'wordlayouts.com': 'hk01.css',
        'terraink.app': 'terraink.css'
    };

    const currenthost = window.location.hostname.replace(/^www\./, '');

    // ---- 1. 主 CSS：用 GM API fetch（繞過 CSP）→ 塞入 <style> ----
    for (const [site, cssfile] of Object.entries(sitecssmap)) {
        if (currenthost.includes(site)) {
            const cssurl = BASE + cssfile
            gmFetch(cssurl + '?t=' + Date.now())
                .then(csstext => {
                    const style = document.createElement('style');
                    style.setAttribute('data-injected-by', 'auto-css-injector');
                    style.textContent = csstext + '\n\n/*# sourceURL=' + cssurl + ' */';
                    (document.head || document.documentElement).appendChild(style);
                    console.log('✅ CSS injected:', cssfile);
                })
                .catch(err => console.error('❌ 無法載入 CSS:', cssurl, err));
            break;
        }
    }
})();