const selectors = {
  navToggle: '.nav-toggle',
  primaryNav: '.primary-nav',
  contactForm: '#contact-form',
  accordionTrigger: '.accordion__trigger',
  anchorLinks: 'a[href^="#"]'
};

const dom = {
  navToggle: null,
  primaryNav: null,
  contactForm: null,
  accordionTriggers: [],
  anchorLinks: []
};

const cacheDom = () => {
  dom.navToggle = document.querySelector(selectors.navToggle);
  dom.primaryNav = document.querySelector(selectors.primaryNav);
  dom.contactForm = document.querySelector(selectors.contactForm);
  dom.accordionTriggers = Array.from(document.querySelectorAll(selectors.accordionTrigger));
  dom.anchorLinks = Array.from(document.querySelectorAll(selectors.anchorLinks));
};

const toggleMobileNav = () => {
  if (!dom.navToggle || !dom.primaryNav) return;
  const expanded = dom.navToggle.getAttribute('aria-expanded') === 'true';
  dom.navToggle.setAttribute('aria-expanded', String(!expanded));
  dom.primaryNav.classList.toggle('primary-nav--expanded', !expanded);
};

const initMobileNav = () => {
  if (!dom.navToggle) return;
  dom.navToggle.addEventListener('click', toggleMobileNav);
};

const smoothScrollHandler = (event) => {
  const link = event.currentTarget;
  if (!(link instanceof HTMLAnchorElement)) return;
  const targetId = link.getAttribute('href');
  if (!targetId || !targetId.startsWith('#')) return;
  const target = document.querySelector(targetId);
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const initSmoothScroll = () => {
  if (!dom.anchorLinks.length) return;
  dom.anchorLinks.forEach((link) => link.addEventListener('click', smoothScrollHandler));
};

const isValidEmail = (value) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value.trim());
};

const markField = (field, message) => {
  const feedback = field.closest('.form-field')?.querySelector('.form-message');
  if (!feedback) return;
  feedback.textContent = message;
  field.setAttribute('aria-invalid', Boolean(message));
};

const validateField = (field) => {
  if (!field) return false;
  const value = field.value.trim();
  if (field.hasAttribute('required') && !value) {
    markField(field, 'This field is required.');
    return false;
  }
  if (field.type === 'email' && value && !isValidEmail(value)) {
    markField(field, 'Please enter a valid email address.');
    return false;
  }
  markField(field, '');
  return true;
};

const handleFormSubmit = (event) => {
  if (!dom.contactForm) return;
  event.preventDefault();
  const fields = Array.from(dom.contactForm.querySelectorAll('input, textarea, select'));
  const isValid = fields.reduce((acc, field) => validateField(field) && acc, true);
  const status = dom.contactForm.querySelector('.form-status');
  if (status) {
    status.textContent = isValid
      ? 'Great! The message is validated locally and ready to be delivered.'
      : 'We still need a couple of corrected fields before sending.';
  }
};

const setupFormValidation = () => {
  if (!dom.contactForm) return;
  dom.contactForm.addEventListener('submit', handleFormSubmit);
  const inputs = dom.contactForm.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => input.addEventListener('blur', () => validateField(input)));
};

const closeAllAccordions = (except) => {
  document.querySelectorAll('.accordion__trigger').forEach((other) => {
    if (other === except) return;
    other.setAttribute('aria-expanded', 'false');
    const otherContent = other.closest('.accordion__item')?.querySelector('.accordion__content');
    if (!otherContent) return;
    otherContent.setAttribute('aria-hidden', 'true');
    otherContent.classList.remove('accordion__content--active');
  });
};

const toggleAccordion = (trigger) => {
  const item = trigger.closest('.accordion__item');
  const content = item?.querySelector('.accordion__content');
  if (!content) return;
  const expanded = trigger.getAttribute('aria-expanded') === 'true';
  const willOpen = !expanded;
  if (willOpen) {
    closeAllAccordions(trigger);
  }
  trigger.setAttribute('aria-expanded', String(willOpen));
  content.setAttribute('aria-hidden', String(!willOpen));
  content.classList.toggle('accordion__content--active', willOpen);
};

const initAccordion = () => {
  if (!dom.accordionTriggers.length) return;
  dom.accordionTriggers.forEach((trigger) => trigger.addEventListener('click', () => toggleAccordion(trigger)));
};

const init = () => {
  cacheDom();
  initMobileNav();
  initSmoothScroll();
  setupFormValidation();
  initAccordion();
};

document.addEventListener('DOMContentLoaded', init);
