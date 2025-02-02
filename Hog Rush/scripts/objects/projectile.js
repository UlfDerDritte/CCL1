import { global } from "../modules/global.js";
import { GameObject } from "./gameObject.js";

class Projectile extends GameObject {

    name = 'projectile';
    onScreen = true;
    xVelocity = 2 * global.gameSpeed;
    yVelocity = 0;

    sprites = [
        './sprites/slingStone.png',
    ];
    animationData = {
        'animationSprites': [],
        'timePerSprite': 0.1,
        'currentSpriteElapsedTime': 0,
        'firstSpriteIndex': 0,
        'lastSpriteIndex': 0,
        'currentSpriteIndex': 0
    };

    reactToCollision = function (otherObject) { //empty since the walls don't react
        if (otherObject.name !== 'snout' && otherObject.name !== 'projectile' ) {
            this.onScreen = false;
            this.active = false;
        }
    }

    constructor(x, y, width, height) {  //uses the input variables to define position and size below
        super(x, y, width, height)
        this.name = 'projectile';
        global.projectiles.push(this)
        this.loadImages()
    }
}

export { Projectile }