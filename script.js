// AKARI Designs - Interactive Features

let currentLanguage = localStorage.getItem('language') || detectBrowserLanguage();
let translations = {};

// Detect browser language and load translations
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

// Detect browser language
function detectBrowserLanguage() {
  const browserLang = navigator.language || navigator.userLanguage;
  return browserLang.startsWith('de') ? 'de' : 'en';
}

// Set language and translate page
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  translatePage();
  updateLanguageSwitcher();
}

// Translate page content
function translatePage() {
  const t = translations[currentLanguage];
  if (!t) return;

  // Navigation
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = t;
    keys.forEach(k => { value = value[k]; });
    if (value) el.textContent = value;
  });

  // Attributes
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const attr = el.getAttribute('data-i18n-attr');
    const key = el.getAttribute('data-i18n-key');
    const keys = key.split('.');
    let value = t;
    keys.forEach(k => { value = value[k]; });
    if (value) el.setAttribute(attr, value);
  });
}

// Initialize language switcher
function initializeLanguageSwitcher() {
  const switcher = document.getElementById('language-switcher');
  if (!switcher) return;

  switcher.innerHTML = `
    <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" data-lang="en">EN</button>
    <button class="lang-btn ${currentLanguage === 'de' ? 'active' : ''}" data-lang="de">DE</button>
  `;

  switcher.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
  });
}

// Update language switcher UI
function updateLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLanguage);
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  await initializeLanguage();
  initializeNavigation();
  initializeProductFilters();
  initializeFormHandling();
  initializeScrollEffects();
});

// NAVIGATION - Mobile menu toggle
function initializeNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const header = document.querySelector('header');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Sticky header effect
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// PRODUCT FILTERS
function initializeProductFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter products
      productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
          card.classList.add('animate-fade');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// FORM HANDLING
function initializeFormHandling() {
  const contactForm = document.getElementById('contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Validate form
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }

      if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Prepare email
      const phone = document.getElementById('phone').value.trim();
      const company = document.getElementById('company').value.trim();
      const service = document.getElementById('service').value;

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

      // Open mail client
      const mailtoLink = `mailto:hello@akaridesigns.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      // Optional: Show feedback to user
      alert('Please complete the email in your mail client to send your message.');
    });
  }
}

// SCROLL EFFECTS
function initializeScrollEffects() {
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade');
      }
    });
  }, observerOptions);

  // Observe elements with animate classes
  document.querySelectorAll('.card, .feature, .testimonial').forEach(el => {
    observer.observe(el);
  });
}

// UTILITY - Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// WhatsApp integration
function openWhatsApp() {
  const phoneNumber = '49'; // Update with actual number
  const message = encodeURIComponent('Hi AKARI, I would like to inquire about your services.');
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

// Scroll to top button (optional enhancement)
window.addEventListener('scroll', function() {
  const scrollButton = document.getElementById('scroll-to-top');
  if (scrollButton) {
    if (window.scrollY > 300) {
      scrollButton.style.display = 'block';
    } else {
      scrollButton.style.display = 'none';
    }
  }
});

// Initialize animations on page load
function initializeAnimations() {
  const elements = document.querySelectorAll('[class*="animate-"]');
  elements.forEach(el => {
    el.style.opacity = '1';
  });
}

initializeAnimations();
