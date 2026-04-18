// main.js — message animation, stars, particles, music, sunflower reveal

// =============================================
// WEB AUDIO — ROMANTIC MUSIC
// =============================================
let audioContext = null, isPlaying = false;
let oscillators = [], gainNodes = [], musicLoopId = null, chordIndex = 0;

const notes = {
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196.00, A3:220.00,
    C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392.00, A4:440.00, B4:493.88,
    C5:523.25, E5:659.25, G5:783.99
};

const chords = [
    [notes.C4, notes.E4, notes.G4],
    [notes.A3, notes.C4, notes.E4],
    [notes.F3, notes.A3, notes.C4],
    [notes.G3, notes.D4, notes.G4],
    [notes.E3, notes.G3, notes.C4],
    [notes.D3, notes.F3, notes.A3],
];

function initAudio() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function createOscillator(frequency, type = 'sine') {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.value = frequency;
    osc.detune.value = (Math.random() - 0.5) * 8;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    return { osc, gain };
}

function playChord(chord, duration, startTime) {
    chord.forEach((freq, i) => {
        const { osc, gain } = createOscillator(freq, 'triangle');
        const nd = i * 0.1;
        gain.gain.setValueAtTime(0, startTime + nd);
        gain.gain.linearRampToValueAtTime(0.07, startTime + nd + 0.5);
        gain.gain.exponentialRampToValueAtTime(0.02, startTime + duration - 0.5);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        oscillators.push(osc); gainNodes.push(gain);
        setTimeout(() => { try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch(e){} },
            (duration + startTime - audioContext.currentTime) * 1000 + 500);
    });
}

function playArpeggio(startTime) {
    [notes.C5, notes.E5, notes.G5, notes.C5, notes.G4, notes.E4].forEach((freq, i) => {
        const { osc, gain } = createOscillator(freq, 'sine');
        const t = startTime + i * 0.28;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.04, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
        gain.gain.linearRampToValueAtTime(0, t + 0.5);
        oscillators.push(osc); gainNodes.push(gain);
        setTimeout(() => { try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch(e){} },
            (t - audioContext.currentTime + 0.6) * 1000);
    });
}

function playBass(freq, duration, startTime) {
    const { osc, gain } = createOscillator(freq, 'sine');
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.09, startTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.04, startTime + duration - 0.5);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    oscillators.push(osc); gainNodes.push(gain);
    setTimeout(() => { try { osc.stop(); osc.disconnect(); gain.disconnect(); } catch(e){} },
        (duration + startTime - audioContext.currentTime) * 1000 + 500);
}

function startMusic() {
    if (isPlaying) return;
    initAudio(); isPlaying = true;
    const bassNotes = [notes.C3, notes.A3, notes.F3, notes.G3, notes.E3, notes.D3];
    function loop() {
        if (!isPlaying) return;
        const now = audioContext.currentTime;
        playBass(bassNotes[chordIndex], 3, now);
        playChord(chords[chordIndex], 3.5, now + 0.2);
        if (chordIndex % 2 === 0) playArpeggio(now + 2);
        chordIndex = (chordIndex + 1) % chords.length;
        musicLoopId = setTimeout(loop, 4000);
    }
    loop();
}

// =============================================
// MESSAGE ANIMATION
// =============================================
function animateMessage() {
    const container = document.getElementById('message-container');
    const tapHint   = document.getElementById('tap-hint');

    setTimeout(() => {
        container.style.opacity = '1';

        const message = "hi kim amo ini an surprise ko kanina if mag gana dapat may flower na magpakita";
        const words = message.split(' ');
        words.forEach((word, i) => {
            const span = document.createElement('span');
            span.className = 'message-word';
            span.textContent = word;
            span.style.animationDelay = `${i * 0.4}s`;
            container.appendChild(span);
        });

        const hintDelay = ((words.length - 1) * 0.4 + 0.8) * 1000;
        setTimeout(() => {
            tapHint.style.opacity = '1';
            tapHint.style.pointerEvents = 'auto';
        }, hintDelay);

    }, 1500);
}

// =============================================
// GENERATE STARS
// =============================================
function generateStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 120; i++) {
        const star = document.createElement('div');
        star.className = 'star' + (Math.random() < 0.1 ? ' bright' : '');
        const size = Math.random() * 2.5 + 0.5;
        star.style.cssText = `
            left:${Math.random()*100}%;
            top:${Math.random()*100}%;
            width:${size}px; height:${size}px;
            --duration:${Math.random()*3+2}s;
            --delay:${Math.random()*5}s;
        `;
        container.appendChild(star);
    }
}

// =============================================
// GENERATE PARTICLES
// =============================================
function generateParticles() {
    const container = document.getElementById('particles');
    const types = ['particle-gold','particle-pink','particle-white'];
    for (let i = 0; i < 25; i++) {
        const p = document.createElement('div');
        p.className = `particle ${types[Math.floor(Math.random()*3)]}`;
        const tx = (Math.random()-0.5)*80;
        p.style.cssText = `
            left:${20+Math.random()*60}%;
            bottom:${10+Math.random()*40}%;
            --tx:${tx}px;
            --tx2:${tx+(Math.random()-0.5)*40}px;
            --duration:${5+Math.random()*5}s;
            --delay:${Math.random()*8}s;
        `;
        container.appendChild(p);
    }
}

// =============================================
// BUILD & REVEAL SUNFLOWERS
// =============================================
function buildSunflowers() {
    const flowerHTML = `
        <div class="flower-top">
            <div class="flower-petal flower-petal__1"></div>
            <div class="flower-petal flower-petal__2"></div>
            <div class="flower-petal flower-petal__3"></div>
            <div class="flower-petal flower-petal__4"></div>
            <div class="flower-petal flower-petal__5"></div>
            <div class="flower-petal flower-petal__6"></div>
            <div class="flower-petal flower-petal__7"></div>
            <div class="flower-petal flower-petal__8"></div>
            <div class="flower-circle"></div>
            <div class="flower-light flower-light__1"></div>
            <div class="flower-light flower-light__2"></div>
            <div class="flower-light flower-light__3"></div>
            <div class="flower-light flower-light__4"></div>
            <div class="flower-light flower-light__5"></div>
            <div class="flower-light flower-light__6"></div>
            <div class="flower-light flower-light__7"></div>
            <div class="flower-light flower-light__8"></div>
        </div>
        <div class="flower-bottom">
            <div class="flower-stem"></div>
            <div class="flower-leaf flower-leaf__1"></div>
            <div class="flower-leaf flower-leaf__2"></div>
            <div class="flower-leaf flower-leaf__3"></div>
            <div class="flower-leaf flower-leaf__4"></div>
            <div class="flower-leaf flower-leaf__5"></div>
            <div class="flower-leaf flower-leaf__6"></div>
            <div class="flower-grass flower-grass__1"></div>
            <div class="flower-grass flower-grass__2"></div>
            <div class="flower-grass flower-grass__3"></div>
            <div class="flower-grass flower-grass__4"></div>
        </div>`;

    document.querySelectorAll('.flower-container').forEach(el => {
        el.innerHTML = flowerHTML;
    });
}

function revealSunflowers() {
    document.getElementById('sunflower-scene').classList.add('visible');

    const flowers = Array.from(document.querySelectorAll('.flower-container'));

    // First flower blooms immediately
    flowers[0].classList.add('animate');

    // Flowers 2 & 3 after 3s (matches original timing)
    setTimeout(() => {
        for (let i = 1; i <= 2 && i < flowers.length; i++) {
            flowers[i].classList.add('animate');
        }

        // Remaining flowers bloom randomly every 500ms
        let remaining = flowers.slice(3);
        const interval = setInterval(() => {
            if (remaining.length === 0) { clearInterval(interval); return; }
            const randomIndex = Math.floor(Math.random() * remaining.length);
            const el = remaining.splice(randomIndex, 1)[0];
            el.classList.add('animate');
        }, 500);

    }, 3000);
}

// =============================================
// SECOND MESSAGE — shown after sunflowers bloom
// =============================================
function showSecondMessage() {
    const container = document.getElementById('second-message');
    const el = document.getElementById('second-message-text');
    const message = "Hi kim 👋, thanks for visiting again. Hope ma enjoy mo an little easter (moon) ko. sorry sa cringy joke. redo ko. The moon shines bright for you to see, reach for it and touch it, there's more beneath 🌙";
    const words = message.split(' ');
    const delayPerWord = 0.18;

    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'second-msg-word';
        span.textContent = word;
        span.style.animationDelay = `${i * delayPerWord}s`;
        el.appendChild(span);
    });

    requestAnimationFrame(() => {
        container.classList.add('visible');
    });
}

// =============================================
// MOON PHOTO LIGHTBOX
// =============================================
function initMoonPhoto() {
    const moon = document.querySelector('.moon-container');
    const overlay = document.getElementById('photo-overlay');
    const closeBtn = document.getElementById('photo-close');
    const img = document.getElementById('photo-img');

    moon.style.cursor = 'pointer';
    img.src = 'photo.jpg';

    moon.addEventListener('click', () => {
        overlay.classList.add('visible');
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        overlay.classList.remove('visible');
    });

    overlay.addEventListener('click', () => {
        overlay.classList.remove('visible');
    });
}

// =============================================
// START EXPERIENCE ON TAP
// =============================================
function startExperience() {
    document.getElementById('message-screen').classList.add('fade-out');
    document.getElementById('scene').classList.add('visible');
    startMusic();
    revealSunflowers();
    setTimeout(showSecondMessage, 6500);
}

// =============================================
// INIT
// =============================================
window.addEventListener('DOMContentLoaded', () => {
    buildSunflowers();
    animateMessage();
    generateStars();
    generateParticles();
    initMoonPhoto();

    document.getElementById('message-screen').addEventListener('click', startExperience, { once: true });
    document.getElementById('tap-hint').addEventListener('click', e => {
        e.stopPropagation();
        startExperience();
    }, { once: true });
});
