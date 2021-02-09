// define variables
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, ground2, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

var cakeImage, cake;


// preload images and sounds
function preload(){
  trex_running = loadAnimation("images/trex/trex1.png","images/trex/trex3.png","images/trex/trex4.png");
  trex_collided = loadAnimation("images/trex/trex_collided.png");
  
  groundImage = loadImage("images/ground2.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/obstacles/obstacle1.png");
  obstacle2 = loadImage("images/obstacles/obstacle2.png");
  obstacle3 = loadImage("images/obstacles/obstacle3.png");
  obstacle4 = loadImage("images/obstacles/obstacle4.png");
  obstacle5 = loadImage("images/obstacles/obstacle5.png");
  obstacle6 = loadImage("images/obstacles/obstacle6.png");
  
  restartImg = loadImage("images/restart.png")
  gameOverImg = loadImage("images/gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

  cakeImage = loadImage("images/cake image.png");
}

function setup() {
  // canvas to fit window
  createCanvas(windowWidth, windowHeight);
  
  // create trex sprite and add animations (scaled)
  trex = createSprite(width/4,height - 40,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  // create game over sprite & image
  gameOver = createSprite(width / 2,height / 2);
  gameOver.addImage(gameOverImg);
  // create restart sprite & image
  restart = createSprite(width / 2, (height / 2) + 40);
  restart.addImage(restartImg);
  // scale both
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  // create invisible ground sprite which is invisible
  invisibleGround = createSprite(width*6,height - 10,width*12,10);
  invisibleGround.visible = false;
  
  // create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  // set collider for trex
  trex.setCollider("rectangle",0,0,trex.width,trex.height);

  // set score as 0
  score = 0;
}

function draw()
{
  
  // add background
  background(180);

  //displaying score
  fill("white");
  textSize(15);
  text("Score: "+ score, trex.x + width/2 + width/6,50);

  //stop trex from falling down
  trex.collide(invisibleGround);

  // ground as image
  imageMode(CENTER);
  ground = image(groundImage, width*6, height-10, width*12, 20);

  // make restart and gameOver follow the trex
  restart.x = trex.x + width/4;
  gameOver.x = trex.x + width/4;
  
  // if gameState is play
  if(gameState === PLAY)
  {
    // make gameOver and restart invisible
    gameOver.visible = false;
    restart.visible = false;
    
    //scoring
    if(frameCount % 5 === 0)
    {
      score++
    }
    // for checkpoint sound
    if(score>0 && score%100 === 0)
    {
      checkPointSound.play() 
    }

    // slowly getting faster trex velocity
    trex.velocityX = 5 + (frameCount / 100);

    // camera follows trex
    camera.position.x = trex.x + width/4;
    camera.position.y = height/2;
    
    //jump when the space key is pressed
    if(touches.length > 0 || keyDown("space") && trex.y >= height - 39)
    {
        trex.velocityY = -15;
        jumpSound.play();
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();

    console.log(trex.y);
    
    // to turn gameState to win
    if(trex.x > width*11 && trex.y > invisibleGround.y - 30)
    {
      trex.velocityX = 0;
      trex.velocityY = 0;
      gameState = WIN;
    }
    // to turn gameState to end
    if(obstaclesGroup.isTouching(trex))
    {
      gameState = END;
      dieSound.play();

      gameOver.visible = true;

      trex.velocityX = 0;
      trex.velocityY = 0;
             
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    }
 
  }
  else if (gameState === END)
  {
    restart.visible = true;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
    // if the mouse is pressing the restart button reset the game
    if(mousePressedOver(restart) || touches.length > 0)
    {
      reset();
      touches = [];
    }
  }
  
  // draw sprites
  drawSprites();

  if (gameState === WIN)
  {
    fill("white");
    textSize(Math.round(width/20));
    text("YOU WIN!", trex.x + width/4, height/2);
    obstaclesGroup.destroyEach();
    imageMode(CENTER);
    cake = image(cakeImage, trex.x + width/3, invisibleGround.y-height/8, width/7, height/4);
    console.log("jeihiefh")
    if(frameCount % 500 === 0)
    {
      gameState = END;
    }
  }
}

function reset()
{
  // destroy obstacles on screen
  obstaclesGroup.destroyEach();
  // change trex animation
  trex.changeAnimation("running", trex_running);
  // change score back to 0
  score = 0;
  trex.x = width/4;
  // make gamestate play again
  gameState = PLAY;
}

function spawnObstacles()
{
  if (frameCount % 60 === 0)
  {
    // create obstacle
    var obstacle = createSprite(trex.x + width, height - 35,10,40);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = width / 3;
   
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds()
{
  if (frameCount % 60 === 0)
  {
    // create cloud with random y
    var cloud = createSprite(trex.x + width,120,40,10);
    cloud.y = Math.round(random(80,height - 100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    
    //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    gameOver.depth = cloud.depth + 1;
    restart.depth = gameOver.depth;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
