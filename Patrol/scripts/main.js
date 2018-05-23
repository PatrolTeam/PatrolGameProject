var player;
var myObstacles = [];
var score;
var gameOver;
var background;
var groundLine;
var restart;
var groundHeight = 48;
var isFlying = true;

var jumpFrame = 0;

var planets;

var bullets = [];
var upBullets = [];

function startGame() {
    gameArea.start();

    player = new component(113, 48, "resources/images/player/1.png", 10, 432, "image");
    player.imgArr = ["resources/images/player/1.png", "resources/images/player/2.png", "resources/images/player/3.png", "resources/images/player/4.png"];

    score = new component("30px", "Consolas", "white", 470, 40, "text");
    score.text = "SCORE: " + (gameArea.frameNo / 100).toFixed(0);

    gameOver = new component("30px", "Consolas", "white ", 250, 240, "text");

    background = new component(960, 480, "resources/images/background/BG.png", 0, 0, "background");
    groundLine = new component(960, 48, "resources/images/ground/ground.png", 0, 480 - groundHeight, "background");

    restart = new component("30px", "Consolas", "white", 145, 270,"text");
    planets = new component(960,480,"resources/images/background/desertPlanets.png", -150,-15,"background");

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
        this.currFrame = 0;
        this.imgArr = [];
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
        var rightBorder = gameArea.canvas.width  - this.width;
        
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
            this.gravitySpeed = 0;
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

        if (otherobj.obstacleType === "underground") {
            obstacleLeft += otherobj.width / 3;
            obstacleRight -= otherobj.width / 3;
        }

        var crash = true;

        if ((playerBottom < obstacleTop) || (playerTop > obstacleBottom) || (playerRight < obstacleLeft) || (playerLeft > obstacleRight)) {
            crash = false;
        }

        return crash;
    }
}

var enemies = [
    [48, 48, "resources/images/objects/stoneblock.png", "ground"],
    [144, 48, "resources/images/objects/pit.png", "underground"],
    [64, 48, "resources/images/enemies/bomber.png", "slow"],
    [82, 48, "resources/images/enemies/airship.png", "fast"]
];

var explosionArr = ["resources/images/explosion/1.png", "resources/images/explosion/2.png", "resources/images/explosion/3.png", "resources/images/explosion/4.png","resources/images/explosion/5.png","resources/images/explosion/6.png",
    "resources/images/explosion/7.png", "resources/images/explosion/8.png","resources/images/explosion/9.png","resources/images/explosion/10.png","resources/images/explosion/11.png","resources/images/explosion/12.png",
    "resources/images/explosion/13.png","resources/images/explosion/14.png","resources/images/explosion/15.png","resources/images/explosion/16.png"];

function updateGameArea() {

    // manage player animation
    if (gameArea.frameNo === 1 || everyinterval(10)) {
        player.currFrame++;
        if (player.currFrame > 3){
            player.currFrame = 0;
        }

        player.image.src = player.imgArr[player.currFrame];
    }

    if (gameArea.frameNo - jumpFrame === 10 && isFlying) {
        player.gravity = 0.5;
    }

    // manage player-obstacle collision
    for (i = 0; i< myObstacles.length; i += 1) {
        if (player.crashWith(myObstacles[i])) {
            gameArea.stop();
            return;
        }
    }

    // clear game area
    gameArea.clear();

    background.speedX = -0.5;
    background.newPos();
    background.update();

    groundLine.speedX = -1;
    groundLine.newPos();
    groundLine.update();

    planets.speedX = 0;
    planets.newPos();
    planets.update();

    if (!isFlying) {
        player.speedX = 0;
        player.speedY = 0;
    }

    // handle keyboard input
    if (gameArea.keys && gameArea.keys[65]) {moveLeft() }
    if (gameArea.keys && gameArea.keys[68]) {moveRight() }
    if (gameArea.keys && gameArea.keys[32]) {jump()}
    if (gameArea.keys && gameArea.keys[67]) {shoot(); upShoot()}

    // spawn obstacles logic
    if (gameArea.frameNo > 60 && everyinterval(600)) {
        var index = Math.floor((Math.random() * 10)) % enemies.length;
        var currObstacle = enemies[index];

        obstacleWidth = currObstacle[0];
        obstacleHeight = currObstacle[1];

        obstacleX = gameArea.canvas.width;
        if (currObstacle[3] === "ground") {
            console.log("ground");
            obstacleY = gameArea.canvas.height - groundHeight - obstacleHeight;
        } else if (currObstacle[3] === "underground") {
            console.log("underground");
            obstacleY = gameArea.canvas.height - groundHeight;
        } else if (currObstacle[3] === "slow" || currObstacle[3] === "fast") {
            obstacleX = 0;
            obstacleY = 100;
        }

        var obstacle = new component(obstacleWidth, obstacleHeight, currObstacle[2], obstacleX, obstacleY, "image");

        if (currObstacle[3] === "fast") {
            obstacle.speedX = 5;
        } else if (currObstacle[3] === "slow") {
            obstacle.speedX = 3;
        }
      
        obstacle.isDead = false;
        obstacle.obstacleType = currObstacle[3];
      
        myObstacles.push(obstacle);
    }


    // manage obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myObstacles[i].isDead === true) {
            if (everyinterval(3)) {
                if (myObstacles[i].currFrame > 15){

                    // add score when destroying obstacles
                    switch (myObstacles[i].obstacleType) {
                        case "fast":
                            addScore(50);
                            break;
                        case "slow":
                            addScore(30);
                            break;
                        case "ground":
                            addScore(20);
                            break;
                    }

                    myObstacles.splice(i, 1);
                } else {
                    myObstacles[i].image.src = explosionArr[myObstacles[i].currFrame];
                }
                myObstacles[i].currFrame++;
            }
        } else {
            myObstacles[i].x += -1 + myObstacles[i].speedX;
        }

        //delete obstacles outside the window
        if (myObstacles[i].x < -0 - myObstacles[i].width) {
            myObstacles.splice(i, 1);
            i--;
          
            // add score when dodging obstacles
            addScore(10);
        }

        //myObstacles[i].newPos();
        myObstacles[i].update();

    }

    // manage bullets
    for (i = 0; i < bullets.length; i++) {
            bullets[i].x += 5.1;
            bullets[i].update();


        //delete bullets outside the window
        if (bullets[i].x > gameArea.canvas.width) {
            bullets.splice(i, 1);
        }

        //check bullet collisions
        for (j = 0; j < myObstacles.length; j++) {
            if (bullets[i].crashWith(myObstacles[j]) && myObstacles[j].isDead === false) {
                myObstacles[j].isDead = true;

                bullets.splice(i, 1);
                j--;
            }
        }
    }

    for (i = 0; i < upBullets.length; i++) {
        upBullets[i].y -= 3;
        upBullets[i].update();

        //delete bullets outside the window
        if (upBullets[i].x > gameArea.canvas.width) {
            upBullets.splice(i, 1);
        }

        //check bullet collisions
        for (j = 0; j < myObstacles.length; j++) {
            if (upBullets[i].crashWith(myObstacles[j]) && myObstacles[j].isDead === false) {
                myObstacles[j].isDead = true;
                myObstacles[j].width = 48;
                myObstacles[j].height = 48;

                upBullets.splice(i, 1);
            }
        }
    }

    if (everyinterval(100)) {
        addScore(1);
    }
    score.update();

    player.movePlayer();
    player.update();

    // next frame
    gameArea.frameNo += 1;
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

function jump() {
    if (!isFlying) {
        player.gravity = -1;
        player.speedX += 3;
        isFlying = true;
        jumpFrame = gameArea.frameNo;
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

var upBulletCount = 0;
function upShoot() {
    upBulletCount++;
    if (upBulletCount > 10) {
        upBulletCount = 1;
    }
    if (upBulletCount === 1) {
        upBullets.push(new component(24, 30, "resources/images/objects/upBullet.png", player.x + player.width / 2 - 10, player.y - 30, "image"));
    }
}

function addScore(n) {
    var newScore = parseInt(score.text.substring(7)) + n;
    score.text = "SCORE: " + newScore;
}