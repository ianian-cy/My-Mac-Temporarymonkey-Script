// ==UserScript==
// @name         blog.csdn.net (Disable Copy)
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Disable Copy on blog.csdn.net
// @author       ianian.__.cy
// @match        https://blog.csdn.net/*
// @match        https://wayne-blog.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @run-at       document-start
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/blog-csdn-net-DisableCopy.user.js
// @downloadURL  https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/blog-csdn-net-DisableCopy.user.js
// ==/UserScript==


(function() {
    'use strict';
    function enableCopy() {
        // 移除禁止複製嘅事件監聽器
        document.addEventListener('copy', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 移除選擇文字後唔畀複製嘅效果
        document.addEventListener('selectstart', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 移除可能嘅右鍵選單禁用
        document.addEventListener('contextmenu', function(e) {
            e.stopImmediatePropagation();
        }, true);
    }
    function removeCopyRestrictions() {
        // 解除所有事件監聽
        document.addEventListener('copy', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 處理代碼區塊
        const codeBlocks = document.querySelectorAll('pre');
        codeBlocks.forEach(function(block) {
            // 移除可能存在嘅禁止複製屬性
            block.removeAttribute('onclick');
            block.style.userSelect = 'text';

            // 移除子元素嘅禁止複製屬性
            const codeElements = block.querySelectorAll('code');
            codeElements.forEach(function(code) {
                code.style.userSelect = 'text';
            });
        });
    }
    // 當頁面載入完成後執行
    window.addEventListener('load', function() {removeCopyRestrictions();});
    removeCopyRestrictions();
    // 頁面載入時執行
    window.addEventListener('load', enableCopy);
    // 立即執行一次
    enableCopy();
})();