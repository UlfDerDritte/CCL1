const global = {};

global.canvas = document.querySelector("#canvas");
global.body = document.querySelector("#body");
global.ctx = canvas.getContext("2d");
global.healthBar = document.querySelector(".health")
global.prevTotalRunningTime = 0;
global.deltaTime = 0;
global.allGameObjects = [];
global.playerObject = [];
global.projectiles = [];
global.finish = [];
global.canvasFraction = global.canvas.height / 5;
global.gameSpeed = global.canvasFraction * 3;
global.ctx.imageSmoothingEnabled = false;
global.gameRunning = true;
global.gameEnd = true;
global.id = 0;

global.getCanvasBounds = function () {
    let box = {
        "left": 0,
        "right": this.canvas.width,
        "top": 0,
        "bottom": this.canvas.height
    };

    return box;
}

global.checkAllCollision = function (curObject) {    //checks for collision between the current object and all other objects
    for (let i = 0; i < global.allGameObjects.length; i++) {                //iterates through all positions in the array
        let otherObject = global.allGameObjects[i];                         //and defines them as otherObject
        if (curObject.onScreen == true && otherObject.onScreen == true && otherObject.id > curObject.id) {
            let collided = global.detectBoxCollision(curObject, otherObject);   //defines collided as collision between the current object and the other object
            if (collided == true) {                 //executes function below only if the object collides with an object and that object is not itself
                curObject.reactToCollision(otherObject);
                otherObject.reactToCollision(curObject);
            }
        }
    }
}

global.detectBoxCollision = function (gameObject1, gameObject2) {
    let box1 = gameObject1.getObjectBounds();
    let box2 = gameObject2.getObjectBounds();
    if (box1.left <= box2.right &&
        box1.right >= box2.left &&
        box1.top <= box2.bottom &&
        box1.bottom >= box2.top) {
        return true;
    }
    return false;
}

global.updateHealth = function () {
    let heart3 = document.querySelector("#heart3");
    let heart2 = document.querySelector("#heart2");
    let heart1 = document.querySelector("#heart1");
    if (global.gameRunning == true) {
        switch (global.playerObject.health) {
            case '3':
                heart3.style['visibility'] = 'visible';
                heart2.style['visibility'] = 'visible';
                break;
            case 2:
                heart3.style['visibility'] = 'hidden';
                heart2.style['visibility'] = 'visible';
                break;
            case 1:
                heart2.style['visibility'] = 'hidden';
                heart1.style['visibility'] = 'visible';
                break;
            case 0:
                heart1.style['visibility'] = 'hidden';
                break;
        }
    }
}

global.winLevel = function () {
    for (let i = 0; i < global.allGameObjects.length; i++) {
        global.allGameObjects[i].stop();
    }
    let finishY = global.finish.y;

    for (let i = 0; i < global.projectiles.length; i++) {
        global.projectiles[i].active = false;
        global.projectiles[i].onScreen = false;
    }
    global.gameRunning = false;
    global.playerObject.xVelocity = global.gameSpeed;
    if (global.playerObject.y < finishY - global.canvasFraction * 0.05) {
        global.playerObject.yVelocity = global.playerObject.speed;
    } else if (global.playerObject.y > finishY + global.canvasFraction * 0.05) {
        global.playerObject.yVelocity = -global.playerObject.speed;
    } else {
        global.playerObject.y = finishY;
        global.playerObject.yVelocity = 0;
    }
}

export { global }