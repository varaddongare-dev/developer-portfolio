/**
 * Copyright (c) 2026 Varad. All rights reserved.
 * * PERMISSION NOTICE: 
 * You are free to modify, refactor, and edit this document for your personal 
 * learning and coding practice. You are encouraged to upload your customized 
 * versions to GitHub using your own unique design elements and custom layout effects. 
 * * RESTRICTION: 
 * Do not copy, re-use, or duplicate this exact comment block or claim this unmodified 
 * template source code directly as your own work.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // 1. GLOBAL DOM ELEMENT REGISTRY
    // =================================================================
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("main-content");
    const skipBtn = document.getElementById("skip-intro-btn");
    const canvas = document.getElementById("gun-barrel-canvas");
    const preloaderContent = document.querySelector(".preloader-content-wrapper");
    const textElement = document.getElementById("typing-text");

    // Core Layout Audio Hooks
    const audioTrack = document.getElementById("portfolio-audio");
    const audioBtn = document.getElementById("audio-toggle-btn");
    const cdDisc = document.getElementById("cd-disc");
    const statusLight = document.getElementById("cd-status-light");
    const marqueeContainer = document.querySelector(".track-marquee");

    // Navigation and Animation State Rules
    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || !window.location.pathname.includes(".html");
    const introPlayed = sessionStorage.getItem("skyfallIntroPlayed") === "true";

    let lenisEngine = null;
    let audioHasStarted = false;
    let sequenceStarted = false; 
    let horizontalTrackingComplete = false; 
    let autoLoadTriggered = false; 

    // Instantly bypass preloader for inner routes or returning visitors
    if (!isHomePage || introPlayed) {
        bypassPreloaderSequence();
        initializeCoreSiteFeatures();
        return;
    }

    document.body.classList.add("no-scroll");

    // =================================================================
    // 2. CONFIGURING THE PROCEDURAL GEOMETRY DATA
    // =================================================================
    const barrelMetrics = {
        currentX: -150, 
        centerY: window.innerHeight / 2,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.6,
        currentRadius: 80, 
        riflingBlades: 24 
    };

    if (canvas) {
        const ctx = canvas.getContext("2d");
        
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            barrelMetrics.centerY = canvas.height / 2;
            barrelMetrics.maxRadius = Math.max(canvas.width, canvas.height) * 1.6;
        }
        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        // --- SPECTRE SHROUD DRAW ENGINE ---
        function drawSpectreShroud(cX, cY, radius) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();

            // Fill background solid gunmetal gray texture layer
            ctx.fillStyle = "#111215";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw movie rifling grooves fixed stably to the screen center point
            ctx.save();
            ctx.translate(canvas.width * 0.5, canvas.height * 0.5);
            ctx.strokeStyle = "#1a1c22";
            ctx.lineWidth = 3;
            
            for (let i = 0; i < barrelMetrics.riflingBlades; i++) {
                let angle = (i / barrelMetrics.riflingBlades) * Math.PI * 2;
                let startX = Math.cos(angle) * 80;
                let startY = Math.sin(angle) * 80;
                let endX = Math.cos(angle + 0.4) * Math.max(canvas.width, canvas.height);
                let endY = Math.sin(angle + 0.4) * Math.max(canvas.width, canvas.height);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            ctx.restore();

            // Cut the tracking camera view hole through the dark texture overlay
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(cX, cY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Fill the transparent cutout hole with solid white movie lighting
            ctx.globalCompositeOperation = "destination-over";
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "source-over";
        }

        // --- TICK RENDERING CYCLE ---
        function renderGunBarrel() {
            if (sessionStorage.getItem("skyfallIntroPlayed") === "true") {
                return; 
            }

            // STAGE 1: Movie Walk Sequence (Gliding from left edge across)
            if (!horizontalTrackingComplete) {
                let targetCenterX = canvas.width * 0.5;
                barrelMetrics.currentX += (targetCenterX - barrelMetrics.currentX) * 0.045;

                drawSpectreShroud(barrelMetrics.currentX, barrelMetrics.centerY, barrelMetrics.currentRadius);

                if (Math.abs(targetCenterX - barrelMetrics.currentX) < 1.5) {
                    barrelMetrics.currentX = targetCenterX;
                    horizontalTrackingComplete = true;
                }
            } 
            // STAGE 2: Automated Load Triggers (Wake up typewriter when centered)
            else if (horizontalTrackingComplete && !sequenceStarted) {
                drawSpectreShroud(canvas.width * 0.5, barrelMetrics.centerY, barrelMetrics.currentRadius);
                
                if (!autoLoadTriggered) {
                    autoLoadTriggered = true;
                    if (textElement) {
                        runTypewriter();
                    }
                }
            } 
            // STAGE 3: Controlled GSAP Circle Zoom Expansion (Prevents Webpage Drag Locks)
            else if (sequenceStarted) {
                if (!window.circleAnimationTriggered) {
                    window.circleAnimationTriggered = true;

                    gsap.to(barrelMetrics, {
                        currentRadius: barrelMetrics.maxRadius,
                        duration: 3.2,       
                        ease: "power2.inOut", 
                        onUpdate: () => {
                            drawSpectreShroud(canvas.width * 0.5, barrelMetrics.centerY, barrelMetrics.currentRadius);
                            
                            if (barrelMetrics.currentRadius > 90 && preloaderContent) {
                                preloaderContent.style.opacity = Math.max(0, 1 - ((barrelMetrics.currentRadius - 90) / (barrelMetrics.maxRadius * 0.35)));
                            }
                        },
                        onComplete: () => {
                            stripAutoplayListeners();
                            triggerExitSequence();
                        }
                    });
                }
                return; 
            }

            requestAnimationFrame(renderGunBarrel);
        }
        
        requestAnimationFrame(renderGunBarrel);
    }

    // =================================================================
    // 3. DEFENSIVE AUTOPLAY PRIMING MECHANISMS
    // =================================================================
    function forceAudioUnlock() {
        if (audioTrack && !audioHasStarted && sequenceStarted) {
            audioTrack.play().then(() => {
                setPlayerActiveUI();
                audioHasStarted = true;
                stripAutoplayListeners();
            }).catch((err) => {
                console.log("Audio track waiting on manual window interaction.");
            });
        }
    }

    function stripAutoplayListeners() {
        window.removeEventListener("click", forceAudioUnlock);
        window.removeEventListener("keydown", forceAudioUnlock);
        window.removeEventListener("touchstart", forceAudioUnlock);
    }

    window.addEventListener("click", forceAudioUnlock);
    window.addEventListener("keydown", forceAudioUnlock);
    window.addEventListener("touchstart", forceAudioUnlock);

    if (skipBtn) {
        skipBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            triggerExitSequence();
        });
    }

    // =================================================================
    // 4. MAIN INTRO TYPEWRITER INTERCEPT ENGINE
    // =================================================================
    const phraseloop = ["intercepting...", "decrypting...", "online."];
    let loopIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function runTypewriter() {
        if (!textElement) return;
        let currentStr = phraseloop[loopIdx];

        if (isDeleting) {
            textElement.innerHTML = currentStr.substring(0, charIdx - 1);
            charIdx--;
        } else {
            textElement.innerHTML = currentStr.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 25 : 50;

        if (!isDeleting && charIdx === currentStr.length) {
            if (loopIdx === phraseloop.length - 1) {
                setTimeout(() => {
                    sequenceStarted = true;
                    if (audioTrack && audioTrack.paused && !audioHasStarted) {
                        audioTrack.play().then(() => {
                            setPlayerActiveUI();
                            audioHasStarted = true;
                        }).catch(() => {});
                    }
                }, 1000);
                return;
            }
            typeSpeed = 800; 
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            loopIdx++;
            typeSpeed = 150;
        }
        setTimeout(runTypewriter, typeSpeed);
    }

    // =================================================================
    // 5. TIMED COORDINATED PAGE INCOMING REVEAL
    // =================================================================
    function triggerExitSequence() {
        sessionStorage.setItem("skyfallIntroPlayed", "true");
        document.body.classList.remove("no-scroll");

        if (skipBtn) skipBtn.remove();

        const masterTimeline = gsap.timeline({
            onComplete: () => {
                if (preloader) preloader.remove();
                initializeCoreSiteFeatures();
            }
        });

        masterTimeline.to(preloader, { opacity: 0, duration: 0.6, ease: "power2.out" });
        masterTimeline.to(mainContent, {
            onStart: () => {
                if (mainContent) mainContent.style.display = "block";
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power3.out"
        }, "-=0.3");

        // EXPLICIT FIXED VALUE MAPS: Enforces absolute layout paint matrices during entrance sweeps
        masterTimeline.to(".reveal-title", { 
            translateY: "0%", 
            color: "#ffffff", 
            duration: 1.2, 
            ease: "power4.out", 
            stagger: 0.14 
        }, "-=0.9");

        // DEFENSIVE CHECK: Prevents crash loops by only executing if a secondary target line mask exists
        const goldLineTarget = document.querySelector(".hero-section .line-mask:nth-child(2) .reveal-title");
        if (goldLineTarget) {
            masterTimeline.to(goldLineTarget, {
                color: "#dfb76c",
                duration: 0.1
            }, "-=0.2");
        }
    }

    function bypassPreloaderSequence() {
        if (preloader) preloader.remove();
        if (skipBtn) skipBtn.remove();
        document.body.classList.remove("no-scroll");
        
        if (mainContent) {
            mainContent.style.display = "block";
            mainContent.style.opacity = "1";
            mainContent.style.transform = "none";
        }
    }

    // =================================================================
    // 6. CORE ENGINE SITE REVEALS & DRIVERS
    // =================================================================
    function initializeCoreSiteFeatures() {
        initScrollAnimationTriggers();
        initLenisScrollEngine();
        initIsolatedAudioTrack();

        setTimeout(() => {
            initProjectAccordionEngine();
        }, 100);

        initRadarTelemetryTypewriter();
    }

    function initLenisScrollEngine() {
        lenisEngine = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true
        });

        function raf(time) {
            if (lenisEngine) {
                lenisEngine.raf(time);
                requestAnimationFrame(raf);
            }
        }
        requestAnimationFrame(raf);
    }

    function initScrollAnimationTriggers() {
        gsap.registerPlugin(ScrollTrigger);

        const fadeTargets = document.querySelectorAll('.target-fade');
        if (fadeTargets.length > 0) {
            fadeTargets.forEach(target => {
                gsap.from(target, {
                    scrollTrigger: { trigger: target, start: "top 85%", toggleActions: "play none none none" },
                    opacity: 0, y: 30, duration: 1, ease: "power2.out"
                });
            });
        }

        // CONTROL REGISTRY BACKUP: Re-enforces baseline branding colors securely upon viewport initialization
        if (document.querySelector(".reveal-title")) {
            gsap.to(".reveal-title", { translateY: "0%", color: "#ffffff", duration: 1.0, ease: "power4.out", stagger: 0.1 });
            
            // DEFENSIVE CHECK: Shield rule protecting sub-route initialization sweeps from throwing null warnings
            const goldLineBackup = document.querySelector(".hero-section .line-mask:nth-child(2) .reveal-title");
            if (goldLineBackup) {
                gsap.to(goldLineBackup, { color: "#dfb76c", duration: 0.1 });
            }
        }
    }

    function initProjectAccordionEngine() {
        const accordionItems = document.querySelectorAll(".accordion-item");
        if (accordionItems.length === 0) return;

        gsap.from(".accordion-item", {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".interactive-accordion-grid",
                start: "top 85%"
            }
        });

        accordionItems.forEach(item => {
            const trigger = item.querySelector(".accordion-trigger");
            const content = item.querySelector(".accordion-content");
            const redirectBtn = item.querySelector(".git-redirect-btn");

            if (redirectBtn) {
                redirectBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); 
                });
            }

            if (trigger && content) {
                const freshTrigger = trigger.cloneNode(true);
                trigger.parentNode.replaceChild(freshTrigger, trigger);

                freshTrigger.addEventListener("click", (e) => {
                    e.preventDefault();
                    const isExpanded = item.classList.contains("is-expanded");

                    accordionItems.forEach(otherItem => {
                        if (otherItem !== item && otherItem.classList.contains("is-expanded")) {
                            otherItem.classList.remove("is-expanded");
                            gsap.to(otherItem.querySelector(".accordion-content"), {
                                height: 0,
                                duration: 0.4,
                                ease: "power3.inOut"
                            });
                        }
                    });

                    if (isExpanded) {
                        item.classList.remove("is-expanded");
                        gsap.to(content, {
                            height: 0,
                            duration: 0.4,
                            ease: "power3.inOut",
                            onComplete: () => {
                                if (lenisEngine) lenisEngine.resize();
                            }
                        });
                    } else {
                        item.classList.add("is-expanded");
                        gsap.set(content, { height: "auto" });
                        const targetHeight = content.offsetHeight;
                        gsap.set(content, { height: 0 });

                        gsap.to(content, {
                            height: targetHeight,
                            duration: 0.5,
                            ease: "power3.out",
                            onComplete: () => {
                                if (lenisEngine) lenisEngine.resize();
                            }
                        });
                    }
                });
            }
        });
    }

    // =================================================================
    // 7. RADAR SUB-MODULE CONSOLE LOGGER
    // =================================================================
    function initRadarTelemetryTypewriter() {
        const radarTarget = document.getElementById("radar-typewriter");
        if (!radarTarget) return;

        const radarPhrases = ["intercepting coordinates...", "tracking payload repositories...", "active targets locked."];
        let phraseIdx = 0;
        let letterIdx = 0;
        let isClearing = false;

        function runRadarTypewriter() {
            let activePhrase = radarPhrases[phraseIdx];

            if (isClearing) {
                radarTarget.innerHTML = activePhrase.substring(0, letterIdx - 1);
                letterIdx--;
            } else {
                radarTarget.innerHTML = activePhrase.substring(0, letterIdx + 1);
                letterIdx++;
            }

            let deltaSpeed = isClearing ? 20 : 45;

            if (!isClearing && letterIdx === activePhrase.length) {
                deltaSpeed = 1500; 
                isClearing = true;
            } else if (isClearing && letterIdx === 0) {
                isClearing = false;
                phraseIdx = (phraseIdx + 1) % radarPhrases.length;
                deltaSpeed = 200;
            }
            setTimeout(runRadarTypewriter, deltaSpeed);
        }
        setTimeout(runRadarTypewriter, 600);
    }

    // =================================================================
    // 8. TAPE PLAYER DECK UI CONFIGURATORS
    // =================================================================
    function setPlayerActiveUI() {
        if(audioBtn && cdDisc && statusLight && marqueeContainer) {
            audioBtn.innerText = "// FEED ACTIVE";
            audioBtn.style.color = "#dfb76c";
            cdDisc.classList.add("spinning");
            statusLight.classList.add("active");
            marqueeContainer.classList.add("scrolling");
        }
    }

    function setPlayerPassiveUI() {
        if(audioBtn && cdDisc && statusLight && marqueeContainer) {
            audioBtn.innerText = "// PLAY INTERCEPT";
            audioBtn.style.color = "#5a5d64";
            cdDisc.classList.remove("spinning");
            statusLight.classList.remove("active");
            marqueeContainer.classList.remove("scrolling");
        }
    }

    function initIsolatedAudioTrack() {
        if (audioTrack && audioBtn && cdDisc && statusLight && marqueeContainer) {
            localStorage.removeItem("portfolio-audio-playing");
            localStorage.removeItem("portfolio-audio-time");

            audioTrack.volume = 0.35;

            if (!audioTrack.paused) {
                setPlayerActiveUI();
            } else {
                setPlayerPassiveUI();
            }

            audioBtn.addEventListener("click", (e) => {
                e.stopPropagation(); 
                if (audioTrack.paused) {
                    audioTrack.play().then(() => {
                        setPlayerActiveUI();
                    }).catch(err => console.log("Main system track activation deferred."));
                } else {
                    audioTrack.pause();
                    setPlayerPassiveUI();
                }
            });
        }
    }
});