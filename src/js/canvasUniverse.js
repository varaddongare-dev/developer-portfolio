/**
 * @file canvasUniverse.js
 * @description Native HTML5 Canvas particle engine & SPA view transitions.
 * * © 2026 Varad. All rights reserved.
 * ----------------------------------------------------------------------------------
 * NOTICE: You are permitted to clone this repository to your local system for testing,
 * learning, or private development. If you duplicate or re-host this project publicly,
 * you are required to modify or remove this copyright header to reflect your own work.
 * ----------------------------------------------------------------------------------
 */

import anime from 'animejs/lib/anime.es.js';

export function initUniverse() {
    const canvas = document.getElementById('universe');
    const ctx = canvas.getContext('2d');
    const scatterBtn = document.getElementById('scatter-btn');
    const landingLayer = document.getElementById('landing-layer');
    const portfolioContent = document.getElementById('portfolio-content');
    const backBtn = document.getElementById('back-btn');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const mouse = { x: null, y: null, radius: 140 };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x; 
            this.baseY = this.y;
            this.size = Math.random() * 2 + 1;
            this.density = (Math.random() * 30) + 12; 
            this.vx = 0;
            this.vy = 0;
            this.color = Math.random() > 0.4 ? '#00ffcc' : '#0077ff';
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        update() {
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.hypot(dx, dy);
                
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    
                    this.vx -= forceDirectionX * force * 6;
                    this.vy -= forceDirectionY * force * 6;
                }
            }

            let dxBase = this.baseX - this.x;
            let dyBase = this.baseY - this.y;
            
            this.vx += dxBase / this.density;
            this.vy += dyBase / this.density;

            this.vx *= 0.82;
            this.vy *= 0.82;

            this.x += this.vx;
            this.y += this.vy;
        }

        scatter() {
            this.vx = (Math.random() - 0.5) * 120;
            this.vy = (Math.random() - 0.5) * 120;
        }
    }

    const particleArray = [];
    const particleCount = 300; 
    for (let i = 0; i < particleCount; i++) {
        particleArray.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].update();
            particleArray[i].draw();
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Explode and Transition to Dashboard Workspace
    scatterBtn.addEventListener('click', () => {
        for (let i = 0; i < particleArray.length; i++) {
            particleArray[i].scatter();
        }

        anime({
            targets: landingLayer,
            opacity: 0,
            scale: 0.95,
            duration: 500,
            easing: 'easeInQuad',
            complete: () => {
                landingLayer.classList.add('hidden');
                portfolioContent.classList.remove('hidden');
                
                setTimeout(() => {
                    portfolioContent.classList.add('active');
                    
                    anime({
                        targets: '.card',
                        translateY: [30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(120),
                        easing: 'easeOutExpo',
                        duration: 800
                    });
                }, 50);
            }
        });
    });

    // Handle Project Redirects when cards are clicked
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const destinationUrl = card.getAttribute('data-url');
            if (destinationUrl) {
                // Smooth window redirection to your project webpage
                window.location.href = destinationUrl;
            }
        });
    });

    // Return back to Landing page smoothly
    backBtn.addEventListener('click', () => {
        portfolioContent.classList.remove('active');
        setTimeout(() => {
            portfolioContent.classList.add('hidden');
            landingLayer.classList.remove('hidden');
            anime({
                targets: landingLayer,
                opacity: 1,
                scale: 1,
                duration: 500,
                easing: 'easeOutQuad'
            });
        }, 500);
    });
}