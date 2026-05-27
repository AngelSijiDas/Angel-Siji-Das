/* Shared interactions:
   - custom cursor (desktop)
   - mobile menu toggle
   - reveal-on-scroll
   - portfolio filtering
   - contact form toast (no backend)
*/

(function () {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');

  // Custom cursor (skip on touch devices)
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (cursor && ring && !isCoarsePointer) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverTargets = 'a, button, .btn-primary, .btn-outline, .nav-cta, .svc-arrow';
    document.addEventListener('mouseover', (e) => {
      if (e.target && e.target.closest && e.target.closest(hoverTargets)) ring.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target && e.target.closest && e.target.closest(hoverTargets)) ring.classList.remove('is-hover');
    });
  }

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('is-open');
    });
    mobileMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
    });
  }

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal, .reveal-left, .reveal-right'));
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Portfolio filter
  const filterBar = document.querySelector('.filter-bar');
  if (filterBar) {
    const buttons = Array.from(filterBar.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('.pf-card'));

    function applyFilter(filter) {
      cards.forEach((card) => {
        const cats = (card.getAttribute('data-category') || '').toLowerCase();
        const match = filter === 'all' || cats.includes(filter);
        card.classList.toggle('hidden', !match);
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter((btn.getAttribute('data-filter') || 'all').toLowerCase());
      });
    });
  }

  // Contact form handler (mailto-free demo)
  window.handleFormSubmit = function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form) return;
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sent!';
    }
    form.reset();
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText || 'Send Message';
      }
    }, 1600);
  };
})();

