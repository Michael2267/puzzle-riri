// Layout bentuk HATI (heart shape)
// 1 = ada kartu, 0 = kosong
const heartLayout = [
    [0,0,1,1,1,0,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,0,0,0,0],
];

// Hitung total kartu
let totalCards = 0;
heartLayout.forEach(row => {
    row.forEach(cell => {
        if (cell === 1) totalCards++;
    });
});

// Total pasangan
const totalPairs = Math.floor(totalCards / 2);

// Emoji untuk kartu
const cardEmojis = [
    '❤️', '💕', '💖', '💗', '💘', '💝', '💓', '💞',
    '🌹', '🌺', '🌸', '🌻', '🌷', '🦋', '⭐', '✨',
    '🎀', '💐', '🎁', '🍓', '🍒', '🎂', '🍰', '🧁'
];

// Variabel game
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let startTime = null;
let timerInterval = null;
let canFlip = true;

// Inisialisasi game
function initGame() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    // Buat array pasangan kartu
    cards = [];
    for (let i = 0; i < totalPairs; i++) {
        const emoji = cardEmojis[i % cardEmojis.length];
        cards.push(emoji, emoji);
    }
    
    // Acak kartu
    cards = cards.sort(() => Math.random() - 0.5);
    
    // Reset variabel
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    startTime = null;
    canFlip = true;
    
    // Update UI
    document.getElementById('moves').textContent = '0';
    document.getElementById('time').textContent = '0:00';
    document.getElementById('pairs').textContent = `0/${totalPairs}`;
    document.getElementById('winnerMessage').classList.remove('show');
    document.getElementById('confessionMessage').classList.remove('show');
    document.getElementById('yesMessage').classList.remove('show');
    
    // Stop timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Buat kartu sesuai layout hati
    let cardIndex = 0;
    for (let row = 0; row < heartLayout.length; row++) {
        for (let col = 0; col < heartLayout[row].length; col++) {
            if (heartLayout[row][col] === 1) {
                const card = document.createElement('div');
                card.className = 'card';
                card.dataset.index = cardIndex;
                card.dataset.emoji = cards[cardIndex];
                card.style.gridRow = row + 1;
                card.style.gridColumn = col + 1;
                
                card.innerHTML = `
                    <div class="card-front">
                        <div class="card-icon">💝</div>
                    </div>
                    <div class="card-back">${cards[cardIndex]}</div>
                `;
                
                card.addEventListener('click', flipCard);
                gameBoard.appendChild(card);
                cardIndex++;
            }
        }
    }
}

// Flip kartu
function flipCard() {
    if (!canFlip) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;
    
    // Mulai timer saat kartu pertama diklik
    if (startTime === null) {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

// Cek apakah kartu cocok
function checkMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;
    const emoji1 = card1.dataset.emoji;
    const emoji2 = card2.dataset.emoji;
    
    if (emoji1 === emoji2) {
        // Cocok!
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            document.getElementById('pairs').textContent = `${matchedPairs}/${totalPairs}`;
            flippedCards = [];
            canFlip = true;
            
            // Cek kemenangan
            if (matchedPairs === totalPairs) {
                setTimeout(showWinner, 500);
            }
        }, 600);
    } else {
        // Tidak cocok
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Update timer
function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Tampilkan pesan kemenangan
function showWinner() {
    clearInterval(timerInterval);
    
    // Reveal semua kartu dengan animasi
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.classList.add('revealed');
    });
    
    const finalTime = document.getElementById('time').textContent;
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalTime').textContent = finalTime;
    
    setTimeout(() => {
        document.getElementById('winnerMessage').classList.add('show');
        // Tampilkan pesan nembak setelah 2 detik
        setTimeout(() => {
            showConfessionMessage();
        }, 2000);
    }, 1000);
}

// Tampilkan pesan nembak
function showConfessionMessage() {
    // Sembunyikan winner message
    document.getElementById('winnerMessage').classList.remove('show');
    
    // Tampilkan confession message
    setTimeout(() => {
        document.getElementById('confessionMessage').classList.add('show');
    }, 500);
}

// Handle jawaban Ya
function handleYes() {
    document.getElementById('confessionMessage').classList.remove('show');
    setTimeout(() => {
        document.getElementById('yesMessage').classList.add('show');
    }, 500);
}

// Handle jawaban Tidak
function handleNo() {
    const noBtn = document.querySelector('.btn-no');
    const yesBtn = document.querySelector('.btn-yes');
    
    // Random position untuk tombol No
    const randomX = Math.random() * (window.innerWidth - 200);
    const randomY = Math.random() * (window.innerHeight - 100);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    
    // Perbesar tombol Yes
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
    yesBtn.style.fontSize = (currentSize + 2) + 'px';
    yesBtn.style.padding = '20px 50px';
}

// Mulai ulang game
function restartGame() {
    initGame();
}

// Game baru dengan acak baru
function newGame() {
    initGame();
}

// Inisialisasi game saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    // Autoplay background music
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        // Set volume (opsional, 0.0 - 1.0)
        bgMusic.volume = 0.5;
        
        // Coba autoplay
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Autoplay berhasil
                console.log('Music playing automatically');
            }).catch(error => {
                // Autoplay diblokir browser, play saat user interact
                console.log('Autoplay blocked, will play on first interaction');
                document.body.addEventListener('click', () => {
                    bgMusic.play();
                }, { once: true });
            });
        }
    }
});