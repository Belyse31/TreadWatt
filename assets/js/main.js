// TreadWatt Main JavaScript
// Handles animations, interactions, and form validation

document.addEventListener('DOMContentLoaded', () => {
  initCounters();
  initFootstepsCanvas();
  initSmoothScroll();
  initContactForm();
  initMobileNav();
  initScrollAnimations();
});

// ========================================
// Counter Animation
// ========================================
function initCounters() {
  const counters = document.querySelectorAll('.metric-value');
  const speed = 200; // Animation speed

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-count');
    const increment = target / speed;
    let count = 0;

    const updateCount = () => {
      count += increment;
      if (count < target) {
        counter.textContent = Math.ceil(count).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    updateCount();
  };

  // Intersection Observer to trigger when visible
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => observer.observe(counter));
}

// ========================================
// Footsteps Canvas Animation
// ========================================
function initFootstepsCanvas() {
  const canvas = document.getElementById('footstepsCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const footsteps = [];

  class Footstep {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.radius = 0;
      this.maxRadius = 60;
      this.opacity = 1;
      this.growing = true;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity * 0.3})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(16, 185, 129, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    update() {
      if (this.growing) {
        this.radius += 2;
        if (this.radius >= this.maxRadius) {
          this.growing = false;
        }
      } else {
        this.opacity -= 0.02;
      }
      this.draw();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    footsteps.forEach((footstep, index) => {
      footstep.update();
      if (footstep.opacity <= 0) {
        footsteps.splice(index, 1);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();

  // Create footsteps on click or automatically
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    footsteps.push(new Footstep(x, y));
  });

  // Auto-generate footsteps
  setInterval(() => {
    if (footsteps.length < 5) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      footsteps.push(new Footstep(x, y));
    }
  }, 2000);

  // Resize canvas
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
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
          behavior: 'smooth',
        });
      }
    });
  });
}

// ========================================
// Contact Form Validation
// ========================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error-msg').forEach((msg) => (msg.textContent = ''));

    let isValid = true;

    // Validate name
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
      showError(name, 'Name is required');
      isValid = false;
    }

    // Validate email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
      showError(email, 'Email is required');
      isValid = false;
    } else if (!emailRegex.test(email.value)) {
      showError(email, 'Please enter a valid email');
      isValid = false;
    }

    // Validate message
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
      showError(message, 'Message is required');
      isValid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'Message must be at least 10 characters');
      isValid = false;
    }

    if (isValid) {
      // Show success message
      const successMsg = document.querySelector('.form-success');
      successMsg.style.display = 'block';
      form.reset();

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 5000);
    }
  });

  function showError(input, message) {
    const formGroup = input.parentElement;
    const errorMsg = formGroup.querySelector('.error-msg');
    errorMsg.textContent = message;
    input.style.borderColor = '#ef4444';
  }

  // Clear error on input
  form.querySelectorAll('input, textarea').forEach((input) => {
    input.addEventListener('input', () => {
      const formGroup = input.parentElement;
      const errorMsg = formGroup.querySelector('.error-msg');
      errorMsg.textContent = '';
      input.style.borderColor = '#e5e7eb';
    });
  });
}

// ========================================
// Mobile Navigation Toggle
// ========================================
function initMobileNav() {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    siteNav.style.display = isExpanded ? 'none' : 'flex';
    siteNav.style.flexDirection = 'column';
    siteNav.style.position = 'absolute';
    siteNav.style.top = '100%';
    siteNav.style.left = '0';
    siteNav.style.right = '0';
    siteNav.style.background = 'white';
    siteNav.style.padding = '1rem';
    siteNav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  });
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe sections
  document.querySelectorAll('.section').forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Add hover glow effect to steps
  document.querySelectorAll('.step').forEach((step) => {
    step.addEventListener('mouseenter', () => {
      step.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
    });
    step.addEventListener('mouseleave', () => {
      step.style.boxShadow = 'none';
    });
  });

  // Add hover glow to benefits
  document.querySelectorAll('.benefit').forEach((benefit) => {
    benefit.addEventListener('mouseenter', () => {
      benefit.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
    });
    benefit.addEventListener('mouseleave', () => {
      benefit.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });
  });
}
