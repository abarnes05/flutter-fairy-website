import gameObject from "./gameObject.js";

export default class Obstacle extends gameObject {
    constructor(texture, pos, size, color) {
        super(texture, pos, size, color);

        // Variable to track if the obstacle was passed by the player
        this.wasPassed = false;
    }
}