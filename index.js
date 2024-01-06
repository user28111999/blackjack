const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10']
let deck = []

for (let rank of ranks) {
    let card = {
        rank: rank,
        texture: `textures/${rank}.png`
    }

    deck.push(card)
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function dealCard(deck) {
    return deck.pop();
}

function calculateScore(hand) {
    let score = 0;
    let aceCount = 0;

    for (let card of hand) {
        if (card.rank === 'A') {
            aceCount++;
            score += 11;
        } else {
            score += parseInt(card.rank);
        }
    }

    while (score > 21 && aceCount > 0) {
        score -= 10;
        aceCount--;
    }

    if (score > 21) {
        throw new Error('Bust');
    }

    return score;
}

function determineWinner(playerScore, dealerScore) {
    if (playerScore > 21) {
        return 'Dealer';
    } else if (dealerScore > 21) {
        return 'Player';
    } else if (playerScore > dealerScore) {
        return 'Player';
    } else if (dealerScore > playerScore) {
        return 'Dealer';
    } else {
        return 'Tie';
    }
}

function updateUI(hand, score, cardsElementId, scoreElementId) {
    // Select the HTML elements
    let cardsElement = document.querySelector(cardsElementId);
    let scoreElement = document.querySelector(scoreElementId);

    // Clear the previous cards
    cardsElement.innerHTML = '';

    // Create and append an image element for each card
    for (let card of hand) {
        let img = document.createElement('img');
        img.src = card.texture;
        cardsElement.appendChild(img);
    }

    // Update the score
    scoreElement.textContent = `Score: ${score}`;
}

let newGameButton = document.querySelector('#new-game-button');
let hitButton = document.querySelector('#hit-button');
let standButton = document.querySelector('#stand-button');

let playerHand = [];
let playerScore = 0;
let dealerHand = [];
let dealerScore = 0;

hitButton.addEventListener('click', function() {
    // Deal a new card to the player
    playerHand.push(dealCard(deck));
    try {
        playerScore = calculateScore(playerHand);
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
    } catch (error) {
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
        alert("Player has bust");
    }
});

standButton.addEventListener('click', function() {
    // End the player's turn and start the dealer's turn
    let dealerHand = [dealCard(deck), dealCard(deck)];
    let dealerScore;
    try {
        dealerScore = calculateScore(dealerHand);
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
    } catch (error) {
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
    }

    let winner = determineWinner(playerScore, dealerScore);
    
    if (winner === 'Tie') {
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
        alert("Tie")
    } else if (winner === 'Dealer') {
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
        alert("Dealer wins")
    } else {
        updateUI(playerHand, playerScore, '#player-cards', '#player-score');
        updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
        alert("Player wins")
    }   
});

newGameButton.addEventListener('click', function() {
    // Shuffle the deck
    shuffleDeck(deck);

    // Deal two cards to the player and dealer
    playerHand = [dealCard(deck), dealCard(deck)];
    dealerHand = [dealCard(deck), dealCard(deck)];

    // Calculate the player and dealer scores
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);

    // Update the UI
    updateUI(playerHand, playerScore, '#player-cards', '#player-score');
    updateUI(dealerHand, dealerScore, '#dealer-cards', '#dealer-score');
});