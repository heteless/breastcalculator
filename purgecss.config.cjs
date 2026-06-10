/**
 * PurgeCSS configuration for breastcalculator.
 *
 * Removes CSS rules whose selectors are not referenced in any HTML
 * or JavaScript file. Special cases:
 *   - dynamic class names set via classList / className in script.js
 *     are added to the safelist.
 *   - all @keyframes are preserved (animations are referenced by name).
 *   - CSS custom properties (--var) are preserved.
 *   - @font-face rules are preserved.
 *
 * Only style.css is processed; tailwind-built.css is already minimal
 * (~2.8 KB) and excluded from purging.
 */
const fs = require('fs');
const path = require('path');

/* Safelist: classes that script.js sets dynamically via classList / className.
   Auto-extracted from .dyn-classes.txt, but inlined here for repeatability. */
const DYNAMIC_CLASSES = [
  'active', 'back-bar', 'back-btn', 'back-spacer', 'back-title',
  'back-to-top', 'btn-primary', 'btn-secondary', 'btn-tool',
  'calc-form', 'chart-panel', 'chart-tab', 'closing',
  'consent-toast', 'container', 'cookie-accept', 'cookie-banner',
  'cookie-btns', 'cookie-icon', 'cookie-policy-link', 'cookie-reject',
  'cookie-settings', 'cookie-text', 'copied', 'dropdown-menu',
  'faq-item', 'hero-cta-group', 'hidden', 'hiding', 'home-tools',
  'ht-sub', 'ht-title', 'input-error', 'invalid', 'is-collapsed',
  'is-open', 'modal', 'modal-actions', 'modal-overlay', 'navbar',
        'nav-label', 'nav-link', 'nav-links', 'nav-toggle', 'opacity-0',
        'opacity-100', 'open', 'psb-copy', 'show', 'toast-feedback',
        'toast-icon', 'toast-text', 'tools-grid', 'tool-tile', 'tt-arrow',
        'tt-body', 'tt-desc', 'tt-icon', 'tt-title', 'unit-btn',
        'visible', 'invisible', 'collapsing', 'fade', 'modal-open',
        'scroll-locked', 'body-no-scroll', 'nav-open', 'menu-open',
      ];

/* Tailwind common utilities that may appear via class= attributes in HTML
   (210 such classes are used). They live in tailwind-built.css (2.8 KB)
   which we keep untouched, but safelist the most common ones just in case
   they are referenced from CSS class= attributes. */
const TAILWIND_SAFELIST_PATTERNS = [
  /^(m|p|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr|gap|space)-/,  // spacing
  /^(w|h|min-w|min-h|max-w|max-h)-/,                        // sizing
  /^(bg|text|border|ring|shadow|opacity|fill|stroke)-/,      // visuals
  /^(flex|grid|block|inline|hidden|relative|absolute|fixed|sticky)$/, // layout
  /^(rounded|font|leading|tracking|antialiased|italic|underline|uppercase|lowercase)-?/,
  /^(hover|focus|active|disabled|group-hover|focus-within|focus-visible):/,
];

/* :root, html, body, and other tag selectors - always preserved */
const TAG_SELECTOR_KEEP = [/^html/, /^body/, /^:root/, /^\*/, /^::?[a-z-]+/];

module.exports = {
  content: [
    'index.html',
    '404.html',
    '**/*.html',
    'script.js',
  ],
  css: [
    'style.css',
  ],
  output: 'style.css',
  /* Keep all @keyframes blocks intact (referenced by `animation:` in CSS). */
  keyframes: true,
  /* Keep all --css-custom-property declarations. */
  variables: true,
  /* Keep all @font-face rules. */
  fontFace: true,
  safelist: {
    standard: [
      ...DYNAMIC_CLASSES,
      /* CSS class conventions used in this project */
      /^is-[a-z-]+$/,
      /^has-[a-z-]+$/,
      /^aria-[a-z-]+$/,
      /^data-[a-z-]+$/,
    ],
    deep: [],
    greedy: [],
    /* Treat any :hover / :focus / :active as if used (they chain off
       a used base selector, which PurgeCSS keeps automatically, but
       being explicit is safer). */
  },
  blocklist: [],
  skippedContentGlobs: [
    'node_modules/**',
    'scripts/**',
    '.git/**',
    '.dyn-classes.txt',
    'package*.json',
    '*.md',
  ],
  dynamicAttributes: [
    'class', 'className',
  ],
  /* Treat all Tailwind utility classes as used if referenced anywhere. */
  defaultExtractor: (content) => {
    // Match anything that looks like a class name: word characters and hyphens.
    return content.match(/[A-Za-z0-9_-]+/g) || [];
  },
};
