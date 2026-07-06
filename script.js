/* ==========================================================================
   PASTECORNER — script.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- AOS ---------------- */
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  /* ---------------- Loading screen: type out "PASTECORNER" ---------------- */
  const loader = document.getElementById('loader');
  const loaderTyped = document.getElementById('loaderTyped');
  const brandName = 'PASTECORNER';

  if (loaderTyped) {
    let i = 0;
    const typeInterval = setInterval(() => {
      loaderTyped.textContent = brandName.slice(0, i + 1);
      i++;
      if (i >= brandName.length) clearInterval(typeInterval);
    }, 90);
  }

  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hide'), 900);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hide'), 2600);

  /* ---------------- Custom cursor: text caret + marching-ants marquee ---------------- */
  const cursorCaret = document.getElementById('cursorCaret');
  const cursorMarquee = document.getElementById('cursorMarquee');
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!isTouch && cursorCaret && cursorMarquee) {
    let mouseX = 0, mouseY = 0, marqueeX = 0, marqueeY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorCaret.style.left = mouseX + 'px';
      cursorCaret.style.top = mouseY + 'px';
    });

    function animateMarquee() {
      marqueeX += (mouseX - marqueeX) * 0.18;
      marqueeY += (mouseY - marqueeY) * 0.18;
      cursorMarquee.style.left = marqueeX + 'px';
      cursorMarquee.style.top = marqueeY + 'px';
      requestAnimationFrame(animateMarquee);
    }
    animateMarquee();

    const hoverTargets = 'a, button, .portfolio-item, .service-card, .why-card, .pricing-card, .faq-question, .about-card, .contact-card';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => cursorMarquee.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorMarquee.classList.remove('hovered'));
    });
  }

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    scrollTopBtn.classList.toggle('show', y > 500);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ---------------- Active link on scroll ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let current = sections[0]?.id;
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
    });
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  /* ---------------- Hero particles ---------------- */
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
      const count = window.innerWidth < 700 ? 30 : 60;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.5 + 0.2
      }));
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,79,163,${p.alpha})`;
        ctx.shadowColor = 'rgba(255,79,163,0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      requestAnimationFrame(drawParticles);
    }

    resizeCanvas();
    createParticles();
    drawParticles();
    window.addEventListener('resize', () => { resizeCanvas(); createParticles(); });
  }

  /* ---------------- Portfolio data + render ---------------- */
  const portfolioData = [
    { cat: 'album',  title: 'Midnight Waves',      tag: 'Album Cover',   seed: 'pc-album-1' },
    { cat: 'poster', title: 'Neon Nights Event',    tag: 'Poster',        seed: 'pc-poster-1' },
    { cat: 'logo',   title: 'Nova Studio Mark',     tag: 'Logo',          seed: 'pc-logo-1' },
    { cat: 'social', title: 'Launch Day Post',      tag: 'Social Media',  seed: 'pc-social-1' },
    { cat: 'banner', title: 'Summer Sale Banner',   tag: 'Banner',        seed: 'pc-banner-1' },
    { cat: 'album',  title: 'Static Bloom EP',      tag: 'Album Cover',   seed: 'pc-album-2' },
    { cat: 'poster', title: 'City Lights Tour',     tag: 'Poster',        seed: 'pc-poster-2' },
    { cat: 'logo',   title: 'Rivet Coffee Co.',     tag: 'Logo',          seed: 'pc-logo-2' },
    { cat: 'social', title: 'Weekly Promo Grid',    tag: 'Social Media',  seed: 'pc-social-2' },
    { cat: 'banner', title: 'Store Reopening',      tag: 'Banner',        seed: 'pc-banner-2' },
    { cat: 'album',  title: 'Echoes Vol. II',       tag: 'Album Cover',   seed: 'pc-album-3' },
    { cat: 'poster', title: 'Retro Wave Festival',  tag: 'Poster',        seed: 'pc-poster-3' },
  ];

  const portfolioGrid = document.getElementById('portfolioGrid');
  if (portfolioGrid) {
    portfolioGrid.innerHTML = portfolioData.map((item, i) => `
      <div class="portfolio-item marching-border" data-cat="${item.cat}" data-index="${i}" data-aos="fade-up" data-aos-delay="${(i % 4) * 60}">
        <img src="https://picsum.photos/seed/${item.seed}/500/500" alt="${item.title}" loading="lazy">
        <div class="portfolio-overlay">
          <h5>${item.title}</h5>
          <span>${item.tag}</span>
        </div>
      </div>
    `).join('');

    const items = portfolioGrid.querySelectorAll('.portfolio-item');
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;

        items.forEach(item => {
          const match = filter === 'all' || item.dataset.cat === filter;
          item.classList.toggle('hide', !match);
        });
      });
    });

    /* ---------------- Lightbox ---------------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    items.forEach((item, i) => {
      item.addEventListener('click', () => {
        const data = portfolioData[i];
        lightboxImg.src = `https://picsum.photos/seed/${data.seed}/900/900`;
        lightboxImg.alt = data.title;
        lightboxCaption.textContent = `${data.title} — ${data.tag}`;
        lightbox.classList.add('active');
      });
    });

    function closeLightbox() { lightbox.classList.remove('active'); }
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ---------------- Testimonial slider ---------------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  if (track) {
    const slides = track.children.length;
    let current = 0;

    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
    const dots = dotsWrap.querySelectorAll('span');

    function goTo(index) {
      current = (index + slides) % slides;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    let autoSlide = setInterval(() => goTo(current + 1), 6000);
    [prevBtn, nextBtn, track].forEach(el => {
      el.addEventListener('mouseenter', () => clearInterval(autoSlide));
      el.addEventListener('mouseleave', () => { autoSlide = setInterval(() => goTo(current + 1), 6000); });
    });
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.faq-answer').style.maxHeight = null;
        }
      });

      item.classList.toggle('open', !isOpen);
      answer.style.maxHeight = !isOpen ? answer.scrollHeight + 'px' : null;
    });
  });

});
