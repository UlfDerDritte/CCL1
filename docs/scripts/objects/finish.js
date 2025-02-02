import { global } from "../modules/global.js";
import { GameObject } from "./gameObject.js";

class Finish extends GameObject {

    name = 'finish';
    xVelocity = -global.gameSpeed;
    yVelocity = 0;

    sprites = [
        './sprites/finish.png',
    ];
    animationData = {
        'animationSprites': [],
        'timePerSprite': 0.1,
        'currentSpriteElapsedTime': 0,
        'firstSpriteIndex': 0,
        'lastSpriteIndex': 0,
        'currentSpriteIndex': 0
    };

    // reactToCollision = function (otherObject) {
    //     if (otherObject.name == 'snout') {
    //         main.winGame();
    //     }
    // }

    edgeCollision = function () {
        let objectBounds = this.getObjectBounds();
        let canvasBounds = global.getCanvasBounds();

        if (this.active == true) {
            if (objectBounds.right <= canvasBounds.left || objectBounds.left >= canvasBounds.right) {
                this.onScreen = false;
            } else if (objectBounds.left <= canvasBounds.right && objectBounds.right >= canvasBounds.left) {
                this.onScreen = true;
                if (objectBounds.right <= canvasBounds.right) {
                    global.winLevel();
                }
            }
        }

    }

    constructor(x, y, width, height) {  //uses the input variables to define position and size below
        super(x, y, width, height)
        this.loadImages()
    }
}

export { Finish }