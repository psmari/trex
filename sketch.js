var trex;
var animacao;
var animacaoDerrota;
var solo;
var soloImage;
var solo2;
var num = 0;
var nuvem;
var animacaoNuvem;

var cacto;
var cacto1;
var cacto2;
var cacto3;
var cacto4;
var cacto5;
var cacto6;

var placar = 0;


const JOGAR = 1;
const ENCERRAR = 0;

var estado = JOGAR;

var grupoNuvem;
var grupoCacto;

var spriteGameOver;
var gameOver;

var spriteRestart;
var recomecar;

var jump;
var die;
var checkpoint;


function preload() {
    animacao = loadAnimation('trex1.png', 'trex2.png', 'trex3.png');
    soloImage = loadImage('ground2.png');
    animacaoNuvem = loadImage('cloud.png');
    animacaoDerrota = loadAnimation('trex_collided.png');
    gameOver = loadImage('gameOver.png');
    recomecar = loadImage('restart.png')

    cacto1 = loadImage('obstacle1.png');
    cacto2 = loadImage("obstacle2.png");
    cacto3 = loadImage("obstacle3.png");
    cacto4 = loadImage("obstacle4.png");
    cacto5 = loadImage("obstacle5.png");
    cacto6 = loadImage("obstacle6.png");

    jump = loadSound('jump.mp3');
    die = loadSound('die.mp3');
    checkpoint = loadSound('checkPoint.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    trex = createSprite(100, 140, 10, 10);
    trex.addAnimation('trex andando', animacao);
    trex.scale = 0.5;
    trex.setCollider('circle', -10, 0, 45);
  
    trex.debug = true;
    trex.addAnimation('trex parado', animacaoDerrota);

    spriteGameOver = createSprite(width/2, 100);
    spriteGameOver.scale = 0.5;
    spriteGameOver.addImage('gameOver', gameOver);

    spriteRestart = createSprite(width/2, 150);
    spriteRestart.scale = 0.5;
    spriteRestart.addImage('recomeçar', recomecar);


    solo = createSprite(300, 180, 600, 20);
    solo.addImage('ground2.png', soloImage);

    solo2 = createSprite(300, 200, 600, 20);
    solo2.visible = false;

    grupoNuvem = new Group();

    grupoCacto = new Group();




    

}

function criaNuvem() {
    if(frameCount % 60 == 0) {
        num = Math.round(random(30, 80));
        nuvem = createSprite(600, num, 340, 10);
        nuvem.addImage('animacao', animacaoNuvem);
        nuvem.lifetime = 230;
        nuvem.velocityX = -3;
        nuvem.scale = 0.5;
        
        nuvem.depth = trex.depth;
        trex.depth = trex.depth + 1;

        grupoNuvem.add(nuvem);

        
    }
}

function criarCacto() {
    if(frameCount % 60 == 0) {
        cacto = createSprite(600, 170, 30, 30);
       
        if((6 + Math.round(placar / 100)) > 20) {
            cacto.velocityX = -20;


        } 
        else {
            cacto.velocityX = -(6 + Math.round(placar / 100));
        }

        
        var numCacto = Math.round(random(1, 6));
        switch(numCacto) {
            case 1:
                cacto.addImage('cacto1', cacto1);
            break;
            case 2:
                cacto.addImage('cacto2', cacto2);
            break;
            case 3:
                cacto.addImage('cacto3', cacto3);
            break;
            case 4:
                cacto.addImage('cacto4', cacto4);
            break;
            case 5:
                cacto.addImage('cacto5', cacto5);
            break;
            case 6:
                cacto.addImage('cacto6', cacto6);
            break;
            default:
            break;
            
        }

        cacto.scale = 0.5;
        cacto.lifetime = 110;
        grupoCacto.add(cacto);
    }
        
}

function reset() {
    estado = JOGAR;

    grupoCacto.destroyEach();
    grupoNuvem.destroyEach();

    trex.changeAnimation('trex andando');

    placar = 0;
}

function draw() {
    console.log(touches.length);
    background('white');
    drawSprites();

    fill('gray');
    text('pontuação ' + placar, 500, 50);

    trex.collide(solo2);

    if(estado == JOGAR) {
        placar = placar + Math.round(frameRate() / 60);
        console.log(placar % 100 == 0);
        
        if((keyDown('space') || touches.length > 0) && trex.y > 166) {
            trex.velocityY = -10;
            jump.play();
            touches = [];
        }
        

        if((4 + 3*Math.round(placar / 100)) > 45) {
            solo.velocityX = -45;
        }
        else {
            solo.velocityX = -(4 + 3*Math.round(placar / 100));
        }
        criaNuvem();
        criarCacto();

        if(solo.x < 0) {
            solo.x = solo.width / 2;
        }
        if(grupoCacto.isTouching(trex)) {
            estado = ENCERRAR;
            die.play();
          
        } 

        trex.velocityY = trex.velocityY + 0.5;

        spriteGameOver.visible = false;
        spriteRestart.visible = false;

        if(placar%100 == 0 && placar > 0){
            checkpoint.play();
        }
        
    }



    else if(estado == ENCERRAR) {
        solo.velocityX = 0;
        grupoNuvem.setVelocityXEach(0);
        grupoCacto.setVelocityXEach(0);

        grupoNuvem.setLifetimeEach(-9);
        grupoCacto.setLifetimeEach(-9);

        trex.velocityY = 0;
        trex.changeAnimation('trex parado');
        

        spriteGameOver.visible = true;
        spriteRestart.visible = true;


        if(mousePressedOver(spriteRestart)) {
            reset();
        }

    }

}