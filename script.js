// AKARI Designs - Interactive Features
// Luxury Handmade Brand

// ========================
// STATE & CONFIG
// ========================
let currentLanguage = localStorage.getItem('language') || detectBrowserLanguage();
let translations = {};
let carouselInterval = null;
let currentSlide = 0;
let heroCarouselData = [];

// Reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================
// LANGUAGE SYSTEM
// ========================
async function initializeLanguage() {
  try {
    const response = await fetch('languages.json');
    translations = await response.json();
    setLanguage(currentLanguage);
    initializeLanguageSwitcher();
  } catch (error) {
    console.error('Error loading translations:', error);
    currentLanguage = 'en';
  }
}

function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('de') ? 'de' : 'en';
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  translatePage();
  updateLanguageSwitcher();
}

function translatePage() {
  const t = translations[currentLanguage];
  if (!t) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = t;
    keys.forEach(k => { value = value[k]; });
    if (value) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attr = el.getAttribute('data-i18n-attr');
    const key = el.getAttribute('data-i18n-key');
    const keys = key.split('.');
    let value = t;
    keys.forEach(k => { value = value[k]; });
    if (value) el.setAttribute(attr, value);
  });
}

function initializeLanguageSwitcher() {
  const switcher = document.getElementById('language-switcher');
  if (!switcher) return;

  switcher.innerHTML = `
    <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en" aria-label="Switch to English">EN</button>
    <button class="lang-btn ${currentLanguage === 'de' ? 'active' : ''}" data-lang="de" aria-label="Switch to German">DE</button>
  `;

  switcher.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
}

function updateLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLanguage);
  });
}

// ========================
// HERO CAROUSEL
// ========================
heroCarouselData = [
  {
    title: "Preserved Flowers",
    description: "Forever-preserved memories. Each bloom captures a moment that refuses to fade — a wedding bouquet, a first date, a love letter wrapped in time.",
    image: "assets/images/Letter.png",
    emoji: "🌸",
    gradient: "linear-gradient(135deg, #7B6D60, #4A4038)",
    cta: "products.html",
    ctaText: "Explore Preserved Flowers"
  },
  {
    title: "Bookends",
    description: "Hand-formed bookends that hold more than books — they hold stories. Every piece is unique, like the memories you place between them.",
    image: null,
    emoji: "📚",
    gradient: "linear-gradient(135deg, #7B6D60, #4A4038)",
    cta: "products.html",
    ctaText: "Explore Bookends"
  },
  {
    title: "Marble Trays",
    description: "Cold, solid marble warmed by human hands. Each tray is a quiet masterpiece — for your jewelry, your keys, or the small rituals that make a house a home.",
    image: "assets/images/Tray.png",
    emoji: "🔮",
    gradient: "linear-gradient(135deg, #7B6D60, #4A4038)",
    cta: "products.html",
    ctaText: "Explore Trays"
  },
  {
    title: "Coasters",
    description: "Every sip deserves a surface with soul. Our handcrafted coasters protect your table while telling a story — one layer at a time.",
    image: "assets/images/coasters.png",
    emoji: "☕",
    gradient: "linear-gradient(135deg, #7B6D60, #4A4038)",
    cta: "products.html",
    ctaText: "Explore Coasters"
  },
  {
    title: "Bookmarks",
    description: "A bookmark is a promise to return. Crafted with care, each piece marks not just a page, but a moment you want to revisit.",
    image: null,
    emoji: "🔖",
    gradient: "linear-gradient(135deg, #7B6D60, #4A4038)",
    cta: "products.html",
    ctaText: "Explore Bookmarks"
  }
];

function initHeroCarousel() {
  const container = document.getElementById('hero-carousel');
  if (!container) return;

  const dotsContainer = document.getElementById('carousel-dots');

  container.innerHTML = heroCarouselData.map((slide, index) => {
    const imgBlock = slide.image
      ? `<img src="${slide.image}" alt="${slide.title}" loading="${index === 0 ? 'eager' : 'lazy'}" width="500" height="460">`
      : `<div class="slide-emoji" aria-hidden="true">${slide.emoji}</div>`;
    return `
      <div class="carousel-slide ${index % 2 === 1 ? 'reverse' : ''} ${index === 0 ? 'active' : ''}" data-index="${index}" role="group" aria-roledescription="slide" aria-label="Slide ${index + 1} of ${heroCarouselData.length}">
        <div class="slide-media">
          ${imgBlock}
        </div>
        <div class="slide-text">
          <h1>${slide.title}</h1>
          <p class="slide-subtitle">${slide.description}</p>
          <div class="btn-group">
            <a href="products.html" class="btn btn-primary">Explore Collections</a>
            <a href="contact.html" class="btn btn-secondary">Request a Custom Order</a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  dotsContainer.innerHTML = heroCarouselData.map((_, index) => `
    <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}" aria-label="Go to slide ${index + 1}" aria-current="${index === 0 ? 'true' : 'false'}"></button>
  `).join('');

  document.getElementById('carousel-prev').addEventListener('click', () => moveSlide(-1));
  document.getElementById('carousel-next').addEventListener('click', () => moveSlide(1));
  dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
    dot.addEventListener('click', () => goToSlide(parseInt(dot.getAttribute('data-index'))));
  });

  // Keyboard navigation for carousel
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveSlide(-1);
    if (e.key === 'ArrowRight') moveSlide(1);
  });

  // Pause on hover
  container.addEventListener('mouseenter', pauseCarousel);
  container.addEventListener('mouseleave', startCarousel);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  container.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      moveSlide(diff > 0 ? 1 : -1);
    }
  }

  startCarousel();
}

function moveSlide(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  dots[currentSlide].setAttribute('aria-current', 'false');

  currentSlide = (currentSlide + direction + slides.length) % slides.length;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  dots[currentSlide].setAttribute('aria-current', 'true');
  resetCarousel();
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  dots[currentSlide].setAttribute('aria-current', 'false');

  currentSlide = index;

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  dots[currentSlide].setAttribute('aria-current', 'true');
  resetCarousel();
}

function startCarousel() {
  pauseCarousel();
  carouselInterval = setInterval(() => moveSlide(1), 6000);
}

function pauseCarousel() {
  if (carouselInterval) {
    clearInterval(carouselInterval);
    carouselInterval = null;
  }
}

function resetCarousel() {
  pauseCarousel();
  startCarousel();
}

// ========================
// MOBILE NAVIGATION
// ========================
function initializeNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.querySelector('header');

  if (hamburger && navMenu) {
    // Create backdrop element
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    const openMenu = () => {
      hamburger.classList.add('active');
      navMenu.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      navMenu.setAttribute('aria-hidden', 'false');
    };

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-hidden', 'true');
    };

    hamburger.addEventListener('click', () => {
      if (hamburger.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    backdrop.addEventListener('click', closeMenu);

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Keyboard: Escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMenu();
        hamburger.focus();
      }
    });

    // Initial ARIA state
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation menu');
    navMenu.setAttribute('aria-hidden', 'true');
  }

// Sticky header effect
  window.addEventListener('scroll', function() {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }, { passive: true });
}

// ========================
// FAQ ACCORDION
// ========================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.setAttribute('aria-expanded', 'false');
    question.setAttribute('tabindex', '0');
    question.setAttribute('role', 'button');
    answer.setAttribute('id', `faq-answer-${index}`);
    question.setAttribute('aria-controls', `faq-answer-${index}`);

    const toggle = () => {
      const isOpen = item.classList.contains('active');

      // Close all others (optional accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherQ = otherItem.querySelector('.faq-question');
          const otherA = otherItem.querySelector('.faq-answer');
          if (otherQ) otherQ.setAttribute('aria-expanded', 'false');
          if (otherA) otherA.setAttribute('hidden', '');
        }
      });

      if (isOpen) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('hidden', '');
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
      }
    };

    question.addEventListener('click', toggle);

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

// ========================
// SCROLL REVEAL ANIMATIONS
// ========================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.collections, .how-it-works, .testimonials, .best-sellers, .card, .feature, .section-header, .why-choose-item, .process-step, .testimonial-card, .collection-card, .hero-single-content'
  );

  if (!revealElements.length) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (prefersReducedMotion) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
        } else {
          entry.target.classList.add('revealed');
        }
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-element');
    if (!prefersReducedMotion) {
      el.style.transitionDelay = `${index % 4 * 100}ms`;
    }
    observer.observe(el);
  });
}

// ========================
// COUNTER ANIMATION
// ========================
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');

  if (!counters.length) return;

  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);
          el.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target.toLocaleString();
          }
        }

        if (prefersReducedMotion) {
          el.textContent = target.toLocaleString();
        } else {
          requestAnimationFrame(updateCounter);
        }

        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

// ========================
// PRODUCT FILTERS
// ========================
function initializeProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');

  if (!filterButtons.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const productCards = document.querySelectorAll('[data-category]');
      productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;

        if (shouldShow) {
          card.style.display = '';
          card.classList.add('animate-fade');
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-fade');
        }
      });
    });
  });
}

// ========================
// FORM HANDLING
// ========================
function initializeFormHandling() {
  const contactForm = document.getElementById('contact-form');

  if (!contactForm) return;

  // Add inline error elements
  const formFields = ['name', 'email', 'message', 'service'];
  formFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      const errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      errorEl.id = `${fieldId}-error`;
      errorEl.setAttribute('role', 'alert');
      errorEl.setAttribute('aria-live', 'polite');
      field.parentNode.insertBefore(errorEl, field.nextSibling);
    }
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const fields = {
      name: { el: document.getElementById('name'), error: document.getElementById('name-error'), required: true },
      email: { el: document.getElementById('email'), error: document.getElementById('email-error'), required: true },
      message: { el: document.getElementById('message'), error: document.getElementById('message-error'), required: true },
      service: { el: document.getElementById('service'), error: document.getElementById('service-error'), required: true }
    };

    let isValid = true;
    const errors = {};

    // Clear previous errors
    Object.values(fields).forEach(f => {
      if (f.error) {
        f.error.textContent = '';
        f.error.style.display = 'none';
      }
      if (f.el) f.el.classList.remove('input-error');
    });

    // Validate required fields
    Object.entries(fields).forEach(([key, field]) => {
      if (field.required && field.el && !field.el.value.trim()) {
        isValid = false;
        errors[key] = 'This field is required.';
        if (field.error) {
          field.error.textContent = errors[key];
          field.error.style.display = 'block';
        }
        field.el.classList.add('input-error');
      }
    });

    // Validate email
    if (fields.email.el && fields.email.el.value.trim() && !isValidEmail(fields.email.el.value.trim())) {
      isValid = false;
      errors.email = 'Please enter a valid email address.';
      if (fields.email.error) {
        fields.email.error.textContent = errors.email;
        fields.email.error.style.display = 'block';
      }
      fields.email.el.classList.add('input-error');
    }

    if (!isValid) {
      // Focus first error field
      const firstError = Object.values(fields).find(f => f.el && f.el.classList.contains('input-error'));
      if (firstError && firstError.el) {
        firstError.el.focus();
      }
      return;
    }

    // Prepare email
    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const message = fields.message.el.value.trim();
    const service = fields.service.el.value;
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
    const company = document.getElementById('company') ? document.getElementById('company').value.trim() : '';

    const subject = `New Inquiry from ${name} - ${service || 'General'}`;
    const body = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Service Interest: ${service || 'Not specified'}

Message:
${message}

---
Sent from AKARI Designs Contact Form
    `.trim();

    const mailtoLink = `mailto:info@akari1.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  });
}

// ========================
// SCROLL EFFECTS
// ========================
function initializeScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .feature, .testimonial').forEach(el => {
    observer.observe(el);
  });

  // Initialize scroll reveal for additional sections
  initScrollReveal();

  // Initialize counter animations
  initCounterAnimation();

  // Scroll-to-top button
  initScrollToTop();
}

// ========================
// SCROLL TO TOP
// ========================
function initScrollToTop() {
  const existingBtn = document.getElementById('scroll-to-top');
  if (existingBtn) {
    existingBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
    return;
  }

  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-to-top';
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.innerHTML = '&uarr;';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.style.display = 'none';
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
  document.body.appendChild(scrollBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollBtn.style.display = 'flex';
    } else {
      scrollBtn.style.display = 'none';
    }
  }, { passive: true });
}

// ========================
// WHATSAPP
// ========================
function openWhatsApp() {
  const phoneNumber = '49';
  const message = encodeURIComponent('Hi AKARI, I would like to inquire about your services.');
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// ========================
// UTILITIES
// ========================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ========================
// EVENT TRACKING
// ========================
function trackEvent(eventName, eventParams) {
  try {
    if (typeof gtag === 'function') {
      gtag('event', eventName, eventParams || {});
    }
    if (typeof dataLayer !== 'undefined' && Array.isArray(dataLayer)) {
      dataLayer.push({ event: eventName, ...eventParams });
    }
  } catch (e) {
    console.warn('Tracking error:', e);
  }
}

function initializeEventTracking() {
  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      trackEvent('form_submit', {
        form_id: 'contact-form',
        form_name: 'Contact Form'
      });
    });
  }

  // Quote request buttons
  document.querySelectorAll('a[href*="contact.html"], .btn-primary, .btn-secondary').forEach(btn => {
    if (btn.textContent && (
      btn.textContent.includes('Request a Quote') ||
      btn.textContent.includes('Request Custom') ||
      btn.textContent.includes('Get Custom Quote') ||
      btn.textContent.includes('Request a Bulk Quote') ||
      btn.textContent.includes('Get a Quote') ||
      btn.textContent.includes('Start Your Custom Order') ||
      btn.textContent.includes('Angebot anfordern') ||
      btn.textContent.includes('Individuelle Bestellung') ||
      btn.textContent.includes('Kostenloses Angebot')
    )) {
      btn.addEventListener('click', function() {
        const quoteType = this.textContent.includes('Bulk') || this.textContent.includes('Groß') ? 'bulk_quote' : 'custom_quote';
        trackEvent('quote_request', {
          quote_type: quoteType,
          button_text: this.textContent.trim().substring(0, 50)
        });
      });
    }
  });

  // Bulk order section
  const bulkOrderBtn = document.querySelector('a[href="contact.html"][class*="btn-primary"]');
  if (bulkOrderBtn && bulkOrderBtn.textContent.includes('Request a Bulk Quote')) {
    bulkOrderBtn.addEventListener('click', function() {
      trackEvent('bulk_order_click', {
        button_text: this.textContent.trim().substring(0, 50)
      });
    });
  }

  // Collection clicks
  document.querySelectorAll('.collection-card, a[href*="products.html#"]').forEach(card => {
    card.addEventListener('click', function() {
      const category = this.getAttribute('href') ? this.getAttribute('href').split('#')[1] : 'unknown';
      trackEvent('collection_click', {
        collection_category: category || 'unknown',
        collection_name: this.querySelector('h3') ? this.querySelector('h3').textContent.trim() : 'unknown'
      });
    });
  });

  // Instagram clicks
  document.querySelectorAll('a[href*="instagram"], a[href*="akaridesigns"]').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('instagram_click', {
        instagram_handle: '@akari.designs',
        link_url: this.getAttribute('href')
      });
    });
  });

  // Email clicks
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('email_click', {
        email_address: this.getAttribute('href').replace('mailto:', '')
      });
    });
  });

  // Language selection
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const lang = this.getAttribute('data-lang');
      trackEvent('language_select', {
        selected_language: lang,
        previous_language: currentLanguage
      });
    });
  });

  // Custom order buttons
  document.querySelectorAll('a[href="contact.html"]').forEach(btn => {
    if (btn.textContent && (
      btn.textContent.includes('Request Custom Order') ||
      btn.textContent.includes('Request a Custom Order') ||
      btn.textContent.includes('Start Your Custom Order') ||
      btn.textContent.includes('Individuelle Bestellung anfordern') ||
      btn.textContent.includes('Get Custom Quote') ||
      btn.textContent.includes('Get a Quote')
    )) {
      btn.addEventListener('click', function() {
        trackEvent('custom_order_click', {
          button_text: this.textContent.trim().substring(0, 50)
        });
      });
    }
  });
}

// ========================
// INITIALIZATION
// ========================
document.addEventListener('DOMContentLoaded', function() {
  initializeLanguage();
  initHeroCarousel(); // Only runs if carousel exists
  initializeNavigation();
  initializeProductFilters();
  initializeFormHandling();
  initializeScrollEffects();
  initFAQAccordion();
  initializeEventTracking();
});

// Inline error styles (injected dynamically)
const errorStyles = document.createElement('style');
errorStyles.textContent = `
  .form-error {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: none;
  }
  .input-error {
    border-color: #e74c3c !important;
  }
  .input-error:focus {
    outline-color: #e74c3c !important;
  }
  .nav-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 998;
  }
  .nav-backdrop.active {
    opacity: 1;
    visibility: visible;
  }
  .scroll-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--accent-gold, #D4AF37);
    color: #1a1a1a;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 999;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
  .scroll-to-top:hover {
    transform: translateY(-3px);
  }
  .scroll-to-top:focus {
    outline: 2px solid var(--accent-light-gold, #f0d878);
    outline-offset: 2px;
  }
  .reveal-element {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal-element.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(errorStyles);
