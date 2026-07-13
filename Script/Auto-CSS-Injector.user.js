// ==UserScript==
// @name         Auto CSS Injector
// @namespace    http://tampermonkey.net/
// @version      0.9
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
    const OVERRIDE_URL = 'https://cdn.jsdelivr.net/gh/ianian-cy/My-Mac-Temporarymonkey-Script@main/StyleSheet/Dev-Override.css';

    const sitecssmap = {
        'gemini.google.com': 'Gemini.css',
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