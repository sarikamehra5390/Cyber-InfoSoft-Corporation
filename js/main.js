/**
 * Cyber InfoSoft Corporation - Main JavaScript
 * Handles theme toggling, mobile navigation, animations, and form validation
 */

// Preloader
window.addEventListener('load', function() {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initThemeToggle();
  initMobileNav();
  initScrollReveal();
  initSmoothScroll();
  initPortfolioFilter();
  initFormValidation();
  initQuoteForm();
  initTestimonialSlider();
  initFaqToggle();
  initLazyLoading();
  initStatCounters();
  initPortfolioModals();
  initBackToTop();
  initParticlesAnimation();
  initTypingAnimation();
  initHeroBackgroundAnimation();
  initServiceCardInteractions();
  initHeaderScroll();
  initMapCardReveal();
});

/**
 * Theme Toggle
 * Switches between light and dark themes
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const moonIcon = document.querySelector('.moon-icon');
  const sunIcon = document.querySelector('.sun-icon');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const htmlElement = document.documentElement;
  
  // Check for saved theme preference or use OS preference
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
    htmlElement.setAttribute('data-theme', 'dark');
    if (moonIcon && sunIcon) {
      moonIcon.classList.add('d-none');
      sunIcon.classList.remove('d-none');
    }
  }
  
  // Create theme transition overlay if it doesn't exist
  let transitionOverlay = document.querySelector('.theme-transition-overlay');
  if (!transitionOverlay) {
    transitionOverlay = document.createElement('div');
    transitionOverlay.className = 'theme-transition-overlay';
    document.body.appendChild(transitionOverlay);
  }
  
  // Create theme toast if it doesn't exist
  let themeToast = document.querySelector('.theme-toast');
  if (!themeToast) {
    themeToast = document.createElement('div');
    themeToast.className = 'theme-toast';
    themeToast.innerHTML = `
      <div class="theme-icon"></div>
      <div class="theme-message"></div>
    `;
    document.body.appendChild(themeToast);
  }
  
  // Function to toggle theme with smooth transition
  const toggleTheme = () => {
    // Show transition overlay
    transitionOverlay.classList.add('active');
    
    // Add transition class to enable smooth transitions
    htmlElement.classList.add('theme-transition');
    
    // Toggle theme
    const isDarkTheme = htmlElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDarkTheme ? 'light' : 'dark';
    
    // Apply theme change
    if (isDarkTheme) {
      htmlElement.removeAttribute('data-theme');
    } else {
      htmlElement.setAttribute('data-theme', 'dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Update toggle icon with fade transition
    if (moonIcon && sunIcon) {
      if (newTheme === 'dark') {
        // Fade transition for icons
        moonIcon.style.opacity = '0';
        setTimeout(() => {
          moonIcon.classList.add('d-none');
          sunIcon.classList.remove('d-none');
          sunIcon.style.opacity = '0';
          setTimeout(() => {
            sunIcon.style.opacity = '1';
          }, 50);
        }, 150);
      } else {
        sunIcon.style.opacity = '0';
        setTimeout(() => {
          sunIcon.classList.add('d-none');
          moonIcon.classList.remove('d-none');
          moonIcon.style.opacity = '0';
          setTimeout(() => {
            moonIcon.style.opacity = '1';
          }, 50);
        }, 150);
      }
    }
    
    // Add animation class to toggle button
    themeToggle.classList.add('theme-toggle-spin');
    
    // Show toast notification
    const themeIcon = themeToast.querySelector('.theme-icon');
    const themeMessage = themeToast.querySelector('.theme-message');
    
    themeIcon.innerHTML = newTheme === 'dark' 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line></svg>';
    
    themeMessage.textContent = `Switched to ${newTheme} mode`;
    themeToast.classList.add('active');
    
    // Remove transition class and hide overlay after transition completes
    setTimeout(() => {
      htmlElement.classList.remove('theme-transition');
      themeToggle.classList.remove('theme-toggle-spin');
      transitionOverlay.classList.remove('active');
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        themeToast.classList.remove('active');
      }, 3000);
    }, 500);
    
    // Dispatch custom event for theme change
    const themeChangeEvent = new CustomEvent('themechange', {
      detail: { theme: newTheme }
    });
    document.dispatchEvent(themeChangeEvent);
  };
  
  // Add click event listener
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system preference changes
  prefersDarkScheme.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        htmlElement.setAttribute('data-theme', 'dark');
        if (moonIcon && sunIcon) {
          moonIcon.classList.add('d-none');
          sunIcon.classList.remove('d-none');
        }
      } else {
        htmlElement.removeAttribute('data-theme');
        if (moonIcon && sunIcon) {
          sunIcon.classList.add('d-none');
          moonIcon.classList.remove('d-none');
        }
      }
    }
  });
}

/**
 * Mobile Navigation
 * Handles mobile menu toggle and animations
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileNav.contains(event.target) && !menuToggle.contains(event.target) && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
    
    // Close mobile nav when window is resized to desktop size
    window.addEventListener('resize', function() {
      if (window.innerWidth > 992 && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll');
      }
    });
  }
}

/**
 * Header Scroll
 * Adds shadow and background to header on scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
    
    // Trigger scroll event on page load
    window.dispatchEvent(new Event('scroll'));
  }
}

/**
 * Scroll Reveal
 * Animates elements as they scroll into view
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealHandler = function() {
      for (let i = 0; i < revealElements.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = revealElements[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          revealElements[i].classList.add('active');
        }
      }
    };
    
    window.addEventListener('scroll', revealHandler);
    
    // Trigger on initial load
    revealHandler();
  }
}

/**
 * Smooth Scroll
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Close mobile menu if open
        const mobileNav = document.querySelector('.mobile-nav');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (mobileNav && mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          menuToggle.classList.remove('active');
          document.body.classList.remove('no-scroll');
        }
        
        // Scroll to target
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for header height
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Portfolio Filter
 * Filters portfolio items by category
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.portfolio-filter button');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length > 0 && portfolioItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        // Show/hide portfolio items based on filter
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = 'block';
            setTimeout(() => {
              item.classList.add('show');
            }, 50);
          } else {
            item.classList.remove('show');
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
    
    // Trigger click on 'All' button on page load
    const allButton = document.querySelector('.portfolio-filter button[data-filter="all"]');
    if (allButton) {
      allButton.click();
    }
  }
}

/**
 * Form Validation
 * Validates contact form inputs
 */
function initFormValidation() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    // Add animation to floating input fields when focused
    const animatedInputs = contactForm.querySelectorAll('.floating-input .form-control');
    animatedInputs.forEach((input, index) => {
      // Set animation order based on index
      input.style.setProperty('--animation-order', index + 1);
      
      // Add focus and blur event listeners
      input.addEventListener('focus', () => {
        input.parentElement.classList.add('input-focused');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          input.parentElement.classList.remove('input-focused');
        }
      });
      
      // If input has value on page load, add focused class
      if (input.value) {
        input.parentElement.classList.add('input-focused');
      }
    });
    
    contactForm.addEventListener('submit', function(e) {
      let isValid = true;
      
      // Clear previous error messages
      const errorMessages = contactForm.querySelectorAll('.error-message');
      errorMessages.forEach(error => error.remove());
      
      // Validate required fields
      const requiredFields = contactForm.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          showError(field, 'This field is required');
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          isValid = false;
          showError(field, 'Please enter a valid email address');
        }
      });
      
      if (!isValid) {
        e.preventDefault();
      } else {
        // For demo purposes, prevent form submission and show success message
        e.preventDefault();
        
        // Add submit animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.classList.add('submitting');
          
          // Simulate form submission delay
          setTimeout(() => {
            submitBtn.classList.remove('submitting');
            submitBtn.classList.add('submitted');
            
            // Show success message after a short delay
            setTimeout(() => {
              contactForm.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank you!</h3><p>Your message has been sent successfully. We\'ll get back to you soon.</p></div>';
            }, 500);
          }, 1500);
        } else {
          contactForm.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank you!</h3><p>Your message has been sent successfully. We\'ll get back to you soon.</p></div>';
        }
      }
    });
    
    // Helper function to show error message
    function showError(field, message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      field.parentElement.appendChild(errorDiv);
      field.classList.add('error');
    }
    
    // Helper function to validate email
    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }
}

/**
 * Quote Form
 * Handles multi-step quote form
 */
function initQuoteForm() {
  const quoteForm = document.querySelector('.quote-form');
  
  if (!quoteForm) return;
  
  const steps = quoteForm.querySelectorAll('.form-step');
  const nextButtons = quoteForm.querySelectorAll('.next-step');
  const prevButtons = quoteForm.querySelectorAll('.prev-step');
  const progressBar = quoteForm.querySelector('.progress-bar-inner');
  const progressSteps = quoteForm.querySelectorAll('.progress-step');
  
  let currentStep = 0;
  
  // Show current step and update progress
  const showStep = () => {
    // First remove active class from all steps
    steps.forEach(step => {
      step.classList.remove('active');
      step.classList.remove('fade-in');
    });
    
    // Then add active and fade-in to current step
    setTimeout(() => {
      steps[currentStep].classList.add('active');
      setTimeout(() => {
        steps[currentStep].classList.add('fade-in');
        
        // Animate form groups with staggered delay
        const formGroups = steps[currentStep].querySelectorAll('.form-group');
        formGroups.forEach((group, i) => {
          group.style.animationDelay = `${i * 0.1}s`;
          group.classList.add('animate-in');
        });
      }, 50);
    }, 300);
    
    // Update progress bar with animation
    const progress = (currentStep / (steps.length - 1)) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.classList.add('progress-animate');
    }
    
    // Update progress steps
    progressSteps.forEach((step, index) => {
      if (index <= currentStep) {
        step.classList.add('active');
        if (index < currentStep) {
          step.classList.add('completed');
        } else {
          step.classList.remove('completed');
        }
      } else {
        step.classList.remove('active');
        step.classList.remove('completed');
      }
    });
  };
  
  // Validate current step
  const validateStep = () => {
    const currentStepElement = steps[currentStep];
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous error messages
    const errorMessages = currentStepElement.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    requiredFields.forEach(input => {
      input.classList.remove('error');
      
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = 'This field is required';
        input.parentElement.appendChild(errorDiv);
      }
    });
    
    return isValid;
  };
  
  // Next button click handler
  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (validateStep()) {
        currentStep++;
        showStep();
      }
    });
  });
  
  // Previous button click handler
  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentStep--;
      showStep();
    });
  });
  
  // Service selection handler
  const serviceCards = quoteForm.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', function() {
      serviceCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      
      // Update hidden input with selected service
      const serviceInput = quoteForm.querySelector('input[name="service"]');
      if (serviceInput) {
        serviceInput.value = this.getAttribute('data-service');
      }
    });
  });
  
  // Submit handler
  quoteForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateStep()) {
      // For demo purposes, show success message
      quoteForm.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Quote Request Received!</h3><p>Thank you for your interest in our services. We\'ll review your project details and get back to you with a custom quote within 24-48 hours.</p></div>';
    }
  });
  
  // Initialize first step
  showStep();
}

/**
 * Testimonial Slider
 * Creates a carousel for testimonials
 */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;
  
  const testimonials = slider.querySelectorAll('.testimonial');
  if (testimonials.length <= 1) return;
  
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'slider-dots';
  slider.appendChild(dotsContainer);
  
  // Create navigation arrows
  const prevArrow = document.createElement('button');
  prevArrow.className = 'slider-arrow prev';
  prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';
  slider.appendChild(prevArrow);
  
  const nextArrow = document.createElement('button');
  nextArrow.className = 'slider-arrow next';
  nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';
  slider.appendChild(nextArrow);
  
  let currentSlide = 0;
  let interval;
  
  // Create dots
  testimonials.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  // Reset interval
  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(nextSlide, 5000);
  };
  
  // Show current slide
  const showSlide = () => {
    testimonials.forEach((slide, index) => {
      slide.style.transform = `translateX(${100 * (index - currentSlide)}%)`;
    });
    
    // Update dots
    const dots = dotsContainer?.querySelectorAll('.dot');
    if (dots) {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    }
  };
  
  // Go to specific slide
  const goToSlide = (index) => {
    currentSlide = index;
    if (currentSlide < 0) currentSlide = testimonials.length - 1;
    if (currentSlide >= testimonials.length) currentSlide = 0;
    showSlide();
    resetInterval();
  };
  
  // Next slide
  const nextSlide = () => goToSlide(currentSlide + 1);
  
  // Previous slide
  const prevSlide = () => goToSlide(currentSlide - 1);
  
  // Event listeners
  nextArrow.addEventListener('click', nextSlide);
  prevArrow.addEventListener('click', prevSlide);
  
  // Touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  };
  
  // Initialize slider
  showSlide();
  resetInterval();
}

/**
 * FAQ Toggle
 * Toggles FAQ answers on click
 */
function initFaqToggle() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
      question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = '0';
            }
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
        const answer = item.querySelector('.faq-answer');
        
        if (answer) {
          if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          } else {
            answer.style.maxHeight = '0';
          }
        }
      });
    }
  });
}

/**
 * Lazy Loading
 * Loads images only when they enter the viewport
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    let lazyLoadThrottleTimeout;
    
    function lazyLoad() {
      if (lazyLoadThrottleTimeout) {
        clearTimeout(lazyLoadThrottleTimeout);
      }
      
      lazyLoadThrottleTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset;
        
        lazyImages.forEach(img => {
          if (img.offsetTop < window.innerHeight + scrollTop) {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.remove('lazy');
          }
        });
        
        if (lazyImages.length === 0) {
          document.removeEventListener('scroll', lazyLoad);
          window.removeEventListener('resize', lazyLoad);
          window.removeEventListener('orientationChange', lazyLoad);
        }
      }, 20);
    }
    
    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationChange', lazyLoad);
    lazyLoad();
  }
}

/**
 * Stat Counters
 * Animates number counters when they enter the viewport
 */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'), 10);
          const duration = 2000; // ms
          const step = Math.ceil(target / (duration / 16)); // 60fps
          let current = 0;
          
          const updateCounter = () => {
            current += step;
            if (current >= target) {
              counter.textContent = target;
              observer.unobserve(counter);
            } else {
              counter.textContent = current;
              requestAnimationFrame(updateCounter);
            }
          };
          
          requestAnimationFrame(updateCounter);
        }
      });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
  }
}

/**
 * Portfolio Modals
 * Opens modal with portfolio details
 */
function initPortfolioModals() {
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modal = document.querySelector('.portfolio-modal');
  
  if (!portfolioItems.length || !modalOverlay || !modal) return;
  
  // Close modal function
  const closeModal = () => {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
    
    // Clear modal content after animation
    setTimeout(() => {
      modal.querySelector('.modal-content').innerHTML = '';
    }, 300);
  };
  
  // Close button and overlay click
  modalOverlay.addEventListener('click', closeModal);
  
  // Prevent clicks inside modal from closing it
  modal.addEventListener('click', e => e.stopPropagation());
  
  // ESC key to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
  
  // Open modal for each portfolio item
  portfolioItems.forEach(item => {
    item.addEventListener('click', function() {
      const title = this.querySelector('.portfolio-title')?.textContent || 'Project';
      const category = this.querySelector('.portfolio-category')?.textContent || '';
      const imageSrc = this.querySelector('img')?.src || '';
      const description = this.getAttribute('data-description') || 'No description available.';
      
      // Create modal content
      const modalContent = `
        <div class="modal-header">
          <h3>${title}</h3>
          <button class="modal-close"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img src="${imageSrc}" alt="${title}">
          </div>
          <div class="modal-info">
            <div class="modal-category">${category}</div>
            <div class="modal-description">${description}</div>
          </div>
        </div>
      `;
      
      // Set modal content
      modal.querySelector('.modal-content').innerHTML = modalContent;
      
      // Add close button event
      modal.querySelector('.modal-close').addEventListener('click', closeModal);
      
      // Show modal
      modalOverlay.classList.add('active');
      modal.classList.add('active');
      document.body.classList.add('no-scroll');
    });
  });
}

/**
 * Back to Top Button
 * Shows a button to scroll back to top when user scrolls down
 */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  
  if (backToTopBtn) {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    });
    
    // Scroll to top when clicked
    backToTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    // Trigger scroll event on page load
    window.dispatchEvent(new Event('scroll'));
  }
}

/**
 * Particles Animation
 * Initializes particles.js for background effects
 */
function initParticlesAnimation() {
  const particlesContainer = document.getElementById('particles-js');
  if (typeof ParticlesAnimation !== 'undefined' && particlesContainer) {
    // Create a new instance of ParticlesAnimation
    const particlesOptions = {
      selector: '#particles-js',
      particleCount: 80,
      connectParticles: true,
      color: '#5e35b1',
      connectColor: '#5e35b1',
      minSize: 1,
      maxSize: 3,
      speed: 2,
      interactivity: true,
      hoverEffect: true
    };
    
    // Initialize the particles animation
    new ParticlesAnimation(particlesOptions);
  }
}

/**
 * Typing Animation
 * Creates a typing effect for hero section text
 */
function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  
  if (typingElement) {
    const phrases = JSON.parse(typingElement.getAttribute('data-phrases') || '[]');
    
    if (phrases.length === 0) return;
    
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50; // Faster when deleting
      } else {
        typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100; // Normal speed when typing
      }
      
      // If completed typing the phrase
      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1000; // Pause at the end
      }
      
      // If deleted the phrase
      if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
      }
      
      setTimeout(type, typingSpeed);
    }
    
    // Start typing
    setTimeout(type, 1000);
  }
}

/**
 * Hero Background Animation
 * Creates animated background elements for the hero section
 */
function initHeroBackgroundAnimation() {
  const heroSection = document.querySelector('.hero');
  
  if (!heroSection) return;
  
  // Create animated background elements
  const createBackgroundElements = () => {
    const container = document.createElement('div');
    container.className = 'hero-background';
    
    // Create floating elements
    for (let i = 0; i < 15; i++) {
      const element = document.createElement('div');
      element.className = 'floating-element';
      
      // Randomize properties
      const size = Math.random() * 50 + 10;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      
      // Apply styles
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
      element.style.left = `${posX}%`;
      element.style.top = `${posY}%`;
      element.style.animationDuration = `${duration}s`;
      element.style.animationDelay = `${delay}s`;
      
      container.appendChild(element);
    }
    
    // Add the container to the hero-bg-animation div
    const bgAnimation = heroSection.querySelector('.hero-bg-animation');
    if (bgAnimation) {
      bgAnimation.appendChild(container);
    } else {
      heroSection.appendChild(container);
    }
  };
  
  createBackgroundElements();
  
  // The canvas animation is handled by hero-animation.js
}

/**
 * Service Card Interactions
 * Adds hover effects and animations to service cards
 */
function initServiceCardInteractions() {
  const serviceCards = document.querySelectorAll('.service-card');
  
  serviceCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover');
    });
    
    // Add click effect for mobile
    card.addEventListener('click', function() {
      // Remove active class from all cards
      serviceCards.forEach(c => {
        if (c !== this) c.classList.remove('active');
      });
      
      // Toggle active class on clicked card
      this.classList.toggle('active');
    });
  });
}

/**
 * Map Card Reveal Animation
 * Adds reveal animation to map cards when they come into view
 * and makes the map interactive with mouse movement
 */
function initMapCardReveal() {
  const mapCards = document.querySelectorAll('.map-card');
  const mapContainer = document.querySelector('.map-container');
  
  // Add reveal class to all map cards
  mapCards.forEach(card => {
    card.classList.add('reveal');
  });
  
  // Create intersection observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  // Observe all map cards
  mapCards.forEach(card => {
    observer.observe(card);
  });
  
  // Add 3D perspective effect to map container
  if (mapContainer) {
    mapContainer.addEventListener('mousemove', (e) => {
      const rect = mapContainer.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within the element
      const y = e.clientY - rect.top; // y position within the element
      
      // Calculate rotation based on mouse position
      // Convert to percentage of element width/height, then to degrees (-5 to 5)
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      
      mapContainer.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0) scale(1.01)`;
    });
    
    mapContainer.addEventListener('mouseleave', () => {
      mapContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  }
}
