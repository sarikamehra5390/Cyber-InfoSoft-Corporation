/**
 * Floating Quote Button Functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  initFloatingQuoteButton();
});

function initFloatingQuoteButton() {
  const floatingQuoteBtn = document.querySelector('.floating-quote-btn');
  if (floatingQuoteBtn) {
    // Add scroll visibility
    window.addEventListener('scroll', function() {
      if (window.scrollY > 300) {
        floatingQuoteBtn.classList.add('active');
      } else {
        floatingQuoteBtn.classList.remove('active');
      }
    });
    
    // Add hover effect
    floatingQuoteBtn.addEventListener('mouseenter', function() {
      const svg = this.querySelector('svg');
      if (svg) {
        svg.style.transform = 'rotate(15deg)';
      }
    });
    
    floatingQuoteBtn.addEventListener('mouseleave', function() {
      const svg = this.querySelector('svg');
      if (svg) {
        svg.style.transform = 'rotate(0deg)';
      }
    });
    
    // Trigger scroll event to check initial position
    window.dispatchEvent(new Event('scroll'));
  }
}