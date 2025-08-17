/**
 * Particles.js - A lightweight JavaScript library for creating particles
 */

class ParticlesAnimation {
  constructor(options) {
    this.options = Object.assign({
      selector: '.particles-js',
      particleCount: 80,
      connectParticles: true,
      color: '#4361ee',
      connectColor: '#4895ef',
      minSize: 1,
      maxSize: 3,
      speed: 1,
      interactivity: false,
      hoverEffect: false,
      pulseEffect: false,
      responsive: [
        {
          breakpoint: 768,
          options: {
            particleCount: 40
          }
        },
        {
          breakpoint: 480,
          options: {
            particleCount: 20
          }
        }
      ]
    }, options);

    // Initialize mouse position for interactivity
    this.mouse = {
      x: null,
      y: null,
      radius: 100
    };
    
    this.init();
  }

  init() {
    // Get the container element
    this.container = document.querySelector(this.options.selector);
    if (!this.container) {
      console.warn(`Particles container '${this.options.selector}' not found`);
      return;
    }
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
    
    // Set canvas size
    this.setCanvasSize();
    
    // Create particles
    this.particles = [];
    this.createParticles();
    
    // Add event listeners
    window.addEventListener('resize', this.setCanvasSize.bind(this));
    
    if (this.options.interactivity) {
      this.container.addEventListener('mousemove', (e) => {
        this.updateMousePosition(e.offsetX, e.offsetY);
      });
      
      this.container.addEventListener('mouseleave', () => {
        this.updateMousePosition(null, null);
      });
    }
    
    // Start animation loop
    this.animate();
  }
  
  setCanvasSize() {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
  }
  
  createParticles() {
    // Clear existing particles
    this.particles = [];
    
    // Create new particles
    const count = this.getResponsiveValue('particleCount');
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
      
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: size,
        color: this.options.color,
        speedX: Math.random() * this.options.speed * 2 - this.options.speed,
        speedY: Math.random() * this.options.speed * 2 - this.options.speed,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
  }
  
  getResponsiveValue(property) {
    // Default to the base option
    let value = this.options[property];
    
    // Check responsive breakpoints
    if (this.options.responsive) {
      // Sort breakpoints from largest to smallest
      const breakpoints = [...this.options.responsive].sort((a, b) => b.breakpoint - a.breakpoint);
      
      // Find the first breakpoint that matches
      for (const bp of breakpoints) {
        if (window.innerWidth <= bp.breakpoint && bp.options[property] !== undefined) {
          value = bp.options[property];
          break;
        }
      }
    }
    
    return value;
  }
  
  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.updateParticles();
    this.drawParticles();
    
    // Connect particles if enabled
    if (this.options.connectParticles) {
      this.connectParticles();
    }
    
    // Continue animation loop
    requestAnimationFrame(this.animate.bind(this));
  }
  
  updateParticles() {
    for (const particle of this.particles) {
      // Move particles
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x > this.canvas.width) {
        particle.x = 0;
      } else if (particle.x < 0) {
        particle.x = this.canvas.width;
      }
      
      if (particle.y > this.canvas.height) {
        particle.y = 0;
      } else if (particle.y < 0) {
        particle.y = this.canvas.height;
      }
      
      // Interactivity with mouse
      if (this.options.interactivity && this.mouse.x !== null) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          // Move particles away from mouse
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
        }
      }
    }
  }
  
  drawParticles() {
    for (const particle of this.particles) {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }
  }
  
  connectParticles() {
    const maxDistance = 150;
    
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle1 = this.particles[i];
        const particle2 = this.particles[j];
        
        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          // Calculate opacity based on distance
          const opacity = 1 - (distance / maxDistance);
          
          // Create gradient
          const gradient = this.ctx.createLinearGradient(
            particle1.x, particle1.y, particle2.x, particle2.y
          );
          
          const rgb = this.hexToRgb(this.options.connectColor);
          gradient.addColorStop(0, `rgba(${rgb}, ${opacity})`);
          gradient.addColorStop(1, `rgba(${rgb}, ${opacity})`);
          
          // Draw line
          this.ctx.beginPath();
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(particle1.x, particle1.y);
          this.ctx.lineTo(particle2.x, particle2.y);
          this.ctx.stroke();
        }
      }
    }
  }

  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return `${r}, ${g}, ${b}`;
  }
  
  // Method to update mouse position for interactivity
  updateMousePosition(x, y) {
    this.mouse.x = x;
    this.mouse.y = y;
  }
}

// Create global particlesJS function for compatibility
window.particlesJS = function(selector, options) {
  return new ParticlesAnimation({
    selector: selector,
    ...options
  });
};

// Export for use in other files
window.ParticlesAnimation = ParticlesAnimation;