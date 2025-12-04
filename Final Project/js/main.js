import Engine from './engine.js';

const canvas = document.getElementById("game-canvas");
const engine = new Engine(canvas);

// Game loop
function gameLoop(currentTime) {
    engine.processInput();
    engine.update(currentTime);
    engine.render();
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);