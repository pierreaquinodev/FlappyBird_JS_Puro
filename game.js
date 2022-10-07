const hitAudio = new Audio();
hitAudio.src = "./audio/hit.wav";

const sprites = new Image();
sprites.src = "./sprites.png";

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//Terrain
const terrain = {
  spriteX: 0,
  spriteY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,

  //Terrain Draw
  draw() {
    context.drawImage(
      sprites,
      terrain.spriteX,
      terrain.spriteY,
      terrain.width,
      terrain.height,
      terrain.x,
      terrain.y,
      terrain.width,
      terrain.height
    );
    context.drawImage(
      sprites,
      terrain.spriteX,
      terrain.spriteY,
      terrain.width,
      terrain.height,
      terrain.x + terrain.width,
      terrain.y,
      terrain.width,
      terrain.height
    );
  },
};

hasCollision = (flappyBird, terrain) => {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const terrainY = terrain.y;

  if (flappyBirdY >= terrainY) {
    return true;
  }
  return false;
};

function createFlappyBird() {
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    width: 34,
    height: 24,
    x: 10,
    y: 50,
    speed: 0,
    gravity: 0.25,
    jumpHeight: 4.6,

    jump() {
      flappyBird.speed = -flappyBird.jumpHeight;
    },

    update() {
      if (hasCollision(flappyBird, terrain)) {
        hitAudio.play();
        setTimeout(() => {
          changeToScreen(Screens.START);
        }, 500);

        return;
      }
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },

    draw() {
      context.drawImage(
        sprites,
        flappyBird.spriteX,
        flappyBird.spriteY,
        flappyBird.width,
        flappyBird.height,
        flappyBird.x,
        flappyBird.y,
        flappyBird.width,
        flappyBird.height
      );
    },
  };
  return flappyBird;
}

//Background
const background = {
  spriteX: 390,
  spriteY: 0,
  width: 276,
  height: 204,
  x: 0,
  y: canvas.height - 204,

  //Background Draw
  draw() {
    context.fillStyle = "#70c5ce";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x,
      background.y,
      background.width,
      background.height
    );
    context.drawImage(
      sprites,
      background.spriteX,
      background.spriteY,
      background.width,
      background.height,
      background.x + background.width,
      background.y,
      background.width,
      background.height
    );
  },
};

const getReadyMessage = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: canvas.width / 2 - 174 / 2,
  y: 50,

  draw() {
    context.drawImage(
      sprites,
      getReadyMessage.sX,
      getReadyMessage.sY,
      getReadyMessage.w,
      getReadyMessage.h,
      getReadyMessage.x,
      getReadyMessage.y,
      getReadyMessage.w,
      getReadyMessage.h
    );
  },
};

const globals = {};
let currentScreen = {};

function changeToScreen(newScreen) {
  currentScreen = newScreen;

  if (currentScreen.initialize) {
    currentScreen.initialize();
  }
}

const Screens = {
  START: {
    initialize() {
      globals.flappyBird = createFlappyBird();
    },
    draw() {
      background.draw();
      terrain.draw();
      globals.flappyBird.draw();
      getReadyMessage.draw();
    },
    click() {
      changeToScreen(Screens.GAME);
    },
    update() {},
  },
};

Screens.GAME = {
  draw() {
    background.draw();
    terrain.draw();
    globals.flappyBird.draw();
  },
  click() {
    globals.flappyBird.jump();
  },
  update() {
    globals.flappyBird.update();
  },
};

//Draw
function loop() {
  currentScreen.draw();
  currentScreen.update();

  requestAnimationFrame(loop);
}

window.addEventListener("click", function () {
  if (currentScreen.click) {
    currentScreen.click();
  }
});

changeToScreen(Screens.START);
loop();
