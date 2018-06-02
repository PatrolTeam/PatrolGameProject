var player;

//enemies and obstacles
var myObstacles = [];
var maxObstacles = 1;
var staticObstaclesCount = 0;
var pitsCount = 0;
var enemiesCount = 0;
var enemiesSpawnRate = 400;

var background;
var groundLine;
var planets;

//score
var score;
var scoreBG;
var scoreCount;

var isFlying = true;
var jumpFrame = 0;

//bullets
var bullets = [];
var upBullets = [];

var airshipBullets = [];
var bomberBullets = [];
var tankBullets = [];

//start menu buttons
var startBtn = document.createElement("button");
var highScoreBtn = document.createElement("button");
var exitBtn = document.createElement("button");

//high score menu
var backBtn = document.createElement("button");
var resetBtn = document.createElement("button");

var highScoreTable;
var namesArr = [];
var localStorageName = ["first name", "second name", "third name", "fourth name", "fifth name"];
var highScoreArr = [];
var localStorageHighScoreArr = ["first score","second score","third score","fourth score","fifth score"];

//game over menu
var gameOver;
var restartBtn = document.createElement("button");

function startGame() {
    gameArea.start();
    startBtn.remove();
    highScoreBtn.remove();
    exitBtn.remove();
    backBtn.remove();
    restartBtn.remove();
    //restartBtn.remove();

    player = new component(113, 48, "resources/images/player/1.png", 10, 432, "image");
    player.imgArr = ["resources/images/player/1.png", "resources/images/player/2.png", "resources/images/player/3.png", "resources/images/player/4.png"];
    player.isShooting = false;

    score = new component("30px", "kenvector_future", "white", 400, 40, "text");
    score.text = "SCORE: " + (gameArea.frameNo / 100).toFixed(0);
    scoreBG = new component(250, 48, "resources/images/UI/scorePanel.png", 390, 5, "background");
    gameOver = new component("40px", "kenvector_future", "white ", 195, 240, "text");

    background = new component(960, 480, "resources/images/background/game_background.png", 0, 0, "background");
    groundLine = new component(960, 48, "resources/images/ground/ground.png", 0, 480 - 48, "background");

    //restart = new component("30px", "kenvector_future", "white", 145, 270,"text");
    planets = new component(960,480,"resources/images/background/desertPlanets.png", -150,-15,"background");

}


var gameArea = {
    canvas : document.createElement("canvas"),

    startMenu: function(){

        for (var i = 0; i < localStorageHighScoreArr.length; i++){
            if(localStorage.getItem(localStorageHighScoreArr[i]) == null) {
                highScoreArr[i] = 0;

            } else {
                highScoreArr[i] = localStorage.getItem(localStorageHighScoreArr[i]);
            }
        }

        for (var i = 0; i < localStorageName.length; i++){
            if(localStorage.getItem(localStorageName[i]) == null) {
                namesArr[i] = 'Martian';
            } else {
                namesArr[i] = localStorage.getItem(localStorageName[i]);
            }
        }

        //start menu size
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.canvas.style.border = "solid";
        this.canvas.style.backgroundImage = "url('resources/images/background/menu_background_small.png')";
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        var marginTop = "300px";

        //start button
        document.body.insertBefore(startBtn,document.body.childNodes[0]);
        startBtn.innerHTML = "START";
        startBtn.addEventListener("click", startGame);

        //high score button
        document.body.insertBefore(highScoreBtn,document.body.childNodes[0]);
        highScoreBtn.innerHTML = "HIGH SCORE";

        highScoreBtn.addEventListener("click",function highScore() {
            startBtn.remove();
            highScoreBtn.remove();
            exitBtn.remove();

            //high score table
            initHighScoreTable();

            //back button
            document.body.insertBefore(backBtn,document.body.childNodes[0]);
            backBtn.innerHTML = "BACK";
            backBtn.addEventListener("click", restartGame);
            backBtn.style.marginTop = "420px";
            backBtn.style.marginLeft = "430px";

            //reset button
            document.body.insertBefore(resetBtn,document.body.childNodes[0]);
            resetBtn.innerHTML = "RESET";
            resetBtn.addEventListener("click", function () {
                localStorage.clear();

//ivan
                var cells = document.getElementsByTagName("td")
                    
                for (var k = 0; k < cells.length; k += 2) {
                    cells[k].innerText = "Martian";
                    cells[k + 1].innerText = 0;
                }
            });
            resetBtn.style.marginTop = "420px";
            resetBtn.style.marginLeft = "229px";
        });

        highScoreBtn.style.marginTop = "360px";

        //exit button
        document.body.insertBefore(exitBtn,document.body.childNodes[0]);
        exitBtn.innerHTML = "EXIT";
        exitBtn.addEventListener("click",function () {
            window.close();
        });
        exitBtn.style.marginTop = "420px";
    },

    start : function() {
        // game window size
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.canvas.style.border = "solid";
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
            player.isShooting = false;
        });
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function () {
        clearInterval(this.interval);

        //take score
        scoreCount = parseInt(score.text.substring(7));

        //check high score
        var isHighScore = false;
        var indexOfHighScoreArr;
        if (scoreCount < highScoreArr[4]){
            gameOver.text = "GAME OVER!";
            gameOver.update();

            //restart button
            document.body.insertBefore(restartBtn, document.body.childNodes[0]);
            restartBtn.innerHTML = "MAIN MENU";
            restartBtn.addEventListener("click", restartGame);
        }
        else{
            for (var i = 0; highScoreArr.length; i++){

                if (scoreCount >= highScoreArr[i]){
                    isHighScore = true;
                    var currScore = highScoreArr[i];
                    var currName = namesArr[i];
                    highScoreArr[i] = scoreCount;
                    indexOfHighScoreArr = i;

                    localStorage.setItem(localStorageHighScoreArr[i], highScoreArr[i]);
                    for (var j = i + 1; j < highScoreArr.length; j++) {
                        var temp = highScoreArr[j];
                        var tempName = namesArr[j];

                        highScoreArr[j] = currScore;
                        namesArr[j] = currName;

                        currScore = temp;
                        currName = tempName;

                        localStorage.setItem(localStorageHighScoreArr[j], highScoreArr[j]);
                        localStorage.setItem(localStorageName[j], namesArr[j]);

                    }
                    break;
                }
            }
        }


        if (isHighScore === true) {
            var gameOverTable = document.createElement("TABLE");
            document.body.insertBefore(gameOverTable, document.body.childNodes[0]);
            gameOverTable.setAttribute("id", "gameOverTable");

            //gameOverTable.setAttribute('border', '1px');
            var tableTitle = document.createElement("TH");
            tableTitle.setAttribute('colSpan', '2');
            tableTitle.innerText = "Game Over";
            gameOverTable.appendChild(tableTitle);

            //first row with text field
            var firstRow = document.createElement("tr");
            gameOverTable.appendChild(firstRow);
            var firstCell = document.createElement("td");
            gameOverTable.appendChild(firstCell);
            firstCell.innerText = " Enter your name:\n";
            firstCell.style.fontSize = "20px";

            //text field
            var textfield = document.createElement("INPUT");
            textfield.setAttribute("type", "text");
            textfield.setAttribute("placeholder", "Your name...");
            textfield.setAttribute("maxLength", "20");
            firstCell.appendChild(textfield);

            //second row with buttons
            var secondRow = document.createElement("tr");
            gameOverTable.appendChild(secondRow);
            var secondCell = document.createElement("td");
            secondRow.appendChild(secondCell);
            var submitBtn = document.createElement("input");
            submitBtn.setAttribute("type", "submit");
            submitBtn.setAttribute("value", "Submit");
            secondCell.appendChild(submitBtn);

            submitBtn.addEventListener("click", function () {
                if (textfield.value === "") {
                    namesArr[indexOfHighScoreArr]= "Martian";
                } else {
                    namesArr[indexOfHighScoreArr] = textfield.value;
                }

                localStorage.setItem(localStorageName[indexOfHighScoreArr], namesArr[indexOfHighScoreArr]);

                //show high score table
                gameOverTable.remove();
                initHighScoreTable();

                //buttons to main menu
                var mainMenuBtn = document.createElement("button");
                document.body.insertBefore(mainMenuBtn, document.body.childNodes[0]);
                mainMenuBtn.setAttribute("id","mainMenuBtn");
                mainMenuBtn.innerHTML = "MAIN MENU";
                mainMenuBtn.addEventListener("click", restartGame);
            });

        } else {
            gameOver.text = "GAME OVER!";
            gameOver.update();

            //restart button
            document.body.insertBefore(restartBtn, document.body.childNodes[0]);
            restartBtn.innerHTML = "MAIN MENU";
            restartBtn.addEventListener("click", restartGame);
        }
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
                    this.x + this.width - 2, this.y, this.width, this.height);
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
        var rockbottom = gameArea.canvas.height - this.height - groundLine.height;

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
            obstacleLeft += otherobj.width / 3 + 32;
            obstacleRight -= otherobj.width / 3 + 32;
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
    [144, 48, "resources/images/objects/spike_pit_small.png", "underground"],
    [64, 48, "resources/images/enemies/airship.png", "airship"],
    [82, 48, "resources/images/enemies/bomber.png", "bomber"],
    [102, 48, "resources/images/enemies/tank/1.png", "tank"],
];

var tankArr = ["resources/images/enemies/tank/1.png", "resources/images/enemies/tank/2.png", "resources/images/enemies/tank/3.png", "resources/images/enemies/tank/4.png"];

var explosionArr = ["resources/images/explosion/1.png", "resources/images/explosion/2.png", "resources/images/explosion/3.png", "resources/images/explosion/4.png","resources/images/explosion/5.png","resources/images/explosion/6.png",
    "resources/images/explosion/7.png", "resources/images/explosion/8.png","resources/images/explosion/9.png","resources/images/explosion/10.png","resources/images/explosion/11.png","resources/images/explosion/12.png",
    "resources/images/explosion/13.png","resources/images/explosion/14.png","resources/images/explosion/15.png","resources/images/explosion/16.png"];

function updateGameArea() {

    // manage player animation
    if (gameArea.frameNo === 1 || everyinterval(10)) {
        player.currFrame++;
        if (player.currFrame > 3) {
            player.currFrame = 0;
        }

        player.image.src = player.imgArr[player.currFrame];
    }

    if (gameArea.frameNo - jumpFrame === 10 && isFlying) {
        player.gravity = 0.5;
    }

    // manage player-obstacle collision
    for (i = 0; i < myObstacles.length; i++) {
        let obstacle = myObstacles[i];

        if (player.crashWith(obstacle) && !obstacle.isDead) {
            gameArea.stop();
            return;
        }
    }
    for (i = 0; i < airshipBullets.length; i++) {
        if (player.crashWith(airshipBullets[i])) {
            gameArea.stop();
            return;
        }
    }
    for (i = 0; i < bomberBullets.length; i++) {
        if (player.crashWith(bomberBullets[i])) {
            gameArea.stop();
            return;
        }
    }
    for (i = 0; i < tankBullets.length; i++) {
        if (player.crashWith(tankBullets[i])) {
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

    scoreBG.speedX = 0;
    scoreBG.newPos();
    scoreBG.update();

    if (!isFlying) {
        player.speedX = 0;
        player.speedY = 0;
    }

    // handle keyboard input
    if (gameArea.keys && gameArea.keys[65]) {
        moveLeft()
    }
    if (gameArea.keys && gameArea.keys[68]) {
        moveRight()
    }
    if (gameArea.keys && gameArea.keys[32]) {
        jump()
    }
    if (gameArea.keys && gameArea.keys[67]) {
        if (!player.isShooting) {
            player.isShooting = true;

            shoot();
        }
    }

    // spawn obstacles logic
    if (gameArea.frameNo > 60 && everyinterval(enemiesSpawnRate) && myObstacles.length < maxObstacles) {
        // var index = Math.floor((Math.random() * 10)) % enemies.length;

        let spawnedCorrectType = false;
        while (!spawnedCorrectType) {
            var index = randomNumberBetween(0, enemies.length - 1);
            var currObstacle = enemies[index];

            if (currObstacle[3] === "tank" && staticObstaclesCount > 0) {
                spawnedCorrectType = false;
            } else if (currObstacle[3] === "underground" && pitsCount > 0) {
                spawnedCorrectType = false;
            } else if (currObstacle[3] === "airship" && enemiesCount > 0) {
                spawnedCorrectType = false;
            } else {
                spawnedCorrectType = true;
            }
        }

        var obstacle = new component(currObstacle[0], currObstacle[1], currObstacle[2], 0, 0, "image");
        obstacle.x = gameArea.canvas.width;

        if (currObstacle[3] === "ground") {
            staticObstaclesCount++;

            obstacle.y = gameArea.canvas.height - groundLine.height - obstacle.height;
            obstacle.speedX = -1;
        } else if (currObstacle[3] === "underground") {
            staticObstaclesCount++;
            pitsCount++;

            obstacle.y = gameArea.canvas.height - groundLine.height;
            obstacle.speedX = -1;
        } else if (currObstacle[3] === "airship") {
            enemiesCount++;

            obstacle.x = gameArea.canvas.width;
            obstacle.y = 60;

            obstacle.speedX = -1;
            obstacle.destinationPoint = randomNumberBetween(100, 500);
        } else if (currObstacle[3] === "bomber") {
            enemiesCount++;

            obstacle.y = 100;

            // let startingPoint = Math.floor((Math.random() * 10) + 1);
            let startingPoint = randomNumberBetween(1, 10);
            if (startingPoint <= 5) {
                obstacle.x = 0;
                obstacle.speedX = 3;
            } else {
                obstacle.x = gameArea.canvas.width;
                obstacle.image.src = "resources/images/enemies/bomber2.png";

                obstacle.speedX = -3;
            }
        } else if (currObstacle[3] === "tank") {
            enemiesCount++;

            obstacle.y = gameArea.canvas.height - groundLine.height - obstacle.height;
            obstacle.speedX = -1.5;
            obstacle.currFrame = 0;
        }

        obstacle.isDead = false;
        obstacle.obstacleType = currObstacle[3];

        myObstacles.push(obstacle);
    }


    // manage obstacles
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myObstacles[i].isDead === true) {
            if (everyinterval(3)) {

                if (myObstacles[i].currFrame > 15) {

                    myObstacles.splice(i, 1);
                    continue;
                } else {
                    if (myObstacles[i].obstacleType === "ground") {
                        myObstacles[i].x += -2;
                    }

                    myObstacles[i].image.src = explosionArr[myObstacles[i].currFrame];
                    myObstacles[i].currFrame++;
                }
            }
        } else {
            myObstacles[i].x += myObstacles[i].speedX;

            if (myObstacles[i].obstacleType === "tank" && everyinterval(10)) {
                if (myObstacles[i].currFrame > 3) {
                    myObstacles[i].currFrame = 0;
                }

                myObstacles[i].image.src = tankArr[myObstacles[i].currFrame];
                myObstacles[i].currFrame++;

                if (everyinterval(150)) {
                    let bulletX = myObstacles[i].x - 32;
                    let bulletY = myObstacles[i].y + myObstacles[i].height / 2 - 16;

                    let newBullet = new component(35, 18, "resources/images/objects/bullet2.png", bulletX, bulletY, "image");
                    newBullet.speedX = -2;
                    newBullet.speedY = 0;

                    tankBullets.push(newBullet);
                }
            }

            if (myObstacles[i].obstacleType === "airship") {
                let airship = myObstacles[i];

                if (airship.speedX != 0) {
                    if (airship.x <= airship.destinationPoint) {
                        airship.speedX = 0;
                    }
                } else if (everyinterval(150)) {
                    let bulletX = airship.x + airship.width / 2 - 10;
                    let bulletY = airship.y + 48;

                    let distanceX = bulletX - (player.x + player.width / 2);
                    let distanceY = gameArea.canvas.height - bulletY - groundLine.height - player.height;
                    let ratio = distanceX / distanceY;

                    let newBullet = new component(24, 24, "resources/images/objects/bullet4.png", bulletX, bulletY, "image");

                    newBullet.speedY = 1;
                    newBullet.speedX = newBullet.speedY * ratio;

                    airshipBullets.push(newBullet);
                }
            }
            if (myObstacles[i].obstacleType === "bomber" && everyinterval(100)) {
                let bulletX = myObstacles[i].x + myObstacles[i].width / 2 - 10;
                let bulletY = myObstacles[i].y + 48;

                let newBullet = new component(18, 48, "resources/images/objects/bullet1.png", bulletX, bulletY, "image");
                newBullet.speedX = 0;
                newBullet.speedY = 1;

                bomberBullets.push(newBullet);
            }
        }

        //delete obstacles outside the window
        if (myObstacles[i].x < -0 - myObstacles[i].width || myObstacles[i].x > gameArea.canvas.width) {

            if (myObstacles[i].obstacleType === "underground") {
                staticObstaclesCount--;
                pitsCount--;
            } else if (myObstacles[i].obstacleType === "bomber" && myObstacles[i].obstacleType === "tank") {
                enemiesCount--;
            }

            myObstacles.splice(i, 1);
            i--;

            // add score when dodging obstacles
            addScore(10);

            continue;
        }

        myObstacles[i].update();

    }

    // manage bullets
    for (i = 0; i < bullets.length; i++) {
        bullets[i].x += bullets[i].speedX;
        bullets[i].update();


        //delete bullets outside the window
        if (bullets[i].x > gameArea.canvas.width) {
            bullets.splice(i, 1);
            continue;
        }

        //check bullet collisions
        for (j = 0; j < myObstacles.length; j++) {
            if (bullets[i] != null && bullets[i].crashWith(myObstacles[j]) && myObstacles[j].isDead === false) {
                myObstacles[j].isDead = true;
                myObstacles[j].width = 48;
                myObstacles[j].height = 48;
                myObstacles[j].currFrame = 0;

                addDeathScore(myObstacles[j]);

                bullets.splice(i, 1);
            }
        }
        for (j = 0; j < bomberBullets.length; j++) {
            if (bullets[i] != null && bullets[i].crashWith(bomberBullets[j])) {
                bomberBullets.splice(j, 1);

                bullets.splice(i, 1);

                addScore(3);
            }
        }
        for (j = 0; j < airshipBullets.length; j++) {
            if (bullets[i] != null && bullets[i].crashWith(airshipBullets[j])) {
                airshipBullets.splice(j, 1);

                bullets.splice(i, 1);

                addScore(5);
            }
        }
        for (j = 0; j < tankBullets.length; j++) {
            if (bullets[i] != null && bullets[i].crashWith(tankBullets[j])) {
                tankBullets.splice(j, 1);

                bullets.splice(i, 1);

                addScore(3);
            }
        }
    }


    for (i = 0; i < upBullets.length; i++) {
        upBullets[i].y -= upBullets[i].speedY;
        upBullets[i].update();

        //delete bullets outside the window
        if (upBullets[i].y + upBullets[i].height < 0) {
            upBullets.splice(i, 1);
            continue;
        }

        //check bullet collisions
        for (j = 0; j < myObstacles.length; j++) {
            if (upBullets[i] != null && upBullets[i].crashWith(myObstacles[j]) && myObstacles[j].isDead === false) {
                myObstacles[j].isDead = true;
                myObstacles[j].width = 48;
                myObstacles[j].height = 48;
                myObstacles[j].currFrame = 0;

                addDeathScore(myObstacles[j]);

                upBullets.splice(i, 1);

            }
        }
        for (j = 0; j < bomberBullets.length; j++) {
            if (upBullets[i] != null && upBullets[i].crashWith(bomberBullets[j])) {
                bomberBullets.splice(j, 1);

                upBullets.splice(i, 1);
            }
        }
        for (j = 0; j < airshipBullets.length; j++) {
            if (upBullets[i] != null && upBullets[i].crashWith(airshipBullets[j])) {
                airshipBullets.splice(j, 1);

                upBullets.splice(i, 1);
            }
        }
    }


    // manage airship bullets
    for (i = 0; i < airshipBullets.length; i++) {
        airshipBullets[i].y += airshipBullets[i].speedY;
        airshipBullets[i].x -= airshipBullets[i].speedX;
        airshipBullets[i].update();

        //delete bullets outside the window
        if (airshipBullets[i].y > gameArea.canvas.height - groundLine.height - airshipBullets[i].height) {
            airshipBullets.splice(i, 1);
            continue;
        }
    }

    // manage bomber bullets
    for (i = 0; i < bomberBullets.length; i++) {
        bomberBullets[i].y += bomberBullets[i].speedY;
        bomberBullets[i].update();

        //delete bullets outside the window
        if (bomberBullets[i].y > gameArea.canvas.height - groundLine.height - bomberBullets[i].height) {
            bomberBullets.splice(i, 1);
            continue;
        }
    }

    // manage tank bullets
    for (i = 0; i < tankBullets.length; i++) {
        tankBullets[i].x += tankBullets[i].speedX;
        tankBullets[i].update();

        //delete bullets outside the window
        if (tankBullets[i].x < 0) {
            tankBullets.splice(i, 1);
            continue;
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

function shoot() {
    let bullet = new component(30, 24, "resources/images/objects/bullet3.png", player.x + player.width + 1, player.y , "image");
    bullet.speedX = 8;

    let upBullet = new component(24, 30, "resources/images/objects/upBullet.png", player.x + player.width / 2 - 10, player.y - 30, "image");
    upBullet.speedY = 8;

    upBullets.push(upBullet);
    bullets.push(bullet);
}

function addScore(n) {
    var newScore = parseInt(score.text.substring(7)) + n;
    score.text = "SCORE: " + newScore;

    adjustDifficulty(newScore);
}

function addDeathScore(obstacle) {

    console.log(obstacle.obstacleType);

    // add score when destroying obstacles
    switch (obstacle.obstacleType) {
        case "bomber":
            enemiesCount--;
            addScore(50);
            break;
        case "tank":
            enemiesCount--;
            addScore(40);
            break;
        case "airship":
            enemiesCount--;
            addScore(30);
            break;
        case "ground":
            staticObstaclesCount--;
            addScore(20);
            break;
    }
}

function adjustDifficulty(scorePoints) {
    if (scorePoints > 2500) {
        maxObstacles = 4;
        enemiesSpawnRate = 100;
    } else if (scorePoints > 1500) {
        enemiesSpawnRate = 150;
    } else if (scorePoints > 1000) {
        maxObstacles = 3;
        enemiesSpawnRate = 200;
    } else if (scorePoints > 500) {
        enemiesSpawnRate = 300;
    } else if (scorePoints > 200) {
        maxObstacles = 2;
    }
}

function initHighScoreTable() {
    highScoreTable = highScoreTable = document.createElement("TABLE");

    document.body.insertBefore(highScoreTable,document.body.childNodes[0]);
    highScoreTable.setAttribute("id", "highScoreTable");

    //highScoreTable.setAttribute('border', '1px');
    var tableTitle = document.createElement("TH");
    tableTitle.setAttribute('colSpan', '2');
    tableTitle.innerText = "High Score";
    highScoreTable.appendChild(tableTitle);

    var tableBody = document.createElement("tbody");
    highScoreTable.appendChild(tableBody);

    var tableRows;
    var tableCells;
    var tableCells2;
    tableTitle.innerText = "High Score";

    //create 5 rows in table
    for (var i = 0; i < 5; i++){
        tableRows = document.createElement("TR");
        tableBody.appendChild(tableRows);

        //cells with names
        tableCells = document.createElement("td");
        tableCells.setAttribute("id", "nameCell");
        tableRows.appendChild(tableCells);
        tableCells.innerText = namesArr[i];


        //cells with high score
        tableCells2= document.createElement("td");
        tableCells2.setAttribute("id","highScoreCell");
        tableRows.appendChild(tableCells2);
        tableCells2.innerText = highScoreArr[i];

    }
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}