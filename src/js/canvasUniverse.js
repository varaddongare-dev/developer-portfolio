/**
 * @file canvasUniverse.js
 * @description Advanced 3D WebGL Particle Engine using Three.js & Anime.js
 * © 2026 varaddongare-dev. All rights reserved.
 * --------------------------------------------------------------------------------
 * NOTICE: You are permitted to clone this repository to your local system for
 * learning, private development. If you duplicate or re-host this project publicly,
 * you are required to modify or remove this copyright header to reflect your own work.
 * ----------------------------------------------------------------------------------
 */
import * as THREE from 'three'
import anime from 'animejs/lib/anime.es.js';

export function initUniverse() {
    const canvas = document.getElementById('universe');
    const scatterBtn = document.getElementById('scatter-btn');
    const landingLayer = document.getElementById('landing-layer');
    const portfolioContent = document.getElementById('portfolio-content');
    const backBtn = document.getElementById('back-btn');

    // ======================================================================
    // 1. Three.js 3D Scene Initialization
    // ======================================================================
    const scene = new THREE.Scene();

    // Setup a Perspective Camera (Field of View, Aspect Ratioo, Near/Far clipping)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    //Build the WebGL Renderer using your existing DOM canvas
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true , antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ==========================================================================
    // 2. Generate 3D Particle Geometry
    // ==========================================================================
    const particleCount = 1200; 
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3); 
    const originalPositions = new Float32Array(particleCount * 3); 
    const colors = new Float32Array(particleCount * 3); // <--- This must be defined here

    const colorChoices = [new THREE.Color('#00ffcc'), new THREE.Color('#0077ff')];

    for (let i = 0; i < particleCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.5; 

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);

        positions[i] = x;
        positions[i + 1] = y;
        positions[i + 2] = z;

        originalPositions[i] = x;
        originalPositions[i + 1] = y;
        originalPositions[i + 2] = z;

        // Assign colors cleanly into our array
        const chosenColor = colorChoices[Math.random() > 0.4 ? 0 : 1];
        colors[i] = chosenColor.r;
        colors[i + 1] = chosenColor.g;
        colors[i + 2] = chosenColor.b;
    }

    // Bind arrays directly into the WebGL memory buffers
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3)); 

    //Create a physical glowing 3D particle shader material
    const material = new THREE.PointsMaterial({
        size: 0.025,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // Makes overlapping particles look bright/neon
        depthWrite: false
    })
    // Compile into an editable 3D Point Mesh and insert it into the active scene
     const particleMesh = new THREE.Points(geometry, material);
     scene.add(particleMesh);

     // ===================================================================
     // 3. User Interaction Tracking Logic
     // ===================================================================
     let mouseX = 0, mouseY = 0;
     let targetX = 0, targetY = 0;

     window.addEventListener('mousemove', (event) => {
        //Map cursor coordinates between -1 and 1 for 3D orientation normalization
        mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });
    // Handle viewport dimension uodates gracefully
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ==========================================================================
    // 4. Core Render Engine Loop
    // ==========================================================================

    let isExploded = false;

    function renderLoop() {
        requestAnimationFrame(renderLoop);

        // Ambient automatic rotation
        if (!isExploded) {
            particleMesh.rotation.y += 0.0015;
            particleMesh.rotation.x += 0.0005;
        }
        // Apply smooth fluid parallax tracking based on normalization targets
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        particleMesh.rotation.y += targetX * 0.01;
        particleMesh.rotation.x += targetY * 0.01;

        renderer.render(scene, camera);
    }
    renderLoop();

    // ==========================================================================
    // 5. Cinematic 3D Explosion Transition Engine
    // ==========================================================================
    scatterBtn.addEventListener('click', () => {
        isExploded = true;
        const posAttribute = particleMesh.geometry.attributes.position;

        // Use Anime.js to morph all 3D particle positions outward aggressively
        anime({
            targets: posAttribute.array,
            update: () => {
                posAttribute.needsUpdate = true; // Tell WebGL to re-render changes live
            },
            easing: 'easeOutExpo',
            duration: 1200,
            // Run a mathematical scatter algorithm through the array positions
            ...Array.from({ length: particleCount * 3 }).reduce((acc, _, index) => {
                acc[index] = originalPositions[index] * (Math.random() * 12 + 4);
                return acc;
            }, {})
        });

        // Dissolve text overlays cleanly alongside explosion parameters
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
    //Handle Return Link Back-Animations
    backBtn.addEventListener('click', () => {
        portfolioContent.classList.remove('active');

        setTimeout(() =>{
            portfolioContent.classList.add('hidden');
            landingLayer.classList.remove('hidden');

            const posAttribute = particleMesh.geometry.attributes.position
            isExploded = false;

            //Smoothly animate particles back to their original spherical coordinates
            anime({
                targets: posAttribute.array,
                update: () => { posAttribute.needsUpdate = true; },
                easing: 'easeOutElastic(1, 0.7)',
                duration: 1500,
                ...originalPositions
            });
            anime({
                targets: landingLayer,
                opacity: 1,
                scale: 1,
                duration: 500,
                easing: 'easeOutQuad'
            });
        }, 500);
    });
   // ==========================================================================
    // 6. Full-Screen Card Expansion Redirect System
    // ==========================================================================
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const destinationUrl = card.getAttribute('data-url');
            if (!destinationUrl) return;

            // 1. Block all alternate pointer events immediately
            document.body.classList.add('no-pointer-events');
            
            // 2. Capture layout screen position vectors
            const rect = card.getBoundingClientRect();

            // 3. Force-inject explicit sizing styles onto the active card template
            card.style.position = 'fixed';
            card.style.top = rect.top + 'px';
            card.style.left = rect.left + 'px';
            card.style.width = rect.width + 'px';
            card.style.height = rect.height + 'px';
            
            card.classList.add('expanding');

            // 4. Stagger animate unselected layout cards out of view
            anime({
                targets: Array.from(document.querySelectorAll('.card')).filter(c => c !== card),
                translateY: 50,
                opacity: 0,
                duration: 400,
                easing: 'easeInQuad'
            });

            // 5. Fade out header structural components
            anime({
                targets: '.dash-header',
                opacity: 0,
                duration: 300,
                easing: 'linear'
            });

            // 6. Expand background point particles away safely
            anime({
                targets: material,
                size: 0.1,
                opacity: 0,
                duration: 600,
                easing: 'easeInQuad'
            });

            // 7. Scale selected bento element up to fill screen width/height vectors
            anime({
                targets: card,
                top: '0px',
                left: '0px',
                width: window.innerWidth + 'px',
                height: window.innerHeight + 'px',
                borderRadius: '0px',
                padding: '10%', 
                duration: 600,
                delay: 100, 
                easing: 'easeInOutExpo',
                complete: () => {
                    // 8. Execute redirect to target destination repository
                    window.location.href = destinationUrl;
                }
            });
        });
    });
}
