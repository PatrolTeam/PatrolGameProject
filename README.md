# Moon Patrol
Moon Patrol is a tiny JavaScript game created for the Practice in Video Games course at New Bulgarian University

## Team
- **Project Manager**: Dimitar Petrov
- **Lead Gameplay Programmer**: Spas Kalinov
- **Lead Graphic Designer**: Lucy Dragodanova

## Technical Documentation

### Game Area
The *gameArea* variable is a HTML 5 canvas. Most important methods associated with it:
-	*gameArea.mainMenu()* - instantiates the canvas with the given dimensions and loads the user interface;
-	*gameArea.start()* – sets up the Keyboard Event Listeners (used for user input);
-	*gameArea.clear()* – deletes everything drawn on the canvas;
-	*gameArea.stop()* – stops updating  the canvas;
-	*updateGameArea()* – the main update method of the game. Takes care of updating the canvas, moves the player and enemy/obstacle sprites, checks for collisions between player, enemies/obstacles and bullets, handles keyboard input; if the player is dead, invokes the *gameArea.stop()* method.
### Game Loop
This is the central code of the game, split into three different parts: *initialize, update* and *draw*:
-	*initialize* – the *startGame()* method. It invokes the *gameArea.start()* method and initializes the main game components – player sprite, background elements, ground line, HUD, etc.;
-	*Update* and *Draw* – the *gameArea.update()* method; the game area is updated once every 10th millisecond (100 times per second). It also takes care of clearing the redrawing the game components on the canvas.
### Component
The main object constructor is called *component*. Components have properties and methods to control their appearances and movements. Everything in the game is a *component* – the player, enemies and bullets, the background elements and the HUD.
### Player Movement
The player’s movement logic is handled in the *Update* phase by invoking the *moveLeft()*, *moveRight()* or *jump()* methods.
### Shooting
The player’s shooting logic is handled in the *Update* phase by invoking the *shoot()* method.
### Difficulty Scaling
The difficulty scaling logic is implemented in the *adjustDifficulty()* method.
### Sounds and Music
The sounds and music playback logic is implemented in two methods: *music()* and *playSound(soundType)*.
