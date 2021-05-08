/*
TODOLIST

- xp z mobkow i kupowaie
- typy potworoww
- rozne stage
- dialog? 
- potiony 
- dzwieki i muzyka 
- fale mobków

- fireball

HP CHART
skeleton 100
phantom 150
lich 200
demon 300 

*/


var healthMain = 100; let manaMain = 100;

//these are used when player restarts stage
var healthSave, xpSave;
var spellsSave = [false, false, false, false, false];

//main variables of user stats
var xp = 150;
var healthAmount = healthMain; var manaAmount = manaMain;
var spellsBought = [false, false, false, false, false]; //array that holds information about which spells have been purchased
var currentStage = 0;

var spellInterval = 0;
var oomSpeechSwitch = 1;

//FIXME
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

//xp boost 
if(document.getElementsByName("experience")[1].checked)
{
  xp = 999;
  document.getElementById("xp_amount").innerText = xp;;
}



const appDiv = document.getElementById('game');


class Skeleton
{
  constructor(health, drop)
  {
    this.health = health; this.drop = drop;
  }
}
class Phantom
{
  constructor(health, drop)
  {
    this.health = health; this.drop = drop;
  }
}
class Lich
{
  constructor(health, drop)
  {
    this.health = health; this.drop = drop;
  }
}
class Demon
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
      currentStage = 1;
      loadSpritesAndAudio(currentStage);
    },
  
    //launches on stage creation
    create: function()
    {
      //FIXME
      returnPlayerStatsWhenRestart();
      createAnimationsAndAudio(currentStage); //create every animation for this stage

      backgroundImage = this.add.image(987.5, 620, 'background'); //background image set
      backgroundImage.displayWidth = 1975;
      backgroundImage.displayHeight  = 1240;

      player = this.physics.add.sprite(987.5, 620 , 'playerDown'); //player sprite set
      player.anims.play('up', true); //player animation
      player.displayWidth = 80; //player width
      player.displayHeight = 80; //player height
      player.body.collideWorldBounds = true; //player collides on world border
      player.body.immovable = false; //player can be moved by other mobs
  
      let difficultyLeveles = document.getElementsByName("difficulty"); //skeleton spawn depends on difficulty set
  
      //arrays of enemy objects
      let enemiesSkeleton = [];
      let enemiesLich = [];
      let enemiesDemon = [];
      let enemiesPhantom = [];

      let difficultyLevel = 0; //difficulty level set 
      for(let i = 0; i < difficultyLeveles.length; i++) //difficulty setting read
      {
        if(difficultyLeveles[i].checked)
        {
          difficultyLevel = difficultyLeveles[i].value;
          break;
        }
      }
  
      //Create enemies
      for(let i = 0; i < (10 + 5 * difficultyLevel); i++)
      {
        enemiesSkeleton[i] = new Skeleton(100, "xpParticle");
        enemiesSkeletonSprites[i] = this.physics.add.sprite(200 + i*70,250, 'skeletonAnimation');
        enemiesSkeletonSprites[i].anims.play('skeleton', true);
        enemiesSkeletonSprites[i].displayHeight = 55;
        enemiesSkeletonSprites[i].displayWidth = 55;
        enemiesSkeletonSprites[i].body.collideWorldBounds = true;
        enemiesSkeletonSprites[i].body.immovable = false; 
      }
      enemiesSkeleton[Math.floor(Math.random()*(10 + 5 * difficultyLevel - 1))].drop ="healthDrop"//give to random skeleton a health potion
      for(let i = 0; i < (2 + 1 * difficultyLevel); i++)
      {
        enemiesPhantom[i] = new Phantom(160, "xpParticle");
        enemiesPhantomSprites[i] = this.physics.add.sprite(200 + i*150,300, 'phantomAnimation');
        enemiesPhantomSprites[i].anims.play('phantom', true);
        enemiesPhantomSprites[i].displayHeight = 90;
        enemiesPhantomSprites[i].displayWidth = 90;
        enemiesPhantomSprites[i].body.collideWorldBounds = true;
        enemiesPhantomSprites[i].body.immovable = false; 
      }
      enemiesPhantom[Math.floor(Math.random()*(2 + 1 * difficultyLevel - 1))].drop ="healthDrop"//give to random phantom a health potion

      //adding colission between enemy and player
      enemiesAddColissionToPlayer(enemiesSkeletonSprites, player, currentStage, 0.15);
      enemiesAddColissionToPlayer(enemiesPhantomSprites, player, currentStage, 0.25);
      
      //adding collision between eachother
      enemiesAddCollisionBetweenSameEnemies(enemiesSkeletonSprites, currentStage);
      enemiesAddCollisionBetweenSameEnemies(enemiesPhantomSprites, currentStage);

      //merged arrays for easier movement and spell colission detection
      enemies = enemiesSkeleton.concat(enemiesPhantom);
      enemiesSprites = enemiesSkeletonSprites.concat(enemiesPhantomSprites);

      //set keyboards keys
      setKeyboardKeys(currentStage);
  
      this.scene.pause();
      document.getElementById("stage_1_music").pause();
      document.getElementById("stage_1_ambience").pause();
      this.scene.launch('PauseMenu');
    },
  
    //runs with every frame of the game
    update: function() 
    {
      //spell cooldown set, display set
      if(spellInterval < 30)
      {
        document.getElementById("cooldown_bar_outline").style.display = "block";
        document.getElementById("cooldown_bar_inside").style.width = (spellInterval * 3.33 + "%");
        spellInterval++;
      }
      else
      {
        document.getElementById("cooldown_bar_outline").style.display = "none";
        document.getElementById("cooldown_bar_inside").style.width = "0%";
      }

      //if player mana is below 100 then add 0.3, else dont 
      if(manaTemp < 100)
      {
        manaTemp += 0.3;
        manaPlayerSetMana();
      }
      else 
      {
        manaTemp = 100;
        manaPlayerSetMana();
      }
      //check if player is still alive
      if(healthAmount < 0)
      {
        playerDied(currentStage);
      }
  
      //move enemies
      enemiesMove(enemiesSkeletonSprites, player, 100);
      enemiesMove(enemiesPhantomSprites, player, 160);

      keyboardButtonsFunctionalities();
  
      if(escapeButton.isDown)
      {
        if(!escapeButtonSwitch)
        {
          this.scene.pause();
          this.scene.launch('PauseMenu');
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
      document.getElementById("cooldown_bar_outline").style.display = "none";

      document.getElementById("stage_1_ambience").volume = "0.25"; //music volume set
      document.getElementById("stage_1_music").volume = "0.2"; //music volume set
      document.getElementById("stage_1_music").pause();
      document.getElementById("stage_1_ambience").pause();


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
        if(document.getElementById("spell_buttons").style.display != "block")
        {
          escapeButtonMenuSwitch = true;
          backgroundPause.destroy();
          pauseMenuTile.destroy();
          unpauseButton.destroy();
          exitButton.destroy();

          document.getElementById("stage_1_music").play();
          document.getElementById("stage_1_ambience").play();
          game.scene.scenes[currentStage - 1].scene.resume();
        }
      });


      exitButton = this.add.image(game.canvas.width/2, game.canvas.height/2 + 90, 'quitGame').setInteractive();
      exitButton.displayWidth = 577;
      exitButton.displayHeight = 90;
      exitButton.on('pointerdown', function(event)
      {        
        if(document.getElementById("spell_buttons").style.display != "block")
        {
          location.reload();
        }
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
          escapeButtonMenuSwitch = true;
          backgroundPause.destroy();
          pauseMenuTile.destroy();
          unpauseButton.destroy();
          exitButton.destroy();
          game.scene.scenes[currentStage - 1].scene.resume();
          document.getElementById("stage_1_music").play();
          document.getElementById("stage_1_ambience").play();
          if(document.getElementById("skill_book_video").style.display == "block")
          {
            hideSkillsMenu();
          }
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

  /* -- gameplay set -- */
  function keyboardButtonsFunctionalities()
  {
    player.body.velocity.x = 0; player.body.velocity.y = 0;
    player.displayWidth = 80; player.displayHeight = 80;
  
    if (wButton.isDown && dButton.isDown && !aButton.isDown && !sButton.isDown) //On RIGHT press action
    {
      player.body.velocity.x = 200; player.body.velocity.y = -200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "UpRight"; 
      player.angle = 45;
    }
    else if(wButton.isDown && aButton.isDown)
    {
      player.body.velocity.x = -200; player.body.velocity.y = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "UpLeft";
      player.angle = 315; 
    }
    else if(wButton.isDown)
    {
      player.body.velocity.y = -200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Up";
      player.angle = 0;
    }
  
    if (sButton.isDown && dButton.isDown) //On RIGHT press action
    {
      player.body.velocity.x = 200; player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "DownRight";
      player.angle = 135;
    }
    else if(sButton.isDown && aButton.isDown)
    {
      player.body.velocity.x = -200; player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100; 
      player.anims.play('running', true);
      playerFacingDirection = "DownLeft";
      player.angle = 225;
    }
    else if(sButton.isDown)
    {
      player.body.velocity.y = 200;
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Down";
      player.angle = 180;
    }
  
    if(aButton.isDown && dButton.isDown)
    {
      player.body.velocity.x = 0;      
      player.anims.play('up', true);
      playerFacingDirection = "None";
    }
    else if(aButton.isDown && !wButton.isDown && !sButton.isDown)
    {
      player.body.velocity.x = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Left"
      player.angle = 270;
    }
    else if(dButton.isDown && !wButton.isDown && !sButton.isDown)
    {
      player.body.velocity.x = 200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Right"
      player.angle = 90;
    }
  
    if(dButton.isDown && wButton.isDown && sButton.isDown)
    {
      player.body.velocity.x = 200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Right"
      player.angle = 90;
    }
    if(wButton.isDown && aButton.isDown && dButton.isDown)
    {
      player.body.velocity.y = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true); 
      playerFacingDirection = "Up"
      player.angle = 0;
    }
    if(aButton.isDown && wButton.isDown && sButton.isDown)
    {
      player.body.velocity.x = -200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Left"
      player.angle = 270;
    }
    if(sButton.isDown && aButton.isDown && dButton.isDown)
    {
      player.body.velocity.y = 200; 
      player.displayWidth = 100; player.displayHeight = 100;
      player.anims.play('running', true);
      playerFacingDirection = "Down"
      player.angle = 180;
    }

    if(!aButton.isDown && !wButton.isDown && !dButton.isDown && !sButton.isDown)
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
    
    if(vButton.isDown ) //On V press action
    {     
      if(!vSwitch) //Pressing V activates teleport only once because of this.
      {
        spellSelect("blink");
        if(spellsBought[0] == true)
        {
          if(manaTemp >= 30)
          {
            if(spellInterval >= 30)
            {      
              spellInterval = 0;
              manaTemp -= 30;
              manaPlayerSetMana();
              let directionX = 0; 
              let directionY = 0; 
              if(player.body.velocity.x == 200)
              {
                player.body.x +=160;
                directionX = -160
                // blink2.body.x = player.body.x;
              }      
              if(player.body.velocity.y == 200)
              {
                player.body.y +=100;
                directionY = -100
                // blink2.body.y = player.body.y;

              }
              if(player.body.velocity.x == -200)
              { 
                player.body.x -=160; 
                directionX = 160
                // blink2.body.x = player.body.x;

              }
              if(player.body.velocity.y == -200)
              { 
                player.body.y -=100;
                directionY = 100
                // blink2.body.y = player.body.y;
              }
              blink = game.scene.scenes[currentStage - 1].physics.add.sprite(player.x, player.y, 'blinkAnimation');
              blink.anims.play('blink', true); //player animation
              blink.displayHeight = player.displayHeight;
              blink.displayWidth = player.displayWidth;
              blink.on('animationcomplete', () => 
              {
                blink.disableBody(true, true);
              });

              blink2 = game.scene.scenes[currentStage - 1].physics.add.sprite(player.x - directionX, player.y - directionY, 'blinkAnimation');
              blink2.anims.play('blinkReversed', true); //player animation
              blink2.displayHeight = player.displayHeight;
              blink2.displayWidth = player.displayWidth;
              blink2.on('animationcomplete', () => 
              {
                blink2.disableBody(true, true);
              });
            }
          }
          else
          {
            oomErrorSpeech();
          }
        }
        vSwitch = true;
      }
    }
    if(vButton.isUp)
    {
      vSwitch = false;
    }
  
    if(cursors.space.isDown) //on space press down
    {
      if(!attackSwitch) // player can only attack one per click
      {
        switch(equippedSpell) //switch that casts equipped spell
        {
          case 'fireball':
          {
            if(manaTemp >= 15)
            {
              if(spellInterval >= 0)
              {
                spellInterval = 0;
                manaTemp -=15;
                manaPlayerSetMana();

                let fireball = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'fireballAnimation');
                fireball.anims.play('fireball', true); //fireball animation
                fireball.displayWidth = 30; fireball.displayHeight = 50;
                spellMovement(playerFacingDirection, fireball, player, 350);

                if(enemiesSprites.length != 0)
                {
                  for(let i = 0; i < enemies.length; i++)
                  {
                    game.scene.scenes[currentStage - 1].physics.add.overlap(fireball, enemiesSprites[i], () => 
                    {
                      fireball.disableBody(true, true); //FIXME
                      enemies[i].health -= 50;
                      addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-50");
                      if(enemies[i].health <= 0)
                      {
                        let enemyX = enemiesSprites[i].body.x;
                        let enemyY = enemiesSprites[i].body.y;
                        let enemyWidth = enemiesSprites[i].displayWidth;
                        let enemyHeight = enemiesSprites[i].displayHeight;
                        enemiesSprites[i].disableBody(true, true);

                        if(enemies[i].drop == "xpParticle")
                        {
                          xpParticle = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'expParticle');
                          xpParticle.anims.play('exp', true);
                          xpParticle.displayWidth = 20; xpParticle.displayHeight = 20;
  
                          //FIXME xp podnoszenie
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, xpParticle, () => 
                          {
                            xpParticle.disableBody(true, true);
                            xp += 0.5;
                            console.log("XDD")
                            document.getElementById("xp_amount").innerHTML = xp.toFixed(1);
                          });
                        }
                        else
                        {
                          var hpPotion = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'hpPotion');
                          hpPotion.anims.play('hp', true);
                          hpPotion.displayWidth = 40; hpPotion.displayHeight = 40;
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, hpPotion, () => 
                          {
                            hpPotion.disableBody(true, true);
                            healthTemp += 20;
                            hurtPlayerSetHealth();
                            console.log("XDD")
                          });
                        }
                      }
                    });
                  }
                }
              }
            }
            else
            {
              oomErrorSpeech();
            }
            break;
          }
          case 'toxicbolt':
          {
            if(manaTemp >= 25)
            {
              if(spellInterval >= 30)
              {
                spellInterval = 0;
                manaTemp -= 25;
                manaPlayerSetMana();

                let toxicbolt = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'toxicboltAnimation');
                toxicbolt.anims.play('toxicbolt', true);
                toxicbolt.displayWidth = 40; toxicbolt.displayHeight = 70;
                spellMovement(playerFacingDirection, toxicbolt, player, 500, false);

                if(enemiesSprites.length != 0)
                {
                  for(let i = 0; i < enemiesSprites.length; i++)
                  {
                    game.scene.scenes[currentStage - 1].physics.add.overlap(toxicbolt, enemiesSprites[i], () => 
                    {
                      enemies[i].health -= 2.5;
                      if(dmgTextCount <= 5)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-2.5");
                      }

                      if(enemies[i].health <= 0)
                      {
                        let enemyX = enemiesSprites[i].body.x;
                        let enemyY = enemiesSprites[i].body.y;
                        let enemyWidth = enemiesSprites[i].displayWidth;
                        let enemyHeight = enemiesSprites[i].displayHeight;
                        enemiesSprites[i].disableBody(true, true);

                        if(enemies[i].drop == "xpParticle")
                        {
                          let xpParticle = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'expParticle');
                          xpParticle.anims.play('exp', true);
                          xpParticle.displayWidth = 20; xpParticle.displayHeight = 20;
  
                          //FIXME xp podnoszenie
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, xpParticle, () => 
                          {
                            xpParticle.disableBody(true, true);
                            xp += 0.5;
                            console.log("XDD")
                            document.getElementById("xp_amount").innerHTML = xp.toFixed(1);
                          });
                        }
                        else
                        {
                          let hpPotion = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'hpPotion');
                          hpPotion.anims.play('hp', true);
                          hpPotion.displayWidth = 40; hpPotion.displayHeight = 40;
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, hpPotion, () => 
                          {
                            hpPotion.disableBody(true, true);
                            healthTemp += 20;
                            hurtPlayerSetHealth();
                            console.log("XDD")
                          });
                        }
                      }
                    });
                  }
                }
              }
            }
            else
            {
              oomErrorSpeech();
            }
            break;
          }
          case 'lightningbolt':
          {
            if(manaTemp >= 80)
            {
              if(spellInterval >= 30)
              {
                spellInterval = 0;
                manaTemp -= 80;
                manaPlayerSetMana();
                let lightning = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'lightningboltAnimation')
                lightning.anims.play('lightning', true);
                lightning.displayWidth = 160; lightning.displayHeight = 300;
                spellMovement(playerFacingDirection, lightning, player, 90, true);
                lightning.on('animationcomplete', () => 
                {
                  lightning.disableBody(true, true);
                });

                if(enemiesSprites.length != 0)
                {
                  for(let i = 0; i < enemiesSprites.length; i++)
                  {
                    game.scene.scenes[currentStage - 1].physics.add.overlap(lightning, enemiesSprites[i], () => 
                    {
                      enemies[i].health -= 5.5;
                      if(dmgTextCount <= 5)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-5.5");
                      }
                      
                      if(enemies[i].health <= 0)
                      {
                        let enemyX = enemiesSprites[i].body.x;
                        let enemyY = enemiesSprites[i].body.y;
                        let enemyWidth = enemiesSprites[i].displayWidth;
                        let enemyHeight = enemiesSprites[i].displayHeight;
                        enemiesSprites[i].disableBody(true, true);
                        if(enemies[i].drop == "xpParticle")
                        {
                          let xpParticle = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'expParticle');
                          xpParticle.anims.play('exp', true);
                          xpParticle.displayWidth = 20; xpParticle.displayHeight = 20;
  
                          //FIXME xp podnoszenie
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, xpParticle, () => 
                          {
                            xpParticle.disableBody(true, true);
                            xp += 0.5;
                            console.log("XDD")
                            document.getElementById("xp_amount").innerHTML = xp.toFixed(1);
                          });
                        }
                        else
                        {
                          let hpPotion = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'hpPotion');
                          hpPotion.anims.play('hp', true);
                          hpPotion.displayWidth = 40; hpPotion.displayHeight = 40;
                          game.scene.scenes[currentStage - 1].physics.add.overlap(player, hpPotion, () => 
                          {
                            hpPotion.disableBody(true, true);
                            healthTemp += 20;
                            hurtPlayerSetHealth();
                            console.log("XDD")
                          });
                        }
                      }
                    });
                  }
                }       
              }
            }
            else 
            {
              oomErrorSpeech();
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
    

    if(oneButton.isDown)
    {
      if(!oneButtonSwitch)
      {   
        spellSelect("fireball");
        
        oneButtonSwitch = true;
      }
    }
    if(oneButton.isUp)
    {
      oneButtonSwitch = false;
    }

    if(twoButton.isDown)
    {
      if(!twoButtonSwitch)
      {   
        spellSelect("toxicbolt");
        twoButtonSwitch = true;
      }
    }
    if(twoButton.isUp)
    {
      twoButtonSwitch = false;
    }

    if(threeButton.isDown)
    {
      if(!threeButtonSwitch)
      {   
        spellSelect("lightningbolt");
        threeButtonSwitch = true;
      }
    }
    if(threeButton.isUp)
    {
      threeButtonSwitch = false;
    }

    if(eButton.isDown)
    {
      if(!eButtonSwitch)
      {   
        spellSelect("fear");
        if(spellsBought[4] == true)
        {
          if(manaTemp >= 50)
          {
            if(spellInterval >= 30)
            {
              spellInterval = 0;
              manaTemp -= 50;
              manaPlayerSetMana();
              fear = game.scene.scenes[currentStage - 1].physics.add.sprite(player.x, player.y, 'fearAnimation');
              fear.anims.play('fear', true); //player animation
              fear.displayHeight = 300;
              fear.displayWidth = 300;
              fear.on('animationcomplete', () => 
              {
                fear.disableBody(true, true);
              });
              fearActive = true;
              setTimeout(() => {
                fearActive = false;
              }, 4000);
            }
          }
          else
          {
            oomErrorSpeech();
          }
        }
        eButtonSwitch = true;
      }
    }
    if(eButton.isUp)
    {
      eButtonSwitch = false;
    }
  }
  
  function loadSpritesAndAudio(currentStage)
  {
    game.scene.scenes[currentStage - 1].load.crossOrigin = 'anonymous';
    game.scene.scenes[currentStage - 1].load.spritesheet('playerUp', 'assets/PlayerBody/BodyPlayerUp.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('playerDown', 'assets/PlayerBody/BodyPlayerDown.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('playerLeft', 'assets/PlayerBody/BodyPlayerLeft.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('playerRight', 'assets/PlayerBody/BodyPlayerRight.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('playerRunning', 'assets/PlayerBody/BodyPlayerRunning.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.image('deadPlayer', 'assets/PlayerBody/DeadBodyPlayer.png');

    game.scene.scenes[currentStage - 1].load.spritesheet('skeletonAnimation', 'assets/VariousAnimations/skeletonAnimation.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('phantomAnimation', 'assets/VariousAnimations/phantomAnimation.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('lichAnimation', 'assets/VariousAnimations/lichAnimation.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('demonAnimation', 'assets/VariousAnimations/demonAnimation.png', { frameWidth: 267.75, frameHeight: 200});

    game.scene.scenes[currentStage - 1].load.spritesheet('toxicboltAnimation', 'assets/VariousAnimations/toxicboltAnimation2.png', { frameWidth: 100, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('fireballAnimation', 'assets/VariousAnimations/fireballAnimation.png', { frameWidth: 75, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('lightningboltAnimation', 'assets/VariousAnimations/lightningboltAnimation.png', { frameWidth: 52.9, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('blinkAnimation', 'assets/VariousAnimations/blinkAnimation.png', { frameWidth: 87.6, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('fearAnimation', 'assets/VariousAnimations/fearAnimation.png', { frameWidth: 300, frameHeight: 300});

    game.scene.scenes[currentStage - 1].load.spritesheet('expParticle', 'assets/VariousAnimations/experienceOrbAnimation.png', { frameWidth: 68, frameHeight: 68});
    game.scene.scenes[currentStage - 1].load.spritesheet('hpPotion', 'assets/VariousAnimations/potionHealthAnimation.png', { frameWidth: 80, frameHeight: 80});

    game.scene.scenes[currentStage - 1].load.image('background', 'assets/Backgrounds/Background1.jpg');
    game.scene.scenes[currentStage - 1].load.image('restartQuestionMenu', 'assets/GameMenu/MenuPopup.png');
    game.scene.scenes[currentStage - 1].load.image('buttonSmallYes', 'assets/GameMenu/ButtonSmallYes.png');
    game.scene.scenes[currentStage - 1].load.image('buttonSmallNo', 'assets/GameMenu/ButtonSmallNo.png');
  }

  function createAnimationsAndAudio(currentStage)
  {
  //animations creating
       //player -- -- --
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'up', 
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('playerUp', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'down', 
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('playerDown', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'left', 
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('playerLeft', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'right', 
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('playerRight', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'running',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('playerRunning', { start: 0, end: 6}),
        frameRate: 8,
        repeat: -1
      })

       //spells -- -- --
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'fireball',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('fireballAnimation', { start: 0, end: 3}),
        frameRate: 6,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'toxicbolt',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('toxicboltAnimation', { start: 0, end: 3}),
        frameRate: 9,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'lightning',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('lightningboltAnimation', { start: 0, end: 9}),
        frameRate: 20,
        repeat: 0
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'blink',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('blinkAnimation', { start: 0, end: 4}),
        frameRate: 30,
        repeat: 0
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'blinkReversed',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('blinkAnimation', { start: 4, end: 0}),
        frameRate: 30,
        repeat: 0
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'fear',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('fearAnimation', { start: 0, end: 6}),
        frameRate: 6,
        repeat: 0
      })

       //monsters -- -- --
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'skeleton',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('skeletonAnimation', { start: 0, end: 8}),
        frameRate: 7,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'phantom',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('phantomAnimation', { start: 0, end: 8}),
        frameRate: 7,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'lich',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('lichAnimation', { start: 0, end: 7}),
        frameRate: 7,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'demon',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('demonAnimation', { start: 0, end: 11}),
        frameRate: 6,
        repeat: -1
      })

       //various -- -- --
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'exp',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('expParticle', { start: 0, end: 8}),
        frameRate: 9,
        repeat: -1
      })
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'hp',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('hpPotion', { start: 0, end: 3}),
        frameRate: 5,
        repeat: -1
      })
  }

  function setKeyboardKeys(currentStage)
  {
    cursors = game.scene.scenes[currentStage - 1].input.keyboard.createCursorKeys(); // UP DOWN LEFT RIGHT SPACE bind kinda
    wButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    sButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    aButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    dButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    oneButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
    twoButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
    threeButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
    eButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    vButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V); //escape button bind
    escapeButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); //escape button bind
  }
  /* -- gameplay set -- */


  /* -- actions -- */
  //inform game when player was hurt, update health bar
  function hurtPlayerSetHealth()
  {
    if(healthTemp != healthAmount)
    {
      if(healthTemp > 50)
      {
        if(healthTemp >= 100)
        {
          document.getElementById("health_bar").src = "assets/HpBars/hpBar100.jpg";
        }
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

  //inform game when player mana changed
  function manaPlayerSetMana()
  {
    if(manaTemp != manaAmount)
    {
      if(manaTemp > 50)
      {

        if(manaTemp >= 100)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar100.jpg";
        }
        if(manaTemp < 100 && manaTemp >= 90)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar90.jpg";
        }
        if(manaTemp < 90 && manaTemp >= 80)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar80.jpg";
        }
        if(manaTemp < 80 && manaTemp >= 70)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar70.jpg";
        }
        if(manaTemp < 70 && manaTemp >= 60)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar60.jpg";
        }
        if(manaTemp < 60 && manaTemp >= 50)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar50.jpg";
        }
      }
      else
      {
        if(manaTemp < 50 && manaTemp >= 40)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar40.jpg";
        }
        if(manaTemp < 40 && manaTemp >= 30)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar30.jpg";
        }
        if(manaTemp < 30 && manaTemp >= 20)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar20.jpg";
        }
        if(manaTemp < 20 && manaTemp >= 10)
        {
          document.getElementById("mana_bar").src = "assets/ManaBar/manaBar10.jpg";
        }
        if(manaTemp < 10 && manaTemp >= 0)
        {
          document.getElementById("mana_bar").src = "assets/HpBars/hpBar0.jpg";
        }
      }
      manaAmount = manaTemp
      document.getElementById("mana_bar_amount").innerHTML = (manaAmount.toFixed(1) + "/" + manaMain);
    }
  }

  function playerDied(currentStage)
  {
    healthAmount = 0;
    document.getElementById("stage_1_music").src = "assets/Audio/Music/deadMusic.mp3";
    document.getElementById("stage_1_music").load();
    document.getElementById("stage_1_music").play();
    document.getElementById("health_bar_amount").innerHTML = (healthAmount.toFixed(1) + "/" + healthMain);

    playerDead = game.scene.scenes[currentStage - 1].physics.add.image(player.x, player.y, 'deadPlayer');
    playerDead.displayHeight = player.displayHeight + 30;
    playerDead.displayWidth = player.displayWidth + 30;
    player.disableBody(false, true);

    restartMenu = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2, game.canvas.height/2, 'restartQuestionMenu');
    restartMenu.displayWidth = 900;
    restartMenu.displayHeight = 300;

    restartButtonYes = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2 - 200, game.canvas.height/2 + 25, 'buttonSmallYes').setInteractive();
    restartButtonYes.displayWidth = 340;
    restartButtonYes.displayHeight = 100;
    restartButtonYes.on('pointerdown', function(event)
    {
      healthAmount = 100; healthTemp = 100;
      document.getElementById("stage_1_music").src = "assets/Audio/Music/stage1Music.mp3";
      document.getElementById("stage_1_ambience").src = "";
      document.getElementById("stage_1_ambience").src = "assets/Audio/Music/stage1Ambience.mp3";
      document.getElementById("health_bar").src = "assets/HpBars/hpBar100.jpg";
      document.getElementById("health_bar_amount").innerHTML = (healthTemp.toFixed(1) + "/" + healthMain);
      game.scene.scenes[currentStage - 1].scene.restart();
    });

    //button restart no
    restartButtonNo = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2 + 200, game.canvas.height/2 + 25, 'buttonSmallNo').setInteractive();
    restartButtonNo.displayWidth = 340;
    restartButtonNo.displayHeight = 100;
    restartButtonNo.on('pointerdown', function (event)
    {
      location.reload();
    });
  }

  function spellMovement(playerDirection, spellName, player, speed, lightning)
  {
    if(lightning)
    {
      switch(playerDirection)
      {
        case "Up":
        {
          spellName.x = player.x; spellName.y = player.y - player.displayHeight - 50;
          spellName.angle = 0;
          spellName.body.velocity.y = -speed;
          break;
        }
        case "UpRight":
        {
          spellName.x = player.x + player.displayWidth + 50; spellName.y = player.y - player.displayHeight - 50;
          spellName.angle = 45;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "UpLeft":
        {
          spellName.x = player.x - player.displayWidth  - 50; spellName.y = player.y - player.displayHeight - 50;
          spellName.angle = 315;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Down":
        {
          spellName.x = player.x; spellName.y = player.y + player.displayHeight + 50;
          spellName.angle = 180;
          spellName.body.velocity.y = speed;
          break;
        }
        case "DownRight":
        {
          spellName.x = player.x + player.displayWidth + 50; spellName.y = player.y + player.displayHeight + 50;
          spellName.angle = 135;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "DownLeft":
        {
          spellName.x = player.x - player.displayWidth - 50; spellName.y = player.y + player.displayHeight + 50;
          spellName.angle = 225;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Left":
        {
          spellName.x = player.x - player.displayWidth - 50; spellName.y = player.y;
          spellName.angle = 270;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Right":
        {
          spellName.x = player.x + player.displayWidth + 50; spellName.y = player.y;
          spellName.angle = 90;
          spellName.body.velocity.x = speed;
          break;
        }
      }
    }
    else
    {
      switch(playerDirection)
      {
        case "Up":
        {
          spellName.x = player.x; spellName.y = player.y - 50;
          spellName.angle = 0;
          spellName.body.velocity.y = -speed;
          break;
        }
        case "UpRight":
        {
          spellName.x = player.x + 50; spellName.y = player.y - 50;
          spellName.angle = 45;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "UpLeft":
        {
          spellName.x = player.x - 50; spellName.y = player.y - 50;
          spellName.angle = 315;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Down":
        {
          spellName.x = player.x; spellName.y = player.y + 50;
          spellName.angle = 180;
          spellName.body.velocity.y = speed;
          break;
        }
        case "DownRight":
        {
          spellName.x = player.x + 50; spellName.y = player.y + 50;
          spellName.angle = 135;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "DownLeft":
        {
          spellName.x = player.x - 50; spellName.y = player.y + 50;
          spellName.angle = 225;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Left":
        {
          spellName.x = player.x - 50; spellName.y = player.y;
          spellName.angle = 270;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Right":
        {
          spellName.x = player.x + 50; spellName.y = player.y;
          spellName.angle = 90;
          spellName.body.velocity.x = speed;
          break;
        }
      }
    }
  }

  function enemiesMove(enemiesMoveSprites, player, speed)
  {
    if(!fearActive)
    {
      for(let i = 0; i < enemiesMoveSprites.length; i++)
      {
        enemiesMoveSprites[i].body.velocity.x=0;
        enemiesMoveSprites[i].body.velocity.y=0;
       
        let xDifference = player.x - enemiesMoveSprites[i].x;
        let yDifference = player.y - enemiesMoveSprites[i].y;
  
        let c = Math.sqrt((xDifference * xDifference) + (yDifference * yDifference));
        let sina = Math.abs(xDifference) / c;
        let sinb = Math.abs(yDifference) / c;
        
        if(player.x > enemiesMoveSprites[i].x)
        {
          if(player.y < enemiesMoveSprites[i].y)
          {
            enemiesMoveSprites[i].body.velocity.setTo(sina * speed, sinb * (-speed));
            enemiesMoveSprites[i].angle = 90 * sina;
          }
          else
          {
            enemiesMoveSprites[i].body.velocity.setTo(sina * speed, sinb * speed);
            enemiesMoveSprites[i].angle = 90 * sinb + 90;
          }
        }
        if(player.x < enemiesMoveSprites[i].x)
        {
          if(player.y > enemiesMoveSprites[i].y)
          {
            enemiesMoveSprites[i].body.velocity.setTo(sina * (-speed), sinb * speed);
            enemiesMoveSprites[i].angle = 360 - (90 * sinb + 90);
          }
          else
          {
            enemiesMoveSprites[i].body.velocity.setTo(sina * (-speed), sinb * (-speed));
            enemiesMoveSprites[i].angle = 360 - (90 * sina);
          }  
        }
      }
    }
    else
    {
      for(let i = 0; i < enemiesMoveSprites.length; i++)
      {
        let direction = Math.floor(Math.random()*(8 - 1)) + 1;
        switch(direction)
        {
          case 1:
          {
            enemiesMoveSprites[i].body.velocity.x = 0;
            enemiesMoveSprites[i].body.velocity.y = -speed / 2;
            break;
          }
          case 2:
          {
            enemiesMoveSprites[i].body.velocity.x = speed / 2;
            enemiesMoveSprites[i].body.velocity.y = -speed / 2;
            break;
          }
          case 3:
          {
            enemiesMoveSprites[i].body.velocity.x = speed / 2;
            enemiesMoveSprites[i].body.velocity.y = 0;
            break;
          }
          case 4:
          {
            enemiesMoveSprites[i].body.velocity.x = speed / 2;
            enemiesMoveSprites[i].body.velocity.y = speed / 2;
            break;
          }
          case 5:
          {
            enemiesMoveSprites[i].body.velocity.x = 0;
            enemiesMoveSprites[i].body.velocity.y = speed / 2;
            break;
          }
          case 6:
          {
            enemiesMoveSprites[i].body.velocity.x = -speed / 2;
            enemiesMoveSprites[i].body.velocity.y = speed / 2;
            break;
          }
          case 7:
          {
            enemiesMoveSprites[i].body.velocity.x = -speed / 2;
            enemiesMoveSprites[i].body.velocity.y = 0;
            break;
          }
          case 8:
          {
            enemiesMoveSprites[i].body.velocity.x = -speed / 2;
            enemiesMoveSprites[i].body.velocity.y = -speed / 2;
            break;
          }
        }   
      }
    }
  }

  function enemiesAddCollisionBetweenSameEnemies(enemiesCollisionSprites, currentStage)
  {
    for(let i = 0; i < enemiesCollisionSprites.length; i++)
    {
      for(let j = 0; j < enemiesCollisionSprites.length; j++)
      {
        game.scene.scenes[currentStage - 1].physics.add.collider(enemiesCollisionSprites[i], enemiesCollisionSprites[j], () =>
        {
          // empty on puropse / i think so otherwise they overlap each other
        });
      }
    }
  }

  function enemiesAddColissionBetweenDifferentEnemies(enemiesCollisionSpritesEnemy1, enemiesCollisionSpritesEnemy2, currentStage)
  {
    for(let i = 0; i < enemiesCollisionSpritesEnemy1.length; i++)
    {
      for(let j = 0; j < enemiesCollisionSpritesEnemy2.length; j++)
      {
        game.scene.scenes[currentStage - 1].physics.add.collider(enemiesCollisionSpritesEnemy1[i], enemiesCollisionSpritesEnemy2[j], () =>
        {
          // empty on puropse / i think so otherwise they overlap each other
        });
      }
    }
  }

  function enemiesAddColissionToPlayer(enemiesCollisionSprites, player, currentStage, health)
  {
    game.scene.scenes[currentStage - 1].physics.add.collider(enemiesCollisionSprites, player, () =>
    {
      healthTemp -= health;
      hurtPlayerSetHealth();
    });
  }

  function returnPlayerStatsWhenRestart()
  {
    // console.log(spellsBought);
    // console.log(spellsSave);
    if(spellsBought[0] != spellsSave[0])
    {
      document.getElementById("blink_button").className = "spell_button blink_button"
      document.getElementById("blink_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellBlink');
      };
      document.getElementById("blink_button").style.opacity = "100%";
      spellsBought[0] = spellsSave[0];
    }
    if(spellsBought[1] != spellsSave[1])
    {
      document.getElementById("fireball_button").className = "spell_button fireball_button"
      document.getElementById("fireball_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellFireball');
      };
      document.getElementById("fireball_button").style.opacity = "100%";
      spellsBought[1] = spellsSave[1];
    }
    if(spellsBought[2] != spellsSave[2])
    {
      document.getElementById("toxicbolt_button").className = "spell_button toxicbolt_button"
      document.getElementById("toxicbolt_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellToxicbolt');
      };
      document.getElementById("toxicbolt_button").style.opacity = "100%";
      spellsBought[2] = spellsSave[2];
    }
    if(spellsBought[3] != spellsSave[3])
    {
      document.getElementById("lightning_button").className = "spell_button lightning_button"
      document.getElementById("lightning_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellLightning');
      };
      document.getElementById("lightning_button").style.opacity = "100%";
      spellsBought[3] = spellsSave[3];
    }
    if(spellsBought[4]!= spellsSave[4])
    {
      document.getElementById("fear_button").className = "spell_button fear_button"
      document.getElementById("fear_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellFear');
      };
      document.getElementById("fear_button").style.opacity = "100%";
      spellsBought[4] = spellsSave[4];
    }
    // console.log(spellsBought);
    // console.log(spellsSave);
  }

  function addDmgText(x, y, currentStage, damage)
  {
    let damageTxt = game.scene.scenes[currentStage - 1].add.text(x, y, damage, { fontFamily: 'Arial', fontSize: 39, color: '#b32d2d' });
    damageTxt.setDepth(5);
    let direction = Math.floor(Math.random()*(4 - 1)) + 1;
    switch(direction)
    {
      case 1:
      {
        for(let i = 0; i < 6; i++)
        {
          moveDmgText(damageTxt, 2.5, -2.5, i);
        }
        break;
      }
      case 2:
      {
        for(let i = 0; i < 6; i++)
        {
          moveDmgText(damageTxt, 2.5, 2.5, i);
        }
        break;
      }
      case 3:
      {
        for(let i = 0; i < 6; i++)
        {
          moveDmgText(damageTxt, -2.5, 2.5, i);
        }
        break;
      }
      case 4:
      {
        for(let i = 0; i < 6; i++)
        {
          moveDmgText(damageTxt, 2.5, -2.5, i);
        }
        break;
      }
    }
  }

  function moveDmgText(dmgtext, x, y, i)
  {
    setTimeout( ()=>
    {
      dmgtext.x += x;
      dmgtext.y += y;
      if(i = 6)
      {
        setTimeout(() => 
        {
          if(dmgTextCount >= 0 && dmgTextCount < 7)
          {
            dmgTextCount--;
          }
          dmgtext.destroy();
        }, 60 * (i + 1));
      }
    }, 60 * i);  
  }

  /* -- actions -- */
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

  game = new Phaser.Game(config); //game object, most important

  var enemiesSprites = [];
  var enemies = [];

  var enemiesSkeletonSprites = [];
  var enemiesLichSprites = [];
  var enemiesDemonSprites = [];
  var enemiesPhantomSprites = [];
  
  dmgTextCount = 0;
  var fearActive = false;


  var player, cursors;
  var vSwitch, escapeButtonSwitch, escapeButtonMenuSwitch, fireballSwitch, lightningSwitch, topicboltSwitch, fearSwitch, attackSwitch;
  var oneButtonSwitch = true, twoButtonSwitch = true, threeButtonSwitch = true, eButtonSwitch = true

  equippedSpell = "fireball", playerFacingDirection = "Up";
}





/* - - - - - - - - - - MAIN / GAME MENU METHODS - - - - - - - - - - */

//buying spells method
function interfaceButtonsFunctionalities(chosenSpell)
{
  switch (chosenSpell)
  {
    case "spellBlink": spellBlink(); break;
    case "spellFireball": spellFireball(); break;
    case "spellToxicbolt": spellToxicbolt(); break;
    case "spellLightning": spellLightning(); break;
    case "spellFear": spellFear(); break;
  }
  function spellBlink()
  {
    if(xp >= 15)
    {
      xp -= 15;
      document.getElementById("xp_amount").innerText = xp.toFixed(2);
      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("blink_button").className = "spell_button_after blink_button"
      document.getElementById("blink_button").onclick = "";
      document.getElementById("blink_button").style.opacity = "50%";
      spellsBought[0] = true;
    }
    else
    {
      document.getElementById("cantAfford").load();
      document.getElementById("cantAfford").play();
    }
  }
  function spellFireball()
  {
    if(xp >= 15)
    {
      xp -= 15;
      document.getElementById("xp_amount").innerText = xp.toFixed(2);
      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("fireball_button").className = "spell_button_after fireball_button"
      document.getElementById("fireball_button").onclick = "";
      document.getElementById("fireball_button").style.opacity = "50%";
      spellsBought[1] = true;
    }
    else
    {
      document.getElementById("cantAfford").load();
      document.getElementById("cantAfford").play();
    }
  }
  function spellToxicbolt()
  {
    if(xp > 10)
    {

      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("toxicbolt_button").className = "spell_button_after toxicbolt_button"
      document.getElementById("toxicbolt_button").onclick = "";
      document.getElementById("toxicbolt_button").style.opacity = "50%";
      spellsBought[2] = true;
    }
    else
    {
      document.getElementById("cantAfford").load();
      document.getElementById("cantAfford").play();
    }
  }
  function spellLightning()
  {
    if(xp >= 30)
    {
      xp -= 30;
      document.getElementById("xp_amount").innerText = xp.toFixed(2);
      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("lightning_button").className = "spell_button_after lightning_button"
      document.getElementById("lightning_button").onclick = "";
      document.getElementById("lightning_button").style.opacity = "50%";
      spellsBought[3] = true;
    }
    else
    {
      document.getElementById("cantAfford").load();
      document.getElementById("cantAfford").play();
    }
  }
  function spellFear()
  {
    if(xp >= 20)
    {
      xp -= 15;
      document.getElementById("xp_amount").innerText = xp.toFixed(2);
      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("fear_button").className = "spell_button_after fear_button"
      document.getElementById("fear_button").onclick = "";
      document.getElementById("fear_button").style.opacity = "50%";
      spellsBought[4] = true;
    }
    else
    {
      document.getElementById("cantAfford").load();
      document.getElementById("cantAfford").play();
    }
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

//show player skills menu
function showSkillsMenu()
{
  if(healthAmount > 0)
  {

    
    document.getElementById("book_use").src = "assets/Audio/Fx/bookOpen.mp3";
    document.getElementById("book_use").load();
    document.getElementById("book_use").play();

    document.getElementById("main_menu_music").src = "assets/Audio/Music/spellBookAmbience.mp3"; //music volume set
    document.getElementById("main_menu_music").load();
    document.getElementById("main_menu_music").volume = "0.25"; //music volume set
    document.getElementById("main_menu_music").loop = true;
    document.getElementById("main_menu_music").play(); //music play

    
    game.scene.scenes[currentStage - 1].scene.pause();
    game.scene.scenes[currentStage - 1].scene.launch('PauseMenu');
    document.getElementById("blackout").style.display = "block";
    document.getElementById("skill_book_video").currentTime = 0;
    document.getElementById("skill_book_video").style.display = "block";
    document.getElementById("skill_book_video").play();
    document.getElementById("skill_book").style.zIndex = 7;
    document.getElementById("skill_book").onclick = () =>
    {
      hideSkillsMenu();
    }
    setTimeout( ()=>
    {
      if(document.getElementById("skill_book_video").style.display != "none")
      {
        document.getElementById("spell_buttons").style.display = "block";
      }
    }, 1300);
  } 
}

//hide player skills menu
function hideSkillsMenu()
{
  document.getElementById("book_use").src = "assets/Audio/Fx/bookClose.mp3";
  document.getElementById("book_use").load();
  document.getElementById("book_use").play();

  document.getElementById("spell_buttons").style.display = "none";

  document.getElementById("main_menu_music").pause(); //music play


  document.getElementById("skill_book_video").style.margin = "0px 10vw 0vw 130vw";
  document.getElementById("skill_book_video").currentTime = 0;
  setTimeout( ()=>
  {
    document.getElementById("blackout").style.display = "none";
    document.getElementById("skill_book_video").currentTime = 0;
    document.getElementById("skill_book_video").style.display = "none";
    document.getElementById("skill_book_video").style.margin = "0px 10vw 0vw 30vw";
  }, 300);
  document.getElementById("skill_book").style.zIndex = 5;
  document.getElementById("skill_book_video").play();
  document.getElementById("skill_book").onclick = () =>
  {
    showSkillsMenu();
  }
}

function spellSelect(spellName)
{
  function spellSelectCosmetic()
  {
    document.getElementById("selected_spell").style.display = "block";
    document.getElementById("selected_spell").style.margin = "6vh 0px 0px 4vw";
    setTimeout( ()=>
    {
      document.getElementById("selected_spell").style.display = "none";
      document.getElementById("selected_spell").style.margin = "6vh 0px 0px -14vh";
    }, 500);
  }
  switch(spellName)
  {
    case "blink":
    {
      if(spellsBought[0] == true)
      {
        document.getElementById("selected_spell").src = "assets/Icons/BlinkIcon.jpg";
        spellSelectCosmetic();
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }

    case "fireball":
    {
      if(spellsBought[1] == true)
      {
        equippedSpell = "fireball";
        document.getElementById("selected_spell").src = "assets/Icons/FireballIcon.jpg";
        spellSelectCosmetic();
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }
    case "toxicbolt":
    {
      if(spellsBought[2] == true)
      {
        equippedSpell = "toxicbolt";
        document.getElementById("selected_spell").src = "assets/Icons/ToxicBoltIcon.jpg";
        spellSelectCosmetic();
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }
    case "lightningbolt":
    {
      if(spellsBought[3] == true)
      {
        equippedSpell = "lightningbolt";
        document.getElementById("selected_spell").src = "assets/Icons/LightningIcon.jpg";
        spellSelectCosmetic();
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }
    case "fear":
    {
      if(spellsBought[4] == true)
      {
        document.getElementById("selected_spell").src = "assets/Icons/FearIcon.jpg";
        spellSelectCosmetic();
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }
  }
}

function oomErrorSpeech()
{
  switch(oomSpeechSwitch)
  {
    case 1:
    {
      oomSpeechSwitch = 2;
      document.getElementById("errorSpeechOom").src = "assets/Audio/Fx/oom2.mp3"
      document.getElementById("errorSpeechOom").currentTime = 0;
      document.getElementById("errorSpeechOom").play();
      break;
    }
    case 2:
    {
      oomSpeechSwitch = 3;
      document.getElementById("errorSpeechOom").src = "assets/Audio/Fx/oom3.mp3"
      document.getElementById("errorSpeechOom").currentTime = 0;
      document.getElementById("errorSpeechOom").play();
      break;
    }
    case 3:
    {
      oomSpeechSwitch = 1;
      document.getElementById("errorSpeechOom").src = "assets/Audio/Fx/oom1.mp3"
      document.getElementById("errorSpeechOom").currentTime = 0;
      document.getElementById("errorSpeechOom").play();
      break;
    }
  }
}

/* - - - - - - - - - - MAIN / GAME MENU METHODS - - - - - - - - - - */
