// =============================================
// Site-wide ES/EN translation toggle
// Non-destructive: reads original text at runtime,
// swaps text nodes and key attributes based on
// window.TRANSLATIONS (see assets/translations.js)
// =============================================
(function () {
    var STORAGE_KEY = 'site-lang';
    var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

    function normalize(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    window.__lang = localStorage.getItem(STORAGE_KEY) || 'es';

    window.t = function (str) {
        if (window.__lang !== 'en' || typeof str !== 'string') return str;
        var dict = window.TRANSLATIONS || {};
        var key = normalize(str);
        if (Object.prototype.hasOwnProperty.call(dict, key)) {
            return dict[key];
        }
        return str;
    };

    var originalText = new WeakMap();
    var originalAttrs = new WeakMap();

    function shouldSkipParent(el) {
        if (!el) return true;
        var tag = el.tagName;
        return tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT';
    }

    function translateTextNode(node) {
        if (shouldSkipParent(node.parentElement)) return;
        if (!originalText.has(node)) {
            if (!node.textContent || !node.textContent.trim()) return;
            originalText.set(node, node.textContent);
        }
        var original = originalText.get(node);
        node.textContent = window.__lang === 'en' ? window.t(original) : original;
    }

    function translateElementAttrs(el) {
        if (!originalAttrs.has(el)) {
            var stored = {};
            var has = false;
            ATTRS.forEach(function (attr) {
                if (el.hasAttribute(attr)) {
                    stored[attr] = el.getAttribute(attr);
                    has = true;
                }
            });
            if (!has) return;
            originalAttrs.set(el, stored);
        }
        var stored = originalAttrs.get(el);
        Object.keys(stored).forEach(function (attr) {
            el.setAttribute(attr, window.__lang === 'en' ? window.t(stored[attr]) : stored[attr]);
        });
    }

    function translateMetaAttr(selector, attr) {
        var el = document.querySelector(selector);
        if (!el) return;
        if (!originalAttrs.has(el)) originalAttrs.set(el, {});
        var stored = originalAttrs.get(el);
        if (!(attr in stored)) stored[attr] = el.getAttribute(attr);
        el.setAttribute(attr, window.__lang === 'en' ? window.t(stored[attr]) : stored[attr]);
    }

    function walk(root) {
        if (!root) return;
        if (root.nodeType === Node.TEXT_NODE) {
            translateTextNode(root);
            return;
        }
        if (root.nodeType !== Node.ELEMENT_NODE) return;
        var tag = root.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return;
        translateElementAttrs(root);
        var child = root.firstChild;
        while (child) {
            walk(child);
            child = child.nextSibling;
        }
    }

    function translateTitleAndMeta() {
        if (!originalText.has(document)) {
            originalText.set(document, { title: document.title });
        }
        var stored = originalText.get(document);
        document.title = window.__lang === 'en' ? window.t(stored.title) : stored.title;

        translateMetaAttr('meta[name="description"]', 'content');
        translateMetaAttr('meta[property="og:title"]', 'content');
        translateMetaAttr('meta[property="og:description"]', 'content');
        translateMetaAttr('meta[name="twitter:title"]', 'content');
        translateMetaAttr('meta[name="twitter:description"]', 'content');
    }

    function refreshDynamicWidgets() {
        var searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.setAttribute('placeholder', window.t('Buscar en el sitio...'));
            searchInput.setAttribute('aria-label', window.t('Buscar'));
        }
        var searchResults = document.getElementById('search-results');
        if (searchResults) searchResults.style.display = 'none';

        var themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('title', window.t('Cambiar tema'));
            themeToggle.setAttribute('aria-label', window.t('Cambiar entre modo claro y oscuro'));
        }

        if (typeof window.__refreshMoodChart === 'function') {
            window.__refreshMoodChart();
        }

        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: window.__lang } }));
    }

    function updateToggleButtonUI() {
        var btn = document.getElementById('lang-toggle');
        if (!btn) return;
        var label = btn.querySelector('.lang-toggle-text');
        if (label) label.textContent = window.__lang === 'en' ? 'ES' : 'EN';
        var a11yText = window.__lang === 'en' ? 'Cambiar a español' : 'Cambiar a inglés';
        btn.setAttribute('aria-label', a11yText);
        btn.setAttribute('title', a11yText);
    }

    function applyLanguage() {
        document.documentElement.setAttribute('lang', window.__lang);
        walk(document.body);
        translateTitleAndMeta();
        refreshDynamicWidgets();
        updateToggleButtonUI();
    }

    function toggleLanguage() {
        window.__lang = window.__lang === 'en' ? 'es' : 'en';
        localStorage.setItem(STORAGE_KEY, window.__lang);
        applyLanguage();
    }

    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
            m.addedNodes.forEach(function (n) {
                walk(n);
            });
        });
    });

    function init() {
        observer.observe(document.body, { childList: true, subtree: true });
        var btn = document.getElementById('lang-toggle');
        if (btn) btn.addEventListener('click', toggleLanguage);
        applyLanguage();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('load', applyLanguage);
})();
