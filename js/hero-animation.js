/**
 * Hero Animation - Creates smooth background animations for the home page
 * Includes particles, waves, and 3D shapes
 */

class HeroAnimation {
  constructor(options = {}) {
    this.options = Object.assign({
      canvasId: 'heroCanvas',
      particleCount: 100,
      particleColor: 'rgba(74, 108, 247, 0.6)',  // Primary color with transparency
      lineColor: 'rgba(74, 108, 247, 0.2)',      // Primary color with more transparency for lines
      waveColor: 'rgba(74, 108, 247, 0.3)',      // Primary color for waves
      backgroundColor: 'transparent',
      maxSpeed: 0.5,
      particleSize: 3,
      lineWidth: 1,
      connectDistance: 150,
      waveHeight: 50,
      waveSpeed: 0.01,
      responsive: true,
      mouseInteraction: true,
      darkModeSupport: true
    }, options);

    this.canvas = document.getElementById(this.options.canvasId);
    if (!this.canvas) {
      console.warn(`Canvas element with ID '${this.options.canvasId}' not found`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    this.time = 0;
    this.mouse = { x: null, y: null, radius: 100 };
    this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    // Initialize the animation
    this.init();
  }

  init() {
    // Set up canvas size
    this.setupCanvas();

    // Create particles
    this.createParticles();

    // Add event listeners
    this.addEventListeners();

    // Start animation loop
    this.animate();
  }

  setupCanvas() {
    // Make canvas fill its parent container
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // Set canvas size with device pixel ratio for sharp rendering
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  createParticles() {
    this.particles = [];
    const count = this.options.responsive ? 
      Math.min(this.options.particleCount, Math.floor(this.width / 10)) : 
      this.options.particleCount;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * this.options.particleSize + 1,
        speedX: (Math.random() - 0.5) * this.options.maxSpeed,
        speedY: (Math.random() - 0.5) * this.options.maxSpeed,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }

  addEventListeners() {
    // Resize event
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.createParticles();
    });

    // Mouse move event for interaction
    if (this.options.mouseInteraction) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    // Theme change event
    if (this.options.darkModeSupport) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'data-theme') {
            this.isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            this.updateColors();
          }
        });
      });

      observer.observe(document.documentElement, { attributes: true });
    }
  }

  updateColors() {
    if (this.isDarkMode) {
      this.options.particleColor = 'rgba(74, 108, 247, 0.6)';
      this.options.lineColor = 'rgba(74, 108, 247, 0.2)';
      this.options.waveColor = 'rgba(74, 108, 247, 0.3)';
    } else {
      this.options.particleColor = 'rgba(74, 108, 247, 0.6)';
      this.options.lineColor = 'rgba(74, 108, 247, 0.2)';
      this.options.waveColor = 'rgba(74, 108, 247, 0.3)';
    }
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = this.options.particleColor;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.options.connectDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.options.lineColor;
          this.ctx.lineWidth = this.options.lineWidth * (1 - distance / this.options.connectDistance);
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  drawWaves() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height / 2);

    for (let x = 0; x < this.width; x += 10) {
      const y = Math.sin(x * 0.01 + this.time * this.options.waveSpeed) * this.options.waveHeight + this.height / 2;
      this.ctx.lineTo(x, y);
    }

    this.ctx.lineTo(this.width, this.height);
    this.ctx.lineTo(0, this.height);
    this.ctx.closePath();
    this.ctx.fillStyle = this.options.waveColor;
    this.ctx.fill();
  }

  updateParticles() {
    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.width) {
        particle.speedX *= -1;
      }

      if (particle.y < 0 || particle.y > this.height) {
        particle.speedY *= -1;
      }

      // Mouse interaction
      if (this.options.mouseInteraction && this.mouse.x && this.mouse.y) {
        const dx = particle.x - this.mouse.x;
        const dy = particle.y - this.mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.mouse.radius) {
          const angle = Math.atan2(dy, dx);
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.speedX += Math.cos(angle) * force * 0.2;
          particle.speedY += Math.sin(angle) * force * 0.2;
        }
      }

      // Apply some friction to prevent extreme speeds
      particle.speedX *= 0.99;
      particle.speedY *= 0.99;
    });
  }

  animate() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background
    if (this.options.backgroundColor !== 'transparent') {
      this.ctx.fillStyle = this.options.backgroundColor;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Draw waves
    this.drawWaves();

    // Draw particles and connections
    this.drawConnections();
    this.drawParticles();

    // Update particles
    this.updateParticles();

    // Update time
    this.time++;

    // Request next frame
    requestAnimationFrame(this.animate.bind(this));
  }
}

// Initialize the animation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('heroCanvas');
  if (heroCanvas) {
    new HeroAnimation();
  }
});