import { global } from "../modules/global.js";
import { GameObject } from "./gameObject.js";
import { winGame } from "../modules/main.js";
import { loseGame } from "../modules/main.js";

class Snout extends GameObject {

    name = 'snout';
    onScreen = true;
    xVelocity = 0;
    yVelocity = 0;
    speed = 300;
    health = 3;
    damageTickGrace = 0;
    damageTickGraceDefault = 1;
    shotCooldownTimer = 0;
    shotCooldown = 0.25;

    sprites = [
        './sprites/snoutSpritesheet.png',
    ];
    animationData = {
        'animationSprites': [],
        'timePerSprite': 0.1,
        'currentSpriteElapsedTime': 0,
        'firstSpriteIndex': 0,
        'lastSpriteIndex': 7,
        'currentSpriteIndex': 0
    };

    getObjectBounds = function () {
        let box = {
            left: this.x + this.width * 0.2,
            right: this.x + this.width * 0.8,
            top: this.y + this.height * 0.1,
            bottom: this.y + this.height * 0.9
        }
        return box;
    };

    update = function () {  //empty, static by default
        this.x += this.xVelocity * global.deltaTime; // Adjust x and y position based on velocity and time elapsed since last frame ( == deltaTime)
        this.y += this.yVelocity * global.deltaTime;
        this.edgeCollision();
        this.damageTickGrace -= global.deltaTime;
        this.shotCooldownTimer -= global.deltaTime;
    };

    reactToCollision = function (otherObject) { //empty since the walls don't react
        switch (otherObject.name) {
            case 'finish':
                winGame();
                break;
            case 'rock':
                this.damageTick(1);
                break;
            case 'enemyProjectile':
                this.damageTick(1);
                break;
            case 'enemy':
                this.damageTick(1);
                break;
        }

    }

    getNextSprite = function () {
        this.animationData.currentSpriteElapsedTime += global.deltaTime;

        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            if (this.xVelocity < 0 && this.x >= 10) {
                this.animationData.currentSpriteIndex--;
                this.animationData.currentSpriteElapsedTime = 0;
            } else
            this.animationData.currentSpriteIndex++;
            this.animationData.currentSpriteElapsedTime = 0;
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex
            } else if (this.animationData.currentSpriteIndex < this.animationData.firstSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.lastSpriteIndex
            }
        }

        return this.animationData.animationSprites[this.animationData.currentSpriteIndex];
    };

    edgeCollision = function () {
        let objectBounds = this.getObjectBounds();
        let canvasBounds = global.getCanvasBounds();

        if (objectBounds.left <= canvasBounds.left + this.width * 0.1 || objectBounds.right >= canvasBounds.right - this.width * 0.1) {
            this.x = this.prevX;
        }
        if (objectBounds.bottom >= canvasBounds.bottom - this.height * 0.1 || objectBounds.top <= canvasBounds.top + this.height * 0.1) {
            this.y = this.prevY;
        }
    }

    damageTick = function (damage) {
        if (this.damageTickGrace <= 0) {
            this.health -= damage;
            console.log(this.health);
            this.damageTickGrace = this.damageTickGraceDefault;
            if (this.health <= 0) {
                loseGame();
            }
        }
    }

    constructor(x, y, width, height) {  //uses the input variables to define position and size below
        super(x, y, width, height)
        this.loadSpritesheet(8, 1)
    }
}

export { Snout }