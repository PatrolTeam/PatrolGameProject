var player;
var myObstacles = [];
var score;
var gameOver;
var background;
var groundLine;
var restart;
var groundHeight = 48;
var isFlying = true;
var imgArr = ["resources/images/player/1.png", "resources/images/player/2.png", "resources/images/player/3.png", "resources/images/player/4.png"];
var currFrame = 0;

var bullets = [];

function startGame() {
    gameArea.start();
    player = new component(113, 48, "resources/images/player/1.png", 10, 120, "image");
    score = new component("30px", "Consolas", "white", 380, 40, "text");
    gameOver = new component("30px", "Consolas", "white ", 250, 240, "text");
    background = new component(960, 480, "resources/images/background/background.png", 0, 0, "background");
    groundLine = new component(960, 48, "resources/images/ground/ground.png", 0, 480 - groundHeight, "background");
    restart = new component("30px", "Consolas", "white", 145, 270,"text");
}


var gameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        // game window size
        this.canvas.width = 640;
        this.canvas.height = 480;

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        this.frameNo = 0;

        // we update the game area 60 times per second
        this.interval = setInterval(updateGameArea, 10);
      
        window.addEventListener('keydown', function (e) {
            gameArea.keys = (gameArea.keys || []);
            gameArea.keys[e.keyCode] = true;
        });
        window.addEventListener('keyup', function (e) {
            if (e.keyCode === 32) {
                accelerateUp(0.1);
            }

            gameArea.keys[e.keyCode] = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function () {
        gameOver.text = "GAME OVER!";
        gameOver.update();
        clearInterval(this.interval);

        restart.text = "Press any key to restart";
        restart.update();
        restart = addEventListener("click",restartGame);
    }
};

function restartGame() {
    location.reload();

}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type === "image" || type === "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;

    this.update = function(){
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type === "image" || type === "background") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height);
            if (type === "background"){
                ctx.drawImage(this.image,
                    this.x + this.width, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.movePlayer = function () {

        this.gravitySpeed += this.gravity;

        var tempX = this.x + this.speedX;
        var rightBorder = gameArea.canvas.width / 2;
        
        if (tempX < 0) {
            this.x = 0;
        } else if (tempX > rightBorder) {
            this.x = rightBorder;
        } else {
            this.x += this.speedX;
        }

        this.y += this.speedY + this.gravitySpeed;

        this.hitBottom();
    }


    this.newPos = function () {

        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type === "background") {
            if (this.x === -(this.width)) {
                this.x = 0;
            }
        }
    }

    this.hitBottom = function() {
        var rockbottom = gameArea.canvas.height - this.height - groundHeight;

        if (this.y > rockbottom) {
            this.y = rockbottom;
            isFlying = false;

        }
    }
    

    this.crashWith = function (otherobj) {
        var playerLeft = this.x;
        var playerRight = this.x + (this.width);
        var playerTop = this.y;
        var playerBottom = this.y + (this.height);
        var obstacleLeft = otherobj.x;
        var obstacleRight = otherobj.x + (otherobj.width);
        var obstacleTop = otherobj.y;
        var obstacleBottom = otherobj.y + (otherobj.height);
        var crash = true;

        if ((playerBottom < obstacleTop) || (playerTop > obstacleBottom) || (playerRight < obstacleLeft) || (playerLeft > obstacleRight)) {
            crash = false;
        }
        return crash;
    }
}


function updateGameArea() {
    if (gameArea.frameNo === 1 || everyinterval(20)) {
        currFrame++;
        if (currFrame > 3){
            currFrame = 0;
        }
        player.image.src = imgArr[currFrame];
    }

    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i< myObstacles.length; i += 1) {
        if (player.crashWith(myObstacles[i])) {
            gameArea.stop();
            return;
        }
    }
    gameArea.clear();
    background.speedX = -1;
    background.newPos();
    background.update();
    groundLine.speedX = -1;
    groundLine.newPos();
    groundLine.update();
    gameArea.frameNo += 1;

    player.speedX = 0;
    player.speedY = 0;
    if (gameArea.keys && gameArea.keys[65]) {moveLeft() }
    if (gameArea.keys && gameArea.keys[68]) {moveRight() }
    if (gameArea.keys && gameArea.keys[32]) {accelerateUp(-0.2)}
    if (gameArea.keys && gameArea.keys[67]) {
        shoot();
    }

    gameArea.frameNo += 1;
    if (gameArea.frameNo === 1 || everyinterval(150)) {
        x = gameArea.canvas.width;
        minHeight = 100;
        maxHeight = 110;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 200;
        maxGap = 250;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(10, height, "green", x, 0));
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;

        //delete obstacles outside the window
        if (myObstacles[i].x < -0 - myObstacles[i].width) {
            myObstacles.splice(i, 1);
        }

        //myObstacles[i].newPos();
        myObstacles[i].update();

    }

    for (i = 0; i < bullets.length; i++) {
        bullets[i].x += 3;
        bullets[i].update();

        //delete bullets outside the window
        if (bullets[i].x > gameArea.canvas.width) {
            bullets.splice(i, 1);
        }

        //check bullet collisions
        for (j = 0; j < myObstacles.length; j++) {
            if (bullets[i].crashWith(myObstacles[j])) {
                bullets.splice(i, 1);
                myObstacles.splice(j, 1);
            }
        }
    }

    score.text = "SCORE: " + (gameArea.frameNo / 10).toFixed(0);
    score.update();
    player.movePlayer();
    player.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}

function moveLeft() {
    if (!isFlying) {
        player.speedX -= 2;
    }
}

function moveRight() {
    if (!isFlying) {
        player.speedX += 2;
    }
}

function accelerateUp(n) {
    var rockbottom = gameArea.canvas.height - player.height - groundHeight;
    if (player.y == rockbottom) {
        player.gravity = -1;
        isFlying = true;
    } else {
        player.gravity = n;
    }
}

var bulletCount = 0;
function shoot() {
    bulletCount++;
    if (bulletCount > 10) {
        bulletCount = 1;
    }
    if (bulletCount === 1) {
        bullets.push(new component(30, 24, "resources/images/objects/bullet3.png", player.x + player.width + 1, player.y , "image"));
    }
}