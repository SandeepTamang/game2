document.addEventListener('DOMContentLoaded', function() {
  const car = document.getElementById('car');
  const obstaclesContainer = document.getElementById('obstacles');
  const playAgainBtn = document.getElementById('playAgainBtn');
  const startBtn = document.getElementById('startBtn');
  const scoreDisplay = document.getElementById('score');

  let carPositionX = 50; // Initial car position on X-axis (percentage)
  let carSpeed = 5; // Car speed (pixels per frame)
  let obstacleSpeed = 7; // Initial obstacle speed (pixels per frame)
  let obstacles = [];
  let score = 0;
  let gameInterval;

  // Event listener for start button
  startBtn.addEventListener('click', function() {
    startGame();
    startBtn.style.display = 'none'; // Hide start button
  });

  function startGame() {
    createObstacles();
    gameInterval = setInterval(updateGame, 20);
    playAgainBtn.style.display = 'none'; // Hide play again button
  }

  function createObstacles() {
    for (let i = 0; i < 5; i++) { // Create 5 obstacles
      const obstacle = document.createElement('div');
      obstacle.classList.add('obstacle');
      obstacle.style.left = Math.random() * 360 + 'px'; // Random position
      obstacle.style.top = -Math.random() * 500 + 'px'; // Random initial y position
      obstaclesContainer.appendChild(obstacle);
      obstacles.push(obstacle);
    }
  }

  function updateGame() {
    moveCar();
    moveObstacles();
    checkCollision();
  }

  function moveCar() {
    car.style.left = carPositionX + '%';
  }

  function moveObstacles() {
    obstacles.forEach(obstacle => {
      const obstacleTop = parseInt(obstacle.style.top) + obstacleSpeed;
      obstacle.style.top = obstacleTop + 'px';

      if (obstacleTop > 600) { // If obstacle goes out of the road
        obstacle.remove(); // Remove obstacle from DOM
        obstacles = obstacles.filter(o => o !== obstacle); // Remove obstacle from array
        score++; // Increment score when obstacle is dodged
        scoreDisplay.textContent = 'Score: ' + score; // Update score display
      }
    });
  }

  function checkCollision() {
    const carRect = car.getBoundingClientRect();
    obstacles.forEach(obstacle => {
      const obstacleRect = obstacle.getBoundingClientRect();
      // Check collision between the car and each obstacle
      if (
        carRect.left < obstacleRect.right &&
        carRect.right > obstacleRect.left &&
        carRect.top < obstacleRect.bottom &&
        carRect.bottom > obstacleRect.top
      ) {
        gameOver();
      }
    });
  }

  function gameOver() {
    clearInterval(gameInterval); // Stop the game
    playAgainBtn.style.display = 'block'; // Show play again button
  }

  // Event listener for controlling the car on mobile devices
  let touchStartX;
  document.addEventListener('touchstart', function(event) {
    touchStartX = event.touches[0].clientX;
  });

  document.addEventListener('touchmove', function(event) {
    event.preventDefault(); // Prevent scrolling
  });

  document.addEventListener('touchend', function(event) {
    const touchEndX = event.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;

    if (deltaX > 0) { // Swipe right
      carPositionX += carSpeed;
      if (carPositionX > 100) {
        carPositionX = 100;
      }
    } else if (deltaX < 0) { // Swipe left
      carPositionX -= carSpeed;
      if (carPositionX < 0) {
        carPositionX = 0;
      }
    }
  });

  // Event listener for play again button
  playAgainBtn.addEventListener('click', function() {
    obstacles.forEach(obstacle => obstacle.remove()); // Remove obstacles
    obstacles = [];
    score = 0; // Reset score
    scoreDisplay.textContent = 'Score: 0'; // Reset score display
    startGame(); // Restart the game
  });
});
