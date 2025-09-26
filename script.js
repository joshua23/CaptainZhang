function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';

        if (Math.random() > 0.5) {
            particle.style.background = 'linear-gradient(45deg, #8B00FF, #FFD700)';
        }

        particlesContainer.appendChild(particle);
    }
}

function addInteractiveGlow() {
    const silhouette = document.querySelector('.master-silhouette');

    document.addEventListener('mousemove', (e) => {
        const rect = silhouette.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - centerX, 2) +
            Math.pow(e.clientY - centerY, 2)
        );

        if (distance < 300) {
            const intensity = 1 - (distance / 300);
            silhouette.style.filter = `drop-shadow(0 0 ${30 + intensity * 20}px rgba(139, 0, 255, ${0.5 + intensity * 0.3}))`;
        }
    });
}

function animateSymbols() {
    const symbols = document.querySelectorAll('.symbol');

    symbols.forEach((symbol, index) => {
        symbol.addEventListener('animationiteration', () => {
            const positions = [
                { top: '10%', left: '10%', right: 'auto', bottom: 'auto' },
                { top: '15%', right: '10%', left: 'auto', bottom: 'auto' },
                { bottom: '40%', left: '5%', top: 'auto', right: 'auto' },
                { bottom: '30%', right: '5%', top: 'auto', left: 'auto' },
                { bottom: '10%', left: '50%', top: 'auto', right: 'auto' }
            ];

            const randomPos = positions[Math.floor(Math.random() * positions.length)];
            Object.keys(randomPos).forEach(key => {
                symbol.style[key] = randomPos[key];
            });
        });
    });
}

function pulseOnClick() {
    const image = document.querySelector('.master-image');

    if (image) {
        image.addEventListener('click', () => {
            image.style.animation = 'none';
            void image.offsetWidth;
            image.style.animation = 'fadeInOut 4s ease-in-out infinite, pulse 0.5s ease-out';

            setTimeout(() => {
                image.style.animation = 'fadeInOut 4s ease-in-out infinite';
            }, 500);
        });
    }
}

const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    addInteractiveGlow();
    animateSymbols();
    pulseOnClick();
});