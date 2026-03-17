const CONFIG = {
  particleDensity: 120,
  particleSpeed: 0.4,
  particleColor: 'rgba(175, 168, 76, 0.7)',
  lineColor: 'rgba(175, 168, 76, 0.7)',
  connectionDistance: 220
};

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.vy = (Math.random() - 0.5) * CONFIG.particleSpeed;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = CONFIG.particleColor;
    this.ctx.fill();
  }
}

class ParticleNetwork {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.init();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  init() {
    this.resize();
    for (let i = 0; i < CONFIG.particleDensity; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  drawLines() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectionDistance) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = CONFIG.lineColor;
          this.ctx.lineWidth = 1 - dist / CONFIG.connectionDistance;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(p => {
      p.update();
      p.draw();
    });
    this.drawLines();
    requestAnimationFrame(() => this.animate());
  }
}

// Lightbox Logic
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img').src;
      lightboxImg.src = imgSrc;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
}

// Contact Form Logic
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    alert('Thank you for your message! (Demo Only)');
    form.reset();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  new ParticleNetwork();
  initLightbox();
  initContactForm();
});
