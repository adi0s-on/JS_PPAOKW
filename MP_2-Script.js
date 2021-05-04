/*
TODOLIST
- wszystkie spelle
- kupowanie spelli
- zbieranie kasy i hp mp
- kolizje
- xp
- ksiazka do spelli
- wiecej stage? moze 
- animacja dialog
*/

let healthMain = 100; let manaMain = 100;
let healthAmount = healthMain; let manaAmount = manaMain;
//difficulty check
if(document.getElementsByName("invincibility")[1].checked)
{
  healthAmount = 1000000000000; healthMain = healthAmount;
  document.getElementById("health_bar_amount").innerText = "∞";
  document.getElementById("health_bar_amount").style.fontSize = "33";
  manaAmount = 1000000000000; manaMain = manaAmount;
}
healthTemp = healthAmount; 
manaTemp = manaAmount;//main player health variable and temporary health variable that tells game when player has been hurt 

var spellsBought = [false, false, false, false, false]; //array that holds information about which spells have been purchased
var currentStage = 0;
const appDiv = document.getElementById('game');


class Skeleton
{
  constructor(health, drop)
  {
    this.health = health; this.drop = drop;
  }
}






//method that starts game - initializes variables, sets stages etc..
function startGame()
{

  /* - - - - - - STAGES - - - - - - */

  var FirstStage = new Phaser.Class({ 
    Extends: Phaser.Scene,
    initialize:
  
    function FirstStage()
    {
      Phaser.Scene.call(this, {key: 'FirstStage'});
    },
  
    //preload needed images and sfx files
    preload: function()
    {
      this.load.crossOrigin = 'anonymous';
      this.load.spritesheet('playerUp', 'assets/PlayerBody/BodyPlayerUp.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerDown', 'assets/PlayerBody/BodyPlayerDown.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerLeft', 'assets/PlayerBody/BodyPlayerLeft.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerRight', 'assets/PlayerBody/BodyPlayerRight.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerRunning', 'assets/PlayerBody/BodyPlayerRunning.png', { frameWidth: 100, frameHeight: 100});
      this.load.image('background', 'assets/Backgrounds/Background1.jpg');
      this.load.image('deadPlayer', 'assets/PlayerBody/DeadBodyPlayer.png');
      this.load.image('buttonSmallYes', 'assets/GameMenu/ButtonSmallYes.png');
      this.load.image('buttonSmallNo', 'assets/GameMenu/ButtonSmallNo.png');
      this.load.image('restartQuestionMenu', 'assets/GameMenu/MenuPopup.png');

    },
  
    //launches on stage creation
    create: function()
    {
      currentStage = 1;
      backgroundImage = this.add.image(987.5, 620, 'background'); //background image set
      backgroundImage.displayWidth = 1975;
      backgroundImage.displayHeight  = 1240;

      // document.getElementById("stage_1_music").load(); //music play
      document.getElementById("stage_1_music").play(); //music play
      document.getElementById("stage_1_music").volume = "0.5"; //music volume set

      //animations creating
      this.anims.create({
        key: 'up', 
        frames: this.anims.generateFrameNumbers('playerUp', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
  
      this.anims.create({
        key: 'down', 
        frames: this.anims.generateFrameNumbers('playerDown', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
    
      this.anims.create({
        key: 'left', 
        frames: this.anims.generateFrameNumbers('playerLeft', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
  
      this.anims.create({
        key: 'right', 
        frames: this.anims.generateFrameNumbers('playerRight', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
  
      this.anims.create({
        key: 'running',
        frames: this.anims.generateFrameNumbers('playerRunning', { start: 0, end: 6}),
        frameRate: 8,
        repeat: -1
      })
  
      player = this.physics.add.sprite(800, 500 , 'playerDown'); //player sprite set
      player.anims.play('up', true); //player animation
      player.displayWidth = 80; //player width
      player.displayHeight = 80; //player height
      player.body.collideWorldBounds = true; //player collides on world border
      player.body.immovable = false; //player can be moved by other mobs
  
      let difficultyLeveles = document.getElementsByName("difficulty"); //skeleton spawn depends on difficulty set
  
      let difficultyLevel = 0; //difficulty level set 
      for(let i = 0; i < difficultyLeveles.length; i++) //difficulty setting read
      {
        if(difficultyLeveles[i].checked)
        {
          difficultyLevel = difficultyLeveles[i].value;
          break;
        }
      }
  
      for(let i = 0; i < (10 + 5 * difficultyLevel); i++)
      {
        // setTimeout( ()=>
        // {
          enemiesSkeleton[i] = new Skeleton(100, "coin1");
          enemiesSkeletonSprites[i] = this.physics.add.sprite(200 + i*70,250, 'playerUp');
          enemiesSkeletonSprites[i].displayHeight = 50;
          enemiesSkeletonSprites[i].displayWidth = 50;
          enemiesSkeletonSprites[i].body.collideWorldBounds = true;
        // }, 1500 + 1500*i);
        // enemiesSkeletonSprites[i].body.bounce.set(1);
      }
      // enemiesSkeleton[2].drop ="healthDrop"
      console.log(enemiesSkeletonSprites.length);
      for(let i = 0; i < enemiesSkeletonSprites.length; i++)
      {
        for(let j = 0; j < enemiesSkeletonSprites.length; j++)
        {
          this.physics.add.collider(enemiesSkeletonSprites[i], enemiesSkeletonSprites[j], () =>
          {
            enemiesSkeletonSprites[i].body.velocity.x = 0;
            enemiesSkeletonSprites[i].body.velocity.y = 0;
          });
          this.physics.add.overlap(enemiesSkeletonSprites[i], enemiesSkeletonSprites[j], () =>
          {
            enemiesSkeletonSprites[i].x += 1;
            // enemiesSkeletonSprites[i].y += 1;
            enemiesSkeletonSprites[j].x -= 1;
            // enemiesSkeletonSprites[j].y -= 1;
            // enemiesSkeletonSprites[i].body.velocity.y = 0;
          });
        }
      }
      
      this.physics.add.collider(enemiesSkeletonSprites, player, () =>
      {
        healthTemp-=0.1;
        hurtPlayerSetHealth();
      });
      
      cursors = this.input.keyboard.createCursorKeys(); // UP DOWN LEFT RIGHT SPACE bind kinda
      escapeButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); //escape button bind
      leftControlButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.CTRL); //escape button bind
  
      this.scene.pause();
      document.getElementById("stage_1_music").pause();
      this.scene.launch('PauseMenu');
    },
  
    //runs with every frame of the game
    update: function() 
    {
      //check if player is still alive
      if(healthAmount < 0)
      {
        healthAmount = 0;
        document.getElementById("health_bar_amount").innerHTML = (healthAmount.toFixed(1) + "/" + healthMain);

        playerDead = this.physics.add.image(player.x, player.y, 'deadPlayer');
        playerDead.displayHeight = player.displayHeight + 30;
        playerDead.displayWidth = player.displayWidth + 30;
        player.disableBody(false, true);

        restartMenu = this.add.image(game.canvas.width/2, game.canvas.height/2, 'restartQuestionMenu');
        restartMenu.displayWidth = 900;
        restartMenu.displayHeight = 300;

        restartButtonYes = this.add.image(game.canvas.width/2 - 200, game.canvas.height/2 + 25, 'buttonSmallYes').setInteractive();
        restartButtonYes.displayWidth = 340;
        restartButtonYes.displayHeight = 100;
        restartButtonYes.on('pointerdown', function(event)
        {
          document.getElementById("stage_1_music").pause();
          document.getElementById("stage_1_music").currentTime = 0;
          game.scene.scenes[0].scene.restart();
          // this.scene.restart();
        });
        restartButtonYes.on('pointerover', function(event)
        {

        });

        restartButtonNo = this.add.image(game.canvas.width/2 + 200, game.canvas.height/2 + 25, 'buttonSmallNo').setInteractive();
        restartButtonNo.displayWidth = 340;
        restartButtonNo.displayHeight = 100;
        restartButtonNo.on('pointerdown', function (event)
        {
          location.reload();
        });
      }
  
      //move skeletons
      for(let i = 0; i < enemiesSkeletonSprites.length; i++)
      {
        enemiesSkeletonSprites[i].body.velocity.x=0;
        enemiesSkeletonSprites[i].body.velocity.y=0;
       
        xDifference = player.x - enemiesSkeletonSprites[i].x;
        yDifference = player.y - enemiesSkeletonSprites[i].y;
  
        let c = Math.sqrt((xDifference*xDifference)+(yDifference*yDifference));
        let sina = Math.abs(xDifference)/c;
        let sinb = Math.abs(yDifference)/c;
        
        //FIXME
        if(player.x > enemiesSkeletonSprites[i].x)
        {
          if(player.y < enemiesSkeletonSprites[i].y)
          {
            enemiesSkeletonSprites[i].body.velocity.setTo(sina * 100, sinb * (-100));
            enemiesSkeletonSprites[i].angle = 90 * sina;
          }
          else
          {
            enemiesSkeletonSprites[i].body.velocity.setTo(sina * 100, sinb * 100);
            enemiesSkeletonSprites[i].angle = 90 * sinb + 90;
          }
        }
        if(player.x < enemiesSkeletonSprites[i].x)
        {
          if(player.y > enemiesSkeletonSprites[i].y)
          {

            enemiesSkeletonSprites[i].body.velocity.setTo(sina * (-100), sinb * 100);
            enemiesSkeletonSprites[i].angle = 360 - (90 * sinb + 90);
          }
          else
          {
            enemiesSkeletonSprites[i].body.velocity.setTo(sina * (-100), sinb * (-100));
            enemiesSkeletonSprites[i].angle = 360 - (90 * sina);
          }  
        }
      }

      keyboardButtonsFunctionalities();
  
      if(escapeButton.isDown)
      {
        if(!escapeButtonSwitch)
        {
          this.scene.pause();
          this.scene.launch('PauseMenu');
          console.log("Game paused");
          escapeButtonSwitch = true;
        }
      }
      if(escapeButton.isUp)
      {
        escapeButtonSwitch = false;
      }
    },


  });
  
  //Pause menu - this is treated as stage, so it needs to be implemented this way
  var PauseMenu = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
  
    function PauseMenu()
    {
      Phaser.Scene.call(this, {key: 'PauseMenu'});
    },
  
    //preload needed images
    preload: function()
    {
      this.load.image('pauseMenuBackground', 'assets/GameMenu/BackgroundBlackout.png');
      this.load.image('upauseGame', 'assets/GameMenu/ButtonUnpauseGame-min.png');
      this.load.image('quitGame', 'assets/GameMenu/ButtonExitGame-min.png');
      this.load.image('pauseMenuTile', 'assets/GameMenu/MenuPopup2.png');
    },
  
    //launches on stage creation
    create: function()
    {
      document.getElementById("stage_1_music").pause();
      backgroundPause = this.add.image(987.5, 620, 'pauseMenuBackground');
      backgroundPause.displayWidth = 1975;
      backgroundPause.displayHeight = 1240;

      pauseMenuTile = this.add.image(game.canvas.width/2, game.canvas.height/2, 'pauseMenuTile');
      pauseMenuTile.displayWidth = 800;
      pauseMenuTile.displayHeight = 500;

      unpauseButton = this.add.image(game.canvas.width/2, game.canvas.height/2 - 90, 'upauseGame').setInteractive();
      unpauseButton.displayWidth = 577;
      unpauseButton.displayHeight = 90;
      unpauseButton.on('pointerdown', function(event)
      {
        console.log("Game resumed");
        escapeButtonMenuSwitch = true;
        backgroundPause.destroy();
        pauseMenuTile.destroy();
        unpauseButton.destroy();
        exitButton.destroy();
        game.scene.scenes[currentStage - 1].scene.resume();
        document.getElementById("stage_1_music").play();
      });


      exitButton = this.add.image(game.canvas.width/2, game.canvas.height/2 + 90, 'quitGame').setInteractive();
      exitButton.displayWidth = 577;
      exitButton.displayHeight = 90;
      exitButton.on('pointerdown', function(event)
      {
        location.reload();
      });

      escapeButtonMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    },
  
    //runs with every frame of the game
    update: function()
    {
      if(escapeButtonMenu.isDown)
      {
        if(!escapeButtonMenuSwitch)
        {
          console.log("Game resumed");
          escapeButtonMenuSwitch = true;
          backgroundPause.destroy();
          pauseMenuTile.destroy();
          unpauseButton.destroy();
          exitButton.destroy();

          switch(currentStage)
          {
            case 1:
              {
                this.scene.resume('FirstStage');
                break;
              }
          }

          document.getElementById("stage_1_music").play();
        }
      }
      if(escapeButtonMenu.isUp)
      {
        escapeButtonMenuSwitch = false;
      }
    }
  });
  
  /* - - - - - - STAGES - - - - - - */



  /* - - - - - - - - - - GAME METHODS - - - - - - - - - - */

  function keyboardButtonsFunctionalities()
  {
    player.body.velocity.x = 0; player.body.velocity.y = 0;
    player.displayWidth = 80; player.displayHeight = 80;
  
    if (cursors.up.isDown && cursors.right.isDown) //On RIGHT press action
    {
      player.body.velocity.x = 200; player.body.velocity.y = -200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "UpRight"; 
      player.angle = 45;
    }
    else if(cursors.up.isDown && cursors.left.isDown)
    {
      player.body.velocity.x = -200; player.body.velocity.y = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "UpLeft";
      player.angle = 315; 
    }
    else if(cursors.up.isDown)
    {
      player.body.velocity.y = -200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Up";
      player.angle = 0;
    }
  
    if (cursors.down.isDown && cursors.right.isDown) //On RIGHT press action
    {
      player.body.velocity.x = 200; player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "DownRight";
      player.angle = 135;
    }
    else if(cursors.down.isDown && cursors.left.isDown)
    {
      player.body.velocity.x = -200; player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100; 
      player.anims.play('running', true);
      playerFacingDirection = "DownLeft";
      player.angle = 225;
    }
    else if(cursors.down.isDown)
    {
      player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Down";
      player.angle = 180;
    }
  
    if(cursors.left.isDown && cursors.right.isDown)
    {
      player.body.velocity.x = 0;      
      player.anims.play('up', true);
      playerFacingDirection = "None";
    }
    else if(cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown)
    {
      player.body.velocity.x = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Left"
      player.angle = 270;
    }
    else if(cursors.right.isDown && !cursors.up.isDown && !cursors.down.isDown)
    {
      player.body.velocity.x = 200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Right"
      player.angle = 90;
    }
  
    if(!cursors.left.isDown && !cursors.up.isDown && !cursors.right.isDown && !cursors.down.isDown)
    {
      player.anims.play('up', true);
      switch(playerFacingDirection)
      {
        case "Up":
          {
            player.angle = 0;
            break;
          }
        case "UpRight":
          {
            player.angle = 45;
  
            break;
          }
        case "UpLeft":
          {
            player.angle = 315;
            break;
          }
        case "Down":
          {
            player.angle = 180;
            break;
          }
        case "DownRight":
          {
            player.angle = 135;
            break;
          }
        case "DownLeft":
          {
            player.angle = 225;
            break;
          }
        case "Left":
          {
            player.angle = 270;
            break;
          }
        case "Right":
          {
            player.angle = 90;
            break;
          }
      }
    }
    
    if(leftControlButton.isDown ) //On LEFTCONTROL press action
    {
      if(!leftControlSwitch) //Pressing LEFT CONTROL activates teleport only once because of this.
      {
        if(player.body.velocity.x == 200)
        {
          player.body.x +=160;
        }      
        if(player.body.velocity.y == 200)
        {
          player.body.y +=100;
        }
        if(player.body.velocity.x == -200)
        { 
          player.body.x -=160; 
        }
        if(player.body.velocity.y == -200)
        { 
          player.body.y -=100;
        }
        leftControlSwitch = true;
      }
    }
    if(leftControlButton.isUp)
    {
      leftControlSwitch = false;
    }
  
    if(cursors.space.isDown)
    {
      if(!attackSwitch)
      {
        switch(equippedSpell)
        {
          case 'fireball':
          {
            let scene1 = game.scene.scenes[0];
  
            switch(playerFacingDirection)
            {
              case 'Up':
                {
                  fireball = scene1.physics.add.sprite(player.x, player.y - 50 , 'playerDown'); //player sprite set
                  fireball.displayWidth = 30; fireball.displayHeight = 30;
                  fireball.body.velocity.y = -100;
                  fireball.body.setCollideWorldBounds(true);
                  fireball.body.onWorldBounds = true;
                  // function spellDisappeares(fireball, up, down, left, right)
                  // {
                  //   if(up || down || left || right)
                  //   {
                  //     fireball.disableBody(true. true);
                  //   }
                  // }
                  // scene1.physics.world.on("worldbounds", spellDisappeares);
                  for(let i = 0; i < enemiesSkeletonSprites.length; i++)
                  {
                    scene1.physics.add.overlap(fireball, enemiesSkeletonSprites[i], () => 
                    {
                      fireball.disableBody(true, true); //FIXME
                      enemiesSkeletonSprites[i].disableBody(true, true);
                    }, null, this);
                  }
                  break;
                }
              case 'Right':
                {
                  fireball = scene1.physics.add.sprite(player.x + 50, player.y, 'playerDown'); //player sprite set
                  fireball.displayWidth = 30; fireball.displayHeight = 30;
                  fireball.body.velocity.x = 100;
                  for(let i = 0; i < enemiesSkeletonSprites.length; i++)
                  {
                    scene1.physics.add.overlap(fireball, enemiesSkeletonSprites[i], () => 
                    {
                      fireball.disableBody(true, true); //FIXME
                      enemiesSkeletonSprites[i].disableBody(true, true);
                    }, null, this);
                  }
                  break;
                }
              case 'Down':
                {
                  fireball = scene1.physics.add.sprite(player.x , player.y + 50 , 'playerDown'); //player sprite set
                  fireball.displayWidth = 30; fireball.displayHeight = 30;
                  fireball.body.velocity.y = 100;
                  for(let i = 0; i < enemiesSkeletonSprites.length; i++)
                  {
                    scene1.physics.add.overlap(fireball, enemiesSkeletonSprites[i], () => 
                    {
                      fireball.disableBody(true, true); //FIXME
                      enemiesSkeletonSprites[i].disableBody(true, true);
                    }, null, this);
                  }
                  break;
                }
              case 'Left':
                {
                  fireball = scene1.physics.add.sprite(player.x - 50, player.y, 'playerDown'); //player sprite set
                  fireball.displayWidth = 30; fireball.displayHeight = 30;
                  fireball.body.velocity.x = -100;
                  for(let i = 0; i < enemiesSkeletonSprites.length; i++)
                  {
                    scene1.physics.add.overlap(fireball, enemiesSkeletonSprites[i], () => 
                    {
                      fireball.disableBody(true, true); //FIXME
                      enemiesSkeletonSprites[i].disableBody(true, true);
                    }, null, this);
                  }
                  break;
                }
              case 'none':
                {
  
                  break;
                }
            }
            break;
          }
        }
        attackSwitch = true;
      }
    }
    if(cursors.space.isUp)
    {
      attackSwitch = false;
    }
  }
  
  //inform game when player was hurt, update health bar
  function hurtPlayerSetHealth()
  {
    if(healthTemp != healthAmount)
    {
      if(healthTemp > 50)
      {
        if(healthTemp < 100 && healthTemp >= 90)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar90.jpg";
        }
        if(healthTemp < 90 && healthTemp >= 80)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar80.jpg";
        }
        if(healthTemp < 80 && healthTemp >= 70)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar70.jpg";
        }
        if(healthTemp < 70 && healthTemp >= 60)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar60.jpg";
        }
        if(healthTemp < 60 && healthTemp >= 50)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar50Orange.jpg";
        }
      }
      else
      {
        if(healthTemp < 50 && healthTemp >= 40)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar40Orange.jpg";
        }
        if(healthTemp < 40 && healthTemp >= 30)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar30Orange.jpg";
        }
        if(healthTemp < 30 && healthTemp >= 20)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar20Red.jpg";
        }
        if(healthTemp < 20 && healthTemp >= 10)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar10Red.jpg";
        }
        if(healthTemp < 10 && healthTemp >= 0)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar0.jpg";
        }
      }
      healthAmount = healthTemp
      if(!document.getElementsByName("invincibility")[1].checked)
      {
        document.getElementById("health_bar_amount").innerHTML = (healthAmount.toFixed(1) + "/" + healthMain);
      }
    }
  }

  /* - - - - - - - - - - GAME METHODS - - - - - - - - - - */



  //whole game configuration, width, height, scenes etc..
  config = 
  {
    type: Phaser.AUTO,
    width: 1975,
    height: 1240,
    parent: appDiv,
    scale:
    {
      mode: Phaser.Scene.FIT, //scaling disabled on purpose
    },
    backgroundColor: "000000",
    physics: 
    {
      default: 'arcade',
    },
    scene: [ FirstStage, PauseMenu ]
  };

  var game = new Phaser.Game(config); //game object, most important
  console.log(game);
  var enemiesSkeleton = [];
  var enemiesSkeletonSprites = [];
  var enemiesLich = [];
  var enemiesDemon = [];
  var enemiesPhantom = [];
  var player, cursors;
  var leftControlSwitch, escapeButtonSwitch, escapeButtonMenuSwitch, fireballSwitch, lightningSwitch, toxicboltSwitch, fearSwitch, attackSwitch;
  var equippedSpell = "fireball", playerFacingDirection = "Up";
}




/* - - - - - - - - - - MAIN / GAME MENU METHODS - - - - - - - - - - */

//buying spells method
function interfaceButtonsFunctionalities(chosenSpell)
{
  switch (chosenSpell)
  {
    case "spellLightning": spellLightning(); break;
    case "spellBlink": spellBlink(); break;
    case "spellFear": spellFear(); break;
    case "spellFireball": spellFireball(); break;
    case "spellToxicbolt": spellToxicbolt(); break;
  }
  function spellLightning()
  {
    document.getElementById("buy_spell_sound").load();
    document.getElementById("buy_spell_sound").play();
    document.getElementsByClassName("spell_button")[0].style.display = "none";
    spellsBought[0] = true;
  }
  function spellBlink()
  {
    document.getElementById("buy_spell_sound").load();
    document.getElementById("buy_spell_sound").play();
    document.getElementsByClassName("spell_button")[1].style.display = "none";
    spellsBought[1] = true;
  }
  function spellFear()
  {
    document.getElementById("buy_spell_sound").load();
    document.getElementById("buy_spell_sound").play();
    document.getElementsByClassName("spell_button")[2].style.display = "none";
    spellsBought[2] = true;
  }
  function spellFireball()
  {
    document.getElementById("buy_spell_sound").load();
    document.getElementById("buy_spell_sound").play();
    document.getElementsByClassName("spell_button")[3].style.display = "none";
    spellsBought[3] = true;
  }
  function spellToxicbolt()
  {
    document.getElementById("buy_spell_sound").load();
    document.getElementById("buy_spell_sound").play();
    document.getElementsByClassName("spell_button")[4].style.display = "none";
    spellsBought[4] = true;
  }
}

//show menu for first time
function showMenu()
{
  document.getElementById("game_menu_frame").style.margin ="0px 35%"; //slide animation
  document.getElementById("chains_down_sound").volume = "0.5"; //sound volume set 
  document.getElementById("chains_up_sound").volume = "0.5"; //sound volume set
  document.getElementById("chains_down_sound").play(); //sound playback 
  document.getElementById("rain_loop").play(); //sound playback 
  document.getElementById("rain_loop").volume = "0.25"; //rain volume set
  
  document.getElementById("click_anywhere_info").onclick = ""; //removing onclick method from ClickAnywhereInfo text
  document.getElementById("vignette").onclick = ""; //removing onclick method from vignette 
  document.getElementById("game_menu_buttons_frame").onclick = ""; //removing onclick method from specific div 
  document.getElementById("game_menu_background").onclick = ""; //removing onclick method from specific div 
  
  document.getElementById("click_anywhere_info").style.margin = "8% 0px 0px 12%"; //hiding text 
  document.getElementById("click_anywhere_info").style.fontSize = "33"; //hiding text 
  document.getElementById("click_anywhere_info").textContent = "v.1.0.1"; //hiding text 
  
  document.getElementById("game_logo").style.margin = "2% 0px 0px 7%"; //hiding logo
  document.getElementById("game_logo").style.width = "300px"; //hiding logo
  
  document.getElementById("buy_spell_sound").volume = "0.7"; // buy spell sound volume set
  setTimeout( ()=>
  {
    document.getElementById("main_menu_music").play(); //sound playback 
    document.getElementById("main_menu_music").volume = "0.7"; //rain volume set
    document.getElementById("game_menu_button_start").style.display = "block"; //showing button
    document.getElementById("game_menu_button_options").style.display = "block"; //showing button
    document.getElementById("game_menu_button_quit").style.display = "block"; //showing button
  }, 700);
}

//hide menu when starting game
function hideMenu()
{
  document.getElementById("game_menu_frame").style.margin = "-1000px 35%" //slide animation 
  document.getElementById("game_menu_button_start").style.display = "none"; //showing button
  document.getElementById("game_menu_button_options").style.display = "none"; //showing button
  document.getElementById("game_menu_button_quit").style.display = "none"; //showing button
  document.getElementById("chains_up_sound").load(); //sound load again because sometimes sound doesnt play  
  document.getElementById("chains_up_sound").play(); //sound playback 
  setTimeout( ()=>
  {
    document.getElementById("vignette").style.display = "none"; //removing onclick method from vignette 
    document.getElementById("game_menu_frame").style.display = "none"; //showing button
    document.getElementById("game_menu_buttons_frame").style.display = "none"; //showing button
    document.getElementById("game_menu_background").style.display = "none"; //showing button
    document.getElementById("background_video").style.display = "none"; //showing button
    document.getElementById("click_anywhere_info").style.display = "none"; //hiding text 
    document.getElementById("rain_loop").pause(); //sound playback 
    document.getElementById("main_menu_music").pause(); //sound playback 
    document.getElementById("game_left_interface").style.display = "block" //sound playback 
  }, 1500);
}

//main menu chosen button funcionality
function startMenuButtonsChoice(buttonClicked)
{
  switch (buttonClicked)
  {
    case "startGameButton": 
    {
      hideMenu();
      document.getElementById("start_game_sound").load(); //menu button click sound  
      document.getElementById("start_game_sound").play(); //menu button click sound  
      setTimeout( ()=>
      {
        startGame();
      }, 700);
      break;
    }
    case "optionsButton": 
    {
      document.getElementById("menu_click_sound").load(); //menu button click sound  
      document.getElementById("menu_click_sound").play(); //menu button click sound  
      optionsGame();
      break;
    }

    case "creditsButton": 
    {
      document.getElementById("menu_click_sound").load(); //menu button click sound  
      document.getElementById("menu_click_sound").play(); //menu button click sound  
      creditsGame();
      break;
    }
    case "returnButton": 
    {
      document.getElementById("menu_click_sound").load(); //menu button click sound  
      document.getElementById("menu_click_sound").play(); //menu button click sound  
      returnFromOptionsCreditsGame();
      break;
    }
  }
}

//show options in main menu
function optionsGame()
{
  document.getElementById("chains_up_sound").load(); //sound load again because sometimes sound doesnt play  
  document.getElementById("chains_up_sound").play(); //sound playback 
  document.getElementById("game_menu_button_start").style.display = "none"; //hiding button
  document.getElementById("game_menu_button_options").style.display = "none"; //hiding button
  document.getElementById("game_menu_button_quit").style.display = "none"; //hiding button
  document.getElementById("game_menu_frame").style.margin = "-1000px 35%" //slide animation 
  setTimeout( ()=>
  {
    document.getElementById("game_menu_frame").style.margin = "0px 35%" //slide animation 
    document.getElementById("chains_down_sound").load(); //sound load again because sometimes sound doesnt play  
    document.getElementById("chains_down_sound").play(); //sound playback 
    setTimeout( ()=>
    {
      document.getElementById("options_section").style.display = "block";
      document.getElementById("game_menu_button_return").style.display ="block" //show return button
    }, 700);
  }, 900);
}

//return from options
function returnFromOptionsCreditsGame()
{
  document.getElementById("chains_up_sound").load(); //sound load again because sometimes sound doesnt play  
  document.getElementById("chains_up_sound").play(); //sound playback 
  document.getElementById("options_section").style.display = "none";
  document.getElementById("quit_section_credits").style.display = "none";
  document.getElementById("game_menu_button_return").style.display = "none";
  document.getElementById("game_menu_frame").style.margin = "-1000px 35%" //slide animation 
  setTimeout( ()=>
  {
    document.getElementById("game_menu_frame").style.margin ="0px 35%"; //slide animation
    document.getElementById("chains_down_sound").load(); //sound load again because sometimes sound doesnt play  
    document.getElementById("chains_down_sound").play(); //sound playback 
    setTimeout( ()=>
    {
      document.getElementById("game_menu_button_start").style.display = "block"; //showing button
      document.getElementById("game_menu_button_options").style.display = "block"; //showing button
      document.getElementById("game_menu_button_quit").style.display = "block"; //showing button
    }, 700);
  }, 900);
}

//show game credits
function creditsGame()
{
  document.getElementById("chains_up_sound").load(); //sound load again because sometimes sound doesnt play  
  document.getElementById("chains_up_sound").play(); //sound playback 
  document.getElementById("game_menu_button_start").style.display = "none"; //hiding button
  document.getElementById("game_menu_button_options").style.display = "none"; //hiding button
  document.getElementById("game_menu_button_quit").style.display = "none"; //hiding button
  document.getElementById("game_menu_frame").style.margin = "-1000px 35%" //slide animation 
  setTimeout( ()=>
  {
    document.getElementById("game_menu_frame").style.margin = "0px 35%" //slide animation 
    document.getElementById("chains_down_sound").load(); //sound load again because sometimes sound doesnt play  
    document.getElementById("chains_down_sound").play(); //sound playback 
    setTimeout( ()=>
    {
      document.getElementById("quit_section_credits").style.display = "block";
      document.getElementById("game_menu_button_return").style.display ="block" //show return button
    }, 700);
  }, 900);
}

function showSkillsMenu()
{

}


/* - - - - - - - - - - MAIN / GAME MENU METHODS - - - - - - - - - - */
