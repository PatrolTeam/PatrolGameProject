var player;

function startGame() {
    gameArea.start();
    player = new component(30, 30, "red", 10, 120);
}

var gameArea = {
    canvas : document.createElement("canvas"),

    start : function() {
        // game window size
        this.canvas.width = 640;
        this.canvas.height = 480;

        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

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
    }
};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;

    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    };

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function updateGameArea() {
    gameArea.clear();
    player.speedX = 0;
    player.speedY = 0;
    if (gameArea.key && gameArea.key === 37) {player.speedX = -1; }
    if (gameArea.key && gameArea.key === 39) {player.speedX = 1; }
    player.newPos();
    player.update();
}

function moveLeft() {
    player.speedX -= 1;
}

function moveRight() {
    player.speedX += 1;
}