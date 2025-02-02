import { global } from './global.js';
import { Projectile } from '../objects/projectile.js';

function move(event) {
    if (event.key == 'w' && global.playerObject.yVelocity > -global.playerObject.speed) {
        global.playerObject.yVelocity = -global.playerObject.speed;
    }
    if (event.key == 'a' && global.playerObject.xVelocity > -global.playerObject.speed * 2) {
        global.playerObject.xVelocity = -global.playerObject.speed * 2;
        // if (global.playerObject.yVelocity == 0 && global.playerObject.xVelocity < 0) { //needs more work
        //     global.playerObject.switchSpriteIndex(8, 8);
        // }
    }
    if (event.key == 's' && global.playerObject.yVelocity < global.playerObject.speed) {
        global.playerObject.yVelocity = global.playerObject.speed;
    }
    if (event.key == 'd' && global.playerObject.xVelocity < global.playerObject.speed) {
        global.playerObject.xVelocity = global.playerObject.speed;
    }
}

function stop(event) {
    if (global.gameRunning == true) {
        if (event.key == 'w' && global.playerObject.yVelocity < 0) {
            global.playerObject.yVelocity = 0;
        }
        else if (event.key == 'a' && global.playerObject.xVelocity < 0) {
            global.playerObject.xVelocity = 0;
            // global.playerObject.switchSpriteIndex(0, 7); //needs more work
        }
        else if (event.key == 's' && global.playerObject.yVelocity > 0) {
            global.playerObject.yVelocity = 0;
        }
        else if (event.key == 'd' && global.playerObject.xVelocity > 0) {
            global.playerObject.xVelocity = 0;
        }
    }
}

function shoot(event) {
    if (event.code == 'Space' && global.playerObject.shotCooldownTimer <= 0) {
        new Projectile(global.playerObject.x + global.playerObject.width * 0.7, global.playerObject.y + global.playerObject.height / 2, global.canvasFraction * 0.3, global.canvasFraction * 0.15);
        global.playerObject.shotCooldownTimer = global.playerObject.shotCooldown;
        // console.log('space');
    }
}

document.addEventListener('keydown', move);
document.addEventListener('keyup', stop);
document.addEventListener('keydown', shoot);