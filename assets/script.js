const LINE_URL = 'https://line.me/ti/p/MFNrCUgMpT';
const CLICK_DELAY_MS = 800;
const VIEW_CONTENT_DELAY_MS = 5000;

let lineClickLocked = false;
let viewContentTracked = false;

function sendViewContentEvent() {
  try {
    if (!viewContentTracked && typeof fbq === 'function') {
      viewContentTracked = true;

      fbq('track', 'ViewContent', {
        content_name: 'debt_consultation_landing_page',
        content_category: 'financial_services'
      });
    }
  } catch (error) {
    console.warn('ViewContent event failed:', error);
  }
}

function sendPixelEvents(link) {
  try {
    if (typeof fbq === 'function') {
      const buttonPosition = link.getAttribute('data-line-position') || 'unknown';
      const buttonText = link.innerText ? link.innerText.trim() : 'LINE Button';

      fbq('track', 'Contact', {
        content_name: 'line_contact_click',
        content_category: 'financial_services',
        button_position: buttonPosition,
        button_text: buttonText
      });

      fbq('track', 'Lead', {
        content_name: 'line_lead_click',
        content_category: 'financial_services',
        button_position: buttonPosition,
        button_text: buttonText
      });
    }
  } catch (error) {
    console.warn('Pixel event failed:', error);
  }
}

function goLine(event) {
  event.preventDefault();

  if (lineClickLocked) {
    return;
  }

  lineClickLocked = true;

  const link = event.currentTarget;
  const targetUrl = link.getAttribute('href') || LINE_URL;
  const label = link.querySelector('.btn-label');

  if (label) {
    label.textContent = '正在開啟 LINE...';
  }

  link.classList.add('is-loading');

  sendPixelEvents(link);

  setTimeout(() => {
    window.location.href = targetUrl;
  }, CLICK_DELAY_MS);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(sendViewContentEvent, VIEW_CONTENT_DELAY_MS);

  document.querySelectorAll('[data-line-link]').forEach((link, index) => {
    link.setAttribute('href', LINE_URL);

    if (!link.getAttribute('data-line-position')) {
      link.setAttribute('data-line-position', `line_button_${index + 1}`);
    }

    link.addEventListener('click', goLine);
  });
});