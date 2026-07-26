/* classic-ui.js
 * 微交互：Header 滚动毛玻璃、drawer body 锁滚动、计算按钮防重复提交。
 * 纯 vanilla JS，可重复加载。
 */
(function () {
  'use strict';
  if (window.__bcClassicUiLoaded) return;
  window.__bcClassicUiLoaded = true;

  // ── Header 滚动毛玻璃 ──────────────────────────────────────────────
  function initHeaderScroll() {
    var navbar = document.querySelector('.classic-navbar') || document.querySelector('.navbar');
    if (!navbar) return;
    var threshold = 10;
    var lastState = false;
    function onScroll() {
      var scrolled = window.scrollY || window.pageYOffset || 0;
      var next = scrolled > threshold;
      if (next === lastState) return;
      lastState = next;
      if (next) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Drawer 锁滚动 ──────────────────────────────────────────────────
  function initDrawerLock() {
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t) return;
      // 兼容各种 toggle 选择器
      var toggle = t.closest && t.closest('.nav-toggle, [data-drawer-toggle], #menuToggle, button[aria-controls="drawer"]');
      if (toggle) {
        // 等框架添加 .open 后再加 body class
        setTimeout(function () {
          var open = document.querySelector('.drawer.open, .drawer.is-open');
          if (open) document.body.classList.add('drawer-open');
        }, 50);
      }
      var closer = t.closest && t.closest('.drawer-close, [data-drawer-close]');
      if (closer) {
        document.body.classList.remove('drawer-open');
      }
    });
    // 观察 drawer 状态变化
    if (typeof MutationObserver !== 'undefined') {
      var drawer = document.querySelector('.drawer');
      if (drawer) {
        new MutationObserver(function () {
          if (drawer.classList.contains('open') || drawer.classList.contains('is-open')) {
            document.body.classList.add('drawer-open');
          } else {
            document.body.classList.remove('drawer-open');
          }
        }).observe(drawer, { attributes: true, attributeFilter: ['class'] });
      }
      var overlay = document.querySelector('.drawer-overlay');
      if (overlay) {
        overlay.addEventListener('click', function () {
          document.body.classList.remove('drawer-open');
        });
      }
    }
  }

  // ── 计算按钮防重复提交 ────────────────────────────────────────────
  function initCalcButtonGuard() {
    document.addEventListener('submit', function (ev) {
      var form = ev.target;
      if (!form || form.tagName !== 'FORM') return;
      var submitter = ev.submitter || (form.querySelector('[type="submit"], .calc-cta, .btn-primary'));
      if (!submitter) return;
      // 只对显式标记的按钮生效，避免误伤普通表单
      if (!/(calc-cta|btn-primary|btn-tool)/.test(submitter.className || '')) return;
      lockButton(submitter, 1000);
    });
    // 直接绑定 .calc-cta 的 click
    document.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.classList) return;
      if (t.classList.contains('calc-cta') || (t.classList.contains('btn-primary') && t.dataset.guard !== 'off')) {
        // 不重复锁同一按钮
        if (t.dataset.bcLocked === '1') {
          ev.preventDefault();
          ev.stopImmediatePropagation();
          return;
        }
        lockButton(t, 1000);
      }
    }, true);
  }

  function lockButton(btn, ms) {
    if (!btn || btn.dataset.bcLocked === '1') return;
    btn.dataset.bcLocked = '1';
    var prevText = btn.textContent;
    btn.dataset.bcPrevText = prevText;
    btn.classList.add('is-loading');
    btn.setAttribute('aria-busy', 'true');
    if (btn.tagName === 'BUTTON') btn.disabled = true;
    setTimeout(function () {
      btn.classList.remove('is-loading');
      btn.removeAttribute('aria-busy');
      if (btn.tagName === 'BUTTON') btn.disabled = false;
      btn.dataset.bcLocked = '';
    }, ms || 1000);
  }

  // ── Header 下拉菜单：click 切换 + 外部点击关闭 + Esc 关闭 ───────────
  function initNavDropdowns() {
    var navbar = document.querySelector('.classic-navbar') || document.querySelector('.navbar');
    if (!navbar) return;
    var categories = navbar.querySelectorAll('.nav-category');
    if (!categories.length) return;

    function closeAll(except) {
      for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        if (cat === except) continue;
        cat.classList.remove('is-open');
        var lbl = cat.querySelector('.nav-label');
        if (lbl) lbl.setAttribute('aria-expanded', 'false');
      }
    }

    // 点击 label：切换 open 状态
    navbar.addEventListener('click', function (ev) {
      var lbl = ev.target.closest && ev.target.closest('.nav-label');
      if (!lbl || !navbar.contains(lbl)) return;
      // 仅在桌面端 (≥1024px) 启用 click toggle
      if (window.matchMedia && !window.matchMedia('(min-width: 1024px)').matches) return;
      ev.preventDefault();
      var cat = lbl.closest('.nav-category');
      if (!cat) return;
      var willOpen = !cat.classList.contains('is-open');
      closeAll(cat);
      cat.classList.toggle('is-open', willOpen);
      lbl.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    // 外部点击关闭
    document.addEventListener('click', function (ev) {
      if (!navbar.contains(ev.target)) {
        closeAll(null);
      }
    });

    // Esc 关闭
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') closeAll(null);
    });

    // 鼠标离开整个 nav-categories 区域 100ms 后关闭（防误触）
    var hoverTimer = null;
    var navCats = navbar.querySelector('.nav-categories');
    if (navCats) {
      navCats.addEventListener('mouseleave', function () {
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { closeAll(null); }, 120);
      });
      navCats.addEventListener('mouseenter', function () {
        clearTimeout(hoverTimer);
      });
    }
  }

  // ── 初始化 ─────────────────────────────────────────────────────────
  function init() {
    initHeaderScroll();
    initDrawerLock();
    initCalcButtonGuard();
    initNavDropdowns();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
