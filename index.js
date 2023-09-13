//jshint esversion:8

class Player {
  constructor(game) {
    this.game = game;
    this.width = 140;
    this.height = 120;
    this.x = this.game.width * 0.5 - (this.width * 0.5);
    this.y = this.game.height - this.height;
    this.playerImage = document.getElementById('player');
    this.jets_image = document.getElementById('player_jets');
    this.speed = 6;
    this.lives = 3;
    this.frameX = 0;
    this.maxLives = 10;
    this.jetsFrame = 1;
  }
  draw(context) {
    // sprite frames
    if (this.game.keys.indexOf(' ') > -1) {
      this.frameX = 1;
    } else {
      this.frameX = 0;
    }
    context.drawImage(this.jets_image, this.jetsFrame * this.width, 0, this.width, this.height,
      this.x, this.y, this.width, this.height);
    // context.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.playerImage, this.frameX * this.width, 0, this.width, this.height,
      this.x, this.y, this.width, this.height);
  }
  update() {

    //   if(this.x < this.game.width - this.width){
    //   this.x += this.speed;
    // }

    if (this.game.keys.indexOf('ArrowLeft') > -1) {
      this.x -= this.speed;
      this.jetsFrame = 0;
    } else if (this.game.keys.indexOf('ArrowRight') > -1) {
      this.x += this.speed;
      this.jetsFrame = 2;
    } else {
      this.jetsFrame = 1;
    }
    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - (this.width * 0.5)) this.x = this.game.width - this.width * 0.5;

  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y); // check that the pool use not exceeded number of porjectiles
  }

  restart() {
    this.x = this.game.width * 0.5 - (this.width * 0.5);
    this.y = this.game.height - this.height;
    this.lives = 3;
  }
} // End Player Class

class Projectile { // using object polling
  constructor() {
    this.width = 4;
    this.height = 20;
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.free = true;
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.fillStyle = 'gold';
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  } // End Projectile draw method
  update() {
    if (!this.free) {
      this.y -= this.speed;
      if (this.y < -this.height) this.reset();
    }
  } //end Projectile update method
  start(x, y) {
    // set to player position x,y
    this.x = x - (this.width * 0.5);
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }



} // End Projectile class
class Enemy {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = this.game.enemySize;
    this.height = this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.positionX = positionX;
    this.positionY = positionY;
    this.markedForDeletion = false;
  }
  draw(context) {
    // context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  update(x, y) {
    this.x = x + this.positionX;
    this.y = y + this.positionY;
    // check collision here
    this.game.projectilesPool.forEach(projectile => {
      if (!projectile.free && this.game.checkCollision(this, projectile) &&
        this.lives > 0) {
        // this.markedForDeletion = true;
        this.hit(1);
        projectile.reset();
        // if(!this.game.gameOver) this.game.score++;
      }
    });

    if (this.lives < 1) {
      if (this.game.spriteUpdate) this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        if (!this.game.gameOver) this.game.score += this.maxLives;
      }
    }
    // check collision enemies - Player
    if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
      this.lives = 0;

      // this.markedForDeletion = true;
      // if(!this.game.gameOver && this.game.score > 0) this.game.score--;
      this.game.player.lives--;
      // if(this.game.player.lives < 1) this.game.gameOver = true;

    }
    // lose condition
    if (this.y + this.height > this.game.height || this.game.player.lives < 1) {
      this.game.gameOver = true;
      // this.markedForDeletion = true;
    }
  }
  hit(damage) {
    this.lives -= damage;
  }
} // end Enemy class

class Boss{
  constructor(game){
    this.game = game;
    this.width = 200;
    this.height= 200;
    this.x =  this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.lives = 10;
    this.maxLives = this.lives;
    this.markedFor = false;
    this.bossImage = document.getElementById('boss');
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 11;
  }
  draw(context){
    context.drawImage(this.bossImage, this.frameX*this.width, this.frameY*this.height, this.width,
    this.height, this.x, this.y, this.width, this.height);
    context.save();
    context.textAlign = 'center';
    context.fillStyle = 'white';
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = 'black';
    if(this.lives != '0')
    context.fillText(this.lives, this.x + this.width * 0.5, this.y);
    context.restore();
  }

  update(){
    this.speedY = 0;
    if (this.game.spriteUpdate && this.lives > 0) this.frameX = 0;
    if (this.y < 0) this.y += 3;
    if (this.x < 0 || this.x > this.game.width - this.width){
      this.speedX *= -1;
      this.speedY = this.height * 0.3;
    }
    this.x += this.speedX;
    this.y += this.speedY;

    //--------------------collision detect
    this.game.projectilesPool.forEach(projectile =>{
      if (this.game.checkCollision(this, projectile) && !projectile.free && this.lives > 0){
        // this.lives--;
        this.hit(1);
        projectile.reset();
      }
    });

    // boss destroyed
    if (this.lives < 1 && this.game.spriteUpdate){
      this.frameX++;
      if (this.framex > this.maxFrame){
        this.markedForDeletion = true;
        this.game.score += this.maxLives;
      }
    }

  }

  hit(damage){
    this.lives -= damage;
    if(this.lives > 0) {
    this.frameX = 2;
    }
  }
}// end class boss wave

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;

    this.x = this.game.width * 0.5 - this.width * 0.5; // wave starting position
    this.y = -this.height; // starting position
    this.speedX = Math.random() < 0.5 ? -1 : 1; // sets initial the direction of wave
    this.speedY = 0;
    this.enemies = [];
    this.nextWaveTrigger = false;
    this.markedForDeletion = false;
    this.create();

  }
  render(context) {
    // context.strokeRect(this.x, this.y, this.width, this.height);
    if (this.y < 70) this.y += 5;
    this.speedY = 0;
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX *= -1;
      this.speedY = this.game.enemySize;
    }
    this.x += this.speedX;
    this.y += this.speedY;

    this.enemies.forEach(enemy => {
      enemy.update(this.x, this.y);
      enemy.draw(context);
    });
    this.enemies = this.enemies.filter(object => !object.markedForDeletion);
    if (this.enemies.length <= 0) this.markedForDeletion = true;
  } // end wave render method
  create() { // create the 2d wave

    for (let y = 0; y < this.game.rows; y++) {
      for (let x = 0; x < this.game.columns; x++) {
        let enemyX = x * this.game.enemySize;
        let enemyY = y * this.game.enemySize;

        if (Math.random() < 0.5){
          this.enemies.push(new Rhinomorph(this.game, enemyX, enemyY));
        } else{
          this.enemies.push(new Beetlemorph(this.game, enemyX, enemyY));
        }

      }
    }
  }
} // end wave class

class Beetlemorph extends Enemy {
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY); //pass these parameter to superclass Enemy
    this.image = document.getElementById('beetlemorph');
    this.frameX = 0; // this indicates the frame X on the sprite
    this.frameY = Math.floor(Math.random() * 4); // frame Y position on sprite sheet
    this.maxFrame = 2;
    this.lives = 1; // defines how easy it is to beat this enemy
    this.maxLives = this.lives;
  }

}

class Rhinomorph extends Enemy {
  constructor(game, positionX, positionY){
    super(game, positionX, positionY);
    this.image = document.getElementById('rhinomorph');
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 4;
    this.maxLives = this.lives;
  }
  hit(damage){
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
}
class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.keys = [];
    this.score = 0;
    this.gameOver = false;

    //-------------Projectiles------------
    this.fired = false;
    this.projectilesPool = [];
    this.numberOfPrjectiles = 15;
    this.createProjectiles();

    //-------------------------------------
    //----------timeing frames------------
    this.spriteUpdate = false;
    this.spriteTimer = 0;
    this.spriteInterval = 80;
    //-----------------------------------

    //-------------Enemy Wave Grid--------------
    this.columns = 2;
    this.rows = 2;
    this.enemySize = 80;
    this.waves = [];
    // this.waves.push(new Wave(this));
    this.waveCount = 1;
    //-------------------------------------

    //----------Boss---------------------
    this.bossArray = [];
    this.restart();// when boss appaers you restart
    //---------------------------------

    // event listeber - Key controls
    window.addEventListener('keydown', e => { // use => to maintain scope

      if (e.key === ' ' && !this.fired || e.key === 'ArrowUp' && !this.fired) this.player.shoot();
      this.fired = true;
      if (this.keys.indexOf(e.key) === -1) {
        this.keys.push(e.key);
        // console.log(e.key);
      }
      if (e.key === 'r' && this.gameOver) this.restart();


    });
    window.addEventListener('keyup', e => { // use => to maintain scope
      const index = this.keys.indexOf(e.key);
      this.fired = false;

      if (index > -1) {
        this.keys.splice(index, 1);
      }

    });
  } // End game Constructor

  render(context, deltaTime) {
    // sprite timeingif
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }
    this.drawStatusText(context);
    this.player.draw(context);
    this.player.update();
    this.projectilesPool.forEach(projectile => {
      projectile.update();
      projectile.draw(context);
    });

    this.bossArray.forEach(boss => {
      boss.draw(context);
      boss.update();
    });

    this.bossArray = this.bossArray.filter(object => !object.markedForDeletion);// delete boss
    this.waves.forEach(wave => {
      wave.render(context);
      if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
        this.newWave();
        this.waveCount++;
        wave.nextWaveTrigger = true;
        // if (this.waveCount % 3 === 0) this.player.lives++;
        if(this.player.lives < this.player.maxLives && this.waveCount % 3 === 0) this.player.lives++;
      }
    });
  }

  // create object pool projectiles-------------------
  createProjectiles() {
    for (let i = 0; i < this.numberOfPrjectiles; i++) {
      this.projectilesPool.push(new Projectile());
    }
  }
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
  //-------------Projectile Pool-------------------------------

  //----------------Collision-------------------------
  checkCollision(a, b) {
    return (a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y);
  }
  //--------------------------------------------------
  // ----------------Game Text------------------------
  drawStatusText(context) {
    context.fillText('Score: ' + this.score, 20, 40);


    //--------------UNER CONSTRUCTION-------------------------
    context.save();
    context.fillStyle = 'lightyellow';
    context.font = '50px Impact';
    context.globalAlpha = 0.5;
    context.textAlign = 'center';
    context.fillText('UNDER CONSTRUCTION', this.width * 0.5, this.height * 0.5);
    context.restore();
    //----------------------------------------------------------

    for (let i = 0; i < this.player.maxLives; i++) {
      context.strokeRect(20 + 15 * i, 60, 10, 15);
    }

    for (let i = 0; i < this.player.lives; i++) {
      context.fillRect(20 + 15 * i, 60, 10, 15);
    }


    if (this.gameOver) {
      context.save();
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'black';
      context.fillStyle = 'tomato';
      context.textAlign = 'center';
      context.font = '100px Impact';
      context.fillText('GAME OVER!', this.width * 0.5, this.height * 0.5);
      context.font = '20px Impact';
      context.fillText('Press R to restart!', this.width * 0.5, this.height * 0.5 + 60);
      context.restore();
    }
  } //------------------drawStatusText function ---------------------
  newWave() {
    if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
      this.columns++;
    } else if (this.rows * this.enemySize < this.height * 0.6) {
      this.rows++;
    }
    this.waves.push(new Wave(this));
    this.waves = this.waves.filter(object => !object.markedForDeletion);
  }

  restart() {
    this.player.restart();
    this.columns = 2;
    this.rows = 2;

    this.waves = [];
    this.waves.push(new Wave(this));
    this.bossArray.push(new Boss(this));
    this.waveCount = 1;
    this.score = 0;
    this.gameOver = false;
  }


} //end Game class



window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 800;
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'white';
  // ctx.lineWidth = 5;
  ctx.font = '30px Impact';

  const game = new Game(canvas);



  let lastTime = 0;
  //------------------animation loop --------------
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, deltaTime);
    window.requestAnimationFrame(animate);

  }


  animate(0);
});
