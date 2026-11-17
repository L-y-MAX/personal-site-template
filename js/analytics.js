/* ==========================================================================
   可可手记 · 访问统计与事件埋点
   --------------------------------------------------------------------------
   默认什么都不加载（provider: 'none'），页面不会向任何第三方发请求。
   想开启统计，只改下面 CONFIG 里的三行，不用动 HTML。

   方案 A：百度统计（国内最快，免费，不需要服务器）
     1. 打开 https://tongji.baidu.com/ 新建站点，拿到 hm.js?id= 后面那串数字
     2. provider 改成 'baidu'，baiduId 填那串数字

   方案 B：Umami（隐私友好，可以用你阿里云 ECS 自建，也能用官方云）
     1. 自建：docker run -d --name umami -p 3000:3000 ghcr.io/umami-software/umami:postgresql-latest
     2. 后台添加网站后，复制「跟踪脚本」里的 src 和 data-website-id
     3. provider 改成 'umami'，填入 umamiSrc 和 umamiId

   埋点事件（HTML 里加 data-track="事件名" 就会自动上报）：
     resume-download  简历被下载了几次  ← 最关心这个
     resume-view      简历预览页被打开
     project-view     项目详情页被点开
     copy-email       复制邮箱
     github           点 GitHub
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    provider: 'none',   // 'none' | 'baidu' | 'umami'
    baiduId: '',        // 百度统计的站点 ID
    umamiSrc: '',       // 例如 https://analytics.example.com/script.js
    umamiId: '',        // Umami 的 data-website-id
    debug: false        // 本地调试时改成 true，控制台能看到每次上报
  };

  /* ---------- 加载第三方脚本 ---------- */
  function inject(src, attrs) {
    var s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.src = src;
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        s.setAttribute(k, attrs[k]);
      });
    }
    document.head.appendChild(s);
  }

  function init() {
    if (CONFIG.provider === 'baidu' && CONFIG.baiduId) {
      window._hmt = window._hmt || [];
      inject('https://hm.baidu.com/hm.js?' + CONFIG.baiduId);
    } else if (CONFIG.provider === 'umami' && CONFIG.umamiSrc && CONFIG.umamiId) {
      inject(CONFIG.umamiSrc, { 'data-website-id': CONFIG.umamiId });
    }
  }

  /* ---------- 统一的埋点入口 ---------- */
  window.cocoTrack = function (name, data) {
    data = data || {};
    try {
      if (CONFIG.provider === 'baidu' && window._hmt) {
        // 百度统计：_trackEvent(类别, 动作, 标签, 数值)
        window._hmt.push(['_trackEvent', name, 'click', data.label || '', data.value || 1]);
      }
      if (CONFIG.provider === 'umami' && window.umami && window.umami.track) {
        window.umami.track(name, data);
      }
      if (CONFIG.debug) console.log('[track]', name, data);
    } catch (e) {
      /* 统计失败不能影响页面 */
    }
  };

  /* ---------- 自动绑定 data-track ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('[data-track]') : null;
    if (!el) return;
    var name = el.getAttribute('data-track');
    if (!name) return;
    var label = el.getAttribute('data-track-label') ||
                (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    window.cocoTrack(name, {
      label: label,
      page: location.pathname,
      value: 1
    });
  }, true);

  init();
})();
