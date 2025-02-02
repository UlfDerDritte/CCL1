import { global } from "../modules/global.js";
import { GameObject } from "./gameObject.js";

class Enemy extends GameObject {

    name = 'enemy';
    onScreen = true;
    xVelocity = -global.gameSpeed;
    yVelocity = global.gameSpeed / 2;
    health = 1;

    sprites = [
        './sprites/enemySpritesheet.png',
    ];
    animationData = {
        'animationSprites': [],
        'timePerSprite': 0.1,
        'currentSpriteElapsedTime': 0,
        'firstSpriteIndex': 0,
        'lastSpriteIndex': 3,
        'currentSpriteIndex': 0
    };

    reactToCollision = function (otherObject) { //empty since the walls don't react
        let objectBounds = this.getObjectBounds();
        let otherObjectBounds = otherObject.getObjectBounds();
        if (otherObject.name == 'projectile') {
            this.damageTick(1);
        } else if (otherObject.name == 'rock' && (objectBounds.bottom >= otherObjectBounds.bottom || objectBounds.top <= otherObjectBounds.top)) {
            this.y = this.prevY;
            this.yVelocity = this.yVelocity * -1;
        }
    }

    damageTick = function (damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.active = false;
            this.onScreen = false;
        }
    }

    edgeCollision = function () {
        let objectBounds = this.getObjectBounds();
        let canvasBounds = global.getCanvasBounds();

        if (this.active == true) {
            if (objectBounds.right <= canvasBounds.left || objectBounds.left >= canvasBounds.right) {
                this.onScreen = false;
            } else if (objectBounds.left <= canvasBounds.right || objectBounds.right >= canvasBounds.left) {
                this.onScreen = true;
            } if (
                objectBounds.bottom >= canvasBounds.bottom || objectBounds.top <= canvasBounds.top) {
                this.y = this.prevY;
                this.yVelocity = this.yVelocity * -1;
            }
        }
    }

    constructor(x, y, width, height) {  //uses the input variables to define position and size below
        super(x, y, width, height)
        this.loadSpritesheet(4, 1)
    }
}

export { Enemy }