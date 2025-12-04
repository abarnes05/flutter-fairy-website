import GameObject from "./gameObject.js";
import Obstacle from "./obstacle.js";

export default class Player extends GameObject {
    constructor(texture, pos, size, color = "magenta") {
        super(texture, pos, size, color);

        // Physics variables
        this.velocity = 0.0;
        this.gravity = 0.0;
        this.vertSpeed = 0.0; // verticle speed
        this.jumpSpeed = 350.0; // verticle speed when jumping
        this.fallingConstant = 1500.0; // gravity (pulls user down)

        // Variable to track if player just jumped
        this.justJumped = false;
        // Variable to track is player is dead
        this.isDead = false;
        // Variable to track if player has bounced off an obstacle
        this.hasBounced = false;
    }

    update(deltaTime) {
        // Calculate velocity and gravity
        this.velocity = this.vertSpeed * deltaTime;
        this.gravity = this.fallingConstant * deltaTime;
        
        // Handle jumping
        if (this.justJumped) {
            this.vertSpeed = -this.jumpSpeed;
            // Reset jump flag
            this.justJumped = false;
        }

        // Update player position and vertspeed using velocity and gravity
        this.pos.y += this.velocity;
        this.vertSpeed += this.gravity;
    }

    reset(canvasWidth, canvasHeight) {
        // Reset player position after restarting game
        this.pos = { x: canvasWidth / 2, y: canvasHeight / 2 };
        // Reset vertspeed
        this.vertSpeed = 0.0;

        // Reset player dead variable
        this.isDead = false;
        // Reset player bounced variable
        this.hasBounced = false;
    }

    bounceOffObstacle(other) {
        // If player collides with an obstacle and hasn't bounced yet
        if (other instanceof Obstacle && !this.hasBounced) {
            // Player bounces off obstacle
            this.vertSpeed = -this.jumpSpeed * 0.85;
            // Set bounce flag to true so player only bounces once
            this.hasBounced = true;
        }
    }

    checkOffScreenCollision(topObstacle) {
        // Makes sure the player doesn't fly offscreen above all the obstacles
        if (topObstacle instanceof Obstacle) {
            return (this.getRight() > topObstacle.getLeft() &&
                    this.getLeft() < topObstacle.getRight() && 
                    this.getBottom() < topObstacle.getTop());
        }
    }

    hasPassed(obstacle) {
        // Check if player has passed an obstacle
        return this.getLeft() > obstacle.getLeft() && this.getLeft() > obstacle.getRight();
    }
}