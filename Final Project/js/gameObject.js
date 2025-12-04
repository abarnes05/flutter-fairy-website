export default class gameObject {
    constructor(texture, pos, size, color = "white") {
        this.texture = texture; // HTMLImageElement
        this.pos = {x: pos.x, y: pos.y};
        this.size = {x: size.x, y: size.y};
        this.color = color;
    }

    draw(ctx) {
        if (this.texture) {
            ctx.drawImage(
                this.texture,
                this.pos.x - this.size.x / 2,
                this.pos.y - this.size.y / 2,
                this.size.x,
                this.size.y
            );
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.pos.x - this.size.x / 2,
                this.pos.y - this.size.y / 2,
                this.size.x,
                this.size.y
            );
        }
    }

    // Collision with another GameObject
    checkCollision(other) {
        return !(
            this.getLeft() > other.getRight() ||
            this.getRight() < other.getLeft() ||
            this.getTop() > other.getBottom() ||
            this.getBottom() < other.getTop()
        );
    }

    // Getters
    getLeft() { return this.pos.x - this.size.x / 2; }
    getRight() { return this.pos.x + this.size.x / 2; }
    getTop() { return this.pos.y - this.size.y / 2; }
    getBottom() { return this.pos.y + this.size.y / 2; }

    // Movement
    move(offset) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
    }
    moveX(x) { this.pos.x += x; }
    moveY(y) { this.pos.y += y; }

    // Setters
    setPos(pos) { this.pos = { x: pos.x, y: pos.y }; }
    setPosX(x) { this.pos.x = x; }
    setPosY(y) { this.pos.y = y; }

    setSize(size) { this.size = { x: size.x, y: size.y }; }
    setSizeX(x) { this.size.x = x; }
    setSizeY(y) { this.size.y = y; }

    changePos(delta) { this.move(delta); }
    changeWidth(delta) { this.size.x += delta; }
    changeHeight(delta) { this.size.y += delta; }

    update(deltaTime) {
        // Abstract; override in subclasses if needed
    }
}