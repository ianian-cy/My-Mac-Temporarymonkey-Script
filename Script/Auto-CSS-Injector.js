// ==UserScript==
// @name         Auto CSS Injector
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  直接修改 CSS
// @author       ianian.__.cy
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.js
// @downloadURL  https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.js
// ==/UserScript==



(function () {
    'use strict';

    const BASE = 'https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/StyleSheet/';
    const OVERRIDE_URL = 'https://cdn.jsdelivr.net/gh/ianian-cy/My-Mac-Temporarymonkey-Script@main/StyleSheet/Dev-Override.css';

    const sitecssmap = {
        'gemini.google.com': 'Gemini.css',
    };

    const currenthost = window.location.hostname.replace(/^www\./, '');

    // ---- 1. 注入該網站嘅主 CSS(fetch → <style>,跨平台,唔使任何 GM API) ----
    for (const [site, cssfile] of Object.entries(sitecssmap)) {
        if (currenthost.includes(site)) {
            const cssurl = BASE + cssfile;
            fetch(cssurl)
                .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
                .then(csstext => {
                    const style = document.createElement('style');
                    style.setAttribute('data-injected-by', 'auto-css-injector');
                    style.textContent = csstext + `\n\n/*# sourceURL=${cssurl} */`;
                    (document.head || document.documentElement).appendChild(style);
                    console.log('✅ CSS injected:', cssfile);
                })
                .catch(err => console.error('❌ 無法載入 CSS:', cssurl, err));
            break;
        }
    }

    // ---- 2. 每個網站都額外注入 Dev-Override.css(<link>,配合 Local Overrides 做 live dev) ----
    const injectOverride = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = OVERRIDE_URL;
        link.setAttribute('data-injected-by', 'auto-css-dev-override');
        document.head.appendChild(link);
    };
    if (document.head) {
        injectOverride();
    } else {
        document.addEventListener('DOMContentLoaded', injectOverride, { once: true });
    }
})();