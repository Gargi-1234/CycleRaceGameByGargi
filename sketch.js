var path, mainCyclist;
var player1, player2, player3;
var pathImg, mainRacerImg1, mainRacerImg2;

var oppPink1Img, oppPink2Img;
var oppYellow1Img, oppYellow2Img;
var oppRed1Img, oppRed2Img;
var gameOverImg, cycleBell;

var pinkCG, yellowCG, redCG;

var obstacle1, obstacle2, obstacle3;
var obstacle1Img, obstacle2Img, obstacle3Img;

var END = 0;
var PLAY = 1;
var gameState = PLAY;

var distance = 0;
var gameOver, restart;

var birds, birds_eating, bird_running;

var bird1, bird_right, bird2, bird_left, bird3, bird_front;

var barricade1, barricade2, barricade3, barricadeImg, barricadeImg2;

function preload() {
  pathImg = loadImage("images/Road.png");

  mainRacerImg1 = loadAnimation(
    "images/mainPlayer1.png",
    "images/mainPlayer2.png"
  );
  mainRacerImg2 = loadAnimation("images/mainPlayer3.png");

  oppPink1Img = loadAnimation("images/opponent1.png", "images/opponent2.png");
  oppPink2Img = loadAnimation("images/opponent3.png");

  oppYellow1Img = loadAnimation("images/opponent4.png", "images/opponent5.png");
  oppYellow2Img = loadAnimation("images/opponent6.png");

  oppRed1Img = loadAnimation("images/opponent7.png", "images/opponent8.png");
  oppRed2Img = loadAnimation("images/opponent9.png");

  cycleBell = loadSound("sound/bell.mp3");
  gameOverImg = loadImage("images/gameOver.png");

  obstacle1Img = loadImage("images/obstacle1.png");

  obstacle2Img = loadImage("images/obstacle2.png");

  obstacle3Img = loadImage("images/obstacle3.png");

  rampImg = loadImage("ramp.png");

  birds_eating = loadAnimation("bird1.png", "bird2.png", "bird3.png");

  bird_right = loadAnimation("bird4.png", "bird5.png", "bird6.png");

  bird_left = loadAnimation("bird7.png", "bird8.png");

  bird_front = loadAnimation("bird9.png", "bird10.png");

  barricadeImg = loadImage("barricade.png");

  barricadeImg2 = loadImage("barricade2.png");
}

function setup() {
  createCanvas(1200, 300);

  // Moving background
  path = createSprite(100, 150);
  path.addImage(pathImg);
  path.velocityX = -5;

  //creating boy running
  mainCyclist = createSprite(70, 150);
  mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
  mainCyclist.scale = 0.1;

  //set collider for mainCyclist

  //mainCyclist.debug = true
  mainCyclist.setCollider("rectangle", 0, 0, mainCyclist.x, mainCyclist.y);

  gameOver = createSprite(650, 150);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.8;
  gameOver.visible = false;

  pinkCG = new Group();
  yellowCG = new Group();
  redCG = new Group();
  obstacle1Grp = new Group();
  obstacle2Grp = new Group();
  obstacle3Grp = new Group();
  obstacle4Grp1 = new Group();
  birdsGrp = new Group();
  barricadeGrp1 = new Group();
  barricadeGrp2 = new Group();
  barricadeGrp3 = new Group();

  bird1 = createSprite(1100, 150);
  bird1.addAnimation("runningRight", bird_right);
  bird1.scale = 0.3;
  bird1.visible = false;

  bird2 = createSprite(1100, 150);
  bird2.addAnimation("runningleft", bird_left);
  bird2.scale = 0.5;
  bird2.visible = false;

  bird3 = createSprite(1100, 150);
  bird3.addAnimation("runningfront", bird_front);
  bird3.scale = 0.2;
  bird3.visible = false;
}

function draw() {
  background(0);

  drawSprites();
  textSize(20);
  fill(255);
  text("Distance: " + distance, 900, 30);

  if (gameState === PLAY) {
    distance = distance + Math.round(getFrameRate() / 50);
    path.velocityX = -(6 + (2 * distance) / 150);

    mainCyclist.y = World.mouseY;

    edges = createEdgeSprites();
    mainCyclist.collide(edges);

    //code to reset the background
    if (path.x < 0) {
      path.x = width / 2;
    }

    //code to play cycle bell sound
    if (keyDown("space")) {
      cycleBell.play();
    }

    //creating continous opponent players
    var select_oppPlayer = Math.round(random(1, 8));

    if (World.frameCount % 150 == 0) {
      if (select_oppPlayer == 1) {
        pinkCyclists();
      } else if (select_oppPlayer == 2) {
        yellowCyclists();
      } else if (select_oppPlayer == 3) {
        redCyclists();
      } else if (select_oppPlayer == 4) {
        obstacle_2();
      } else if (select_oppPlayer == 5) {
        obstacle_1();
      } else if (select_oppPlayer == 6) {
        obstacle_4();
      } else if (select_oppPlayer == 7) {
        obstacle_5();
        obstacle_6();
        obstacle_7();
      } else {
        obstacle_3();
      }
    }

    if (pinkCG.isTouching(mainCyclist)) {
      gameState = END;
      player1.velocityY = 0;
      player1.addAnimation("opponentPlayer1", oppPink2Img);
    }

    if (yellowCG.isTouching(mainCyclist)) {
      gameState = END;
      player2.velocityY = 0;
      player2.addAnimation("opponentPlayer2", oppYellow2Img);
    }

    if (redCG.isTouching(mainCyclist)) {
      gameState = END;
      player3.velocityY = 0;
      player3.addAnimation("opponentPlayer3", oppRed2Img);
    }

    if (obstacle1Grp.isTouching(mainCyclist)) {
      obstacle1.velocityY = 0;
      gameState = END;
    }

    if (obstacle2Grp.isTouching(mainCyclist)) {
      obstacle2.velocityY = 0;
      gameState = END;
    }

    if (obstacle3Grp.isTouching(mainCyclist)) {
      obstacle2.velocityY = 0;
      gameState = END;
    }

    if (birdsGrp.collide(mainCyclist)) {
      birdsGrp.destroyEach();
      bird1.x = birds.x;
      bird2.x = birds.x;
      bird3.x = birds.x;
      bird1.visible = true;
      bird2.visible = true;
      bird3.visible = true;
      bird1.velocityX = 4;
      bird1.velocityY = -6;
      bird2.velocityX = -5;
      bird2.velocityY = 6;
      bird3.velocityY = 6;
    }

    if (barricadeGrp1.isTouching(mainCyclist)) {
      barricade1.velocityY = 0;
      gameState = END;
    }

    if (barricadeGrp2.isTouching(mainCyclist)) {
      barricade2.velocityY = 0;
      gameState = END;
    }

    if (barricadeGrp3.isTouching(mainCyclist)) {
      barricade3.velocityY = 0;
      gameState = END;
    }

    //
  } else if (gameState === END) {
    gameOver.visible = true;
    //Add code to show restart game instrution in text here

    if (obstacle2Grp.isTouching(mainCyclist)) {
      mainCyclist.visible = false;
    }

    text("Press Up Arrow to restart the Game", 500, 200);

    path.velocityX = 0;
    mainCyclist.velocityY = 0;
    mainCyclist.addAnimation("SahilRunning", mainRacerImg2);

    pinkCG.setVelocityXEach(0);
    pinkCG.setLifetimeEach(-1);

    yellowCG.setVelocityXEach(0);
    yellowCG.setLifetimeEach(-1);

    redCG.setVelocityXEach(0);
    redCG.setLifetimeEach(-1);

    obstacle1Grp.setVelocityXEach(0);
    obstacle1Grp.setLifetimeEach(-1);

    obstacle2Grp.setVelocityXEach(0);
    obstacle2Grp.setLifetimeEach(-1);

    obstacle3Grp.setVelocityXEach(0);
    obstacle3Grp.setLifetimeEach(-1);

    barricadeGrp1.setVelocityXEach(0);
    barricadeGrp1.setLifetimeEach(-1);

    barricadeGrp2.setVelocityXEach(0);
    barricadeGrp2.setLifetimeEach(-1);

    barricadeGrp3.setVelocityXEach(0);
    barricadeGrp3.setLifetimeEach(-1);

    //write condition for calling reset( )

    if (keyIsDown(UP_ARROW)) {
      reset();
    }
  }
}

function pinkCyclists() {
  player1 = createSprite(1100, Math.round(random(50, 250)));
  player1.scale = 0.1;
  player1.velocityX = -(6 + (2 * distance) / 150);
  player1.addAnimation("opponentPlayer1", oppPink1Img);
  player1.setLifetime = 170;
  pinkCG.add(player1);
}

function yellowCyclists() {
  player2 = createSprite(1100, Math.round(random(50, 250)));
  player2.scale = 0.1;
  player2.velocityX = -(6 + (2 * distance) / 150);
  player2.addAnimation("opponentPlayer2", oppYellow1Img);
  player2.setLifetime = 170;
  yellowCG.add(player2);
}

function redCyclists() {
  player3 = createSprite(1100, Math.round(random(50, 250)));
  player3.scale = 0.1;
  player3.velocityX = -(6 + (2 * distance) / 150);
  player3.addAnimation("opponentPlayer3", oppRed1Img);
  player3.setLifetime = 170;
  redCG.add(player3);
}

//create reset function here
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  mainCyclist.addAnimation("SahilRunning", mainRacerImg1);
  redCG.destroyEach();
  yellowCG.destroyEach();
  pinkCG.destroyEach();
  obstacle1Grp.destroyEach();
  obstacle2Grp.destroyEach();
  obstacle3Grp.destroyEach();
  barricadeGrp1.destroyEach();
  barricadeGrp2.destroyEach();
  barricadeGrp3.destroyEach();
  distance = 0;
  mainCyclist.visible = true;
}

function obstacle_1() {
  obstacle1 = createSprite(1100, Math.round(random(50, 250)));
  obstacle1.addImage("cone", obstacle1Img);
  obstacle1.velocityX = -(6 + (2 * distance) / 150);
  obstacle1.scale = 0.3;
  obstacle1.setLifetime = 170;

  obstacle1Grp.add(obstacle1);

  obstacle1.setCollider("rectangle", 0, 0, obstacle1.width, obstacle1.height);
}

function obstacle_2() {
  obstacle2 = createSprite(1100, Math.round(random(50, 250)));
  obstacle2.addImage("hole", obstacle2Img);
  obstacle2.velocityX = -(6 + (2 * distance) / 150);
  obstacle2.scale = 0.3;
  obstacle2.setLifetime = 170;

  obstacle2Grp.add(obstacle2);
  obstacle2.setCollider("rectangle", 0, 0, obstacle2.width, obstacle2.height);
}

function obstacle_3() {
  obstacle3 = createSprite(1100, Math.round(random(50, 250)));
  obstacle3.addImage("pines", obstacle3Img);
  obstacle3.velocityX = -(6 + (2 * distance) / 150);
  obstacle3.scale = 0.1;
  obstacle3.setLifetime = 170;

  obstacle3Grp.add(obstacle3);
  obstacle3.setCollider("rectangle", 0, 0, obstacle3.width, obstacle3.height);
}

function obstacle_4() {
  birds = createSprite(1100, 150);
  birds.addAnimation("eatingGrains", birds_eating);
  birds.scale = 0.2;
  //birds.debug = true;
  birds.setCollider("rectangle", 0, 0, 1500, 1500);
  birds.velocityX = -(6 + (2 * distance) / 150);

  birdsGrp.add(birds);
}

function obstacle_5() {
  barricade1 = createSprite(1200, 200);
  barricade1.addImage(barricadeImg);
  barricade1.scale = 1.4;
  barricade1.velocityX = -(6 + (2 * distance) / 150);
  barricadeGrp1.add(barricade1);
  barricade1.setLifetime = 170;
  barricade1.setCollider(
    "rectangle",
    0,
    0,
    barricade1.width,
    barricade1.height
  );
}

function obstacle_6() {
  barricade2 = createSprite(700, 200);
  barricade2.addImage(barricadeImg);
  barricade2.scale = 1.4;
  barricade2.velocityX = -(6 + (2 * distance) / 150);
  barricadeGrp2.add(barricade2);
  barricade2.setLifetime = 170;
  barricade2.setCollider(
    "rectangle",
    0,
    0,
    barricade2.width,
    barricade2.height
  );
}

function obstacle_7() {
  barricade3 = createSprite(950, 50);
  barricade3.addImage(barricadeImg2);
  barricade3.scale = 1.4;
  barricade3.velocityX = -(6 + (2 * distance) / 150);
  barricadeGrp3.add(barricade3);
  barricade3.setLifetime = 170;
  barricade3.setCollider(
    "rectangle",
    0,
    0,
    barricade3.width,
    barricade3.height
  );
}
