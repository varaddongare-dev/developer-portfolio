import anime from 'animejs/lib/anime.es.js'

export function inituiAnimations() {
    //1. Coordinated staggered screen entry layout sequence
    const timeline = anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200
    });
    timeline
    .add({
        targets: 'h1',
        translateY: [40, 0],
        opacity: [0, 1],
        delay : 200
    })
    .add({
        targets: 'p',
        translateY: [20, 0],
        opacity: [0 ,1]
    }, '-=800') //Staggered overlap: start early
    .add({
        targets: '#scatter-btn',
        scale: [0.7, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .6)'
    }, '-=600');
    
    //2. Playful spring-physics elastic hover effects on the button
    const button = document.getElementById('scatter-btn');

    button.addEventListener('mouseenter', () => {
        anime({
           targets: button,
           scale: 1.1,
           boxShadow: '0 0 20px rgba (0, 255, 204, 0.6)',
           backgroundColor: 'rgba(0, 255, 204, 0.1)',
           duration: 400,
           easing: 'easeOutQuad' 
        });
    });
    button.addEventListener('mouseleave', () => {
        anime({
            targets: button,
            scale: 1.0,
            boxShadow: '0 0 0px rgba(0, 255, 204, 0)',
            backgroundColor: 'transparent',
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
}
