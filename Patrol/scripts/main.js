var player;
var myObstacles = [];
var score;

function startGame() {
    gameArea.start();
    player = new component(30, 30, "red", 10, 120);
    score = new component("30px", "Consolas", "black", 380, 40, "text");
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

        window.addEventListener('keydown', function (ev) {
            gameArea.key = ev.keyCode;
        })
        window.addEventListener('keyup', function (ev) {
            gameArea.key = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function () {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function(){
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        var tempX = this.x + this.speedX;
        var rightBorder = gameArea.canvas.width / 2;
        
        if (tempX < 0) {
            this.x = 0;
        } else if (tempX > rightBorder) {
            this.x = rightBorder;
        } else {
            this.x += this.speedX;
        }

        this.y += this.speedY;
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
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i< myObstacles.length; i += 1) {
        if (player.crashWith(myObstacles[i])) {
            gameArea.stop();
            return;
        }
    }
    gameArea.clear();
    gameArea.frameNo += 1;

    player.speedX = 0;
    player.speedY = 0;
    if (gameArea.key && gameArea.key === 37) {player.speedX = -2; }
    if (gameArea.key && gameArea.key === 39) {player.speedX = 2; }

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
        //myObstacles[i].newPos();
        myObstacles[i].update();
    }

    score.text = "SCORE: " + (gameArea.frameNo / 10).toFixed(0);
    score.update();
    player.newPos();
    player.update();
}

function everyinterval(n) {
    if ((gameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}

function moveLeft() {
    player.speedX -= 1;
}

function moveRight() {
    player.speedX += 1;
}