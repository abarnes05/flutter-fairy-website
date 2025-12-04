import Player from './player.js';
import Obstacle from './obstacle.js';
import GameObject from './gameObject.js';           

export default class Engine {
    constructor(canvas) {
        const engine = this;
        
        // Initialize canvas
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Initialize canvas dimensions
        this.width = canvas.width;
        this.height = canvas.height;

        // Set up game states
        this.state = { START: "start", PLAY: "play", END: "end", LEADERBOARD: "leaderboard"};
        // Set initial state to START
        this.currentState = this.state.START;

        // Delta time tracking
        this.lastFrame = 0;
        this.deltaTime = 0;

        // Input
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };
        this.mouseLastFrame = false;

        // Initialize score
        this.scoreCount = 0;
        this.bestScore = 0;

        // Load textures
        this.fairyTex = new Image();
        this.fairyTex.src = './textures/fairy.png';
        this.grassTex = new Image();
        this.grassTex.src = './textures/grass.png';
        this.obstTex = new Image();
        this.obstTex.src = './textures/obstacle.png';
        this.bgTex = new Image();
        this.bgTex.src = './textures/background.png';
        
        // Declare game objects
        this.player = null;
        this.grass = null;
        this.topObst = [];
        this.bottomObst = [];
        // Initialize game objects
        this.initGameObjects();

        // Event listeners
        this.initInput();

        // HTML elements for END screen popup
        this.endScreen = document.getElementById('end-screen');
        this.scoreText = document.getElementById('score-text');
        this.bestText = document.getElementById('best-text');
        this.restartButton = document.getElementById('restart-button');
        this.leaderboardButton = document.getElementById('leaderboard-button');
        this.form = document.getElementById('leaderboard-form');
        this.cancelButton = document.getElementById('lb-cancel');
        this.submitButton = document.getElementById("lb-submit");
        
        // Delete leaderboard entries (for testing)
        // localStorage.setItem("leaderboard", JSON.stringify([]));

        // Flag to track if END screen popup is visible
        this.endScreenVisible = false;

        // Event listeners for END screen popup buttons
        this.restartButton.addEventListener('click', () => {
            // Hide the END screen popup
            this.hideEndScreen();
            // Function to restart the game
            this.restartGame();
        });

        this.leaderboardButton.addEventListener('click', () => {
            // Show the leaderboard form
            this.showForm();
        });

        this.cancelButton.addEventListener('click', () => {
            // Hide the leaderboard form
            this.hideForm();
        });

        this.form.onsubmit = function (e) {
            // Prevent default form submission
            e.preventDefault();

            // Get values
            const name = document.getElementById("name").value;
            const score = engine.bestScore;

            // Save values to localStorage
            localStorage.setItem("name", name);
            localStorage.setItem("score", score);

            // Extra validation
            if (name.length < 1) {
                // If name wasn't submitted, alert user
                alert("Must enter name before submitting.");
                // Return to form
                return;
            }
            if (score < 1) {
                // If name wasn't submitted, alert user
                alert("Score must be greater than 0.");
                // Return to form
                return;
            }

            // Load leaderboard
            const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

            // Add new entry
            leaderboard.push({ name, score });

            // Save back to localStorage
            localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

            // When submitted redirect to leaderboard page
            window.location.href = "leaderboard.html";
        };
    }

    // Show / hide functions for END screen popup
    showEndScreen() {
        // Change textContent to the player's score
        this.scoreText.textContent = `Score: ${this.scoreCount}`;
        this.bestText.textContent = `Best: ${this.bestScore}`;
        // Make END screen popup visible
        this.endScreen.style.display = "flex";
        // Set flag to indicate popup is visible
        this.endScreenVisible = true;
    }

    hideEndScreen() {
        // Hide END screen popup
        this.endScreen.style.display = "none";
        // Set flag to indicate popup is hidden
        this.endScreenVisible = false;
    }

    // Show / hide functions for leaderboard form
    showForm() {
        // Make leaderboard form visible
        this.form.style.display = "flex";
    }
    
    hideForm() {
        // Hide leaderboard form
        this.form.style.display = "none";
    }

    initInput() {
        // Add event listeners for keyboard and mouse input
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        this.canvas.addEventListener('mousedown', () => this.mouse.pressed = true);
        this.canvas.addEventListener('mouseup', () => this.mouse.pressed = false);
    }

    initGameObjects() {
        // Initialize background
        this.background = new GameObject(this.bgTex, { x: this.width / 2, y: this.height / 2 }, { x: this.width, y: this.height }, 'lightblue');
        
        // Initialize player
        this.player = new Player(this.fairyTex, { x: this.width / 2, y: this.height / 2 }, { x: 64, y: 64 }, 'magenta');

        // Initialize grass
        this.grass = new GameObject(this.grassTex, { x: this.width / 2, y: this.height - 50 }, { x: this.width, y: 100 }, 'green');

        // Initialize top and bottom obstacles
        const gapHeight = 150; // vertical gap between top and bottom obstacles
        const obstWidth = 80; // width of each obstacle
        const obstHeight = 400; // height of each obstacle
        
        let totalObstWidth = 0;

        // Y position range for top obstacles
        const minY = 100; // min Y pos for top obstacle
        const maxY = 250; // max Y pos for top obstacle

        // Function to get random Y position for top obstacle
        function randomY() {
            return minY + Math.random() * (maxY - minY);
        }

        while (totalObstWidth < this.width + 800) {
            // Set top obstacle X position off-screen
            const topX = totalObstWidth + obstWidth / 2 + 1000;
            // Set top obstacle Y position randomly within set range
            const topY = randomY() - obstHeight / 2;
            // Initialize top obstacle using these positions
            const top = new Obstacle(this.obstTex, { x: topX, y: topY }, { x: obstWidth, y: obstHeight }, 'pink');
            // Add to top obstacles array
            this.topObst.push(top);

            // Set bottom obstacle Y position based on top obstacle position and gap height
            const bottomY = topY + obstHeight + gapHeight;
            // Initialize bottom obstacle using these positions (same X pos as top obstacle)
            const bottom = new Obstacle(this.obstTex, { x: topX, y: bottomY }, { x: obstWidth, y: obstHeight }, 'blue');
            // Add to bottom obstacles array
            this.bottomObst.push(bottom);

            // Account for spacing between obstacles
            totalObstWidth += obstWidth + 200;
        }
    }

    processInput() {
        // Variable to track if player jumped (clicked/pressed space)
        const playerPressedJump = this.mouse.pressed || this.keys['Space'];
        // Variable to track if player jumped this frame
        this.playerJumpedThisFrame = playerPressedJump && !this.playerJumpedLastFrame;
        // Variable to save if player jumped last frame
        this.playerJumpedLastFrame = playerPressedJump;

        if (this.currentState === this.state.START) {
            // If player clicked/jumped on the START screen, make the player jump and start the game
            if (this.playerJumpedThisFrame) {
                this.player.justJumped = true;
                this.currentState = this.state.PLAY;
            }
        }
        else if (this.currentState === this.state.PLAY) {
            // If player isn't dead + clicked/jumped on the PLAY screen, make the player jump
            if (!this.player.isDead && this.playerJumpedThisFrame) {
                this.player.justJumped = true;
            }
        }
        // Variable to save if mouse was pressed last frame
        this.mouseLastFrame = this.mouse.pressed;
    }

    update(currentTime) {
        // Calculate delta time in seconds
        this.deltaTime = (currentTime - this.lastFrame) / 1000;
        this.lastFrame = currentTime;

        // Set obstacle speed
        const obstSpeed = 135;

        if (this.currentState === this.state.PLAY) {
            // Move player when jumping
            this.player.update(this.deltaTime);

            if (!this.player.isDead) {
                // Move top obstacles
                this.topObst.forEach((obst, i) => {
                    // Increase score if player passes obstacle
                    if (!obst.wasPassed && this.player.hasPassed(obst)) {
                        this.scoreCount++;
                        obst.wasPassed = true;
                    }

                    // Move obstacle to the left
                    obst.moveX(-obstSpeed * this.deltaTime);

                    // Recycle obstacle if it goes off-screen
                    if (obst.pos.x < -(obst.size.x / 2)) {
                        const buildingOnLeft = (i === 0) ? this.topObst.length - 1 : i - 1;
                        const leftObst = this.topObst[buildingOnLeft];
                        obst.pos.x = leftObst.pos.x + leftObst.size.x / 2 + obst.size.x / 2 + 200;
                        obst.wasPassed = false; // reset for next pass
                    }
                });

                // Move bottom obstacles
                this.bottomObst.forEach((obst, i) => {
                    // Move obstacle to the left
                    obst.moveX(-obstSpeed * this.deltaTime);

                    // Recycle obstacle if it goes off-screen
                    if (obst.pos.x < -(obst.size.x / 2)) {
                        const buildingOnLeft = (i === 0) ? this.bottomObst.length - 1 : i - 1;
                        const leftObst = this.bottomObst[buildingOnLeft];
                        obst.pos.x = leftObst.pos.x + leftObst.size.x / 2 + obst.size.x / 2 + 200;
                    }
                });

                // Collision detection for top obstacles
                this.topObst.forEach((obst) => {
                    // If player collides with top obstacle, player dies
                    if (this.player.checkCollision(obst)) {
                        this.player.isDead = true;
                    }
                    // If player goes off-screen past top obstacle, player dies
                    if (this.player.checkOffScreenCollision(obst)) {
                        this.player.isDead = true;
                    }
                });

                // Collision detection for bottom obstacles
                this.bottomObst.forEach((obst) => {
                    // If player collides with bottom obstacle, player bounces off and dies
                    if (this.player.checkCollision(obst)) {
                        this.player.isDead = true;
                        this.player.bounceOffObstacle(obst);
                    }
                });
            }

            // Collision detection for grass, game ends when player hits ground
            if (this.player.checkCollision(this.grass)) {
                this.currentState = this.state.END;
            }
        }
        else if (this.currentState === this.state.END) {
            // Check for high score
            if (this.scoreCount > this.bestScore) {
                this.bestScore = this.scoreCount;
            }

            // Show end screen if not already visible
            if (!this.endScreenVisible) {
                this.showEndScreen();
            }
        }
    }

    // Function to restart the game and reset positions, variables, ect.
    restartGame() {
        // Reset score
        this.scoreCount = 0;

        // Reset player (position + variables)
        this.player.reset(this.width, this.height);

        // Reset obstacles positions
        const startPosX = this.width + 200;
        const gapWidth = 280;
        const gapHeight = 150;
        const obstHeight = 400;
        // Y position range for top obstacles
        const minY = 100;
        const maxY = 250;

        for (let i = 0; i < this.topObst.length; i++) {
            // Reset X position for top obstacle
            this.topObst[i].setPosX(startPosX + i * gapWidth);
            // Get random Y position for top obstacle
            const topY = minY + Math.random() * (maxY - minY) - obstHeight / 2;
            // Reset Y position for top obstacle
            this.topObst[i].pos.y = topY;
            // Reset wasPassed flag for top obstacle
            this.topObst[i].wasPassed = false;

            // Reset X position for bottom obstacle (same as top obstacle)
            this.bottomObst[i].setPosX(startPosX + i * gapWidth);
            // Get bottom obstacle Y position based on top obstacle position and gap height
            const bottomY = topY + obstHeight + gapHeight;
            // Reset Y position for bottom obstacle
            this.bottomObst[i].pos.y = bottomY;
        }
        // Reset state to START
        this.currentState = this.state.START;
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background, obstacles, grass, player
        this.background.draw(this.ctx);
        this.topObst.forEach(o => o.draw(this.ctx));
        this.bottomObst.forEach(o => o.draw(this.ctx));
        this.grass.draw(this.ctx);
        this.player.draw(this.ctx);

        // Draw score
        this.ctx.fillStyle = "white";
        this.ctx.font = "24px 'Press Start 2P'";
        this.ctx.fillText(`Score: ${this.scoreCount}`, this.canvas.width / 2 - 80, this.canvas.height - 40);
    }
}