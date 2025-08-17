/**
 * Cyber InfoSoft Corporation - Main JavaScript
 * Handles theme toggling, mobile navigation, animations, and form validation
 */

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
});

/**
 * Statistics Counter Animation
 * Animates the statistics numbers counting up to their target values
 */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-number');
  
  if (statElements.length === 0) return;
  
  const options = {
    threshold: 0.5,
    rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const targetValue = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        // Start value at 0
        let currentCount = 0;
        element.textContent = '0';
        
        // Animate the counter
        const counter = setInterval(() => {
          frame++;
          
          // Calculate the progress (0 to 1)
          const progress = frame / totalFrames;
          
          // Use easeOutQuad for smoother animation
          const easeProgress = 1 - Math.pow(1 - progress, 2);
          
          // Calculate current count
          currentCount = Math.floor(easeProgress * targetValue);
          
          // Update the element
          element.textContent = currentCount;
          
          // If we've reached the target value, stop the animation
          if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = targetValue;
          }
        }, frameDuration);
        
        // Stop observing once animation has started
        observer.unobserve(element);
      }
    });
  }, options);
  
  // Start observing each stat element
  statElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Lazy Loading and Image Optimization
 * Implements lazy loading for images to improve page load performance
 */
function initLazyLoading() {
  // Select all images that should be lazy loaded
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  // Create an intersection observer
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          // Replace src with data-src
          img.src = img.dataset.src;
          
          // If there's a srcset attribute, handle that too
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          // Add a loaded class for potential animations
          img.classList.add('loaded');
          
          // Stop observing the image after it's loaded
          observer.unobserve(img);
        }
      });
    }, {
      // Options for the observer
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    // Observe each image
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Simple scroll-based lazy loading
    const lazyLoad = function() {
      let active = false;
      
      if (active === false) {
        active = true;
        
        setTimeout(function() {
          lazyImages.forEach(img => {
            if ((img.getBoundingClientRect().top <= window.innerHeight && img.getBoundingClientRect().bottom >= 0) && 
                getComputedStyle(img).display !== 'none') {
              img.src = img.dataset.src;
              
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              
              img.classList.add('loaded');
              
              lazyImages = lazyImages.filter(image => image !== img);
              
              if (lazyImages.length === 0) {
                document.removeEventListener('scroll', lazyLoad);
                window.removeEventListener('resize', lazyLoad);
                window.removeEventListener('orientationchange', lazyLoad);
              }
            }
          });
          
          active = false;
        }, 200);
      }
    };
    
    // Add event listeners for scroll, resize, and orientation change
    document.addEventListener('scroll', lazyLoad);
    window.addEventListener('resize', lazyLoad);
    window.addEventListener('orientationchange', lazyLoad);
    
    // Initial load
    lazyLoad();
  }
  
  // Convert existing images to use lazy loading
  convertImagesToLazyLoad();
}

/**
 * Convert existing images to use lazy loading
 * This function finds all images without data-src and converts them to use lazy loading
 */
function convertImagesToLazyLoad() {
  // Select all images that don't already have data-src attribute
  // and aren't in the header logo or other critical above-the-fold elements
  const images = document.querySelectorAll('img:not([data-src]):not(.logo img):not(.hero-image)');
  
  images.forEach(img => {
    // Skip SVG images as they're typically small and used for icons
    if (img.src.endsWith('.svg')) return;
    
    // Store the original src
    const originalSrc = img.src;
    
    // Set data-src attribute with the original source
    img.dataset.src = originalSrc;
    
    // Set a lightweight placeholder or blur-up image
    // For simplicity, we're using a transparent placeholder
    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
    
    // Add loading="lazy" attribute for native lazy loading as a fallback
    img.loading = 'lazy';
    
    // Add a CSS class for styling
    img.classList.add('lazy');
  });
}

/**
 * FAQ Toggle
 * Handles the accordion functionality for FAQ items with enhanced animations
 */
function initFaqToggle() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (!faqItems.length) return;
  
  // Add animation classes to FAQ items for staggered reveal
  faqItems.forEach((item, index) => {
    item.classList.add('reveal');
    item.style.setProperty('--reveal-delay', index);
  });
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const answerContent = answer ? answer.querySelector('p') : null;
    
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other open items with animation
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            
            // Reset answer content animation
            const otherAnswerContent = otherItem.querySelector('.faq-answer p');
            if (otherAnswerContent) {
              otherAnswerContent.style.opacity = '0';
              otherAnswerContent.style.transform = 'translateY(10px)';
            }
          }
        });
        
        // Toggle current item with animation
        if (!isActive) {
          item.classList.add('active');
          
          // Animate answer content after a small delay
          if (answerContent) {
            setTimeout(() => {
              answerContent.style.opacity = '1';
              answerContent.style.transform = 'translateY(0)';
            }, 150);
          }
        } else {
          // Reset answer content animation before closing
          if (answerContent) {
            answerContent.style.opacity = '0';
            answerContent.style.transform = 'translateY(10px)';
            
            // Small delay before removing active class
            setTimeout(() => {
              item.classList.remove('active');
            }, 100);
          } else {
            item.classList.remove('active');
          }
        }
      });
    }
  });
  
  // Initialize FAQ answer content styles
  document.querySelectorAll('.faq-answer p').forEach(content => {
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
  });
  
  // Open the first FAQ item by default after a small delay
  setTimeout(() => {
    if (faqItems.length > 0) {
      const firstItem = faqItems[0];
      firstItem.classList.add('active');
      
      const firstItemContent = firstItem.querySelector('.faq-answer p');
      if (firstItemContent) {
        setTimeout(() => {
          firstItemContent.style.opacity = '1';
          firstItemContent.style.transform = 'translateY(0)';
        }, 150);
      }
    }
  }, 500);
}

/**
 * Theme Toggle Functionality
 * - Checks user's preferred color scheme
 * - Loads saved theme from localStorage
 * - Toggles between light and dark themes
 * - Responds to system preference changes
 * - Adds smooth transition effects
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;
  
  // Add transition class for smooth theme changes
  htmlElement.classList.add('theme-transition');
  
  // Create theme preference modal
  createThemePreferenceModal();
  
  // Check for saved theme preference in localStorage
  const savedTheme = localStorage.getItem('theme');
  const savedThemePreference = localStorage.getItem('themePreference'); // auto, light, or dark
  
  // Apply theme based on preference
  if (savedThemePreference === 'auto') {
    // Use system preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const systemTheme = prefersDarkMode ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', systemTheme);
    updateThemeIcon(systemTheme);
  } else if (savedTheme) {
    // Use saved theme
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Default to system preference if no saved preference
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDarkMode ? 'dark' : 'light';
    htmlElement.setAttribute('data-theme', defaultTheme);
    updateThemeIcon(defaultTheme);
    // Set default preference to auto
    localStorage.setItem('themePreference', 'auto');
  }
  
  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only apply if preference is set to auto
    if (localStorage.getItem('themePreference') === 'auto') {
      const newTheme = e.matches ? 'dark' : 'light';
      htmlElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });
  
  // Toggle theme when button is clicked
  themeToggle.addEventListener('click', function(e) {
    // Show theme preference modal on long press
    if (e.detail === 3) { // Triple click
      showThemePreferenceModal();
      return;
    }
    
    // Add animation class
    themeToggle.classList.add('theme-toggle-spin');
    
    // Remove animation class after animation completes
    setTimeout(() => {
      themeToggle.classList.remove('theme-toggle-spin');
    }, 300);
    
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    localStorage.setItem('themePreference', newTheme); // Set preference to manual
    
    updateThemeIcon(newTheme);
    
    // Show toast notification
    showThemeToast(newTheme);
  });
  
  // Long press to show theme preference modal
  let pressTimer;
  themeToggle.addEventListener('mousedown', function() {
    pressTimer = setTimeout(() => {
      showThemePreferenceModal();
    }, 800); // 800ms long press
  });
  
  themeToggle.addEventListener('mouseup', function() {
    clearTimeout(pressTimer);
  });
  
  themeToggle.addEventListener('mouseleave', function() {
    clearTimeout(pressTimer);
  });
  
  // Update the theme toggle icon based on current theme
  function updateThemeIcon(theme) {
    const moonIcon = themeToggle.querySelector('.moon-icon');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    
    if (theme === 'dark') {
      moonIcon.classList.add('d-none');
      sunIcon.classList.remove('d-none');
    } else {
      sunIcon.classList.add('d-none');
      moonIcon.classList.remove('d-none');
    }
  }
  
  // Create theme preference modal
  function createThemePreferenceModal() {
    // Check if modal already exists
    if (document.getElementById('theme-preference-modal')) {
      return;
    }
    
    const modal = document.createElement('div');
    modal.id = 'theme-preference-modal';
    modal.className = 'theme-modal';
    modal.innerHTML = `
      <div class="theme-modal-content">
        <div class="theme-modal-header">
          <h3>Theme Preference</h3>
          <button class="theme-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="theme-modal-body">
          <div class="theme-option" data-theme-preference="light">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
            <span>Light</span>
          </div>
          <div class="theme-option" data-theme-preference="dark">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
            <span>Dark</span>
          </div>
          <div class="theme-option" data-theme-preference="auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>System</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.theme-modal-close');
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
    });
    
    // Close modal when clicking outside the content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
    
    // Handle theme option selection
    const themeOptions = modal.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const preference = option.getAttribute('data-theme-preference');
        localStorage.setItem('themePreference', preference);
        
        if (preference === 'auto') {
          // Use system preference
          const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const systemTheme = prefersDarkMode ? 'dark' : 'light';
          htmlElement.setAttribute('data-theme', systemTheme);
          updateThemeIcon(systemTheme);
          localStorage.setItem('theme', systemTheme);
        } else {
          // Use selected preference
          htmlElement.setAttribute('data-theme', preference);
          updateThemeIcon(preference);
          localStorage.setItem('theme', preference);
        }
        
        // Update active state
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Close modal
        modal.classList.remove('active');
        
        // Show toast notification
        showThemeToast(preference === 'auto' ? 'system' : preference);
      });
    });
  }
  
  // Show theme preference modal
  function showThemePreferenceModal() {
    const modal = document.getElementById('theme-preference-modal');
    if (!modal) return;
    
    // Set active option based on current preference
    const currentPreference = localStorage.getItem('themePreference') || 'auto';
    const themeOptions = modal.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
      const preference = option.getAttribute('data-theme-preference');
      if (preference === currentPreference) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
    
    modal.classList.add('active');
  }
  
  // Show theme change toast notification
  function showThemeToast(theme) {
    // Remove existing toast if any
    const existingToast = document.querySelector('.theme-toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'theme-toast';
    
    let message = '';
    if (theme === 'light') {
      message = 'Light theme activated';
    } else if (theme === 'dark') {
      message = 'Dark theme activated';
    } else if (theme === 'system') {
      message = 'Using system theme preference';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
      toast.classList.add('active');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
}

/**
 * Mobile Navigation
 * - Handles hamburger menu toggle
 * - Manages backdrop for mobile menu
 * - Closes menu on ESC key and backdrop click
 */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.backdrop');
  const body = document.body;
  
  // Toggle mobile menu when hamburger is clicked
  hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    backdrop.classList.toggle('active');
    body.classList.toggle('no-scroll');
  });
  
  // Close mobile menu when backdrop is clicked
  backdrop.addEventListener('click', function() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    backdrop.classList.remove('active');
    body.classList.remove('no-scroll');
  });
  
  // Close mobile menu when ESC key is pressed
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      backdrop.classList.remove('active');
      body.classList.remove('no-scroll');
    }
  });
  
  // Close mobile menu when a nav link is clicked
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      backdrop.classList.remove('active');
      body.classList.remove('no-scroll');
    });
  });
}

/**
 * Scroll Reveal Animation
 * Uses IntersectionObserver to animate elements as they enter the viewport
 * with enhanced staggered animations and different animation styles
 */
function initScrollReveal() {
  // Select all reveal elements including the new animation style classes
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  
  if (revealElements.length === 0) return;
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  // Apply staggered delays to elements in the same container
  const applyStaggeredDelays = () => {
    // Find common parent containers with multiple reveal elements
    const containers = document.querySelectorAll('.row, .container, section');
    
    containers.forEach(container => {
      // Get all reveal elements within this container
      const elements = container.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
      
      if (elements.length > 1) {
        // Apply increasing delay to each element
        elements.forEach((element, index) => {
          element.style.setProperty('--reveal-delay', index);
        });
      }
    });
  };
  
  // Apply staggered delays
  applyStaggeredDelays();
  
  // Create the intersection observer
  const revealObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add active class with a small delay to ensure CSS transitions work properly
        setTimeout(() => {
          entry.target.classList.add('active');
        }, 50);
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);
  
  // Observe all reveal elements
  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
  
  // Apply different animation styles to specific elements for visual variety
  const applyAnimationStyles = () => {
    // Apply left/right animations to alternating elements in feature sections
    const featureCards = document.querySelectorAll('.features .card');
    featureCards.forEach((card, index) => {
      // Remove the original reveal class
      card.classList.remove('reveal');
      // Add alternating left/right reveal classes
      if (index % 2 === 0) {
        card.classList.add('reveal-left');
      } else {
        card.classList.add('reveal-right');
      }
    });
    
    // Apply scale animation to testimonials
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach(testimonial => {
      testimonial.classList.add('reveal-scale');
    });
  };
  
  // Apply custom animation styles
  applyAnimationStyles();
}

/**
 * Smooth Scrolling for Anchor Links
 */
function initSmoothScroll() {
  // Select all anchor links that don't point to just '#'
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  
  // Get header height for offset (assuming there's a fixed header)
  const header = document.querySelector('header');
  const headerOffset = header ? header.offsetHeight : 0;
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get the target's position with offset
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Extra 20px padding
        
        // Smooth scroll to the target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        history.pushState(null, null, targetId);
      }
    });
  });
  
  // Handle initial page load with hash in URL
  if (window.location.hash) {
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash);
      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300); // Small delay to ensure page is fully loaded
  }
}

/**
 * Portfolio Filtering
 * Filters portfolio items based on category
 */
function initPortfolioFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  if (filterButtons.length === 0 || portfolioItems.length === 0) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      const filterValue = this.getAttribute('data-filter');
      
      // Show/hide portfolio items based on filter
      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  
  // Trigger click on 'All' filter button to initialize
  const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
  if (allFilterButton) {
    allFilterButton.click();
  }
  
  // Initialize project details modal functionality
  initProjectDetailsModal();
}

/**
 * Project Details Modal
 * Handles opening and closing of project detail modals
 */
function initProjectDetailsModal() {
  const portfolioButtons = document.querySelectorAll('.portfolio-btn');
  const projectDetailsContainer = document.querySelector('.project-details-container');
  const projectDetails = document.querySelectorAll('.project-details');
  const closeButtons = document.querySelectorAll('.close-project');
  
  if (!projectDetailsContainer) return;
  
  // Open project details modal
  portfolioButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const projectId = this.getAttribute('data-project');
      const targetProject = document.getElementById(projectId);
      
      if (targetProject) {
        // Show container
        projectDetailsContainer.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Hide all project details
        projectDetails.forEach(detail => {
          detail.style.display = 'none';
        });
        
        // Show target project details
        targetProject.style.display = 'block';
      }
    });
  });
  
  // Close project details modal
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      projectDetailsContainer.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    });
  });
  
  // Close modal when clicking outside content
  projectDetailsContainer.addEventListener('click', function(e) {
    if (e.target === projectDetailsContainer) {
      projectDetailsContainer.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
  
  // Handle thumbnail clicks
  const galleryThumbs = document.querySelectorAll('.project-gallery-thumbs img');
  galleryThumbs.forEach(thumb => {
    thumb.addEventListener('click', function() {
      const mainImg = this.closest('.project-gallery').querySelector('.project-main-img');
      if (mainImg) {
        // Get the data-src if it exists (for lazy loaded images), otherwise use src
        const mainSrc = mainImg.dataset.src || mainImg.src;
        const thumbSrc = this.dataset.src || this.src;
        
        // Swap images with animation
        mainImg.style.opacity = '0';
        setTimeout(() => {
          // If the main image uses data-src (lazy loading), update both src and data-src
          if (mainImg.dataset.src) {
            mainImg.dataset.src = thumbSrc;
            // If the image is already loaded (has the 'loaded' class), update src directly
            mainImg.src = thumbSrc;
          } else {
            // Regular image, just update src
            mainImg.src = thumbSrc;
          }
          
          // Update the thumbnail similarly
          if (this.dataset.src) {
            this.dataset.src = mainSrc;
            if (this.classList.contains('loaded')) {
              this.src = mainSrc;
            }
          } else {
            this.src = mainSrc;
          }
          
          mainImg.style.opacity = '1';
        }, 300);
      }
    });
  });
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && projectDetailsContainer.style.display === 'block') {
      projectDetailsContainer.style.display = 'none';
      document.body.style.overflow = ''; // Restore scrolling
    }
  });
}

/**
 * Form Validation
 * Enhanced client-side validation for contact and quote forms
 */
function initFormValidation() {
  const forms = document.querySelectorAll('.needs-validation');
  
  if (forms.length === 0) return;
  
  // Contact form specific validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const phoneInput = contactForm.querySelector('#phone');
    const messageInput = contactForm.querySelector('#message');
    const privacyCheckbox = contactForm.querySelector('#privacy-policy');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formSuccess = document.querySelector('.form-success');
    const formError = document.querySelector('.form-error');
    
    // Real-time validation
    if (nameInput) {
      nameInput.addEventListener('input', function() {
        validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter a valid name (at least 2 characters)');
      });
    }
    
    if (emailInput) {
      emailInput.addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        validateField(emailInput, emailRegex.test(emailInput.value), 'Please enter a valid email address');
      });
    }
    
    if (phoneInput) {
      phoneInput.addEventListener('input', function() {
        // Allow empty phone (if not required) or validate format
        const phoneRegex = /^[\d\+\-\(\)\s]*$/;
        const isEmpty = phoneInput.value.trim() === '';
        const isValid = phoneRegex.test(phoneInput.value) && phoneInput.value.replace(/[^\d]/g, '').length >= 7;
        validateField(phoneInput, isEmpty || isValid, 'Please enter a valid phone number');
      });
    }
    
    if (messageInput) {
      messageInput.addEventListener('input', function() {
        validateField(messageInput, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters long');
      });
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate all fields before submission
      let isValid = true;
      
      if (nameInput) {
        isValid = validateField(nameInput, nameInput.value.trim().length >= 2, 'Please enter a valid name') && isValid;
      }
      
      if (emailInput) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = validateField(emailInput, emailRegex.test(emailInput.value), 'Please enter a valid email address') && isValid;
      }
      
      if (messageInput) {
        isValid = validateField(messageInput, messageInput.value.trim().length >= 10, 'Message must be at least 10 characters long') && isValid;
      }
      
      if (privacyCheckbox && privacyCheckbox.required) {
        isValid = validateField(privacyCheckbox, privacyCheckbox.checked, 'You must agree to the privacy policy') && isValid;
      }
      
      // Enhanced spam protection checks
      const honeypotField = contactForm.querySelector('.honeypot-field');
      if (honeypotField && honeypotField.value) {
        isValid = false;
        return; // Silent fail for bots
      }
      
      // Rate limiting check
      if (!checkRateLimit('contact-form')) {
        showFormError('Please wait before submitting another message.');
        isValid = false;
        return;
      }
      
      // Content validation for spam patterns
      if (detectSpamContent(messageInput.value)) {
        showFormError('Your message contains suspicious content. Please revise and try again.');
        isValid = false;
        return;
      }
      
      if (isValid) {
        // If using Netlify forms, let Netlify handle the submission
        if (contactForm.getAttribute('data-netlify') === 'true') {
          contactForm.submit();
          return;
        }
        
        // For custom form handling (AJAX submission)
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        // Simulate form submission (replace with actual AJAX call in production)
        setTimeout(() => {
          formSuccess.style.display = 'block';
          formError.style.display = 'none';
          contactForm.reset();
          submitButton.disabled = false;
          submitButton.innerHTML = 'Send Message';
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 5000);
        }, 1500);
      }
    });
  }
  
  // Generic validation for other forms
  forms.forEach(form => {
    if (form.id !== 'contactForm') { // Skip contact form as it's handled separately
      form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        
        form.classList.add('was-validated');
      }, false);
      
      // Honeypot field check for spam prevention
      const honeypotField = form.querySelector('.honeypot-field');
      if (honeypotField) {
        form.addEventListener('submit', function(event) {
          if (honeypotField.value) {
            event.preventDefault();
            event.stopPropagation();
          }
        }, false);
      }
    }
  });
}

/**
 * Helper function to validate a form field
 * @param {HTMLElement} field - The field to validate
 * @param {boolean} isValid - Whether the field is valid
 * @param {string} errorMessage - The error message to display
 * @returns {boolean} - Whether the field is valid
 */
function validateField(field, isValid, errorMessage) {
  const feedbackElement = field.nextElementSibling?.classList.contains('invalid-feedback') 
    ? field.nextElementSibling 
    : null;
  
  if (isValid) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    if (feedbackElement) {
      feedbackElement.textContent = '';
    }
  } else {
    field.classList.remove('is-valid');
    field.classList.add('is-invalid');
    if (feedbackElement) {
      feedbackElement.textContent = errorMessage;
    }
  }
  
  return isValid;
}

/**
 * Multi-step Quote Form
 * Handles navigation between form steps with enhanced validation
 */
function initQuoteForm() {
  const quoteForm = document.querySelector('.quote-form');
  
  if (!quoteForm) return;
  
  const formSteps = quoteForm.querySelectorAll('.form-step');
  const nextButtons = quoteForm.querySelectorAll('.btn-next');
  const prevButtons = quoteForm.querySelectorAll('.btn-prev');
  const progressBar = quoteForm.querySelector('.progress-bar');
  const submitButton = quoteForm.querySelector('button[type="submit"]');
  const formSuccess = quoteForm.querySelector('.form-success');
  const formError = quoteForm.querySelector('.form-error');
  const stepIndicators = quoteForm.querySelectorAll('.step-indicator');
  
  let currentStep = 0;
  
  // Update progress bar and step indicators
  function updateProgress() {
    const progress = (currentStep / (formSteps.length - 1)) * 100;
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute('aria-valuenow', progress);
    }
    
    // Update step indicators
    if (stepIndicators.length) {
      stepIndicators.forEach((indicator, index) => {
        if (index < currentStep) {
          indicator.classList.add('completed');
          indicator.classList.remove('active');
        } else if (index === currentStep) {
          indicator.classList.add('active');
          indicator.classList.remove('completed');
        } else {
          indicator.classList.remove('active', 'completed');
        }
      });
    }
  }
  
  // Show current step with animation
  function showStep(stepIndex) {
    formSteps.forEach((step, index) => {
      if (index === stepIndex) {
        step.classList.add('active');
        step.classList.add('fade-in');
        setTimeout(() => {
          step.classList.remove('fade-in');
        }, 500);
      } else {
        step.classList.remove('active');
      }
    });
    
    // Update navigation buttons visibility
    const isFirstStep = stepIndex === 0;
    const isLastStep = stepIndex === formSteps.length - 1;
    
    prevButtons.forEach(btn => {
      btn.style.display = isFirstStep ? 'none' : 'block';
    });
    
    nextButtons.forEach(btn => {
      btn.style.display = isLastStep ? 'none' : 'block';
    });
    
    if (submitButton) {
      submitButton.style.display = isLastStep ? 'block' : 'none';
    }
    
    updateProgress();
  }
  
  // Validate a single field
  function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Get the field's validation feedback element
    const feedbackElement = field.nextElementSibling?.classList.contains('invalid-feedback') 
      ? field.nextElementSibling 
      : null;
    
    // Skip validation for non-required empty fields
    if (!field.hasAttribute('required') && !field.value.trim()) {
      field.classList.remove('is-invalid', 'is-valid');
      if (feedbackElement) feedbackElement.textContent = '';
      return true;
    }
    
    // Validate based on field type and attributes
    switch (field.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(field.value);
        errorMessage = 'Please enter a valid email address';
        break;
        
      case 'tel':
        const phoneRegex = /^[\d\+\-\(\)\s]*$/;
        isValid = phoneRegex.test(field.value) && field.value.replace(/[^\d]/g, '').length >= 7;
        errorMessage = 'Please enter a valid phone number';
        break;
        
      case 'url':
        try {
          new URL(field.value.startsWith('http') ? field.value : 'https://' + field.value);
          isValid = true;
        } catch (e) {
          isValid = false;
          errorMessage = 'Please enter a valid URL';
        }
        break;
        
      case 'date':
        isValid = !isNaN(new Date(field.value).getTime());
        errorMessage = 'Please enter a valid date';
        break;
        
      case 'checkbox':
        isValid = field.checked;
        errorMessage = 'This field is required';
        break;
        
      case 'select-one':
        isValid = field.value !== '';
        errorMessage = 'Please select an option';
        break;
        
      case 'textarea':
        isValid = field.value.trim().length >= 10;
        errorMessage = 'Please enter at least 10 characters';
        break;
        
      default:
        // Text inputs
        isValid = field.value.trim().length >= 2;
        errorMessage = 'This field is required';
    }
    
    // Apply validation classes
    if (isValid) {
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      if (feedbackElement) feedbackElement.textContent = '';
    } else {
      field.classList.remove('is-valid');
      field.classList.add('is-invalid');
      if (feedbackElement) feedbackElement.textContent = errorMessage;
    }
    
    return isValid;
  }
  
  // Validate all fields in a step
  function validateStep(stepIndex) {
    const currentStepFields = formSteps[stepIndex].querySelectorAll('input, select, textarea');
    let isStepValid = true;
    
    currentStepFields.forEach(field => {
      // Skip hidden fields and honeypot
      if (field.type === 'hidden' || field.classList.contains('honeypot-field')) {
        return;
      }
      
      const fieldIsValid = validateField(field);
      isStepValid = isStepValid && fieldIsValid;
    });
    
    return isStepValid;
  }
  
  // Initialize first step
  showStep(currentStep);
  
  // Add input event listeners for real-time validation
  const allFields = quoteForm.querySelectorAll('input, select, textarea');
  allFields.forEach(field => {
    // Skip hidden fields and honeypot
    if (field.type === 'hidden' || field.classList.contains('honeypot-field')) {
      return;
    }
    
    field.addEventListener('input', function() {
      validateField(this);
    });
    
    field.addEventListener('change', function() {
      validateField(this);
    });
  });
  
  // Next button click handler
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Validate current step fields
      const isStepValid = validateStep(currentStep);
      
      if (isStepValid && currentStep < formSteps.length - 1) {
        currentStep++;
        showStep(currentStep);
        
        // Scroll to top of form
        quoteForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Previous button click handler
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
        
        // Scroll to top of form
        quoteForm.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Form submission handler
  if (quoteForm) {
    quoteForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate all steps before submission
      let isValid = true;
      for (let i = 0; i < formSteps.length; i++) {
        isValid = validateStep(i) && isValid;
        if (!isValid) {
          currentStep = i;
          showStep(i);
          break;
        }
      }
      
      // Enhanced spam protection checks
      const honeypotField = quoteForm.querySelector('.honeypot-field');
      if (honeypotField && honeypotField.value) {
        isValid = false;
        return; // Silent fail for bots
      }
      
      // Rate limiting check
      if (!checkRateLimit('quote-form')) {
        showFormError('Please wait before submitting another quote request.');
        isValid = false;
        return;
      }
      
      // Validate email for disposable domains
      const emailField = quoteForm.querySelector('input[type="email"]');
      if (emailField && emailField.value && isDisposableEmail(emailField.value)) {
        showFormError('Please use a valid business email address.');
        isValid = false;
        return;
      }
      
      if (isValid) {
        // If using Netlify forms, let Netlify handle the submission
        if (quoteForm.getAttribute('data-netlify') === 'true') {
          quoteForm.submit();
          return;
        }
        
        // For custom form handling (AJAX submission)
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
        
        // Simulate form submission (replace with actual AJAX call in production)
        setTimeout(() => {
          // Simulate random success/error (90% success rate)
          const isSuccess = Math.random() > 0.1;
          
          if (isSuccess) {
            // Success case
            formSteps.forEach(step => step.classList.remove('active'));
            formSuccess.style.display = 'block';
            formError.style.display = 'none';
            quoteForm.reset();
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            // Error case
            formError.textContent = 'There was a problem submitting your request. Please try again or contact us directly.';
            formError.style.display = 'block';
            
            // Scroll to error message
            formError.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Add shake animation to error message
            formError.classList.add('shake');
            setTimeout(() => {
              formError.classList.remove('shake');
            }, 500);
          }
          
          submitButton.disabled = false;
          submitButton.innerHTML = 'Submit Request';
          
          // Reset to first step for new submissions
          currentStep = 0;
          updateProgress();
        }, 1500);
      }
    });
  }
}

/**
 * Testimonial Slider
 * Enhanced carousel for testimonials section with smooth transitions and animations
 */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  
  if (!slider) return;
  
  const slides = slider.querySelectorAll('.testimonial');
  const prevButton = slider.querySelector('.slider-prev');
  const nextButton = slider.querySelector('.slider-next');
  const indicators = slider.querySelectorAll('.slider-indicator');
  
  let currentSlide = 0;
  let isAnimating = false;
  let autoplayInterval;
  const autoplayDelay = 6000; // 6 seconds between slides for better reading experience
  
  // Add animation classes to testimonial slider for scroll reveal
  slider.classList.add('reveal-scale');
  
  // Show current slide with enhanced animation
  function showSlide(index, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;
    
    // Get current and next slides
    const currentSlideElement = slides[currentSlide];
    const nextSlideElement = slides[index];
    
    // Determine animation direction
    const animationOut = direction === 'next' ? 'translateX(-50px)' : 'translateX(50px)';
    const animationIn = direction === 'next' ? 'translateX(50px)' : 'translateX(-50px)';
    
    // Prepare the new slide for animation
    if (nextSlideElement) {
      nextSlideElement.style.display = 'block';
      nextSlideElement.style.opacity = '0';
      nextSlideElement.style.transform = animationIn;
    }
    
    // Update indicators with animation
    indicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
    
    // Animate current slide out
    if (currentSlideElement && currentSlideElement.classList.contains('active')) {
      currentSlideElement.style.transition = `opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
      currentSlideElement.style.opacity = '0';
      currentSlideElement.style.transform = animationOut;
      
      // Wait for animation to complete
      setTimeout(() => {
        currentSlideElement.classList.remove('active');
        currentSlideElement.style.display = 'none';
        
        // Animate new slide in
        if (nextSlideElement) {
          nextSlideElement.classList.add('active');
          nextSlideElement.style.transition = `opacity 0.5s ease, transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)`;
          nextSlideElement.style.opacity = '1';
          nextSlideElement.style.transform = 'translateX(0) scale(1)';
          
          // Add subtle pulse animation to the active indicator
          const activeIndicator = indicators[index];
          if (activeIndicator) {
            activeIndicator.style.animation = 'pulse 1s ease';
            setTimeout(() => {
              activeIndicator.style.animation = '';
            }, 1000);
          }
          
          // Reset animation state after completion
          setTimeout(() => {
            isAnimating = false;
          }, 100);
        } else {
          isAnimating = false;
        }
      }, 500);
    } else {
      // If no current slide (first load), just show the new slide
      if (nextSlideElement) {
        nextSlideElement.classList.add('active');
        nextSlideElement.style.opacity = '1';
        nextSlideElement.style.transform = 'translateX(0) scale(1)';
        isAnimating = false;
      }
    }
    
    // Update current slide index
    currentSlide = index;
  }
  
  // Initialize first slide
  showSlide(currentSlide);
  
  // Next slide function with enhanced animation
  function nextSlide() {
    if (isAnimating) return;
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex, 'next');
    resetAutoplay();
    
    // Add animation to next button
    if (nextButton) {
      nextButton.style.transform = 'scale(1.2)';
      setTimeout(() => {
        nextButton.style.transform = '';
      }, 300);
    }
  }
  
  // Previous slide function with enhanced animation
  function prevSlide() {
    if (isAnimating) return;
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex, 'prev');
    resetAutoplay();
    
    // Add animation to prev button
    if (prevButton) {
      prevButton.style.transform = 'scale(1.2)';
      setTimeout(() => {
        prevButton.style.transform = '';
      }, 300);
    }
  }
  
  // Next button click handler
  if (nextButton) {
    nextButton.addEventListener('click', nextSlide);
  }
  
  // Previous button click handler
  if (prevButton) {
    prevButton.addEventListener('click', prevSlide);
  }
  
  // Indicator click handlers with enhanced feedback
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function() {
      if (isAnimating || currentSlide === index) return;
      
      // Determine direction for animation
      const direction = index > currentSlide ? 'next' : 'prev';
      showSlide(index, direction);
      resetAutoplay();
      
      // Add animation to clicked indicator
      this.style.transform = 'scale(1.3)';
      setTimeout(() => {
        this.style.transform = '';
      }, 300);
    });
  });
  
  // Enhanced touch swipe support with feedback
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;
  
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    
    // Visual feedback on touch
    slider.style.transition = 'transform 0.2s ease';
  }, { passive: true });
  
  slider.addEventListener('touchmove', e => {
    if (isAnimating) return;
    
    const currentX = e.changedTouches[0].screenX;
    const diff = currentX - touchStartX;
    
    // Only apply horizontal movement if significant and not vertical scroll
    if (Math.abs(diff) > 20) {
      const moveX = diff * 0.5; // Reduce movement for resistance feel
      slider.style.transform = `translateX(${moveX}px)`;
    }
  }, { passive: true });
  
  slider.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    
    // Reset slider position with animation
    slider.style.transform = '';
    
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance to register as swipe
    const swipeVerticalThreshold = 50; // Vertical threshold to ignore diagonal swipes
    
    const horizontalDistance = touchEndX - touchStartX;
    const verticalDistance = Math.abs(touchEndY - touchStartY);
    
    // Only process horizontal swipes (not vertical scrolling)
    if (verticalDistance < swipeVerticalThreshold) {
      if (horizontalDistance < -swipeThreshold) {
        // Swipe left - next slide
        nextSlide();
      } else if (horizontalDistance > swipeThreshold) {
        // Swipe right - previous slide
        prevSlide();
      }
    }
  }
  
  // Create progress indicator for autoplay
  let progressElement = document.createElement('div');
  progressElement.className = 'slider-progress';
  slider.appendChild(progressElement);
  
  // Update progress indicator
  function updateProgressIndicator(progress) {
    progressElement.style.width = `${progress}%`;
  }
  
  // Reset and start autoplay with progress indicator
  function resetAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
    }
    startAutoplay();
    
    // Reset progress indicator
    updateProgressIndicator(0);
  }
  
  // Start autoplay with progress indicator
  function startAutoplay() {
    let progress = 0;
    const updateInterval = 50; // Update progress every 50ms for smooth animation
    const steps = autoplayDelay / updateInterval;
    let step = 0;
    
    autoplayInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !isAnimating) {
        step++;
        progress = (step / steps) * 100;
        updateProgressIndicator(progress);
        
        if (step >= steps) {
          nextSlide();
          step = 0;
          progress = 0;
        }
      }
    }, updateInterval);
  }
  
  // Pause autoplay when user hovers over slider
  slider.addEventListener('mouseenter', () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      // Pause progress indicator
      progressElement.style.transition = 'none';
    }
  });
  
  // Resume autoplay when user leaves slider
  slider.addEventListener('mouseleave', () => {
    progressElement.style.transition = '';
    startAutoplay();
  });
  
  // Handle visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      startAutoplay();
    } else {
      clearInterval(autoplayInterval);
    }
  });
  
  // Add CSS for progress indicator
  const style = document.createElement('style');
  style.textContent = `
    .slider-progress {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 0;
      background-color: var(--primary-color);
      transition: width 0.1s linear;
      z-index: 2;
    }
    
    @keyframes pulse {
      0% { transform: scale(1.2); }
      50% { transform: scale(1.4); }
      100% { transform: scale(1.2); }
    }
  `;
  document.head.appendChild(style);
  
  // Start autoplay initially
  startAutoplay();
}

/**
 * Spam Protection Functions
 * Enhanced security measures for form submissions
 */

// Rate limiting storage
const rateLimitStorage = {};

/**
 * Check if user has exceeded rate limit for form submissions
 * @param {string} formType - Type of form (e.g., 'contact-form', 'quote-form')
 * @param {number} maxAttempts - Maximum attempts allowed (default: 3)
 * @param {number} timeWindow - Time window in minutes (default: 15)
 * @returns {boolean} - Whether submission is allowed
 */
function checkRateLimit(formType, maxAttempts = 3, timeWindow = 15) {
  const now = Date.now();
  const windowMs = timeWindow * 60 * 1000;
  const userKey = getUserIdentifier();
  const key = `${formType}-${userKey}`;
  
  if (!rateLimitStorage[key]) {
    rateLimitStorage[key] = [];
  }
  
  // Remove old attempts outside the time window
  rateLimitStorage[key] = rateLimitStorage[key].filter(timestamp => 
    now - timestamp < windowMs
  );
  
  // Check if user has exceeded the limit
  if (rateLimitStorage[key].length >= maxAttempts) {
    return false;
  }
  
  // Add current attempt
  rateLimitStorage[key].push(now);
  return true;
}

/**
 * Get a simple user identifier for rate limiting
 * @returns {string} - User identifier
 */
function getUserIdentifier() {
  // Use a combination of user agent and screen resolution as identifier
  const ua = navigator.userAgent.slice(0, 50);
  const screen = `${window.screen.width}x${window.screen.height}`;
  return btoa(ua + screen).slice(0, 20);
}

/**
 * Detect spam content in form messages
 * @param {string} content - Content to check
 * @returns {boolean} - Whether content appears to be spam
 */
function detectSpamContent(content) {
  if (!content || typeof content !== 'string') return false;
  
  const spamPatterns = [
    // Common spam phrases
    /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
    // Excessive links
    /(https?:\/\/[^\s]+.*){3,}/i,
    // Excessive capitalization
    /[A-Z]{10,}/,
    // Excessive repetition
    /(.)\1{5,}/,
    // Common spam words
    /\b(free money|make money fast|click here|act now|limited time)\b/i,
    // Suspicious email patterns
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  ];
  
  return spamPatterns.some(pattern => pattern.test(content));
}

/**
 * Show form error message
 * @param {string} message - Error message to display
 */
function showFormError(message) {
  const formError = document.querySelector('.form-error');
  const formSuccess = document.querySelector('.form-success');
  
  if (formError) {
    formError.textContent = message;
    formError.style.display = 'block';
  }
  
  if (formSuccess) {
    formSuccess.style.display = 'none';
  }
  
  // Hide error message after 8 seconds
  setTimeout(() => {
    if (formError) {
      formError.style.display = 'none';
    }
  }, 8000);
}

/**
 * Validate email domain against known disposable email providers
 * @param {string} email - Email address to validate
 * @returns {boolean} - Whether email domain is suspicious
 */
function isDisposableEmail(email) {
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org',
    'yopmail.com', 'maildrop.cc', 'sharklasers.com'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  return disposableDomains.includes(domain);
}