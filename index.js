//jshint esversion:8
class Asteroid{
  constructor(game){
    this.game = game;
    this.radius = 73;
    this.x = -(Math.random() * 3 + 1) * this.radius;
    this.y = Math.random() * (this.game.height - this.game.bottomMargin);
    this.image = document.getElementById('asteroid');
    this.image.src = 'assets/asteroid.png';
    this.spriteWidth = 150;
    this.spriteHeight = 155;

    this.speed = (Math.random() * 3 + 1) * 0.3;
    this.free = true;// is the astroid in the pool free or not
    this.angle = 0;// rotation angle
    this.va = Math.random() * 0.02 - 0.01;
    this.hitSound = new Audio();
    this.hitSound.src = 'assets/hit.mp3';
    this.hitSound.volume = 0.1;
  }
  render(context){
    // if the asteroid is not available continue to draw it
    if (!this.free){
      // context.save();
      // context.beginPath();
      // // context.strokeRect(this.x, this.y, 70, 70);
      // // context.strokeStyle = 'transparent';
      // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // context.stroke();
      //   context.restore();


      context.save();
      context.translate(this.x, this.y);
      context.rotate(this.angle);
      // because of the translate method this.x and this.y is set
      // in drawImage this.x and this.y is now from 0
      context.drawImage(this.image, 0 - this.spriteWidth * 0.5, 0 - this.spriteHeight * 0.5,
      this.spriteWidth, this.spriteHeight);

      //context.drawImage(this.image, this.x - this.spriteWidth * 0.5, this.y - this.spriteHeight * 0.5,
      // this.spriteWidth, this.spriteHeight);
      context.restore();

    }
    this.game.projectilesPool.forEach(projectile => {
      if (!projectile.free && this.game.checkCollisonAstroid(this, projectile)) {
        // this.markedForDeletion = true;
        this.hitSound.currentTime = 0;
        this.hitSound.play();
        projectile.reset();
        // if(!this.game.gameOver) this.game.score++;
      }
    });
  }

  update(){
    this.angle += this.va;
    if (!this.free){
      this.x += this.speed;
      // if the asteroid has gone pass the area then return to pool and mark as available
      if(this.x > this.game.width + this.radius){
        this.reset();
      }
    }
  }
  reset(){
    this.free = true;
  }
  // set the original values
  start(){
    this.free = false;
    this.x = -(Math.random() * 3 + 1) * this.radius;
    this.y = Math.random() * (this.game.height - this.game.bottomMargin);
  }

}
class Laser {
  constructor(game) {
    this.game = game;
    this.x = 0;
    this.y = 0;

    this.height = this.game.height - 50;
  }
  render(context) {
    this.x = this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5; // horizotal coord of player
    this.game.player.energy -= this.damage;
    context.save();
    context.fillStyle = 'red';
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = 'white';
    context.fillRect(this.x + this.width * 0.3, this.y, this.width * 0.4, this.height);
    context.restore();

    //------------check laser collision with enemy wavehere-----------------
    if (this.game.spriteUpdate) {
      this.game.waves.forEach(wave => {
        wave.enemies.forEach(enemy => {
          if (this.game.checkCollision(enemy, this)) {
            enemy.hit(this.damage);
          }
        });
      });
      this.game.bossArray.forEach(boss => {
        if (this.game.checkCollision(boss, this) && boss.y >= 0) {
          boss.hit(this.damage);
        }
      });
    }

  }
}


class SmallLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 6;
    this.damage = 0.3;

  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.coolDown) {
      super.render(context); // call the render method of the superclass
    }

  }
} // end small laser class

class BigLaser extends Laser {
  constructor(game) {
    super(game);
    this.width = 18;
    this.damage = 0.7;

  }
  render(context) {
    if (this.game.player.energy > 1 && !this.game.player.coolDown) {
      super.render(context); // call the render method of the superclass
    }

    // super.render(context); // call the render method of the superclass
  }
} //---------------end big laser-------------
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
    this.SmallLaser = new SmallLaser(this.game);
    this.bigLaser = new BigLaser(this.game);
    this.energy = 50;
    this.maxEnergy = 75;
    this.coolDown = false;
    this.laserSound = new Audio();
    this.laserSound.src = 'assets/smallLaser.mp3';
    this.ammoClick = new Audio();
    this.ammoClick.src = 'assets/ammoClick.mp3';
    this.smallLaserSound = new Audio();
    this.smallLaserSound.src = 'assets/smallLaserSound.mp3';
    this.smallLaserSound.volume = 0.5;
    this.radius = 90;
    this.shield = false;
  }
  draw(context) {
    // sprite frames and Laser triggers

    if (this.game.keys.indexOf('s') > -1 && this.shield === false){
      this.shield = true;
    }else{
      // this.shield = false;
    }
    if (this.game.keys.indexOf(' ') > -1) {
      this.frameX = 1;
    } else if (this.game.keys.indexOf('a') > -1 && this.shield === false) {
      if (!this.coolDown) {
        this.smallLaserSound.currentTime = 0;
        this.frameX = 2;
        this.SmallLaser.render(context);
        this.smallLaserSound.play();
      }else{
        this.framX = 1;
        this.ammoClick.play();
      }

    } else if (this.game.keys.indexOf('d') > -1 && this.shield === false) {
      if (!this.coolDown) {
        this.frameX = 3;
        this.bigLaser.render(context);
        this.game.megaSound.play();
      } else {
        this.framX = 1;
        this.ammoClick.play();
      }
    } else if (this.game.btn_press.indexOf('laser') > -1 && this.shield === false) {
      if (!this.coolDown) {
        this.smallLaserSound.currentTime = 0;
        this.frameX = 2;
        this.SmallLaser.render(context);
        this.smallLaserSound.play();
      }else{
        this.framX = 1;
        this.ammoClick.play();
      }


    } else if (this.game.btn_press.indexOf('mega') > -1 && this.shield === false) {
      // this.frameX = 3;
      this.bigLaser.render(context);
    } else {
      this.frameX = 0;
    }
    context.drawImage(this.jets_image, this.jetsFrame * this.width, 0, this.width, this.height,
      this.x, this.y, this.width, this.height);
    // context.fillRect(this.x, this.y, this.width, this.height);
    context.drawImage(this.playerImage, this.frameX * this.width, 0, this.width, this.height,
      this.x, this.y, this.width, this.height);


     //------------------Shield draw --------------------
     if(this.shield === true){
      context.save();
      context.beginPath();
      // context.strokeRect(this.x, this.y, 70, 70);

      context.lineWidth = 5;
      context.strokeStyle = 'white';
      context.globalAlpha = 0.5;

      context.arc(this.x + this.width*0.5, this.y + this.height*0.5, this.radius, 0, Math.PI * 2);
      context.stroke();
      context.fill();
      context.restore();
      //------------------------------------------------
    }
  }
  update() {
    //energy
    if (this.energy < this.maxEnergy) {
      this.energy += 0.05;
    }
    if (this.energy < 1) this.coolDown = true;
    else if (this.energy > this.maxEnergy * 0.5) this.coolDown = false;
    //   if(this.x < this.game.width - this.width){
    //   this.x += this.speed;
    // }
    // this block handles left and right movements for keys and touch screen inputs

    if (this.game.keys.indexOf('ArrowLeft') > -1 || this.game.btn_press.indexOf('left') > -1) {
      this.x -= this.speed;
      this.jetsFrame = 0;
      const index = this.game.keys.indexOf('left');
      if (index > -1) {
        this.game.keys.splice(index);
      }


    } else if (this.game.keys.indexOf('ArrowRight') > -1 || this.game.btn_press.indexOf('right') > -1) {
      this.x += this.speed;
      this.jetsFrame = 2;
      const index = this.game.keys.indexOf('right');
      if (index > -1) {
        this.game.keys.splice(index);
      }
    } else {
      this.jetsFrame = 1;
    }


    if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
    else if (this.x > this.game.width - (this.width * 0.5)) this.x = this.game.width - this.width * 0.5;

    // const index = this.game.keys.indexOf('left');
    // if(index > -1){
    //   this.game.keys.splice(index);
    // }

  }// end update -------------------------------

  shoot() {
    if (this.shield === false){
    const projectile = this.game.getProjectile();

    if (projectile) {
      this.play();
      projectile.start(this.x + this.width * 0.5, this.y); // check that the pool use not exceeded number of porjectiles
    }
  }
}

  restart() {
    this.x = this.game.width * 0.5 - (this.width * 0.5);
    this.y = this.game.height - this.height;
    this.lives = 3;
  }

  play() {
    this.laserSound.volume = 0.3;
    this.laserSound.currentTime = 0;
    this.laserSound.play();
  }
} // End Player Class

class BossBombs{
  constructor(game){
    this.game = game;
    this.width = 4;
    this.height = 20;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.free = true;
  }
  draw(context) {
    if (!this.free) {
      context.save();
      context.fillStyle = 'white';
      context.fillRect(this.x, this.y, this.width, this.height);
      context.restore();
    }
  } // End Projectile draw method

  update() {
    if (!this.free) {
      this.y += this.speed;
      if (this.y > this.height) this.reset();
    }
  } //end boss bombs update method
  start(x, y) {
    // set to player position x,y
    this.x = x - (this.width * 0.5);
    this.y = y;
    this.free = false;
  }
  reset() {
    this.free = true;
  }
}//---end boss bombs class

class Projectile { // using object polling
  constructor(game) {
    this.game = game;
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
    // check collision here for Projectiles ----------------------
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

class Boss {
  constructor(game, bossLives) {
    this.game = game;
    this.width = 200;
    this.height = 200;
    this.x = this.game.width * 0.5 - this.width * 0.5;
    this.y = -this.height;
    this.speedX = Math.random() < 0.5 ? -1 : 1;
    this.speedY = 0;
    this.lives = bossLives;
    this.maxLives = this.lives;
    this.markedFor = false;
    this.bossImage = document.getElementById('boss');
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.maxFrame = 11;
    this.explode = new Audio();
    this.explode.src = 'assets/bossExplode.mp3';
    this.explode.volume = 0.5;
  }
  draw(context) {
    context.drawImage(this.bossImage, this.frameX * this.width, this.frameY * this.height, this.width,
      this.height, this.x, this.y, this.width, this.height);
    if (this.lives >= 1) {
      context.save();
      context.textAlign = 'center';
      context.fillStyle = 'white';
      context.shadowOffsetX = 2;
      context.shadowOffsetY = 2;
      context.shadowColor = 'black';
      context.fillText(Math.floor(this.lives), this.x + this.width * 0.5, this.y + 50);
      context.restore();
    }
  }

  update() {
    this.speedY = 0;
    if (this.game.spriteUpdate && this.lives >= 1) this.frameX = 0;
    if (this.y < 0) this.y += 3;
    if (this.x < 0 || this.x > this.game.width - this.width && this.lives >= 1) {
      this.speedX *= -1;
      this.speedY = this.height * 0.4;
    }
    this.x = this.x + this.speedX;
    this.y += this.speedY;

    //--------------------collision detect projectiles-----------
    this.game.projectilesPool.forEach(projectile => {
      if (this.game.checkCollision(this, projectile) && !projectile.free &&
        this.lives >= 1 && this.y >= 0) {
        // this.lives--;
        this.hit(1);
        projectile.reset();
      }
    });

    // collision detection boss/player
    if (this.game.checkCollision(this, this.game.player) && this.lives >= 1) {
      this.game.gameOver = true;
      this.lives = 0;
    }
    // boss destroyed
    if (this.lives < 1 && this.game.spriteUpdate) {
      this.frameX++;
      if (this.frameX > this.maxFrame) {
        this.markedForDeletion = true;
        this.explode.play();
        this.game.score += this.maxLives;
        this.game.bossLives += 5;
        if (!this.game.gameOver) this.game.newWave();
      }
    }
    //lose condition
    if (this.y + this.height > this.game.height) this.game.gameOver = true;

  }//------------- end update --------------------
  // -----------------
  BossBombDrop() {

    const projectile = this.game.getBossBombs();
    if (projectile) {
      projectile.start(this.x + this.width * 0.5, this.y); // check that the pool use not exceeded number of porjectiles
    }
  }

  hit(damage) {
    this.lives -= damage;
    if (this.lives >= 1) {
      this.frameX = 2;
    }
  }
} // end class boss wave

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
    if (this.y < 0) this.y += 5;
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

        if (Math.random() < 0.5) {
          this.enemies.push(new Rhinomorph(this.game, enemyX, enemyY));
        } else {
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
  constructor(game, positionX, positionY) {
    super(game, positionX, positionY);
    this.image = document.getElementById('rhinomorph');
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameY = Math.floor(Math.random() * 4);
    this.lives = 4;
    this.maxLives = this.lives;
  }
  hit(damage) {
    this.lives -= damage;
    this.frameX = this.maxLives - Math.floor(this.lives);
  }
}
class Game {
  constructor(canvas, shoot_btn, laser_btn, mega_beam) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    // this.astroid = new Asteroid(this);
    this.btn_press = [];
    this.keys = [];
    this.score = 0;
    this.gameOver = false;
    this.mega = mega_beam;
    this.megaSound = new Audio();
    this.megaSound.src = 'assets/mega.mp3';

    // this.canonSound.src = 'assets/smallLaser.mp3';



    //----------BossBombs----------------
    this.bossFired = false;
    this.bossBombsPool = [];
    this.bossBombsnumber = 15;
    this.createBossBombs();
    //------------------------------------


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

    //----------Asteroid Pool ------------
    this.bottomMargin = 80;
    this.astroidPool = [];
    this.maxAstroid = 4;
    this.asteroidTimer = 0;
    this.asteroidInterval = 1000;
    this.createAsteroidPool();
    //-------------------------------------

    //----------Boss---------------------
    this.bossArray = [];
    this.bossLives = 10;
    this.restart(); // when boss appaers you restart
    //---------------------------------
    // ----------------------button control fire, left, right-------------

    mega_beam.addEventListener('touchstart', e => {
      e.preventDefault();
      if (this.btn_press.indexOf('mega') === -1) this.btn_press.push('mega');
      if (!this.player.coolDown) {
        this.megaSound.currentTime = 0;
        if (!this.player.shield) this.megaSound.play();
        this.player.frameX = 3;
      } else {
        this.player.frameX = 1;
        this.player.ammoClick.play();
      }


    });



    mega_beam.addEventListener('touchend', e => {
      // lets make sure that the btn_press array only has 0ne btn entry per btn push
      const index = this.btn_press.indexOf('mega');
      if (index > -1) this.btn_press.splice(index, 1);
      this.player.frameX = 1;
      // this.megaSound.currentTime = 0;

    });

    laser_btn.addEventListener('touchstart', e => {
      e.preventDefault();
      if (this.btn_press.indexOf('laser') === -1) this.btn_press.push('laser');
      this.player.frameX = 2;

    });

    laser_btn.addEventListener('touchend', e => {
      // lets make sure that the btn_press array only has 0ne btn entry per btn push
      const index = this.btn_press.indexOf('laser');
      if (index > -1) this.btn_press.splice(index, 1);
      this.player.frameX = 1;


    });

    shoot_btn.addEventListener('touchstart', e => {
      e.preventDefault();

      this.player.shoot();
      this.fired = true;

    });

    left_btn.addEventListener('touchstart', e => {
      // lets make sure that the btn_press array only has 0ne btn entry per btn push
      e.preventDefault(); // prevent long touch popups
      if (this.btn_press.indexOf('left') === -1) this.btn_press.push('left');

    });
    left_btn.addEventListener('touchend', e => {
      // lets make sure that the btn_press array only has 0ne btn entry per btn push
      const index = this.btn_press.indexOf('left');
      if (index > -1) this.btn_press.splice(index, 1);

    });
    right_btn.addEventListener('touchstart', e => {
      e.preventDefault();
      if (this.btn_press.indexOf('right') === -1) this.btn_press.push('right');
    });

    right_btn.addEventListener('touchend', e => {
      // lets make sure that the btn_press array only has 0ne btn entry per btn push

      const index = this.btn_press.indexOf('right');
      if (index > -1) this.btn_press.splice(index, 1);

    });
    //--------------------------------------------------
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
      this.player.shield = false;

      if (index > -1) {
        this.keys.splice(index, 1);
      }

    });


  } // End game Constructor

  render(context, deltaTime) {
    // create asteroid periodically
    if(this.asteroidTimer > this.asteroidInterval){
      const asteroid = this.getAsteroid();

      if (asteroid) asteroid.start();
      this.asteroidTimer = 0;
    }else{
      this.asteroidTimer += deltaTime;
    }

    // sprite timeingif
    if (this.spriteTimer > this.spriteInterval) {
      this.spriteUpdate = true;
      this.spriteTimer = 0;
    } else {
      this.spriteUpdate = false;
      this.spriteTimer += deltaTime;
    }
    this.drawStatusText(context);



    this.astroidPool.forEach(astroid =>{
      astroid.render(context);
      astroid.update();
    });

    // this.astroid.render(context, deltaTime);

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

    this.bossArray = this.bossArray.filter(object => !object.markedForDeletion); // delete boss
    this.waves.forEach(wave => {
      wave.render(context);
      if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
        this.newWave();
        this.waveCount++;
        wave.nextWaveTrigger = true;
        // if (this.waveCount % 3 === 0) this.player.lives++;
        // if (this.player.lives < this.player.maxLives && this.waveCount % 3 === 0) this.player.lives++;
      }
    });
  } // end render
  //-----------create boss bombs ----------------------
  createBossBombs(){
    for (let i = 0; i < this.bossBombsnumber; i++){
      this.bossBombsPool.push(new BossBombs(this));
    }
  }

  getBossBombs(){
    for (let i = 0; i < this.bossBombsPool.length; i++) {
      if (this.bossBombsPool[i].free) return this.bossBombsPool[i];
    }
  }
  //---------------------------------------------------
  // create object pool projectiles-------------------
  createProjectiles() {
    for (let i = 0; i < this.numberOfPrjectiles; i++) {
      this.projectilesPool.push(new Projectile(this));
    }
  }
  getProjectile() {
    for (let i = 0; i < this.projectilesPool.length; i++) {
      if (this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
  //-------------Projectile Pool end-------------------------------
  //-------------------Astriod pool create----------------
  createAsteroidPool(){
    for (let i = 0; i < this.maxAstroid; i++){
      this.astroidPool.push(new Asteroid(this));
    }
  }

  getAsteroid(){
    for (let i = 0; i < this.astroidPool.length; i++){
      if (this.astroidPool[i].free){
        return this.astroidPool[i];
      }
    }
  }
  //---------------------Asteroid pool--------------------

  //----------------Collision-------------------------
  checkCollision(a, b) {
    return (a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y);
  }

  checkCollisonAstroid(asteroid, rect){
    var distX = Math.abs(asteroid.x - rect.x - rect.width/2);
     var distY = Math.abs(asteroid.y - rect.y - rect.height/2);

     if (distX > (rect.width/2 + asteroid.radius)) { return false; }
     if (distY > (rect.height/2 + asteroid.radius)) { return false; }

     if (distX <= (rect.width/2)) { return true; }
     if (distY <= (rect.height/2)) { return true; }

     // also test for corner collisions
     var dx=distX-rect.width/2;
     var dy=distY-rect.height/2;
     return (dx*dx+dy*dy<=(asteroid.radius*asteroid.radius));

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

    // energy

    for (let i = 0; i < this.player.energy; i++) {

      context.save();
      context.fillStyle = 'white';
      context.font = '15px Impact';
      context.fillText('Laser Status', 20, 100);
      // context.strokeStyle = 'white';
      // context.strokeRect();
      // context.fillStyle = 'tomato';

      this.player.coolDown ? context.fillStyle = 'red' : context.fillStyle = 'lime';
      this.player.coolDown ? this.mega.style.color = 'red' : this.mega.style.color = 'white';
      this.player.coolDown ? this.mega.style.borderColor = 'red' : this.mega.style.borderColor = 'green';

      context.globalAlpha = 0.7;
      context.fillRect(20 + 2 * i, 110, 2, 15);

      context.restore();

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
    this.waveCount++;

       if (this.player.lives < this.player.maxLives) {
      if (this.waveCount% 6 === 0){
        this.player.lives++;
      }

    }


    if (this.waveCount % 3 === 0) {
      this.bossArray.push(new Boss(this, this.bossLives));
    } else {
      if (Math.random() < 0.5 && this.columns * this.enemySize < this.width * 0.8) {
        this.columns++;
      } else if (this.rows * this.enemySize < this.height * 0.6) {
        this.rows++;
      }
      this.waves.push(new Wave(this));
    }
    this.waves = this.waves.filter(object => !object.markedForDeletion);
  }

  restart() {
    this.player.restart();
    this.columns = 2;
    this.rows = 2;

    this.waves = [];
    this.bossArray = [];
    this.bossLives = 10;
    this.waves.push(new Wave(this, this.bossLives));
    // this.bossArray.push(new Boss(this));
    this.waveCount = 1;
    this.score = 0;
    this.gameOver = false;
  }


} //end Game class



window.addEventListener('load', function() {
  const canvas = document.getElementById('canvas1');
  const shoot_btn = document.getElementById('shoot');
  const laser_btn = document.getElementById('laser');
  const left_btn = document.getElementById('left_btn');
  const right_btn = document.getElementById('right_btn');
  const mega_beam = document.getElementById('mega');

  // console.log(mega_beam.style);

  //-----------------Sounds------------------------------



  //small_laser.loop = true;
  //crowSounds.play();






  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 800;
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'white';
  // ctx.lineWidth = 5;
  ctx.font = '30px Impact';

  const game = new Game(canvas, shoot_btn, laser_btn, mega_beam);



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
