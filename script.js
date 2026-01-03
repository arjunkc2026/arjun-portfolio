// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

// Smoke trail particles
const smokeParticles = [];
const maxSmokeParticles = 15;

class SmokeParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 20 + 10;
        this.life = 1;
        this.decay = 0.02;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        this.element = document.createElement('div');
        this.element.className = 'smoke-particle';
        this.element.style.cssText = `
            position: fixed;
            width: ${this.size}px;
            height: ${this.size}px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(100, 255, 218, 0.4), transparent);
            pointer-events: none;
            z-index: 9998;
            filter: blur(8px);
            left: ${this.x}px;
            top: ${this.y}px;
            transform: translate(-50%, -50%);
        `;
        document.body.appendChild(this.element);
    }
    
    update() {
        this.life -= this.decay;
        this.x += this.vx;
        this.y += this.vy;
        this.size += 0.5;
        
        this.element.style.left = this.x + 'px';
        this.element.style.top = this.y + 'px';
        this.element.style.width = this.size + 'px';
        this.element.style.height = this.size + 'px';
        this.element.style.opacity = this.life;
        
        if (this.life <= 0) {
            this.element.remove();
            return false;
        }
        return true;
    }
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    
    // Create smoke particle
    if (Math.random() > 0.7) {
        smokeParticles.push(new SmokeParticle(mouseX, mouseY));
        if (smokeParticles.length > maxSmokeParticles) {
            const removed = smokeParticles.shift();
            if (removed && removed.element) removed.element.remove();
        }
    }
});

function animateFollower() {
    const distX = mouseX - followerX;
    const distY = mouseY - followerY;
    
    followerX += distX * 0.15;
    followerY += distY * 0.15;
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    // Update smoke particles
    for (let i = smokeParticles.length - 1; i >= 0; i--) {
        if (!smokeParticles[i].update()) {
            smokeParticles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(animateFollower);
}

animateFollower();

// Cursor hover effects
document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ==================== NAVIGATION ====================
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Hamburger menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Smooth scroll and active link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== PARTICLE CANVAS ====================
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    
    draw() {
        ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.strokeStyle = `rgba(100, 255, 218, ${0.1 * (1 - distance / 120)})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ==================== TYPING EFFECT ====================
const typedText = document.querySelector('.typed-text');
const texts = [
    'const role = "Full-Stack Developer"',
    'const position = "CTO at Prodizy Tech"',
    'const passion = "Building Scalable Solutions"',
    'const expertise = "React + Node.js + Cloud"',
    'const mission = "Innovating the Future"'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typedText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }
    
    let typeSpeed = isDeleting ? 30 : 80;
    
    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }
    
    setTimeout(typeText, typeSpeed);
}

// Start typing effect after a small delay
setTimeout(() => {
    typeText();
}, 500);

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars
            if (entry.target.classList.contains('skill-category')) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                skillBars.forEach(bar => {
                    const progress = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                        bar.classList.add('animate');
                    }, 200);
                });
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.about-text, .about-visual, .skill-category, .timeline-item').forEach(el => {
    observer.observe(el);
});

// ==================== SECTION SCROLL ANIMATIONS ====================
const sectionObserverOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, sectionObserverOptions);

// Observe all sections except home
document.querySelectorAll('section:not(#home)').forEach(section => {
    sectionObserver.observe(section);
});

// ==================== PROJECT FILTERING ====================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            card.classList.remove('show', 'hide');
            
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                setTimeout(() => {
                    card.classList.add('show');
                }, 10);
            } else {
                card.classList.add('hide');
            }
        });
    });
});

// Show all projects initially
setTimeout(() => {
    projectCards.forEach(card => {
        card.classList.add('show');
    });
}, 100);

// ==================== FORM SUBMISSION ====================
const contactForm = document.querySelector('.contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(contactForm);
    
    // Show success message (you can replace this with actual form submission logic)
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ==================== PARALLAX EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-shapes');
    
    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ==================== PAGE LOAD ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ==================== STATS COUNTER ANIMATION ====================
const factNumbers = document.querySelectorAll('.fact-number');

const countUp = (element) => {
    const target = parseInt(element.textContent);
    const increment = target / 50;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            countUp(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

factNumbers.forEach(number => {
    statsObserver.observe(number);
});

// ==================== CONSOLE MESSAGE ====================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold; color: #64ffda;');
console.log('%cLooking for something? Feel free to reach out!', 'font-size: 14px; color: #a8b2d1;');
console.log('%c📧 arjun@prodizytech.com', 'font-size: 14px; color: #64ffda;');

// ==================== EASTER EGG ====================
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);