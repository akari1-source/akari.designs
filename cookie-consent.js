(function() {
  'use strict';

  const CONSENT_KEY = 'akari_cookie_consent';

  const SERVICES = {
    ga4: {
      name: 'Google Analytics 4',
      id: 'G-XXXXXXXXXX'
    },
    gtm: {
      name: 'Google Tag Manager',
      id: 'GTM-XXXXXXX'
    },
    clarity: {
      name: 'Microsoft Clarity',
      id: 'XXXXXXXXXX'
    }
  };

  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function setConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* ignore */
    }
  }

  function initTracking() {
    if (typeof window.loadTrackingServices === 'function') {
      window.loadTrackingServices();
    }
  }

  function loadGA4() {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + SERVICES.ga4.id;
    document.head.appendChild(script);

    const config = document.createElement('script');
    config.textContent = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '" + SERVICES.ga4.id + "');";
    document.head.appendChild(config);
  }

  function loadGTM() {
    const script = document.createElement('script');
    script.textContent = "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0], j=d.createElement(s),dl=l!='dataLayer'?'&l='+l; j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl; f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + SERVICES.gtm.id + "');";
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + SERVICES.gtm.id + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  function loadClarity() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)}; t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i; y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, 'clarity', 'script', '" + SERVICES.clarity.id + "');";
    document.head.appendChild(script);
  }

  function loadTrackingServices() {
    loadGA4();
    loadGTM();
    loadClarity();
  }

  function showBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML = '<div class="container">' +
      '<p>We use cookies and similar technologies to analyze traffic and personalize your experience. By clicking "Accept All", you consent to our use of <a href="/privacy">analytics and tracking cookies</a>. You can also visit our <a href="/privacy">Privacy Policy</a> to learn more.</p>' +
      '<div class="cc-buttons">' +
        '<button class="btn-accept" aria-label="Accept all cookies">Accept All</button>' +
        '<button class="btn-reject" aria-label="Reject all non-essential cookies">Reject All</button>' +
      '</div>' +
    '</div>';

    document.body.appendChild(banner);

    banner.querySelector('.btn-accept').addEventListener('click', function() {
      setConsent('accepted');
      banner.remove();
      loadTrackingServices();
      initTracking();
    });

    banner.querySelector('.btn-reject').addEventListener('click', function() {
      setConsent('rejected');
      banner.remove();
      initTracking();
    });
  }

  function initializeCookieConsent() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/cookie-consent.css';

    const existing = document.querySelector('link[href="/cookie-consent.css"]');
    if (!existing) {
      document.head.appendChild(link);
    }

    const consent = getConsent();
    if (consent === 'accepted') {
      loadTrackingServices();
      initTracking();
    } else if (consent === 'rejected') {
      initTracking();
    } else {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieConsent);
  } else {
    initializeCookieConsent();
  }
})();
