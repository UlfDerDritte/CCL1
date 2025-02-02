import { global } from "../modules/global.js";

class GameObject {

    id = -1;
    onScreen = true;
    active = true;
    name;
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    xVelocity = 0;
    yVelocity = 0;

    sprites = [];

    animationData = {
        'animationSprites': [],
        'timePerSprite': 0.1,
        'currentSpriteElapsedTime': 0,
        'firstSpriteIndex': 0,
        'lastSpriteIndex': 0,
        'currentSpriteIndex': 0
    };

    getObjectBounds = function () {
        let box = {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        }
        return box;
    };

    reactToCollision = function (otherObject) { //empty since the walls don't react
    }

    stop = function () {
        this.xVelocity = 0;
        this.yVelocity = 0;
    }

    storePrevPos = function () {    //stores the position in of the object in the previous frame
        this.prevX = this.x;
        this.prevY = this.y;
    }

    update = function () {  //empty, static by default
        this.x += this.xVelocity * global.deltaTime; // Adjust x and y position based on velocity and time elapsed since last frame ( == deltaTime)
        if (this.onScreen == true) {
            this.y += this.yVelocity * global.deltaTime;
        }
        this.edgeCollision();
    };

    draw = function () {
        let sprite = this.getNextSprite();
        global.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    };

    getNextSprite = function () {
        this.animationData.currentSpriteElapsedTime += global.deltaTime;

        if (this.animationData.currentSpriteElapsedTime >= this.animationData.timePerSprite) {
            this.animationData.currentSpriteIndex++;
            this.animationData.currentSpriteElapsedTime = 0;
            if (this.animationData.currentSpriteIndex > this.animationData.lastSpriteIndex) {
                this.animationData.currentSpriteIndex = this.animationData.firstSpriteIndex
            }
        }

        return this.animationData.animationSprites[this.animationData.currentSpriteIndex];
    };

    edgeCollision = function () {
        let objectBounds = this.getObjectBounds();
        let canvasBounds = global.getCanvasBounds();

        if (this.active == true) {
            if (objectBounds.right <= canvasBounds.left || objectBounds.left >= canvasBounds.right) {
                this.onScreen = false;
            } else if (objectBounds.left <= canvasBounds.right || objectBounds.right >= canvasBounds.left) {
                this.onScreen = true;
            }
        }
    }

    loadImages = function () {
        /* first load images from path */
        for (let i = 0; i < this.sprites.length; i++) {
            let image = new Image();
            image.src = this.sprites[i];
            this.animationData.animationSprites.push(image);
        }

        /* after images have been loaded, they are added to an array that consists of each single sprite for our animation */
    };

    loadSpritesheet(cols, rows) {
        // Calculate the number of rows and columns
        //const cols = Math.floor(spritesheetWidth / singleSpriteWidth);
        //const rows = Math.floor(spritesheetHeight / singleSpriteHeight);
        const totalSprites = cols * rows;

        // Pre-create an array with `Image` objects for all sprites
        this.animationData.animationSprites = Array.from({ length: totalSprites }, () => new Image());

        // Load the spritesheet
        const spritesheet = new Image();
        spritesheet.src = this.sprites;

        // Add a "load" event listener to the spritesheet
        spritesheet.addEventListener("load", () => {
            const spritesheetWidth = spritesheet.width;
            const spritesheetHeight = spritesheet.height;
            const singleSpriteWidth = Math.floor(spritesheetWidth / cols);
            const singleSpriteHeight = Math.floor(spritesheetHeight / rows);


            // Create a temporary canvas to extract sprites from the spritesheet
            const tempSpritesheetCanvas = document.createElement("canvas");
            const tempSpritesheetCtx = tempSpritesheetCanvas.getContext("2d");
            tempSpritesheetCanvas.width = singleSpriteWidth;
            tempSpritesheetCanvas.height = singleSpriteHeight;

            // Loop through each sprite's row and column position
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {

                    // Clear the temporary canvas and draw the specific sprite region from the spritesheet
                    tempSpritesheetCtx.clearRect(0, 0, singleSpriteWidth, singleSpriteHeight);
                    tempSpritesheetCtx.drawImage(
                        spritesheet,
                        col * singleSpriteWidth,
                        row * singleSpriteHeight,
                        singleSpriteWidth,
                        singleSpriteHeight,
                        0,
                        0,
                        singleSpriteWidth,
                        singleSpriteHeight
                    );

                    // assign it to the corresponding Image object
                    const index = row * cols + col;
                    this.animationData.animationSprites[index].src = tempSpritesheetCanvas.toDataURL();
                }
            }
        });
    }

    switchSpriteIndex = function (firstSpriteIndex, lastSpriteIndex) {
        this.animationData.firstSpriteIndex = firstSpriteIndex;
        this.animationData.lastSpriteIndex = lastSpriteIndex;
        this.animationData.currentSpriteIndex = firstSpriteIndex;
    }

    constructor(x, y, width, height) {  //uses the input variables to define position and size below
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.id = global.id;
        global.id += 1;

        global.allGameObjects.push(this);   //pushes the object into the allGameObjects array

        this.loadImages();
    }

}

export { GameObject };