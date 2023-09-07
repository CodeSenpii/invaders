//jshint esversion:8

class Player{
  constructor(game){
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = this.game.width * 0.5 - (this.width * 0.5);
    this.y = this.game.height - this.height;
    this.speed = 6;
  }
  draw(context){
    context.fillRect(this.x, this.y, this.width, this.height);
  }
  update(){
  //   if(this.x < this.game.width - this.width){
  //   this.x += this.speed;
  // }

  if(this.game.keys.indexOf('ArrowLeft') > -1) this.x -= this.speed;
  if(this.game.keys.indexOf('ArrowRight') > -1) this.x += this.speed;
  if(this.x < -this.width * 0.5) this.x =-this.width * 0.5;
  else if (this.x > this.game.width - (this.width * 0.5)) this.x = this.game.width - this.width * 0.5;

  }

  shoot(){
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y); // check that the pool use not exceeded number of porjectiles
  }
}// End Player Class

class Projectile{// using object polling
  constructor(){
    this.width = 8;
    this.height = 20;
    this.x = 0;
    this.y = 0;
    this.speed = 20;
    this.free = true;
  }
  draw(context){
    if(!this.free){
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  }// End Projectile draw method
  update(){
    if(!this.free){
      this.y -= this.speed;
      if(this.y < -this.height) this.reset();
    }
  }//end Projectile update method
  start(x,y){
    // set to player position x,y
    this.x = x - (this.width * 0.5);
    this.y = y;
    this.free = false;
  }
  reset(){
    this.free = true;
  }



}// End Projectile class
class Enemy{
  constructor(game){
    this.game = game;
    this.width;
    this.height;
    this.x;
    this.y;
  }
  draw(context){
    context.strokeRect(this.x, this.y, this.width, this.height);
  }
  update(){

  }
}// end Enemy class

class Wave{
  constructor(game){
    this.game = game;
    this.width = this.game.columns * this.game.enemySize;
    this.height = this.game.rows * this.game.enemySize;

    this.x = 0;
    this.y = 0;
    this.speedX = 3;
  }
  render(context){
    context.strokeRect(this.x, this.y, this.width, this.height);
    this.x += this.speedX;
    if (this.x < 0 || this.x > this.game.width - this.width){
      this.speedX *= -1;
    }

  }
}// end wave class
class Game{
  constructor(canvas){
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.keys = [];
    //-------------Projectiles------------
    this.projectilesPool = [];
    this.numberOfPrjectiles = 10;
    this.createProjectiles();

    //-------------------------------------

    //-------------Enemy Wave Grid--------------
    this.columns = 3;
    this.rows = 3;
    this.enemySize = 60;
    this.waves = [];
    this.waves.push(new Wave(this));
    //-------------------------------------

    // event listeber - Key controls
    window.addEventListener('keydown', e => {// use => to maintain scope
      if(this.keys.indexOf(e.key) === -1){
        this.keys.push(e.key);
        // console.log(e.key);

      }

      if(e.key === ' ' || e.key === 'ArrowUp') this.player.shoot();
    });
      window.addEventListener('keyup', e => {// use => to maintain scope
        const index = this.keys.indexOf(e.key);

        if(index > -1){
          this.keys.splice(index, 1);
        }

    });
  }// End game Constructor

  render(context){
    this.player.draw(context);
    this.player.update();
    this.projectilesPool.forEach(projectile => {
      projectile.update();
      projectile.draw(context);
    });
    this.waves.forEach(wave => {
      wave.render(context);
    });
  }

  // create object pool projectiles-------------------
  createProjectiles(){
    for(let i = 0; i < this.numberOfPrjectiles; i++){
      this.projectilesPool.push(new Projectile());
    }
  }
  getProjectile(){
    for(let i = 0; i < this.projectilesPool.length; i++){
      if(this.projectilesPool[i].free) return this.projectilesPool[i];
    }
  }
  //-------------Projectile Pool-------------------------------

}//end Game class

window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');

  canvas.width = 600;
  canvas.height = 800;
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;

  const game =  new Game(canvas);


  //------------------animation loop --------------
  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    window.requestAnimationFrame(animate);

  }

  animate();
});
