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

  /*---------------------------------------------------------
    3.B. CV Sticky Side-Nav ScrollSpy & Smooth Click Handler
  ---------------------------------------------------------*/
  const cvTabs = Array.prototype.slice.call(document.querySelectorAll('.cv-tab'));
  const cvBlocks = Array.prototype.slice.call(document.querySelectorAll('[data-cv-section]'));

  cvTabs.forEach(function (tab) {
    tab.addEventListener('click', function (e) {
      const targetId = tab.getAttribute('data-cv-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  if (cvBlocks.length && 'IntersectionObserver' in window) {
    const cvVisibility = new Map();

    const cvSpy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        cvVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let topCvId = null;
      let maxRatio = 0;
      cvVisibility.forEach(function (ratio, id) {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          topCvId = id;
        }
      });

      if (topCvId) {
        cvTabs.forEach(function (tab) {
          const target = tab.getAttribute('data-cv-tab');
          tab.classList.toggle('active', target === topCvId);
        });
      }
    }, { threshold: [0.1, 0.25, 0.5, 0.75], rootMargin: '-15% 0px -40% 0px' });

    cvBlocks.forEach(function (block) { cvSpy.observe(block); });
  }

  /*---------------------------------------------------------
    4. Interactive Hero Particle & FEA Mesh Canvas
  ---------------------------------------------------------*/
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    window.addEventListener('resize', function () {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 1.2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', function (e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#0284c7';

      particles.forEach(function (p, i) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw node particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = primaryColor;
        ctx.fill();

        // Connect FEA mesh lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = primaryColor;
            ctx.globalAlpha = (1 - dist / 130) * 0.25;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // React subtly to cursor proximity
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 140) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = primaryColor;
          ctx.globalAlpha = (1 - mdist / 140) * 0.4;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

})();
