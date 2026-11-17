/* ==========================================================================
   可可手记 · 全站交互脚本
   零依赖，原生 ES 语法，直接放在 <script defer> 里引用
   包含：主题切换 / 移动菜单 / 阅读进度 / 滚动进场 / 打字机 / 数字滚动
        / 证书灯箱 / 复制邮箱 / 图片缺失兜底 / 目录高亮 / 回到顶部
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_KEY = 'coco-theme';

  /* ---------------- 1. 主题切换 ---------------- */
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0D0A16' : '#FBF9FF');
    doc.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? '切换到浅色模式' : '切换到深色模式');
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });
  }
  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  applyTheme(currentTheme());
  doc.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  });

  /* ---------------- 2. 导航 ---------------- */
  var nav = doc.querySelector('.nav');
  var toggle = doc.querySelector('.nav__toggle');

  if (nav) {
    var onScrollNav = function () {
      nav.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScrollNav();
    window.addEventListener('scroll', onScrollNav, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    doc.addEventListener('click', function (e) {
      if (nav.classList.contains('is-open') && !nav.contains(e.target)) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------- 2.5 导航当前页高亮 ---------------- */
  (function () {
    var path = location.pathname.replace(/\\/g, '/');
    var key = '';
    if (/\/notes\//.test(path)) key = 'notes';
    else if (/about\.html$/.test(path)) key = 'about';
    else if (/resume\.html$/.test(path)) key = 'resume';
    if (!key) return;
    doc.querySelectorAll('.nav__links [data-nav="' + key + '"]').forEach(function (a) {
      a.setAttribute('aria-current', 'page');
    });
  })();

  /* ---------------- 3. 阅读进度条 ---------------- */
  var bar = doc.querySelector('.scroll-progress');
  if (bar) {
    var onProgress = function () {
      var h = doc.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, p)) + '%';
    };
    onProgress();
    window.addEventListener('scroll', onProgress, { passive: true });
    window.addEventListener('resize', onProgress);
  }

  /* ---------------- 4. 滚动进场 ---------------- */
  var revealItems = doc.querySelectorAll('[data-reveal]');
  if (revealItems.length) {
    // 告诉 head 里的兜底计时器：动画脚本已经接手，不要强行显示
    root.setAttribute('data-reveal-ready', '');
    if ('IntersectionObserver' in window && !reduceMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealItems.forEach(function (el) { io.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------------- 5. 首屏职业轮播（打字机） ---------------- */
  var rotator = doc.querySelector('[data-rotator]');
  if (rotator) {
    var words = [];
    try { words = JSON.parse(rotator.getAttribute('data-rotator')) || []; } catch (e) {}
    var out = rotator.querySelector('.rotator__text');
    if (out && words.length) {
      if (reduceMotion) {
        out.textContent = words[0];
      } else {
        var wi = 0, ci = 0, deleting = false;
        var tick = function () {
          var word = words[wi];
          ci += deleting ? -1 : 1;
          out.textContent = word.slice(0, ci);
          var delay = deleting ? 45 : 95;
          if (!deleting && ci === word.length) { deleting = true; delay = 1900; }
          else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
          setTimeout(tick, delay);
        };
        setTimeout(tick, 700);
      }
    }
  }

  /* ---------------- 6. 数字滚动 ---------------- */
  var counters = doc.querySelectorAll('[data-count]');
  if (counters.length) {
    var runCount = function (el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      if (reduceMotion) { el.textContent = target; return; }
      var dur = 1300, start = null;
      var step = function (t) {
        if (!start) start = t;
        var p = Math.min(1, (t - start) / dur);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { runCount(en.target); cio.unobserve(en.target); }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCount);
    }
  }

  /* ---------------- 7. 图片缺失兜底 ---------------- */
  doc.querySelectorAll('img[data-fallback]').forEach(function (img) {
    var mark = function () {
      var host = img.closest('[data-fallback-host]') || img.parentElement;
      if (host) host.classList.add('is-missing');
      img.setAttribute('aria-hidden', 'true');
    };
    if (img.complete && img.naturalWidth === 0) mark();
    else img.addEventListener('error', mark, { once: true });
  });

  /* ---------------- 8. 轻提示 ---------------- */
  var toastEl = doc.querySelector('.toast');
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    var t = toastEl.querySelector('[data-toast-text]');
    if (t) t.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2200);
  }

  /* ---------------- 9. 复制邮箱 / 微信号 ---------------- */
  doc.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () { toast('已复制：' + text); };
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
      function fallback() {
        try {
          var ta = doc.createElement('textarea');
          ta.value = text;
          ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
          doc.body.appendChild(ta);
          ta.select();
          doc.execCommand('copy');
          doc.body.removeChild(ta);
          done();
        } catch (e) { toast('复制失败，请手动选择：' + text); }
      }
    });
  });

  /* ---------------- 10. 页内画廊 + 全屏图片查看器 ---------------- */
  var lb = doc.querySelector('[data-lightbox]');
  if (lb) {
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('[data-lb-caption]');
    var lbCounter = lb.querySelector('[data-lb-counter]');
    var lbThumbs = lb.querySelector('[data-lb-thumbs]');
    var btnPrev = lb.querySelector('[data-lb-prev]');
    var btnNext = lb.querySelector('[data-lb-next]');
    var items = [];
    var index = 0;
    var lastFocus = null;
    var syncInline = null;   // 页内画廊与查看器的联动回调

    /* 图源：有页内画廊就用画廊的图，否则用页面上可点的图片 */
    var galleryEl = doc.querySelector('[data-gallery]');
    if (galleryEl) {
      Array.prototype.forEach.call(galleryEl.querySelectorAll('.gallery__thumb'), function (t) {
        var s = t.getAttribute('data-src') || '';
        if (!s) return;
        items.push({ src: s, caption: t.getAttribute('data-cap') || '' });
      });
    } else {
      doc.querySelectorAll('[data-lightbox-item]').forEach(function (el) {
        var img = el.tagName === 'IMG' ? el : el.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src') || '';
        if (!src || src.indexOf('placeholder') > -1) return;
        items.push({ el: el, src: src, caption: img.getAttribute('alt') || '' });
        el.addEventListener('click', function (e) {
          e.preventDefault();
          if (el.classList.contains('is-missing')) return;
          index = items.findIndex(function (it) { return it.el === el; });
          openLightbox();
        });
      });
    }

    /* 查看器底部缩略图条 */
    if (lbThumbs && items.length) {
      items.forEach(function (it, i) {
        var b = doc.createElement('button');
        b.type = 'button';
        b.className = 'lightbox__thumb';
        b.setAttribute('aria-label', '查看第 ' + (i + 1) + ' 张' + (it.caption ? '：' + it.caption : ''));
        var im = doc.createElement('img');
        im.src = it.src;
        im.alt = '';
        im.loading = 'lazy';
        b.appendChild(im);
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          index = i;
          paint();
        });
        lbThumbs.appendChild(b);
      });
      if (items.length < 2) lbThumbs.parentElement.style.display = 'none';
    }

    function paint() {
      var it = items[index];
      if (!it) return;
      lbImg.src = it.src;
      lbImg.alt = it.caption;
      if (lbCap) lbCap.textContent = it.caption;

      var multiple = items.length > 1;
      if (btnPrev) btnPrev.hidden = !multiple;
      if (btnNext) btnNext.hidden = !multiple;
      if (lbCounter) lbCounter.textContent = (index + 1) + ' / ' + items.length;

      if (lbThumbs) {
        Array.prototype.forEach.call(lbThumbs.children, function (b, i) {
          b.classList.toggle('is-active', i === index);
        });
        var act = lbThumbs.children[index];
        if (act && lbThumbs.scrollTo) {
          lbThumbs.scrollTo({
            left: act.offsetLeft - (lbThumbs.clientWidth - act.offsetWidth) / 2,
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      }
      if (syncInline) syncInline(index);
    }
    function openLightbox() {
      lastFocus = doc.activeElement;
      paint();
      lb.classList.add('is-open');
      doc.body.classList.add('no-scroll');
      var closeBtn = lb.querySelector('[data-lb-close]');
      if (closeBtn) closeBtn.focus();
    }
    function closeLightbox() {
      lb.classList.remove('is-open');
      doc.body.classList.remove('no-scroll');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    function go(step) {
      if (items.length < 2) return;
      index = (index + step + items.length) % items.length;
      paint();
    }

    /* ---- 页内画廊：大图 + 左右箭头 + 缩略图条（项目界面截图） ---- */
    if (galleryEl && items.length) {
      var gMain = galleryEl.querySelector('[data-gallery-main]');
      var gCap = galleryEl.querySelector('[data-gallery-cap]');
      var gCount = galleryEl.querySelector('[data-gallery-count]');
      var gThumbs = Array.prototype.slice.call(galleryEl.querySelectorAll('.gallery__thumb'));
      var gIndex = 0;

      var paintGallery = function () {
        var it = items[gIndex];
        if (!it) return;
        if (gMain) { gMain.src = it.src; gMain.alt = it.caption; }
        if (gCap) gCap.textContent = it.caption;
        if (gCount) gCount.textContent = (gIndex + 1) + ' / ' + items.length;
        gThumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === gIndex); });
      };
      var goGallery = function (step) {
        if (items.length < 2) return;
        gIndex = (gIndex + step + items.length) % items.length;
        paintGallery();
      };
      /* 查看器翻页时同步画廊 */
      syncInline = function (i) { gIndex = i; paintGallery(); };

      var gPrev = galleryEl.querySelector('[data-gallery-prev]');
      var gNext = galleryEl.querySelector('[data-gallery-next]');
      if (gPrev) gPrev.addEventListener('click', function () { goGallery(-1); });
      if (gNext) gNext.addEventListener('click', function () { goGallery(1); });
      gThumbs.forEach(function (t, i) {
        t.addEventListener('click', function () { gIndex = i; paintGallery(); });
      });
      if (gMain) {
        gMain.addEventListener('click', function () {
          index = gIndex;
          openLightbox();
        });
      }

      /* 手机上在图上左右滑动也能切换 */
      var stage = galleryEl.querySelector('.gallery__stage');
      if (stage) {
        var gx = 0, gy = 0, gt = false;
        stage.addEventListener('touchstart', function (e) {
          if (e.touches.length !== 1) { gt = false; return; }
          gt = true;
          gx = e.touches[0].clientX;
          gy = e.touches[0].clientY;
        }, { passive: true });
        stage.addEventListener('touchend', function (e) {
          if (!gt) return;
          gt = false;
          var t = e.changedTouches[0];
          var dx = t.clientX - gx;
          var dy = t.clientY - gy;
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) goGallery(dx < 0 ? 1 : -1);
        }, { passive: true });
      }

      paintGallery();
    }

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.closest('[data-lb-close]')) closeLightbox();
    });
    if (btnPrev) btnPrev.addEventListener('click', function (e) { e.stopPropagation(); go(-1); });
    if (btnNext) btnNext.addEventListener('click', function (e) { e.stopPropagation(); go(1); });

    /* 键盘：← → 翻页，Esc 关闭，Home/End 跳首尾 */
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeLightbox(); return; }
      if (e.key === 'ArrowLeft') { go(-1); return; }
      if (e.key === 'ArrowRight') { go(1); return; }
      if (e.key === 'Home') { index = 0; paint(); return; }
      if (e.key === 'End') { index = items.length - 1; paint(); return; }
    });

    /* 手机上左右滑动切换 */
    var touchX = 0, touchY = 0, tracking = false;
    lb.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tracking = false; return; }
      tracking = true;
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (!tracking) return;
      tracking = false;
      var t = e.changedTouches[0];
      var dx = t.clientX - touchX;
      var dy = t.clientY - touchY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) go(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---------------- 11. 详情页目录高亮 ---------------- */
  var tocLinks = doc.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var el = doc.getElementById(id);
      if (el) { map[id] = a; targets.push(el); }
    });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          tocLinks.forEach(function (a) { a.classList.remove('is-active'); });
          var link = map[en.target.id];
          if (link) link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    targets.forEach(function (t) { tio.observe(t); });
  }

  /* ---------------- 12. 回到顶部 ---------------- */
  var toTop = doc.querySelector('.to-top');
  if (toTop) {
    var onTopScroll = function () {
      toTop.classList.toggle('is-show', window.scrollY > 600);
    };
    onTopScroll();
    window.addEventListener('scroll', onTopScroll, { passive: true });
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- 13. 页脚年份 ---------------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------------- 14. 打印简历 ---------------- */
  doc.querySelectorAll('[data-print]').forEach(function (btn) {
    btn.addEventListener('click', function () { window.print(); });
  });

  /* ---------------- 15. 简历页：PDF 预览失败自动切网页版 ---------------- */
  (function () {
    var wrap = doc.querySelector('[data-resume]');
    if (!wrap) return;
    var root = doc.documentElement;
    var mode = root.getAttribute('data-resume-mode') || 'pdf';

    function toWeb() {
      root.setAttribute('data-resume-mode', 'web');
    }

    /* 浏览器明确不支持内嵌 PDF */
    if (mode === 'pdf' && navigator.pdfViewerEnabled === false) toWeb();

    /* object 在 5 秒内没有渲染出来 → 判定失败，切网页版 */
    var obj = wrap.querySelector('object.pdf-doc');
    if (obj && root.getAttribute('data-resume-mode') === 'pdf') {
      var loaded = false;
      obj.addEventListener('load', function () { loaded = true; });
      setTimeout(function () {
        if (!loaded) toWeb();
      }, 5000);
    }

    /* 手动切换 */
    doc.querySelectorAll('[data-resume-switch]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        root.setAttribute('data-resume-mode', btn.getAttribute('data-resume-switch'));
        var target = wrap.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  })();
})();
