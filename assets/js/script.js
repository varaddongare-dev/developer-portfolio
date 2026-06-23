/**
 * Copyright (c) 2026 Varad. All rights reserved.
 * LICENSE: MIT
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // =================================================================
    // 1. GLOBAL DOM ELEMENT REGISTRY & EXISTENCE GUARDS
    // =================================================================
    const preloader = document.getElementById("preloader");
    const mainContent = document.getElementById("main-content");
    const skipBtn = document.getElementById("skip-intro-btn");
    const videoPlayer = document.getElementById("intro-video");
    const preloaderContent = document.querySelector(".preloader-content-wrapper");
    const textElement = document.getElementById("typing-text");
    const bootWall = document.getElementById("system-boot-wall");

    // Core Layout Audio Widgets
    const audioTrack = document.getElementById("portfolio-audio");
    const audioBtn = document.getElementById("audio-toggle-btn");
    const cdDisc = document.getElementById("cd-disc");
    const statusLight = document.getElementById("cd-status-light");
    const marqueeContainer = document.querySelector(".track-marquee");

    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || !window.location.pathname.includes(".html");
    const introPlayed = sessionStorage.getItem("mi6IntroPlayed") === "true";

    let lenisEngine = null;
    let autoLoadTriggered = false; 
    let systemUnlocked = false; 
    let videoTimelineFinished = false; 
    let globalDustAnimationId = null; 

    const isMobileDevice = window.innerWidth <= 768;

    // 🟢 STRUCTURAL GUARD: If not on Home OR if preloader elements are missing, bypass introduction timelines instantly
    if (!isHomePage || introPlayed || !preloader || !videoPlayer) {
        bypassPreloaderSequence();
        initializeCoreSiteFeatures();
        return;
    }

    document.body.classList.add("no-scroll");

    // =================================================================
    // 2. MI6 SURVEILLANCE TIMELINE & HARDWARE UNMUTED SOUND ENGINE
    // =================================================================
    function initializeSystemUplink(e) {
        if (systemUnlocked) return;
        if (e.type === "keydown" && e.key !== " " && e.key !== "Enter") return;
        
        systemUnlocked = true;

        if (bootWall) {
            gsap.to(bootWall, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => bootWall.remove()
            });
        }

        if (videoPlayer) {
            videoPlayer.style.display = "block";
            videoPlayer.currentTime = 0;
            videoPlayer.muted = true; 
            
            videoPlayer.play().then(() => {
                console.log("Visual pipeline active. Executing hardware audio unblock...");
                videoPlayer.muted = false;
                videoPlayer.volume = 0.85; 
                
                setTimeout(() => {
                    if (!autoLoadTriggered) {
                        autoLoadTriggered = true;
                        runTypewriter();
                    }
                }, 2200);
            }).catch(error => {
                console.log("Hardware media pipeline stalled, routing automatic grid release:", error);
                triggerExitSequence(); 
            });

            videoPlayer.onended = () => {
                videoTimelineFinished = true;
                
                const postPrompt = document.getElementById("post-video-prompt");
                if (postPrompt) {
                    postPrompt.style.display = "block";
                }
                
                if (audioTrack) {
                    audioTrack.muted = false;
                    audioTrack.volume = 0.40; 
                    audioTrack.currentTime = 0;
                    audioTrack.play().then(() => {
                        setPlayerActiveUI();
                        localStorage.setItem("portfolio-audio-active", "true");
                    }).catch(() => {});
                }
                
                window.addEventListener("keydown", finalizeGateAccess);
                window.addEventListener("click", finalizeGateAccess);
                window.addEventListener("touchstart", finalizeGateAccess, { passive: true });
            };
        } else {
            triggerExitSequence();
        }
    }

    function finalizeGateAccess(e) {
        if (!videoTimelineFinished) return;
        if (e.type === "keydown" && e.key !== "Enter") return;

        window.removeEventListener("keydown", finalizeGateAccess);
        window.removeEventListener("click", finalizeGateAccess);
        window.removeEventListener("touchstart", finalizeGateAccess);

        const postPrompt = document.getElementById("post-video-prompt");
        if (postPrompt) postPrompt.remove();

        triggerExitSequence();
    }

    window.addEventListener("keydown", initializeSystemUplink);
    window.addEventListener("click", initializeSystemUplink);
    window.addEventListener("touchstart", initializeSystemUplink, { passive: true });

    if (skipBtn) {
        skipBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            triggerExitSequence();
        });
    }

    // =================================================================
    // 3. MI6 INTELLIGENCE CLASSIFIED TYPEWRITER EXTENSION
    // =================================================================
    const phraseloop = ["authenticating agent 007...", "licence to kill verified.", "access granted."];
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
            if (loopIdx === phraseloop.length - 1) return; 
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
    // 4. COORDINATED PAGE INCOMING REVEAL OVERLAY
    // =================================================================
    function triggerExitSequence() {
        sessionStorage.setItem("mi6IntroPlayed", "true");
        document.body.classList.remove("no-scroll");
        if (skipBtn) skipBtn.remove();

        if (preloaderContent) preloaderContent.classList.add("shattered-glitch");

        const masterTimeline = gsap.timeline({
            onComplete: () => {
                if (preloader) preloader.remove();
                initializeCoreSiteFeatures();
            }
        });

        if (preloader) {
            masterTimeline.to(preloader, { opacity: 0, duration: 0.5, ease: "power2.out" }, "+=0.3");
        }
        
        masterTimeline.to(mainContent, {
            onStart: () => { if (mainContent) mainContent.style.display = "block"; },
            opacity: 1, y: 0, duration: 1.0, ease: "power3.out"
        }, "-=0.2");

        masterTimeline.to(".reveal-title", { translateY: "0%", color: "#ffffff", duration: 1.0, ease: "power4.out", stagger: 0.12 }, "-=0.7");
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
        const hiddenTitles = document.querySelectorAll(".reveal-title");
        hiddenTitles.forEach(title => {
            title.style.transform = "translateY(0%)";
            title.style.transition = "none"; // Bypasses active animation delays on direct page loads
        });
    }

    // =================================================================
    // 5. CORE SITE FEATURES & SCROLL ENGINES
    // =================================================================
    function initializeCoreSiteFeatures() {
        initScrollAnimationTriggers();
        initLenisScrollEngine();
        initIsolatedAudioTrack();
        initProjectAccordionEngine(); 
        initRadarTelemetryTypewriter();
    }

    function initLenisScrollEngine() {
        if (isMobileDevice) return; 

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
    }

    function initProjectAccordionEngine() {
        const accordionItems = document.querySelectorAll(".accordion-item");
        if (accordionItems.length === 0) return;

        const accordionGrid = document.querySelector(".interactive-accordion-grid");
        
        gsap.from(".accordion-item", {
            opacity: 0,
            y: 40,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: accordionGrid ? {
                trigger: ".interactive-accordion-grid",
                start: "top 85%"
            } : undefined
        });

        accordionItems.forEach(item => {
            const trigger = item.querySelector(".accordion-trigger");
            const content = item.querySelector(".accordion-content");
            const redirectBtn = item.querySelector(".git-redirect-btn");

            if (redirectBtn) {
                redirectBtn.addEventListener("click", (e) => { e.stopPropagation(); });
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
                            onComplete: () => { if (lenisEngine) lenisEngine.resize(); }
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
                            onComplete: () => { if (lenisEngine) lenisEngine.resize(); }
                        });
                    }
                });
            }
        });
    }

    function initRadarTelemetryTypewriter() {
        const radarTarget = document.getElementById("radar-typewriter");
        if (!radarTarget) return;

        const radarPhrases = ["scanning mainframe database...", "mapping active tactical registers...", "007 biometric feed secure."];
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

    function setPlayerActiveUI() {
        if(audioBtn && cdDisc && statusLight && marqueeContainer) {
            audioBtn.innerText = "// BLOCK ACTIVE";
            audioBtn.style.color = "#ffcc00"; 
            cdDisc.classList.add("spinning");
            statusLight.classList.add("active");
            marqueeContainer.classList.add("scrolling");
        }
    }

    function setPlayerPassiveUI() {
        if(audioBtn && cdDisc && statusLight && marqueeContainer) {
            audioBtn.innerText = "// ENGAGE SCORE";
            audioBtn.style.color = "#ffffff";
            cdDisc.classList.remove("spinning");
            statusLight.classList.remove("active");
            marqueeContainer.classList.remove("scrolling");
        }
    }

    function initIsolatedAudioTrack() {
        if (audioTrack && audioBtn && cdDisc && statusLight && marqueeContainer) {
            audioTrack.volume = 0.35;

            const shouldBePlaying = localStorage.getItem("portfolio-audio-active") === "true";

            if (shouldBePlaying) {
                audioTrack.play().then(() => {
                    setPlayerActiveUI();
                }).catch(() => {
                    setPlayerPassiveUI();
                });
            } else {
                setPlayerPassiveUI();
            }

            audioBtn.addEventListener("click", (e) => {
                e.stopPropagation(); 
                
                if (audioTrack.paused) {
                    audioTrack.play().then(() => {
                        setPlayerActiveUI();
                        localStorage.setItem("portfolio-audio-active", "true");
                    }).catch(() => {});
                } else {
                    audioTrack.pause();
                    setPlayerPassiveUI();
                    localStorage.setItem("portfolio-audio-active", "false");
                }
            });
        }
    }

    // =================================================================
    // 6. PAUSE INTERFACE: HARDWARE-SAFE GOLD DUST CANVAS ENGINE
    // =================================================================
    function initPauseAmbientParticles() {
        const canvas = document.getElementById("pause-ambient-particles");
        if (!canvas) return;

        if (window.ambientDustEngineRunning) return;
        window.ambientDustEngineRunning = true;

        const ctx = canvas.getContext("2d");
        let particlesArray = [];
        
        const throttlingCap = isMobileDevice ? 20 : 45;
        const sizeBound = isMobileDevice ? 1.5 : 2.5;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }
            reset() {
                const horizontalMargin = isMobileDevice ? canvas.width * 0.70 : canvas.width * 0.45;
                this.x = Math.random() * horizontalMargin;
                this.y = canvas.height + Math.random() * 20;
                this.size = Math.random() * sizeBound + 0.5;
                this.speedX = Math.random() * 0.2 - 0.1;
                this.speedY = -(Math.random() * 0.4 + 0.15);

                const colorRoll = Math.random();
                if (colorRoll > 0.6) {
                    this.color = "rgba(255, 204, 0, " + (Math.random() * 0.35 + 0.1) + ")";
                } else if (colorRoll > 0.2) {
                    this.color = "rgba(200, 160, 40, " + (Math.random() * 0.25 + 0.1) + ")";
                } else {
                    this.color = "rgba(255, 255, 255, " + (Math.random() * 0.4 + 0.1) + ")";
                }
                this.alphaGrowth = Math.random() * 0.008 + 0.003;
                this.opacity = 0;
                this.maxOpacity = Math.random() * 0.45 + 0.1;
                this.shimmer = Math.random() > 0.5;
            } 
            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.opacity < this.maxOpacity) {
                    this.opacity += this.alphaGrowth;
                }
                if (this.shimmer && !isMobileDevice) {
                    this.opacity += (Math.random() * 0.06 - 0.03);
                    if (this.opacity < 0.05) this.opacity = 0.05;
                    if (this.opacity > this.maxOpacity) this.opacity = this.maxOpacity;
                }
                if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
            }
            draw(){
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.restore();
            }
        }
        
        function init(){
            particlesArray = [];
            for (let i = 0; i < throttlingCap; i++) {
                particlesArray.push(new Particle());
            }
        }
        
        function animate(){
            if (!document.getElementById("pause-ambient-particles")) {
                cancelAnimationFrame(globalDustAnimationId);
                window.ambientDustEngineRunning = false;
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            globalDustAnimationId = requestAnimationFrame(animate);
        }
        init();
        animate();
    }
    
    initPauseAmbientParticles();
});