const GRID_SIZE = 20;
const EGGS_COUNT = 20;
const MAX_PLAYERS = 4;
let scoreBoard = {};

// Player colors and symbols
const playerColors = ['red', 'green', 'yellow', 'blue'];
const playerSymbols = ['🟥', '🟩', '🟨', '🟦'];
let players = [];
let eggs = [];
let currentPlayer = 0;

// Select DOM elements
const gridContainer = document.getElementById('grid-container');
const scoreBoardDisplay = document.getElementById('score-board');

// Initialize the grid
function initializeGrid() {
  gridContainer.innerHTML = '';
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    gridContainer.appendChild(cell);
  }
}

// Initialize players
function initializePlayers(playerCount) {
  players = [];
  for (let i = 0; i < playerCount; i++) {
    let name = prompt(`Enter name for Player ${i + 1}:`);
    players.push({
      name: name || `Player ${i + 1}`,
      symbol: playerSymbols[i],
      color: playerColors[i],
      position: { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) },
      score: 0,
    });
    scoreBoard[players[i].name] = 0;
  }
}

// Initialize eggs at random positions
function initializeEggs() {
  eggs = [];
  while (eggs.length < EGGS_COUNT) {
    const eggPosition = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!eggs.some(egg => egg.x === eggPosition.x && egg.y === eggPosition.y)) {
      eggs.push(eggPosition);
    }
  }
}

// Render grid, players, and eggs
function renderGrid() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.classList.remove('player', 'egg');
    cell.textContent = '';
  });
  
  eggs.forEach(egg => {
    const eggIndex = egg.y * GRID_SIZE + egg.x;
    cells[eggIndex].classList.add('egg');
    cells[eggIndex].textContent = '🥚';
  });

  players.forEach(player => {
    const playerIndex = player.position.y * GRID_SIZE + player.position.x;
    const cell = cells[playerIndex];
    cell.classList.add('player');
    cell.style.backgroundColor = player.color;
    cell.textContent = player.symbol;
  });
}

// Display score
function updateScoreBoard() {
  scoreBoardDisplay.innerHTML = '';
  players.forEach(player => {
    const playerScore = document.createElement('div');
    playerScore.innerHTML = `<strong>${player.name}:</strong> ${player.score} eggs`;
    scoreBoardDisplay.appendChild(playerScore);
  });
}

// Move player
function movePlayer(direction) {
  const player = players[currentPlayer];
  switch (direction) {
    case 'w': player.position.y = Math.max(0, player.position.y - 1); break;
    case 's': player.position.y = Math.min(GRID_SIZE - 1, player.position.y + 1); break;
    case 'a': player.position.x = Math.max(0, player.position.x - 1); break;
    case 'd': player.position.x = Math.min(GRID_SIZE - 1, player.position.x + 1); break;
    default: return;
  }

  collectEgg(player);
  renderGrid();
  updateScoreBoard();

  currentPlayer = (currentPlayer + 1) % players.length;
}

// Collect egg if the player lands on one
function collectEgg(player) {
  const eggIndex = eggs.findIndex(egg => egg.x === player.position.x && egg.y === player.position.y);
  if (eggIndex !== -1) {
    player.score++;
    eggs.splice(eggIndex, 1);
    if (eggs.length === 0) alert(`All eggs collected!`);
  }
}

// Game initialization
function startGame() {
  const playerCount = parseInt(document.getElementById('players').value) || 1;
  initializeGrid();
  initializePlayers(playerCount);
  initializeEggs();
  renderGrid();
  updateScoreBoard();
  currentPlayer = 0;
}

// Handle player movement with keyboard events
document.addEventListener('keydown', (event) => {
  const validKeys = ['w', 'a', 's', 'd'];
  if (validKeys.includes(event.key.toLowerCase())) {
    movePlayer(event.key.toLowerCase());
  }
});
