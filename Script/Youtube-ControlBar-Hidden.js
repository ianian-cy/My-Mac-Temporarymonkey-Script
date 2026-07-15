// ==UserScript==
// @name         youtube-improved-controls
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  改進 YouTube 控制項隱藏行為，包括暫停狀態和滑鼠離開視頻區域
// @author       ianian.__.cy
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @connect      raw.githubusercontent.com
// @updateURL    https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.user.js
// @downloadURL  https://raw.githubusercontent.com/ianian-cy/My-Mac-Temporarymonkey-Script/main/Script/Auto-CSS-Injector.user.js
// ==/UserScript==



(function() {
    'use strict';

    // 插入自定義 CSS
    function addCustomCSS() {
        const css = `
            /* 加快過渡動畫 */
            .ytp-chrome-top, .ytp-chrome-bottom {
                transition: opacity 0.15s linear !important;
            }

            /* 強制隱藏控制項 - 當添加了我們自定義嘅 .force-hide-controls 類 */
            .html5-video-player.force-hide-controls .ytp-chrome-bottom,
            .html5-video-player.force-hide-controls .ytp-chrome-top,
            .html5-video-player.force-hide-controls .ytp-gradient-bottom,
            .html5-video-player.force-hide-controls .ytp-gradient-top {
                opacity: 0 !important;
                visibility: hidden !important;
            }

            /* 防止 YouTube 嘅懸停效果覆蓋我們嘅隱藏 */
            .html5-video-player.force-hide-controls:hover .ytp-chrome-bottom,
            .html5-video-player.force-hide-controls:hover .ytp-chrome-top,
            .html5-video-player.force-hide-controls:hover .ytp-gradient-bottom,
            .html5-video-player.force-hide-controls:hover .ytp-gradient-top {
                opacity: 0 !important;
                visibility: hidden !important;
            }

            /* 只有當滑鼠移動時才顯示 */
            .html5-video-player.mouse-moving .ytp-chrome-bottom,
            .html5-video-player.mouse-moving .ytp-chrome-top,
            .html5-video-player.mouse-moving .ytp-gradient-bottom,
            .html5-video-player.mouse-moving .ytp-gradient-top {
                opacity: 1 !important;
                visibility: visible !important;
            }

            /* 當鼠標不在視頻上時隱藏控制項 */
            .html5-video-player.mouse-outside .ytp-chrome-bottom,
            .html5-video-player.mouse-outside .ytp-chrome-top,
            .html5-video-player.mouse-outside .ytp-gradient-bottom,
            .html5-video-player.mouse-outside .ytp-gradient-top {
                opacity: 0 !important;
                visibility: hidden !important;
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 設定滑鼠移動監聽器和計時器
    function setupMouseMoveDetection() {
        let timer;
        const delay = 1000; // 控制項顯示時間 (毫秒) - 調整為 0.2 秒
        let isMouseOverVideo = false;

        function startHideTimer() {
            // 清除之前嘅計時器
            if (timer) clearTimeout(timer);

            // 設定新計時器
            timer = setTimeout(() => {
                // 找到所有播放器元素
                const players = document.querySelectorAll('.html5-video-player');
                players.forEach(player => {
                    // 添加我們自定義嘅強制隱藏類
                    player.classList.add('force-hide-controls');
                    player.classList.remove('mouse-moving');
                });
            }, delay);
        }

        // 監聽整個文檔嘅滑鼠移動
        document.addEventListener('mousemove', (e) => {
            // 找到所有播放器元素
            const players = document.querySelectorAll('.html5-video-player');

            players.forEach(player => {
                // 檢查滑鼠是否在視頻元素上
                const videoElement = player.querySelector('video');
                if (videoElement) {
                    const rect = videoElement.getBoundingClientRect();
                    isMouseOverVideo = (
                        e.clientX >= rect.left &&
                        e.clientX <= rect.right &&
                        e.clientY >= rect.top &&
                        e.clientY <= rect.bottom
                    );

                    if (isMouseOverVideo) {
                        // 滑鼠在視頻上時
                        player.classList.remove('mouse-outside');
                        player.classList.remove('force-hide-controls');
                        player.classList.add('mouse-moving');

                        // 重新開始隱藏計時器
                        startHideTimer();
                    } else {
                        // 滑鼠不在視頻上時
                        player.classList.add('mouse-outside');
                        player.classList.add('force-hide-controls');
                        player.classList.remove('mouse-moving');
                    }
                }
            });
        });

        // 處理滑鼠離開視頻區域
        document.addEventListener('mouseout', (e) => {
            if (e.relatedTarget === null) {  // 滑鼠離開窗口
                const players = document.querySelectorAll('.html5-video-player');
                players.forEach(player => {
                    player.classList.add('mouse-outside');
                    player.classList.add('force-hide-controls');
                    player.classList.remove('mouse-moving');
                });
            }
        });

        // 監聽視頻播放狀態變化
        document.addEventListener('click', (e) => {
            // 延遲處理，確保 YouTube 已處理播放/暫停狀態
            setTimeout(() => {
                const players = document.querySelectorAll('.html5-video-player');
                players.forEach(player => {
                    const video = player.querySelector('video');
                    if (video) {
                        // 即使在暫停狀態下，也應用我們的控制項邏輯
                        if (!isMouseOverVideo || !player.classList.contains('mouse-moving')) {
                            player.classList.add('force-hide-controls');
                        }
                    }
                });
            }, 100);
        });

        // 添加額外嘅事件監聽，確保全屏模式下也有效
        document.addEventListener('fullscreenchange', () => {
            // 短暫延遲，等 YouTube 完成全屏切換
            setTimeout(() => {
                const players = document.querySelectorAll('.html5-video-player');
                players.forEach(player => {
                    if (isMouseOverVideo) {
                        player.classList.remove('force-hide-controls');
                        player.classList.add('mouse-moving');
                        startHideTimer();
                    } else {
                        player.classList.add('mouse-outside');
                        player.classList.add('force-hide-controls');
                        player.classList.remove('mouse-moving');
                    }
                });
            }, 100);
        });
    }

    // 覆蓋 YouTube 的原生控制項顯示邏輯
    function overrideYouTubeMethods() {
        // 使用 MutationObserver 等待播放器加載
        const observer = new MutationObserver(() => {
            const videoPlayer = document.querySelector('.html5-video-player');
            if (videoPlayer && !videoPlayer.hasAttribute('data-controls-modified')) {
                videoPlayer.setAttribute('data-controls-modified', 'true');

                // 監聽播放/暫停事件
                const video = videoPlayer.querySelector('video');
                if (video) {
                    video.addEventListener('play', () => {
                        // 視頻開始播放時，應用我們的控制邏輯
                        setTimeout(() => {
                            videoPlayer.classList.add('force-hide-controls');
                        }, 1200);
                    });

                    video.addEventListener('pause', () => {
                        // 視頻暫停時，也應用我們的控制邏輯
                        // 但暫停後先短暫顯示控制項，然後再隱藏
                        videoPlayer.classList.remove('force-hide-controls');
                        videoPlayer.classList.add('mouse-moving');

                        setTimeout(() => {
                            if (!videoPlayer.matches(':hover')) {
                                videoPlayer.classList.add('force-hide-controls');
                                videoPlayer.classList.remove('mouse-moving');
                            }
                        }, 2500); // 暫停後顯示控制項 1.5 秒
                    });
                }

                // 嘗試覆蓋 YouTube 內部方法
                if (videoPlayer._api) {
                    // 保存原始方法
                    const originalShowControls = videoPlayer._api.showControls;

                    // 覆蓋顯示控制項方法
                    videoPlayer._api.showControls = function() {
                        originalShowControls.apply(this, arguments);

                        // 立即啟動隱藏計時器
                        setTimeout(() => {
                            document.dispatchEvent(new Event('mousemove'));
                        }, 0);
                    };
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 當 DOM 準備好後執行
    function initialize() {
        addCustomCSS();
        setupMouseMoveDetection();
        overrideYouTubeMethods();
    }

    // 立即添加 CSS
    if (document.head) {
        addCustomCSS();
    } else {
        document.addEventListener('DOMContentLoaded', addCustomCSS);
    }

    // 設置其他功能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // 處理 YouTube SPA 導航
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initialize, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
})();
