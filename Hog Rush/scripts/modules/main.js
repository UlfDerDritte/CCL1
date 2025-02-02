import { global } from "./global.js";
import { Snout } from "../objects/snout.js"
import { Rock } from "../objects/rock.js";
import { levels } from "../levels/levels.js";
import { Finish } from "../objects/finish.js";
import { Projectile } from "../objects/projectile.js";
import { Enemy } from "../objects/enemy.js";

let x = 0;

function gameLoop(totalRunningTime) {
    global.deltaTime = totalRunningTime - global.prevTotalRunningTime; // Time in milliseconds between frames
    global.deltaTime /= 1000; // Convert milliseconds to seconds for consistency in calculations
    global.prevTotalRunningTime = totalRunningTime; // Save the current state of 'totalRunningTime', so at the next call of gameLoop (== next frame) to calculate deltaTime again for that next frame.
    x += global.deltaTime;
    if (global.gameEnd == false) {
        global.ctx.clearRect(0, 0, global.canvas.width, global.canvas.height); // Completely clear the canvas for the next graphical output
        for (let i = 0; i < global.allGameObjects.length; i++) {     //iterates trough all objects and executes the functions below
            global.allGameObjects[i].storePrevPos();                //storePrevPos called immediately to get the previous position before it's updated
            global.allGameObjects[i].update();                      //updates the position
            if (global.allGameObjects[i].onScreen == true) {
                global.checkAllCollision(global.allGameObjects[i]);     //checks for collision and executes the reaction if necessary
                global.allGameObjects[i].draw();                        //displays/draws the new gamestate
            }
        }
        global.updateHealth();
    }


    requestAnimationFrame(gameLoop); // This keeps the gameLoop running indefinitely

};

function setup(levelNum) {
    global.allGameObjects = [];
    global.playerObject = [];
    global.finish = [];
    global.canvas.style['visibility'] = 'visible';
    let level = levels[levelNum];
    for (let i = 0; i < level.length; i++) {
        let row = level[i];
        for (let j = 0; j < row.length; j++) {
            switch (row[j]) {
                case 1:
                    new Rock(j * global.canvasFraction, i * global.canvasFraction, global.canvasFraction, global.canvasFraction)
                    break;
                case 2:
                    global.finish = new Finish(j * global.canvasFraction + global.canvasFraction * 0.15, i * global.canvasFraction + global.canvasFraction * 0.15, global.canvasFraction * 0.7, global.canvasFraction * 0.7)
                    break;
                case 3:
                    new Enemy(j * global.canvasFraction + global.canvasFraction * 0.22, i * global.canvasFraction + global.canvasFraction * 0.15, global.canvasFraction * 0.56, global.canvasFraction * 0.7)
                    break;
            };
        };
    };
    document.querySelector("#heart3").style['visibility'] = 'visible';
    document.querySelector("#heart2").style['visibility'] = 'visible';
    document.querySelector("#heart1").style['visibility'] = 'visible';
    global.playerObject = new Snout(global.canvasFraction + global.canvasFraction * 0.15, 2* global.canvasFraction + global.canvasFraction * 0.15, global.canvasFraction * 0.7, global.canvasFraction * 0.7);
};

startButton = document.querySelector("#startButton");
startButton.onclick = function startGame() {
    setup(0);
    global.gameRunning = true;
    global.gameEnd = false;
    this.style['visibility'] = 'hidden';
}

export function winGame() {
    console.log('winGame');
    global.gameEnd = true;
    global.canvas.style['visibility'] = 'hidden';
    winButton.style['visibility'] = 'visible';
    document.querySelector("#heart3").style['visibility'] = 'hidden';
    document.querySelector("#heart2").style['visibility'] = 'hidden';
    document.querySelector("#heart1").style['visibility'] = 'hidden';

}

winButton = document.querySelector("#winButton");

winButton.onclick = function resetWonGame() {
    console.log('resetWonGame');
    this.style['visibility'] = 'hidden';
    startButton.style['visibility'] = 'visible';
}

export function loseGame() {
    for (let i = 0; i < global.allGameObjects.length; i++) {
        global.allGameObjects[i].stop();
    }
    console.log('loseGame');
    global.gameEnd = true;
    global.canvas.style['visibility'] = 'hidden';
    loseButton.style['visibility'] = 'visible';
}

loseButton = document.querySelector("#loseButton");

loseButton.onclick = function resetLostGame() {
    console.log('resetLostGame');
    this.style['visibility'] = 'hidden';
    startButton.style['visibility'] = 'visible';
}

requestAnimationFrame(gameLoop);