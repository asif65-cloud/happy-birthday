// ===================================
// LAMP LOGIN PAGE LOGIC
// ===================================

const lampHit = document.getElementById('lampHit');
const cord = document.getElementById('cord');
const loginForm = document.getElementById('loginForm');
const loginFormElement = document.getElementById('loginFormElement');
const lampPage = document.getElementById('lampPage');
const birthdayPage = document.getElementById('birthdayPage');
const quizPage = document.getElementById('quizPage');
const appreciationPage = document.getElementById('appreciationPage');
const spinWheelPage = document.getElementById('spinWheelPage');
const lampEyes = document.querySelectorAll('.lamp__eye');

let isOn = false;
let isPulling = false;

// Handle lamp cord click
lampHit.addEventListener('click', function() {
    if (isPulling) return;
    
    isPulling = true;
    
    // Animate cord pull
    cord.style.transition = 'all 0.3s ease-out';
    cord.setAttribute('y2', '380');
    
    // Play click sound
    const audio = new Audio('https://assets.codepen.io/605876/click.mp3');
    audio.play().catch(() => {});
    
    setTimeout(() => {
        cord.setAttribute('y2', '348');
        
        // Toggle lamp state
        isOn = !isOn;
        
        // Generate random color
        const hue = Math.floor(Math.random() * 360);
        document.documentElement.style.setProperty('--shade-hue', hue.toString());
        document.documentElement.style.setProperty('--glow-color', `hsl(${hue}, 40%, 45%)`);
        document.documentElement.style.setProperty('--glow-color-dark', `hsl(${hue}, 40%, 35%)`);
        document.documentElement.style.setProperty('--on', isOn ? '1' : '0');
        
        // Toggle form visibility
        if (isOn) {
            loginForm.classList.add('active');
            lampEyes.forEach(eye => eye.classList.add('open'));
        } else {
            loginForm.classList.remove('active');
            lampEyes.forEach(eye => eye.classList.remove('open'));
        }
        
        isPulling = false;
    }, 300);
});

// Handle login form submission
loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Transition to birthday page
    lampPage.classList.remove('active');
    birthdayPage.classList.add('active');
    
    // Initialize birthday page
    initBirthdayPage();
});

// ===================================
// BIRTHDAY PAGE LOGIC
// ===================================

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
    {f: 262, d: 0.5, t: "Hap", p: "p1"},
    {f: 262, d: 0.5, t: "py&nbsp;", p: "p1"},
    {f: 294, d: 1, t: "Birth", p: "p1"},
    {f: 262, d: 1, t: "day&nbsp;", p: "p1"},
    {f: 349, d: 1, t: "To&nbsp;", p: "p1"},
    {f: 330, d: 2, t: "You", p: "p1"},
    
    {f: 262, d: 0.5, t: "Hap", p: "p2"},
    {f: 262, d: 0.5, t: "py&nbsp;", p: "p2"},
    {f: 294, d: 1, t: "Birth", p: "p2"},
    {f: 262, d: 1, t: "day&nbsp;", p: "p2"},
    {f: 392, d: 1, t: "To&nbsp;", p: "p2"},
    {f: 349, d: 2, t: "You", p: "p2"},
    
    {f: 262, d: 0.5, t: "Hap", p: "p3"},
    {f: 262, d: 0.5, t: "py&nbsp;", p: "p3"},
    {f: 523, d: 1, t: "Birth", p: "p3"},
    {f: 440, d: 1, t: "day&nbsp;", p: "p3"},
    {f: 349, d: 1, t: "Dear&nbsp;", p: "p3"},
    {f: 330, d: 1, t: "Dilkash", p: "p3"},
    {f: 294, d: 2, t: "Babu", p: "p3"},
    
    {f: 466, d: 0.5, t: "Hap", p: "p4"},
    {f: 466, d: 0.5, t: "py&nbsp;", p: "p4"},
    {f: 440, d: 1, t: "Birth", p: "p4"},
    {f: 349, d: 1, t: "day&nbsp;", p: "p4"},
    {f: 392, d: 1, t: "To&nbsp;", p: "p4"},
    {f: 349, d: 2, t: "You", p: "p4"},
];

let speed = 0.5;
let flag = false;
let sounds = [];
let birthdayInitialized = false;

// Sound class
class Sound {
    constructor(freq, dur, i) {
        this.stop = true;
        this.frequency = freq;
        this.waveform = "triangle";
        this.dur = dur;
        this.speed = this.dur * speed;
        this.initialGain = 0.15;
        this.index = i;
        this.sp = notes[i].sp;
    }
    
    cease() {
        this.stop = true;
        this.sp.classList.remove("jump");
        if (this.index < sounds.length - 1) {
            sounds[this.index + 1].play();
        }
        if (this.index === sounds.length - 1) {
            flag = false;
            // Show quiz button after song ends
            setTimeout(() => {
                document.getElementById("quizBtn").style.display = "block";
            }, 1000);
        }
    }
    
    play() {
        this.oscillator = audioCtx.createOscillator();
        this.gain = audioCtx.createGain();
        this.gain.gain.value = this.initialGain;
        this.oscillator.type = this.waveform;
        this.oscillator.frequency.value = this.frequency;
        this.gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + this.speed);
        this.oscillator.connect(this.gain);
        this.gain.connect(audioCtx.destination);
        this.oscillator.start(audioCtx.currentTime);
        this.sp.setAttribute("class", "jump");
        this.stop = false;
        this.oscillator.stop(audioCtx.currentTime + this.speed);
        
        const self = this;
        this.oscillator.onended = function() {
            self.cease();
        };
    }
}

function initBirthdayPage() {
    if (birthdayInitialized) return;
    birthdayInitialized = true;
    
    // Create spans for each note
    notes.forEach((n) => {
        const span = document.createElement("span");
        span.innerHTML = n.t;
        const pElement = document.getElementById(n.p);
        pElement.appendChild(span);
        n.sp = span;
    });
    
    // Create sounds
    for (let i = 0; i < notes.length; i++) {
        const sound = new Sound(notes[i].f, notes[i].d, i);
        sounds.push(sound);
    }
    
    // Wishes click event
    const wishes = document.getElementById("wishes");
    wishes.addEventListener("click", function(e) {
        if (e.target.id !== "inputSpeed" && !flag) {
            sounds[0].play();
            flag = true;
            document.getElementById("pleaseClick").style.display = "none";
        }
    }, false);
    
    // Speed input
    const inputSpeed = document.getElementById("inputSpeed");
    inputSpeed.addEventListener("input", function() {
        speed = parseFloat(this.value);
        sounds.forEach((s) => {
            s.speed = s.dur * speed;
        });
    }, false);
    
    // Quiz button click
    const quizBtn = document.getElementById("quizBtn");
    quizBtn.addEventListener("click", function() {
        birthdayPage.classList.remove("active");
        quizPage.classList.add("active");
        initQuizPage();
    });
    
    // Initialize canvas
    initCanvas();
}

// ===================================
// CANVAS ANIMATION
// ===================================

function initCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = window.innerHeight;
    
    const colors = ["#93DFB8", "#FFC8BA", "#E3AAD6", "#B5D8EB", "#FFBDD8"];
    
    class Particle {
        constructor() {
            this.x = Math.random() * cw;
            this.y = Math.random() * ch;
            this.r = 15 + ~~(Math.random() * 20);
            this.l = 3 + ~~(Math.random() * 2);
            this.a = 2 * Math.PI / this.l;
            this.rot = Math.random() * Math.PI;
            this.speed = 0.05 + Math.random() / 2;
            this.rotSpeed = 0.005 + Math.random() * 0.005;
            this.color = colors[~~(Math.random() * colors.length)];
        }
        
        update() {
            if (this.y < -this.r) {
                this.y = ch + this.r;
                this.x = Math.random() * cw;
            }
            this.y -= this.speed;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.beginPath();
            for (let i = 0; i < this.l; i++) {
                let x = this.r * Math.cos(this.a * i);
                let y = this.r * Math.sin(this.a * i);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.lineWidth = 4;
            ctx.strokeStyle = this.color;
            ctx.stroke();
            ctx.restore();
        }
    }
    
    let particles = [];
    for (let i = 0; i < 20; i++) {
        let p = new Particle();
        particles.push(p);
    }
    
    let requestId;
    
    function draw() {
        requestId = window.requestAnimationFrame(draw);
        ctx.clearRect(0, 0, cw, ch);
        particles.forEach((p) => {
            p.rot += p.rotSpeed;
            p.update();
            p.draw();
        });
    }
    
    function init() {
        if (requestId) {
            window.cancelAnimationFrame(requestId);
        }
        cw = canvas.width = window.innerWidth;
        ch = canvas.height = window.innerHeight;
        draw();
    }
    
    setTimeout(() => {
        init();
        window.addEventListener('resize', init, false);
    }, 15);
}

// ===================================
// QUIZ PAGE LOGIC
// ===================================

let quizInitialized = false;
let currentQuestionIndex = 0;
let quizScore = 0;

const quizQuestions = [
    {
        question: "Where did we first talk?",
        options: ["snapchat", "College", "Friend's Party", "At a Cafe"],
        correct: 0,
        correctMessage: "Of course you remember! Our first chat was so special 😍💖",
        wrongMessage: "Wrong answer babu… punishment = one tight hug 🤭💕"
    },
    {
        question: "What nickname do I call you?",
        options: ["Sweetie", "Dilkash jii", "My Love", "Princess"],
        correct: 1,
        correctMessage: "Yes! You're my Dilkash jii forever 👑💖",
        wrongMessage: "Aww, you forgot your special name? That's okay, more hugs for you! 🤗"
    },
    {
        question: "What makes me happiest?",
        options: ["Your messages", "Your smile", "Spending time with you", "All of the above"],
        correct: 3,
        correctMessage: "Perfect! Everything about you makes me happy 🥰✨",
        wrongMessage: "Close, but it's actually ALL of you that makes me happiest! 💕"
    },
    {
        question: "Our future dream city?",
        options: ["Paris", "Saudi Arabia", "New York", "London"],
        correct: 1,
        correctMessage: "Yes! Dubai, where our dreams will come true together 🌟",
        wrongMessage: "Oops! We talked about Dubai, remember? More planning needed! 😘"
    },
    {
        question: "What is your favorite quality about you?",
        options: ["your maharaani style baithna", "your out f the box answer", "your dedication", "Everything about me"],
        correct: 3,
        correctMessage: "Awww, you know I love everything about you! 😍💖",
        wrongMessage: "Trick question! It's everything, silly! But I love that you tried 💕"
    }
];

function initQuizPage() {
    if (quizInitialized) return;
    quizInitialized = true;
    
    // Initialize quiz canvas
    initQuizCanvas();
    
    // Reset quiz state
    currentQuestionIndex = 0;
    quizScore = 0;
    
    // Show first question
    showQuestion();
}

function showQuestion() {
    const question = quizQuestions[currentQuestionIndex];
    
    // Update question number and total
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    
    // Update question text
    document.getElementById('questionText').textContent = question.question;
    
    // Clear and create options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
    
    // Clear feedback
    const feedbackMessage = document.getElementById('feedbackMessage');
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestionIndex];
    const optionButtons = document.querySelectorAll('.option-btn');
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    // Disable all buttons
    optionButtons.forEach(btn => btn.classList.add('disabled'));
    
    // Check if answer is correct
    const isCorrect = selectedIndex === question.correct;
    
    if (isCorrect) {
        quizScore++;
        optionButtons[selectedIndex].classList.add('correct');
        feedbackMessage.textContent = question.correctMessage;
        feedbackMessage.classList.add('correct', 'show');
    } else {
        optionButtons[selectedIndex].classList.add('wrong');
        optionButtons[question.correct].classList.add('correct');
        feedbackMessage.textContent = question.wrongMessage;
        feedbackMessage.classList.add('wrong', 'show');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        if (currentQuestionIndex < quizQuestions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            showResults();
        }
    }, 3000);
}

function showResults() {
    document.getElementById('quizContent').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    // Update score
    document.getElementById('finalScore').textContent = quizScore;
    document.getElementById('finalTotal').textContent = quizQuestions.length;
    
    // Generate score message
    let scoreMessage = '';
    const percentage = (quizScore / quizQuestions.length) * 100;
    
    if (percentage === 100) {
        scoreMessage = "Perfect Score! You're the Official Queen of My Heart 👑💖";
    } else if (percentage >= 80) {
        scoreMessage = "Amazing! You know us so well, my love 🥰✨";
    } else if (percentage >= 60) {
        scoreMessage = "Great job! You're truly special to me 💕😊";
    } else {
        scoreMessage = "That's okay! We'll make more memories together 💝🌟";
    }
    
    document.getElementById('scoreMessage').textContent = scoreMessage;
    
    // Continue button
    document.getElementById('continueToAppreciation').addEventListener('click', function() {
        quizPage.classList.remove('active');
        appreciationPage.classList.add('active');
        initAppreciationPage();
    });
}

// ===================================
// QUIZ CANVAS ANIMATION (Hearts)
// ===================================

function initQuizCanvas() {
    const canvas = document.getElementById('quizCanvas');
    const ctx = canvas.getContext('2d');
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = window.innerHeight;
    
    class Heart {
        constructor() {
            this.x = Math.random() * cw;
            this.y = ch + 50;
            this.size = Math.random() * 20 + 15;
            this.speed = Math.random() * 1 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.color = ['#ff6b9d', '#c06c84', '#f093fb', '#f5576c'][Math.floor(Math.random() * 4)];
        }
        
        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            
            if (this.y < -50) {
                this.y = ch + 50;
                this.x = Math.random() * cw;
            }
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            const x = this.x + Math.sin(this.wobble) * 20;
            const y = this.y;
            const size = this.size;
            
            // Draw heart shape
            ctx.beginPath();
            ctx.moveTo(x, y + size / 4);
            ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x, y - size);
            ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
            ctx.fill();
            
            ctx.restore();
        }
    }
    
    let hearts = [];
    for (let i = 0; i < 15; i++) {
        hearts.push(new Heart());
    }
    
    function animate() {
        ctx.clearRect(0, 0, cw, ch);
        
        hearts.forEach(heart => {
            heart.update();
            heart.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    function init() {
        cw = canvas.width = window.innerWidth;
        ch = canvas.height = window.innerHeight;
    }
    
    init();
    animate();
    window.addEventListener('resize', init);
}

// ===================================
// APPRECIATION PAGE LOGIC
// ===================================

let appreciationInitialized = false;

function initAppreciationPage() {
    if (appreciationInitialized) return;
    appreciationInitialized = true;
    
    // Initialize fireworks
    initFireworks();
    
    // Spin wheel button
    const spinWheelBtn = document.getElementById('spinWheelBtn');
    spinWheelBtn.addEventListener('click', function() {
        appreciationPage.classList.remove('active');
        spinWheelPage.classList.add('active');
        initSpinWheelPage();
    });
    
    // Back to start button
    const backBtn = document.getElementById('backToStart');
    backBtn.addEventListener('click', function() {
        // Reset and go back to lamp page
        appreciationPage.classList.remove('active');
        lampPage.classList.add('active');
        
        // Reset states
        birthdayInitialized = false;
        quizInitialized = false;
        appreciationInitialized = false;
        spinWheelInitialized = false;
        flag = false;
        sounds = [];
        currentQuestionIndex = 0;
        quizScore = 0;
        
        // Clear birthday text
        ['p1', 'p2', 'p3', 'p4'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });
        
        // Reset please click and quiz button
        document.getElementById("pleaseClick").style.display = "block";
        document.getElementById("quizBtn").style.display = "none";
        
        // Reset quiz
        document.getElementById('quizContent').style.display = 'block';
        document.getElementById('quizResults').style.display = 'none';
    });
}

// ===================================
// FIREWORKS ANIMATION
// ===================================

function initFireworks() {
    const canvas = document.getElementById("fireworksCanvas");
    const ctx = canvas.getContext("2d");
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = window.innerHeight;
    
    const fireworks = [];
    const particles = [];
    
    const hue = {
        min: 0,
        max: 360
    };
    
    class Firework {
        constructor() {
            this.x = Math.random() * cw;
            this.y = ch;
            this.sx = Math.random() * 3 - 1.5;
            this.sy = Math.random() * -3 - 3;
            this.size = Math.random() * 2 + 1;
            this.shouldExplode = false;
            
            const targetY = Math.random() * ch * 0.5 + ch * 0.1;
            this.targetY = targetY;
        }
        
        update() {
            if (this.sy >= -2 || this.y <= this.targetY) {
                this.shouldExplode = true;
            }
            
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.01;
        }
        
        draw() {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 60%)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.sx = Math.random() * 6 - 3;
            this.sy = Math.random() * 6 - 3;
            this.size = Math.random() * 3 + 2;
            this.life = 100;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        }
        
        update() {
            this.x += this.sx;
            this.y += this.sy;
            this.sy += 0.1;
            this.life -= 1;
            this.size -= 0.02;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life / 100;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    function createFirework() {
        if (Math.random() < 0.05) {
            fireworks.push(new Firework());
        }
    }
    
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.2)';
        ctx.fillRect(0, 0, cw, ch);
        
        createFirework();
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();
            fireworks[i].draw();
            
            if (fireworks[i].shouldExplode) {
                for (let j = 0; j < 50; j++) {
                    particles.push(new Particle(fireworks[i].x, fireworks[i].y));
                }
                fireworks.splice(i, 1);
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            
            if (particles[i].life <= 0 || particles[i].size <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    function init() {
        cw = canvas.width = window.innerWidth;
        ch = canvas.height = window.innerHeight;
    }
    
    init();
    animate();
    window.addEventListener('resize', init);
}

// ===================================
// SPIN WHEEL PAGE LOGIC
// ===================================

let spinWheelInitialized = false;

const prizes = [
    { name: "Kiss", emoji: "😘", message: "You won a sweet kiss! Come claim it now! 💋💕" },
    { name: "Hug", emoji: "🤗", message: "Warm hug coming your way! Get ready for the tightest squeeze! 🫂💖" },
    { name: "Movie Date", emoji: "🎬", message: "Movie date it is! Let's watch something together! 🍿❤️" },
    { name: "Ice Cream", emoji: "🍦", message: "Ice cream treat on me! Your favorite flavor awaits! 🍨😋" },
    { name: "Long Drive", emoji: "🚗", message: "Long drive adventure! Just you, me, and the open road! 🛣️💨" },
    { name: "Surprise Gift", emoji: "🎁", message: "Mystery gift unlocked! Something special is waiting for you! 🎀✨" }
];

let wheelAngle = 0;
let isSpinning = false;

function initSpinWheelPage() {
    if (spinWheelInitialized) return;
    spinWheelInitialized = true;
    
    // Initialize wheel canvas background
    initWheelCanvas();
    
    // Draw the wheel
    drawWheel();
    
    // Spin button
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', spinWheel);
    
    // Back to appreciation button
    const backToAppreciation = document.getElementById('backToAppreciation');
    backToAppreciation.addEventListener('click', function() {
        spinWheelPage.classList.remove('active');
        appreciationPage.classList.add('active');
        
        // Reset prize display
        document.getElementById('prizeResult').style.display = 'none';
        spinButton.disabled = false;
    });
    
    // Spin again button
    const spinAgain = document.getElementById('spinAgain');
    spinAgain.addEventListener('click', function() {
        document.getElementById('prizeResult').style.display = 'none';
        spinButton.disabled = false;
    });
}

function drawWheel() {
    const canvas = document.getElementById('wheelPrize');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    const colors = ['#FF6B9D', '#C06C84', '#F093FB', '#F5576C', '#FA709A', '#FEE140'];
    const anglePerSlice = (2 * Math.PI) / prizes.length;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each slice
    prizes.forEach((prize, index) => {
        const startAngle = wheelAngle + index * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSlice / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Raleway, sans-serif';
        ctx.fillText(prize.emoji, radius * 0.65, -10);
        ctx.font = 'bold 14px Raleway, sans-serif';
        ctx.fillText(prize.name, radius * 0.65, 10);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#FA709A';
    ctx.lineWidth = 4;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    
    // Random number of rotations (5-10 full rotations)
    const extraRotations = 5 + Math.random() * 5;
    const totalRotation = extraRotations * 2 * Math.PI;
    
    // Random final position
    const randomAngle = Math.random() * 2 * Math.PI;
    const finalAngle = wheelAngle + totalRotation + randomAngle;
    
    const duration = 4000; // 4 seconds
    const startTime = Date.now();
    const startAngle = wheelAngle;
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        wheelAngle = startAngle + (finalAngle - startAngle) * easeOut;
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Determine winner
            wheelAngle = wheelAngle % (2 * Math.PI);
            const normalizedAngle = (2 * Math.PI - wheelAngle) % (2 * Math.PI);
            const anglePerSlice = (2 * Math.PI) / prizes.length;
            const winningIndex = Math.floor(normalizedAngle / anglePerSlice);
            
            // Show result
            showPrize(prizes[winningIndex]);
            isSpinning = false;
        }
    }
    
    animate();
}

function showPrize(prize) {
    setTimeout(() => {
        document.getElementById('prizeEmoji').textContent = prize.emoji;
        document.getElementById('prizeTitle').textContent = prize.name + '!';
        document.getElementById('prizeMessage').textContent = prize.message;
        document.getElementById('prizeResult').style.display = 'block';
    }, 500);
}

// ===================================
// WHEEL CANVAS BACKGROUND ANIMATION
// ===================================

function initWheelCanvas() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    let cw = canvas.width = window.innerWidth;
    let ch = canvas.height = window.innerHeight;
    
    class Confetti {
        constructor() {
            this.x = Math.random() * cw;
            this.y = Math.random() * ch - ch;
            this.size = Math.random() * 8 + 4;
            this.speed = Math.random() * 2 + 1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = Math.random() * 0.1 - 0.05;
            this.color = ['#FF6B9D', '#C06C84', '#F093FB', '#F5576C', '#FA709A', '#FEE140'][Math.floor(Math.random() * 6)];
        }
        
        update() {
            this.y += this.speed;
            this.rotation += this.rotationSpeed;
            
            if (this.y > ch) {
                this.y = -this.size;
                this.x = Math.random() * cw;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    let confetti = [];
    for (let i = 0; i < 50; i++) {
        confetti.push(new Confetti());
    }
    
    function animate() {
        ctx.clearRect(0, 0, cw, ch);
        
        confetti.forEach(c => {
            c.update();
            c.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    function init() {
        cw = canvas.width = window.innerWidth;
        ch = canvas.height = window.innerHeight;
    }
    
    init();
    animate();
    window.addEventListener('resize', init);
}