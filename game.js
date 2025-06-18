document.addEventListener('DOMContentLoaded', () => {
    // DOM elementai
    const gameBoard = document.getElementById('gameBoard');
    const attemptsDisplay = document.getElementById('attempts');
    const matchesDisplay = document.getElementById('matches');
    const totalPairsDisplay = document.getElementById('totalPairs');
    const timeDisplay = document.getElementById('time');
    const startBtn = document.getElementById('startBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    // Žaidimo kintamieji
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let canFlip = true;
    let timer = null;
    let seconds = 0;
    let totalPairs = 0;
    
    // Emoji simboliai
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    
    // Pradėti žaidimą
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', startGame);
    
    function startGame() {
        // Sustabdyti ankstesnį laikmatį
        clearInterval(timer);
        seconds = 0;
        timeDisplay.textContent = seconds;
        
        // Gauti pasirinktą lygį (sunkumo)
        const size = 4;
        totalPairs = (size * size) / 2;
        totalPairsDisplay.textContent = totalPairs;
        
        // Išvalyti lentą ir atstatyti žaidimo duomenis
        resetGame();
        
        // Sukurti korteles
        createCards(size);
        
        // Pradėti laikmatį
        timer = setInterval(updateTimer, 1000);
        
        // Pakeisti mygtukų būseną
        startBtn.disabled = true;
        restartBtn.disabled = false;
    }
    
    function resetGame() {
        // Visiškai išvalyti korteles
        gameBoard.innerHTML = '';
        cards = [];
        
        // Atstatyti žaidimo būseną
        flippedCards = [];
        matchedPairs = 0;
        attempts = 0;
        canFlip = true;
        
        // Atnaujinti rodiklius
        matchesDisplay.textContent = matchedPairs;
        attemptsDisplay.textContent = attempts;
    }
    
    function createCards(size) {
        // Nustatyti tinkamą tinklelį
        gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        
        // Pasirinkti reikiamą kiekį emoji
        const pairsNeeded = totalPairs;
        const selectedEmojis = emojis.slice(0, pairsNeeded);
        const cardValues = [...selectedEmojis, ...selectedEmojis];
        
        // Sumaišyti korteles
        shuffleArray(cardValues);
        
        // Sukurti korteles
        cardValues.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            card.addEventListener('click', () => handleCardClick(card));
            
            gameBoard.appendChild(card);
            cards.push(card);
        });
    }
    
    function handleCardClick(card) {
        // Patikrinti ar galima versti kortelę
        if (!canFlip || card.classList.contains('flipped') || 
            card.classList.contains('matched')) {
            return;
        }
        
        // Atversti kortelę
        flipCard(card);
        
        // Tikrinti ar turime dvi atverstas korteles
        if (flippedCards.length === 2) {
            canFlip = false;
            // Pridėti 1 bandymą
            attempts++;
            attemptsDisplay.textContent = attempts;
            
            // Patikrinti ar kortelės sutampa
            setTimeout(checkForMatch, 1000);
        }
    }
    
    function flipCard(card) {
        card.classList.add('flipped');
        card.textContent = card.dataset.emoji;
        flippedCards.push(card);
    }
    
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;
        
        if (isMatch) {
            // Pažymėti kaip sutampančias
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            matchesDisplay.textContent = matchedPairs;
            
            // Tikrinti ar žaidimas baigtas
            if (matchedPairs === totalPairs) {
                clearInterval(timer);
                setTimeout(() => {
                    const playAgain = confirm(`Sveikinu! Laimėjote per ${attempts} bandymų ir ${seconds} sekundžių!\nAr norite žaisti dar kartą?`);
                    if (playAgain) startGame();
                }, 500);
            }
        } else {
            // Užversti korteles
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }
        
        // Atstatyti būseną
        flippedCards = [];
        canFlip = true;
    }
    
    function updateTimer() {
        seconds++;
        timeDisplay.textContent = seconds;
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Pradinis instrukcijų pranešimas
    alert('Sveiki atvykę į atminties žaidimą!\n\nTaisyklės:\n1. Raskite visas sutampančias kortelių poras\n2. Kiekvienas dviejų kortelių atvertimas skaitomas bandymu\n3. Bandykite surasti visas poras kuo greičiau!');
});