'use strict';

/**
 * main.js — motion + navigation for the single-scroll layout.
 * No dependencies. Everything degrades to a static page if JS fails.
 */

(function () {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*---------------------------------------------------------
    1. Split headings into per-word masked spans
      <h1 data-anim-words>Two words</h1>
      becomes <span class="w" style="--i:0"><i>Two</i></span> …
  ---------------------------------------------------------*/
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.trim()) textNodes.push(node);
    }

    let index = 0;
    textNodes.forEach(function (textNode) {
      const frag = document.createDocumentFragment();
      // keep the original whitespace so line breaks stay natural
      textNode.nodeValue.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        const outer = document.createElement('span');
        outer.className = 'w';
        outer.style.setProperty('--i', index++);
        const inner = document.createElement('i');
        inner.textContent = chunk;
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      textNode.parentNode.replaceChild(frag, textNode);
    });
  }

  const wordTargets = document.querySelectorAll('[data-anim-words]');
  if (!reduceMotion) {
    wordTargets.forEach(splitWords);
  } else {
    wordTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /*---------------------------------------------------------
    2. Reveal on scroll
  ---------------------------------------------------------*/
  const revealTargets = document.querySelectorAll('[data-anim-words], [data-reveal]');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

    revealTargets.forEach(function (el) { io.observe(el); });

    // anything already on screen at load should animate immediately,
    // not wait for a scroll event that may never come
    requestAnimationFrame(function () {
      revealTargets.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    });
  }

  /*---------------------------------------------------------
    3. Scroll-spy on the anchor nav
  ---------------------------------------------------------*/
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.anchor-link'));
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const visible = new Map();

    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      // highlight whichever tracked section currently occupies the most viewport
      let bestId = null;
      let bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', bestId !== null && link.getAttribute('href') === '#' + bestId);
      });
    }, { threshold: [0, 0.15, 0.35, 0.6, 0.85], rootMargin: '-15% 0px -35% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

})();
