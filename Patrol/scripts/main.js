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
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.update = function(){
        ctx = gameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

function updateGameArea() {
    gameArea.clear();
    player.update();
}