// connecting to the HTML elements

/// DATA FROM FORM MODAL
const modalContainer = document.querySelector('div.container.form');
const formModal = document.querySelector('form.form');
const formStartBtn = document.querySelector('.btn_form');
const player1_name_field = document.getElementById('player_one_field');
const player2_name_field = document.getElementById('player_two_field');
const radio_game_number = document.getElementsByName('game_number_field');

/// GAME
const gameContainer = document.querySelector('div.container.game');
const cells = document.querySelectorAll('.cell');
const crossScoreSpan = document.getElementById('cross_player_span');
const noughtScoreSpan = document.getElementById('nought_player_span');
const newGameBtn = document.querySelector('.new_game_btn');
const drawsSpan = document.getElementById('draws_span');
const messageSpan = document.getElementById('message_span');
const gameboard = document.querySelector('.gameboard');
const currentGameSpan = document.getElementById('counter_game');
const gamesNoSpan = document.getElementById('games_no');
const roundBtn = document.querySelector('.btn_next_round');
const finalWinnerSpan = document.querySelector('.final_winner_message');
const crossName_span = document.querySelector('.crossName_span');
const noughtName_span = document.querySelector('.noughtName_span');

// introducing variables
let crossName = 'X';
let noughtName = 'O';
let gamesNo = 1;
const cross = 'X';
const nought = 'O';
const cellsNo = cells.length;
let crossScore = 0;
let noughtScore = 0;
let drawScore = 0;
let currentGame = 1;
let currentPlayer = cross;
let winner;
let finalWinner;

// introducing winning combinations
const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const lengthCombos = winningCombos.length;

//FUNCTIONS

//FUNCTION: if cell is clicked
function cellClicked(e) {
    e.preventDefault();
    //display the message for the current player
    messageSpanDisplay();
    //adding the icon
    if (e.target.childElementCount === 0 && e.target.classList.contains('cell')) {
        e.target.appendChild(addImg(currentPlayer));
        //changing the player
        changePlayer();
    }
    //checking for the combos (if winning => end and show message)
    if (checkCombos()) {
        winningRoutine();
        return;
    }
    //checking for the draw
    if (checkDraw()) {
        winningRoutine();
        return;
    }
};

//FUNCTION: adding the img element to the clicked cell
function addImg(player) {
    const img = document.createElement('img');
    img.src = `static/${player}.png`;
    img.alt = `${player}`;
    return img;
};

//FUNCTION: check for the winning combos
function checkCombos() {
    for (let i = 0; i < lengthCombos; i++) {
        if (
            cells[winningCombos[i][0]].firstElementChild?.getAttribute('alt') === cross &&
            cells[winningCombos[i][1]].firstElementChild?.getAttribute('alt') === cross &&
            cells[winningCombos[i][2]].firstElementChild?.getAttribute('alt') === cross) {
            winner = cross;
            return true;
        }
        else if (
            cells[winningCombos[i][0]].firstElementChild?.getAttribute('alt') === nought &&
            cells[winningCombos[i][1]].firstElementChild?.getAttribute('alt') === nought &&
            cells[winningCombos[i][2]].firstElementChild?.getAttribute('alt') === nought) {
            winner = nought;
            return true;
        }
    }
    return false;
};

//FUNCTION: check for the draw:
function checkDraw() {
    let count = 0;
    for (let i = 0; i < cellsNo; i++) {
        if (cells[i].firstChild) count++;
    }
    if (count === 9) {
        winner = 'draw';
        return true;
    } else
        return false;
};

//FUNCTION: changing the player
function changePlayer() {
    //change of player
    currentPlayer === cross ? currentPlayer = nought : currentPlayer = cross;
    //change of message in span
    messageSpanDisplay();
    //change the styling theme for the message for the changing starting players
    messageSpan.classList.toggle('cross');
    messageSpan.classList.toggle('nought');
};

//FUNCTION: messageSpan current player display
function messageSpanDisplay() {
    messageSpan.innerText = `${currentPlayer === cross ? crossName : noughtName}, it's your turn!`;
};

// the routine for the winner
function winningRoutine() {
    //removing event listeners to the cells
    for (let i = 0; i < cellsNo; i++) {
        cells[i].removeEventListener('click', cellClicked);
    };
    //current game counter increase
    currentGame++;
    //styling of the winner message
    messageSpan.classList.contains('cross') ? messageSpan.classList.remove('cross') : messageSpan.classList.remove('nought');
    //add the score display the winner
    if (winner === cross) {
        crossScore++;
        crossScoreSpan.innerText = crossScore;
        messageSpan.innerText = `${crossName} wins this game! ${currentGame <= gamesNo ? "Should we try again? Press the button below!" : ""
            } `;
    } else if (winner === nought) {
        noughtScore++;
        noughtScoreSpan.innerText = noughtScore;
        messageSpan.innerText = `${noughtName} wins this game! ${currentGame <= gamesNo ? "Should we try again? Press the button below!" : ""} `;
    } else if (winner === 'draw') {
        drawScore++;
        drawsSpan.innerText = drawScore;
        messageSpan.innerText = `It's a draw! ${currentGame <= gamesNo ? "Should we try again? Press the button below!" : ""}`;
    };

    //check the games count, offer another round or offer a new game
    if (currentGame <= gamesNo)
        roundBtn.classList.toggle('hidden');
    else {
        finalWinnerSpan.innerText = `Final winner is ${crossScore > noughtScore ? `${crossName}! ` : `${crossScore === noughtScore ? "NOBODY!!!" : `${noughtName}! `}`
            } Start new game!`;
    }
};

//FUNCTION: new game
function newGame(e) {
    //cleaning the gameboard
    for (let i = 0; i < cellsNo; i++) {
        if (cells[i].firstChild)
            cells[i].removeChild(cells[i].firstChild);
    }
    //setting the board with data
    winner = '';
    currentGameSpan.innerText = currentGame;
    gamesNoSpan.innerText = gamesNo;

    if (!roundBtn.classList.contains('hidden'))
        roundBtn.classList.toggle('hidden');

    // check the type of the game (new game or new round)
    if (e) {
        if (e.target.classList.contains('btn_next_round')) {
            cleanScores(true);
        }
    }

    //adding event listeners to the cells
    for (let i = 0; i < cellsNo; i++) {
        cells[i].addEventListener('click', cellClicked);
    };

    //message for the current player
    messageSpanDisplay();

    //display the names of the players in the scores
    crossName_span.innerHTML = crossName;
    noughtName_span.innerHTML = noughtName;
};

//FUNCTION: cleaning the scores
function cleanScores(isNewRound = false) {
    if (!isNewRound) {
        crossScore = 0;
        noughtScore = 0;
        drawScore = 0;
        currentGame = 1;
        finalWinner = '';
        finalWinnerSpan.innerText = '';
        crossScoreSpan.innerText = crossScore;
        noughtScoreSpan.innerText = noughtScore;
        drawsSpan.innerText = drawScore;
        crossName_span.innerHTML = cross;
        noughtName_span.innerHTML = nought;
    };
    //setting the current player to cross - default
    currentPlayer = cross;
    //adding the class for styling the span message
    messageSpan.classList.add('cross');
}

//FUNCTION: hide modal and display gameboard
function hideModal(needsHidding) {
    if (needsHidding) {
        //hide modal
        modalContainer.classList.add('hidden');
        //display the gameboard
        gameContainer.classList.remove('hidden');
        //display new game button
        newGameBtn.classList.remove('hidden');
    } else {
        //show modal
        modalContainer.classList.remove('hidden');
        //hide the gameboard
        gameContainer.classList.add('hidden');
        //hide new game button
        newGameBtn.classList.add('hidden');
    }
}

//EVENT LISTENERS

//STARTING THE GAME
formModal.addEventListener('submit', function (e) {
    e.preventDefault();
    //hide modal, display gameboard
    hideModal(true);
    //getting values from the form
    //cross name
    player1_name_field.value ? crossName = player1_name_field.value : crossName = cross;
    //nought name
    player2_name_field.value ? noughtName = player2_name_field.value : noughtName = nought;
    //number of games
    for (let i = 0; i < radio_game_number.length; i++) {
        if (radio_game_number[i].checked) {
            gamesNo = Number(radio_game_number[i].value);
        }
    };
    //starting the game
    newGame();
});

//adding event listener to the round button
roundBtn.addEventListener('click', newGame);

//adding event listener to the  new game button
newGameBtn.addEventListener('click', function (e) {
    e.preventDefault();
    //show modal
    hideModal(false);
    //clear the form
    player1_name_field.value = '';
    player2_name_field.value = '';
    radio_game_number[0].checked = true;
    //clearing gameboard
    cleanScores();
});







