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
    const videoPlayer = document.getElementById("intro-video");
    const preloaderContent = document.querySelector(".preloader-content-wrapper");
    const textElement = document.getElementById("typing-text");
    const bootWall = document.getElementById("system-boot-wall");

    // Core Layout Audio Widgets (Overhauled to matching RDR2 Red Theme Styles)
    const audioTrack = document.getElementById("portfolio-audio");
    const audioBtn = document.getElementById("audio-toggle-btn");
    const cdDisc = document.getElementById("cd-disc");
    const statusLight = document.getElementById("cd-status-light");
    const marqueeContainer = document.querySelector(".track-marquee");

    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || !window.location.pathname.includes(".html");
    const introPlayed = sessionStorage.getItem("rdr2IntroPlayed") === "true";

    let lenisEngine = null;
    let audioHasStarted = false;
    let autoLoadTriggered = false; 
    let systemUnlocked = false; 

    const isMobileDevice = window.innerWidth <= 768;

    if (!isHomePage || introPlayed) {
        bypassPreloaderSequence();
        initializeCoreSiteFeatures();
        return;
    }

    document.body.classList.add("no-scroll");

    // =================================================================
    // 2. VIDEO TIMELINE & ACTIVE ENGAGEMENT ENGINE
    // =================================================================
    function initializeSystemUplink(e) {
        if (systemUnlocked) return;
        // Native Keyboard Filter Guard
        if (e.type === "keydown" && e.key !== " " && e.key !== "Enter") return;
        
        systemUnlocked = true;

        // Slide away interaction threat panel cleanly
        if (bootWall) {
            gsap.to(bootWall, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => bootWall.remove()
            });
        }
// Initialize and fire hardware-accelerated video player asset
        if (videoPlayer) {
            videoPlayer.style.display = "block";
            
            // CRITICAL AUDIO UNBLOCK CHANNELS:
            videoPlayer.muted = false; // Forces the browser video track to unmute
            videoPlayer.volume = 0.85;  // Calibrates a clean, heavy audio mix
            videoPlayer.currentTime = 0;
            
            // Execute playback inside the direct user-click context window
            videoPlayer.play().then(() => {
                console.log("Media pipeline active with native audio track.");
                
                // TYPEWRITER DELAY OFFSET MATRIX
                setTimeout(() => {
                    if (!autoLoadTriggered) {
                        autoLoadTriggered = true;
                        runTypewriter();
                    }
                }, 2200);
            }).catch(error => {
                console.log("Hardware media pipeline audio block fallback:", error);
                
                // FALLBACK EMERGENCY MODE: If the browser STILL blocks the audio, 
                // we force it to play muted so the visual sequence doesn't freeze!
                videoPlayer.muted = true;
                videoPlayer.play().catch(() => {});
                triggerExitSequence(); 
            });

            // NATIVE EVENT CAPTURE: Fires the frame the RDR2 intro clip ends
            videoPlayer.onended = () => {
                triggerExitSequence();
            };
        } else {
            triggerExitSequence();
        }

        // Fire background ambient score engine safely
        if (audioTrack) {
            const shouldBePlaying = localStorage.getItem("portfolio-audio-active") !== "false";
            if (shouldBePlaying) {
                audioTrack.play().then(() => {
                    setPlayerActiveUI();
                    audioHasStarted = true;
                    localStorage.setItem("portfolio-audio-active", "true");
                }).catch(() => {});
            }
        }
    }

    // Connect global interaction listeners
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
    // 3. DEAD EYE TERMINAL TYPEWRITER EXTENSION
    // =================================================================
    const phraseloop = ["targeting...", "dead eye locked...", "execution complete."];
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
        sessionStorage.setItem("rdr2IntroPlayed", "true");
        document.body.classList.remove("no-scroll");
        if (skipBtn) skipBtn.remove();

        // High-Contrast Red Dead 2 Glitch Impact Phase prior to screen drop
        if (preloaderContent) preloaderContent.classList.add("shattered-glitch");

        const masterTimeline = gsap.timeline({
            onComplete: () => {
                if (preloader) preloader.remove();
                initializeCoreSiteFeatures();
            }
        });

        // Hard crossfade drop straight out of video frame into primary content grid
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

        const radarPhrases = ["scanning perimeter...", "tracking project registries...", "dead eye coordinates set."];
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
            audioBtn.style.color = "#ff0000"; /* High Contrast Pure Red Track Text Overlay */
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
                    audioHasStarted = true;
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
                        audioHasStarted = true;
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
});