// game.js
class ValentineGame {
    constructor() {
        this.hearts = [];
        this.particles = [];
        this.confetti = [];
        this.score = 0;
        this.goal = 10;
        this.message = "♥ Eres la luz que ilumina mi camino.\n♥ Cada momento contigo es un regalo.\n♥ Te quiero más que ayer y menos que mañana.";
        
        this.heartsContainer = document.getElementById('hearts-container');
        this.particlesContainer = document.getElementById('particles-container');
        this.confettiContainer = document.getElementById('confetti-container');
        this.scoreElement = document.getElementById('score');
        this.progressFill = document.getElementById('progress-fill');
        this.messageModal = document.getElementById('message-modal');
        this.loveMessage = document.getElementById('love-message');
        
        this.init();
    }

    init() {
        this.createHeartInterval = setInterval(() => this.createHeart(), 1000);
        this.updateInterval = setInterval(() => this.update(), 16);
        this.loveMessage.textContent = this.message;
    }

    createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * (window.innerWidth - 40)}px`;
        heart.style.top = '-50px';
        
        const heartData = {
            element: heart,
            x: parseFloat(heart.style.left),
            y: -50,
            speed: 1 + Math.random() * 2,
            rotation: Math.random() * 360,
            scale: 0.8 + Math.random() * 0.4
        };

        heart.addEventListener('click', () => this.handleHeartClick(heartData));
        this.heartsContainer.appendChild(heart);
        this.hearts.push(heartData);
    }

    createParticles(x, y) {
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            this.particles.push({
                element: particle,
                x: x,
                y: y,
                vx: Math.cos(angle) * 5,
                vy: Math.sin(angle) * 5,
                life: 1
            });

            this.particlesContainer.appendChild(particle);
        }
    }

    createConfetti() {
        const colors = ['#ff0000', '#ff69b4', '#ff1493', '#ff00ff'];
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            this.confetti.push({
                element: confetti,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20 - 10,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1
            });

            this.confettiContainer.appendChild(confetti);
        }
    }

    handleHeartClick(heart) {
        this.createParticles(heart.x, heart.y);
        heart.element.remove();
        this.hearts = this.hearts.filter(h => h !== heart);
        this.score++;
        this.scoreElement.textContent = this.score;
        this.progressFill.style.width = `${(this.score / this.goal) * 100}%`;

        if (this.score >= this.goal) {
            this.createConfetti();
            this.messageModal.classList.remove('hidden');
            this.messageModal.classList.add('visible');
        }
    }

    update() {
        // Actualizar corazones
        this.hearts.forEach(heart => {
            heart.y += heart.speed;
            heart.rotation += 1;
            heart.element.style.top = `${heart.y}px`;
            heart.element.style.transform = `rotate(${heart.rotation}deg) scale(${heart.scale})`;

            if (heart.y > window.innerHeight) {
                heart.element.remove();
                this.hearts = this.hearts.filter(h => h !== heart);
            }
        });

        // Actualizar partículas
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            
            particle.element.style.left = `${particle.x}px`;
            particle.element.style.top = `${particle.y}px`;
            particle.element.style.opacity = particle.life;
            particle.element.style.transform = `scale(${particle.life})`;

            if (particle.life <= 0) {
                particle.element.remove();
                this.particles = this.particles.filter(p => p !== particle);
            }
        });

        // Actualizar confeti
        this.confetti.forEach(conf => {
            conf.x += conf.vx;
            conf.y += conf.vy;
            conf.vy += 0.3;
            conf.rotation += 5;
            conf.life -= 0.01;
            
            conf.element.style.left = `${conf.x}px`;
            conf.element.style.top = `${conf.y}px`;
            conf.element.style.transform = `rotate(${conf.rotation}deg)`;
            conf.element.style.backgroundColor = conf.color;
            conf.element.style.opacity = conf.life;

            if (conf.life <= 0) {
                conf.element.remove();
                this.confetti = this.confetti.filter(c => c !== conf);
            }
        });
    }
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', () => {
    new ValentineGame();
});