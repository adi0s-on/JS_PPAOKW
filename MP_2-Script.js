/*
TODOLIST


- typy potworoww
- rozne stage

- dialog? 

- potiony jakos zrobic


- dzwieki i muzyka 


po smierci i ponownym graniu stage nie przechodzi do nastepnego FIXME


HP CHART
skeleton 100
phantom 150
lich 200
demon 300 
overlord 2000
*/


var healthMain = 100; let manaMain = 100; //health an mana set

//these are used when player restarts stage
var spellsSave = [true, true, true, true, true, true]; // same as above but for spells

//main variables of user stats
var xp = 0; // xp stat
var healthAmount = healthMain; var manaAmount = manaMain; // player health and mana set
var spellsBought = [true, true, true, true, true, true]; //array that holds information about which spells have been purchased
var currentStage = 0; //very important, sets which stage is now active

var spellInterval = 0; //global spell cast cooldown

//switches for what sound is needed to be played
var oomSpeechSwitch = 1; 
var fireballSoundSwitch = 1;
var fireballImpactSoundSwitch = 1;
var fireballExplosionSoundSwitch = 1;

var toxicboltSoundSwitch = 1;
var toxicboltImpactSoundSwitch = 1;
var toxicboltImpactSoundAllowToPlay = true;

var lightningSoundSwitch = 1
var lightningImpactSoundSwitch = 1;
var lightningImpactSoundAllowToPlay = true;

var horseSoundSwitch = 1;
var horseImpactSoundSwitch = 1;
var horseImpactSoundAllowToPlay = true;


var potionHealthCount = 3;
var potionManaCount = 3;



//FIXME
//difficulty check
if(document.getElementsByName("invincibility")[1].checked)
{
  healthAmount = 1000000000000; healthMain = healthAmount;
  document.getElementById("health_bar_amount").innerText = "∞";
  document.getElementById("health_bar_amount").style.fontSize = "33";
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
  constructor(name, health, drop)
  {
    this.name = name; this.health = health; this.drop = drop;
  }
}
class Phantom
{
  constructor(name, health, drop)
  {
    this.name = name; this.health = health; this.drop = drop;
  }
}
class Lich
{
  constructor(name, health, drop)
  {
    this.name = name; this.health = health; this.drop = drop;
  }
}
class Demon
{
  constructor(name, health, drop)
  {
    this.name = name; this.health = health; this.drop = drop;
  }
}
class Overlord
{
  constructor(name, health, drop)
  {
    this.name = name; this.health = health; this.drop = drop;
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

      enemies = null;
      enemiesSprites = null;

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
      let enemiesPhantom = [];
      let enemiesLich = [];
      let enemiesDemon = [];

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
        enemiesSkeleton[i] = new Skeleton("Skeleton", 100, "xpParticle");
        enemiesSkeletonSprites[i] = this.physics.add.sprite(200 + i*85, 180, 'skeletonAnimation');
        enemiesSkeletonSprites[i].anims.play('skeleton', true);
        enemiesSkeletonSprites[i].displayHeight = 55;
        enemiesSkeletonSprites[i].displayWidth = 55;
        enemiesSkeletonSprites[i].body.collideWorldBounds = true;
        enemiesSkeletonSprites[i].body.immovable = false; 
        enemiesCount++;
      }

      // enemiesSkeleton[Math.floor(Math.random()*(10 + 5 * difficultyLevel - 1))].drop ="healthDrop"//give to random skeleton a health potion
      for(let i = 0; i < (2 + 1 * difficultyLevel); i++)
      {
        enemiesPhantom[i] = new Phantom("Phantom", 160, "xpParticle");
        enemiesPhantomSprites[i] = this.physics.add.sprite(200 + i*500, 1100, 'phantomAnimation');
        enemiesPhantomSprites[i].anims.play('phantom', true);
        enemiesPhantomSprites[i].displayHeight = 90;
        enemiesPhantomSprites[i].displayWidth = 90;
        enemiesPhantomSprites[i].body.collideWorldBounds = true;
        enemiesPhantomSprites[i].body.immovable = false; 
        enemiesCount++;
      }


      // enemiesPhantom[Math.floor(Math.random()*(2 + 1 * difficultyLevel - 1))].drop ="healthDrop"//give to random phantom a health potion

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
      document.getElementById("stage_1_ambience").volume = "0.25"; //music volume set
      document.getElementById("stage_1_music").volume = "0.2"; //music volume set
      document.getElementById("stage_1_music").pause();
      document.getElementById("stage_1_ambience").pause();
      this.scene.launch('PauseMenu');
    },
  
    //runs with every frame of the game
    update: function() 
    {
      if(playerAlive)
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
  
        if(enemiesCount <= 0)
        {
          nextStage(currentStage);
        }
    
        //move enemies

  
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
      }

      enemiesMove(enemiesSkeletonSprites, player, 100);
      enemiesMove(enemiesPhantomSprites, player, 160);

    },

  });

  var SecondStage = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function SecondStage()
    {
      Phaser.Scene.call(this, {key: 'SecondStage'});
    },

    preload: function()
    {
      currentStage = 2;
      loadSpritesAndAudio(currentStage);
    },

    create: function()
    {
      xpSave = xp; healthSave = healthAmount;
      potionHealthCountSave = potionHealthCount;
      potionManaCountSave = potionManaCount;
      manaTemp = 100;
      enemiesCount = 0;
      manaPlayerSetMana();
      
      returnPlayerStatsWhenRestart(); 
      createAnimationsAndAudio(currentStage);

      enemies = null;
      enemiesSprites = null;

      backgroundImage = this.add.image(987.5, 620, 'background2');
      backgroundImage.displayWidth = 1975;
      backgroundImage.displayHeight = 1240;

      player = this.physics.add.sprite(987.5, 620, 'playerDown');
      player.anims.play('up', true); //player animation
      player.displayWidth = 80; //player width
      player.displayHeight = 80; //player height
      player.body.collideWorldBounds = true; //player collides on world border
      player.body.immovable = false; //player can be moved by other mobs

      let difficultyLeveles = document.getElementsByName("difficulty"); //skeleton spawn depends on difficulty set
  
      //arrays of enemy objects
      let enemiesSkeleton = [];
      let enemiesPhantom = [];
      let enemiesLich = [];
      let enemiesDemon = [];

      enemiesSkeletonSprites = [];
      enemiesLichSprites = [];
      enemiesDemonSprites = [];
      enemiesPhantomSprites = [];

      let difficultyLevel = 0; //difficulty level set 
      for(let i = 0; i < difficultyLeveles.length; i++) //difficulty setting read
      {
        if(difficultyLeveles[i].checked)
        {
          difficultyLevel = difficultyLeveles[i].value;
          break;
        }
      }
      
      for(let i = 0; i < (3 + 1 * difficultyLevel); i++)
      {
        enemiesSkeleton[i] = new Skeleton("Skeleton", 100, "xpParticle");
        enemiesSkeletonSprites[i] = this.physics.add.sprite(1800, 550 + i*100, 'skeletonAnimation');
        enemiesSkeletonSprites[i].anims.play('skeleton', true);
        enemiesSkeletonSprites[i].displayHeight = 55;
        enemiesSkeletonSprites[i].displayWidth = 55;
        enemiesSkeletonSprites[i].body.collideWorldBounds = true;
        enemiesSkeletonSprites[i].body.immovable = false; 
        enemiesCount++;
      }
      for(let i = 0; i < (4 + 1 * difficultyLevel); i++)
      {
        enemiesPhantom[i] = new Phantom("Phantom", 160, "xpParticle");
        enemiesPhantomSprites[i] = this.physics.add.sprite(200, 200 + i*170, 'phantomAnimation');
        enemiesPhantomSprites[i].anims.play('phantom', true);
        enemiesPhantomSprites[i].displayHeight = 90;
        enemiesPhantomSprites[i].displayWidth = 90;
        enemiesPhantomSprites[i].body.collideWorldBounds = true;
        enemiesPhantomSprites[i].body.immovable = false; 
        enemiesCount++;
      }
      for(let i = 0; i < 1; i++)
      {
        enemiesLich[i] = new Lich("Lich", 210, "xpParticle");
        enemiesLichSprites[i] = this.physics.add.sprite(800, 1050, 'lichAnimation');
        enemiesLichSprites[i].anims.play('lich', true);
        enemiesLichSprites[i].displayHeight = 75;
        enemiesLichSprites[i].displayWidth = 75;
        enemiesLichSprites[i].body.collideWorldBounds = true;
        enemiesLichSprites[i].body.immovable = false;
        enemiesCount++;
      }

      enemiesAddColissionToPlayer(enemiesSkeletonSprites, player, currentStage, 0.15);
      enemiesAddColissionToPlayer(enemiesPhantomSprites, player, currentStage, 0.25);
      enemiesAddColissionToPlayer(enemiesLichSprites, player, currentStage, 0.4);

      enemiesAddCollisionBetweenSameEnemies(enemiesSkeletonSprites, currentStage);
      enemiesAddCollisionBetweenSameEnemies(enemiesPhantomSprites, currentStage);

      enemiesAddColissionBetweenDifferentEnemies(enemiesLichSprites, enemiesSkeletonSprites, currentStage);

      enemies = enemiesSkeleton.concat(enemiesPhantom, enemiesLich);
      enemiesSprites = enemiesSkeletonSprites.concat(enemiesPhantomSprites, enemiesLichSprites);

      setKeyboardKeys(currentStage);

      this.scene.pause();
      document.getElementById("stage_1_music").pause();
      document.getElementById("stage_1_ambience").pause();
      document.getElementById("stage_1_music").src = "assets/Audio/Music/stage2Music.mp3";
      document.getElementById("stage_1_ambience").src = "assets/Audio/Music/stage2Ambience.mp3";
      document.getElementById("stage_1_music").volume = 0.6; 
      document.getElementById("stage_1_ambience").volume = 0.3; 
      this.scene.launch('PauseMenu');

    },

    update: function()
    {
      if(playerAlive)
      {
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
  
        if(healthAmount < 0)
        {
          playerDied(currentStage);
        }
  
        if(enemiesCount <= 0)
        {
          nextStage(currentStage);
        }
  
  
  
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
      }
      enemiesMove(enemiesSkeletonSprites, player, 100);
      enemiesMove(enemiesPhantomSprites, player, 160);
      enemiesMove(enemiesLichSprites, player, 130);

    },

  });
  
  var ThirdStage = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function ThirdStage()
    {
      Phaser.Scene.call(this, {key: 'ThirdStage'});
    },
    
    preload: function()
    {
      currentStage = 3;
      loadSpritesAndAudio(currentStage);
    },

    create: function()
    {
      xpSave = xp; healthSave = healthAmount;
      potionHealthCountSave = potionHealthCount;
      potionManaCountSave = potionManaCount;
      manaTemp = 100;
      enemiesCount = 0;
      manaPlayerSetMana();
      
      returnPlayerStatsWhenRestart(); 
      createAnimationsAndAudio(currentStage);    

      enemies = null;
      enemiesSprites = null;

      backgroundImage = this.add.image(987.5, 620, 'background3');
      backgroundImage.displayWidth = 1975;
      backgroundImage.displayHeight = 1240;

      player = this.physics.add.sprite(987.5, 620, 'playerDown');
      player.anims.play('up', true); //player animation
      player.displayWidth = 80; //player width
      player.displayHeight = 80; //player height
      player.body.collideWorldBounds = true; //player collides on world border
      player.body.immovable = false; //player can be moved by other mobs

      let difficultyLeveles = document.getElementsByName("difficulty"); //skeleton spawn depends on difficulty set
  
      //arrays of enemy objects
      let enemiesSkeleton = [];
      let enemiesPhantom = [];
      let enemiesLich = [];
      let enemiesDemon = [];

      enemiesSkeletonSprites = [];
      enemiesLichSprites = [];
      enemiesDemonSprites = [];
      enemiesPhantomSprites = [];

      let difficultyLevel = 0; //difficulty level set 
      for(let i = 0; i < difficultyLeveles.length; i++) //difficulty setting read
      {
        if(difficultyLeveles[i].checked)
        {
          difficultyLevel = difficultyLeveles[i].value;
          break;
        }
      }

      for(let i = 0; i < (5 + 1 * difficultyLevel); i++)
      {
        enemiesPhantom[i] = new Phantom("Phantom", 160, "xpParticle");
        enemiesPhantomSprites[i] = this.physics.add.sprite(200 + i * 120, 180, 'phantomAnimation');
        enemiesPhantomSprites[i].anims.play('phantom', true);
        enemiesPhantomSprites[i].displayHeight = 90;
        enemiesPhantomSprites[i].displayWidth = 90;
        enemiesPhantomSprites[i].body.collideWorldBounds = true;
        enemiesPhantomSprites[i].body.immovable = false; 
        enemiesCount++;
      }
      for(let i = 0; i < (3 + 2 * difficultyLevel); i++)
      {
        enemiesLich[i] = new Lich("Lich", 210, "xpParticle");
        enemiesLichSprites[i] = this.physics.add.sprite(800, 1050, 'lichAnimation');
        enemiesLichSprites[i].anims.play('lich', true);
        enemiesLichSprites[i].displayHeight = 75;
        enemiesLichSprites[i].displayWidth = 75;
        enemiesLichSprites[i].body.collideWorldBounds = true;
        enemiesLichSprites[i].body.immovable = false;
        enemiesCount++;
      }

      enemiesAddColissionToPlayer(enemiesPhantomSprites, player, currentStage, 0.25);
      enemiesAddColissionToPlayer(enemiesLichSprites, player, currentStage, 0.4);

      enemiesAddCollisionBetweenSameEnemies(enemiesPhantomSprites, currentStage);
      enemiesAddCollisionBetweenSameEnemies(enemiesLichSprites, currentStage);

      enemies = enemiesPhantom.concat(enemiesLich);
      enemiesSprites = enemiesPhantomSprites.concat(enemiesLichSprites);

      setKeyboardKeys(currentStage);

      this.scene.pause();
      document.getElementById("stage_1_music").pause();
      document.getElementById("stage_1_ambience").pause();
      document.getElementById("stage_1_music").src = "assets/Audio/Music/stage3Music.mp3";
      document.getElementById("stage_1_ambience").src = "assets/Audio/Music/stage3Ambience.mp3";
      document.getElementById("stage_1_music").volume = 0.6; 
      document.getElementById("stage_1_ambience").volume = 0.3; 
      this.scene.launch('PauseMenu');
    },

    update: function()
    {
      if(playerAlive)
      {
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
  
        if(healthAmount < 0)
        {
          playerDied(currentStage);
        }
  
        if(enemiesCount <= 0)
        {
          nextStage(currentStage);
        }
  
  
  
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

      }
      enemiesMove(enemiesPhantomSprites, player, 160);
      enemiesMove(enemiesLichSprites, player, 130);
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

              blinkSound.play();
              
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
            let additionalManaCost = 0;
            if(spellsBought[1] == true)
            {
              additionalManaCost = 20;
            }
            if(manaTemp >= 15 + additionalManaCost)
            {
              if(spellInterval >= 30)
              {
                spellInterval = 0;
                manaTemp -=15 + additionalManaCost;
                manaPlayerSetMana();


                switch(fireballSoundSwitch)
                {
                  case 1:
                  {
                    fireballSound1.play(); fireballSoundSwitch = 2;
                    break;
                  }
                  case 2:
                  {
                    fireballSound2.play(); fireballSoundSwitch = 3;
                    break;
                  }
                  case 3:
                  {
                    fireballSound3.play(); fireballSoundSwitch = 4;
                    break;
                  }
                  case 4:
                  {
                    fireballSound4.play(); fireballSoundSwitch = 1;
                    break;
                  }
                }

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
                      enemies[i].health -= 50;
                      if(spellsBought[1] == true)
                      {
                        switch(fireballExplosionSoundSwitch)
                        {
                          case 1:
                          {
                            fireballExplosionSound1.play(); fireballExplosionSoundSwitch = 2;
                            break;
                          }
                          case 2:
                          {
                            fireballExplosionSound2.play(); fireballExplosionSoundSwitch = 3;
                            break;
                          }
                          case 3:
                          {
                            fireballExplosionSound3.play(); fireballExplosionSoundSwitch = 4;
                            break;
                          }
                          case 4:
                          {
                            fireballExplosionSound4.play(); fireballExplosionSoundSwitch = 1;
                            break;
                          }
                        }
                        let explosion = game.scene.scenes[currentStage - 1].physics.add.sprite(fireball.x, fireball.y, 'explosionAnimation');
                        explosion.anims.play('explosion', true);
                        explosion.displayWidth = 200; explosion.displayHeight = 200;
                        explosion.on('animationcomplete', () => 
                        {
                          explosion.disableBody(true, true);
                        });
                        for(let i = 0; i < enemies.length; i++)
                        {
                          game.scene.scenes[currentStage - 1].physics.add.overlap(explosion, enemiesSprites[i], () =>
                          {
                            enemies[i].health -= 1;
                            if(dmgTextCount <= 2 && dmgTextCount >= 0)
                            {
                              dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-1");
                            }
                            if(enemies[i].health <= 0)
                            {
                              enemyDiedWhatSoundToPlay(enemies[i]);
                              enemiesCount--;
                              addExpText(player.x, player.y, currentStage, enemies[i]);
                              enemiesSprites[i].disableBody(true, true);
                            }
                          });
                        }
                      }

                      switch(fireballImpactSoundSwitch)
                      {
                        case 1:
                        {
                          fireballImpactSound1.play(); fireballImpactSoundSwitch = 2;
                          break;
                        }
                        case 2:
                        {
                          fireballImpactSound2.play(); fireballImpactSoundSwitch = 3;
                          break;
                        }
                        case 3:
                        {
                          fireballImpactSound3.play(); fireballImpactSoundSwitch = 4;
                          break;
                        }
                        case 4:
                        {
                          fireballImpactSound4.play(); fireballImpactSoundSwitch = 1;
                          break;
                        }
                      }

                      fireball.disableBody(true, true); //FIXME
                      if(dmgTextCount <= 5 && dmgTextCount >= 0)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-50");
                      }
                      
                      if(enemies[i].health <= 0)
                      {
                        enemyDiedWhatSoundToPlay(enemies[i]);
                        enemiesCount--;
                        addExpText(player.x, player.y, currentStage, enemies[i]);
                        enemiesSprites[i].disableBody(true, true);
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

                switch(toxicboltSoundSwitch)
                {
                  case 1:
                  {
                    toxicboltSound1.play(); toxicboltSoundSwitch = 2;
                    break;
                  }
                  case 2:
                  {
                    toxicboltSound2.play(); toxicboltSoundSwitch = 3;
                    break;
                  }
                  case 3:
                  {
                    toxicboltSound3.play(); toxicboltSoundSwitch = 4;
                    break;
                  }
                  case 4:
                  {
                    toxicboltSound4.play(); toxicboltSoundSwitch = 1;
                    break;
                  }
                }

                let toxicbolt = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'toxicboltAnimation');
                toxicbolt.anims.play('toxicbolt', true);
                toxicbolt.displayWidth = 40; toxicbolt.displayHeight = 70;
                spellMovement(playerFacingDirection, toxicbolt, player, 370, false);

                if(enemiesSprites.length != 0)
                {
                  for(let i = 0; i < enemiesSprites.length; i++)
                  {
                    game.scene.scenes[currentStage - 1].physics.add.overlap(toxicbolt, enemiesSprites[i], () => 
                    {
                      if(toxicboltImpactSoundAllowToPlay)
                      {
                        switch(toxicboltImpactSoundSwitch)
                        {
                          case 1:
                          {
                            toxicboltImpactSoundAllowToPlay = false;
                            toxicboltImpactSound1.play(); 
                            toxicboltImpactSound1.once('complete', ()=> { toxicboltImpactSoundSwitch = 2; toxicboltImpactSoundAllowToPlay = true;})
                            break;
                          }
                          case 2:
                          {
                            toxicboltImpactSoundAllowToPlay = false;
                            toxicboltImpactSound2.play();
                            toxicboltImpactSound2.once('complete', ()=> { toxicboltImpactSoundSwitch = 3; toxicboltImpactSoundAllowToPlay = true; })
                            break;
                          }
                          case 3:
                          {
                            toxicboltImpactSoundAllowToPlay = false;
                            toxicboltImpactSound3.play(); 
                            toxicboltImpactSound3.once('complete', ()=> { toxicboltImpactSoundSwitch = 1; toxicboltImpactSoundAllowToPlay = true;})
                            break;
                          }
                        }
                      }
                      
                      enemies[i].health -= 2.5;

                      if(dmgTextCount <= 2 && dmgTextCount >= 0)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-2.5");
                      }

                      if(enemies[i].health <= 0)
                      {
                        enemyDiedWhatSoundToPlay(enemies[i]);
                        enemiesCount--;
                        addExpText(player.x, player.y, currentStage, enemies[i]);
                        enemiesSprites[i].disableBody(true, true);
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
            if(manaTemp >= 70)
            {
              if(spellInterval >= 30)
              {
                spellInterval = 0;
                manaTemp -= 70;
                manaPlayerSetMana();

                switch(lightningSoundSwitch)
                {
                  case 1:
                  {
                    lightningSound1.play(); lightningSoundSwitch = 2;
                    break;
                  }
                  case 2:
                  {
                    lightningSound2.play(); lightningSoundSwitch = 3;
                    break;
                  }
                  case 3:
                  {
                    lightningSound3.play(); lightningSoundSwitch = 4;
                    break;
                  }
                  case 4:
                  {
                    lightningSound4.play(); lightningSoundSwitch = 1;
                    break;
                  }
                }

                let lightning = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'lightningboltAnimation')
                lightning.anims.play('lightning', true);
                lightning.displayWidth = 160; lightning.displayHeight = 400;
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
                      if(lightningImpactSoundAllowToPlay)
                      {
                        switch(lightningImpactSoundSwitch)
                        {
                          case 1:
                          {
                            lightningImpactSoundAllowToPlay = false;
                            lightningImpactSound1.play(); 
                            lightningImpactSound1.once('complete', ()=> { lightningImpactSoundAllowToPlay = true; })
                            break;
                          }
                          case 2:
                          {
                            lightningImpactSoundAllowToPlay = false;
                            lightningImpactSound2.play(); 
                            lightningImpactSound2.once('complete', ()=> { lightningImpactSoundAllowToPlay = true; })
                            break;
                          }
                          case 3:
                          {
                            lightningImpactSoundAllowToPlay = false;
                            lightningImpactSound3.play(); 
                            lightningImpactSound3.once('complete', ()=> { lightningImpactSoundAllowToPlay = true; })
                            break;
                          }
                        }
                      }

                      enemies[i].health -= 5.5;
                      if(dmgTextCount <= 2 && dmgTextCount >= 0)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-5.5");
                      }
                      
                      if(enemies[i].health <= 0)
                      {
                        enemyDiedWhatSoundToPlay(enemies[i]);
                        enemiesCount--;
                        addExpText(player.x, player.y, currentStage, enemies[i]);
                        enemiesSprites[i].disableBody(true, true);
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
          case 'horses':
          {
            if(manaTemp >= 100)
            {
              if(spellInterval >= 30)
              {
                spellInterval = 0;
                manaTemp -= 100;
                manaPlayerSetMana();

                switch(horseSoundSwitch)
                {
                  case 1:
                  {
                    horseSound1.play(); horseSoundSwitch = 2;
                    break;
                  }
                  case 2:
                  {
                    horseSound2.play(); horseSoundSwitch = 3;
                    break;
                  }
                  case 3:
                  {
                    horseSound3.play(); horseSoundSwitch = 1;
                    break;
                  }
                }

                let horses = game.scene.scenes[currentStage - 1].physics.add.sprite(0, 0, 'horsesAnimation');
                horses.anims.play('horses', true);
                horses.displayWidth = 333.333; horses.displayHeight = 250; 
                spellMovement(playerFacingDirection, horses, player, 290, false);

                if(enemiesSprites.length != 0)
                {
                  for(let i = 0; i < enemiesSprites.length; i++)
                  {
                    game.scene.scenes[currentStage - 1].physics.add.overlap(horses, enemiesSprites[i], () => 
                    {
                      if(horseImpactSoundAllowToPlay)
                      {
                        switch(horseImpactSoundSwitch)
                        {
                          case 1:
                          {
                            horseImpactSoundAllowToPlay = false;
                            horseImpactSound1.play(); 
                            horseImpactSound1.once('complete', ()=> { horseImpactSoundAllowToPlay = true; })
                            break;
                          }
                          case 2:
                          {
                            horseImpactSoundAllowToPlay = false;
                            horseImpactSound2.play();
                            horseImpactSound2.once('complete', ()=> { horseImpactSoundAllowToPlay = true; })
                            break;
                          }
                          case 3:
                          {
                            horseImpactSoundAllowToPlay = false;
                            horseImpactSound3.play(); 
                            horseImpactSound3.once('complete', ()=> { horseImpactSoundAllowToPlay = true; })
                            break;
                          }
                        }
                      }

                      enemies[i].health -= 2.5;
                      if(dmgTextCount <= 2 && dmgTextCount >= 0)
                      {
                        dmgTextCount++; addDmgText(enemiesSprites[i].body.x, enemiesSprites[i].body.y, currentStage, "-2.5");
                      }

                      if(enemies[i].health <= 0)
                      {
                        enemiesCount--;
                        addExpText(player.x, player.y, currentStage, enemies[i]);
                        enemiesSprites[i].disableBody(true, true);
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

    if(fourButton.isDown)
    {
      if(!fourButtonSwitch)
      {
        spellSelect("horses");
        fourButtonSwitch = true;
      }
    }
    if(fourButton.isUp)
    {
      fourButtonSwitch = false;
    }


    if(eButton.isDown)
    {
      if(!eButtonSwitch)
      {   
        spellSelect("fear");
        if(spellsBought[4] == true)
        {
          if(manaTemp >= 70)
          {
            if(spellInterval >= 30 && fearActive == false)
            {
              spellInterval = 0;
              manaTemp -= 70;
              manaPlayerSetMana();
              
              fearSound.play();

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
              }, 2000);
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

    /* - - - - - - - - - - - - Animations - - - - - - - - - - - - */
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
    game.scene.scenes[currentStage - 1].load.spritesheet('horsesAnimation', 'assets/VariousAnimations/horsesAnimation.png', { frameWidth: 500, frameHeight: 375});
    game.scene.scenes[currentStage - 1].load.spritesheet('blinkAnimation', 'assets/VariousAnimations/blinkAnimation.png', { frameWidth: 87.6, frameHeight: 100});
    game.scene.scenes[currentStage - 1].load.spritesheet('fearAnimation', 'assets/VariousAnimations/fearAnimation.png', { frameWidth: 300, frameHeight: 300});
    game.scene.scenes[currentStage - 1].load.spritesheet('explosionAnimation', 'assets/VariousAnimations/explosionAnimation.png', { frameWidth: 300, frameHeight: 300});

    game.scene.scenes[currentStage - 1].load.spritesheet('expParticle', 'assets/VariousAnimations/experienceOrbAnimation.png', { frameWidth: 68, frameHeight: 68});
    game.scene.scenes[currentStage - 1].load.spritesheet('hpPotion', 'assets/VariousAnimations/potionHealthAnimation.png', { frameWidth: 80, frameHeight: 80});

    game.scene.scenes[currentStage - 1].load.image('background', 'assets/Backgrounds/Background1.jpg');
    game.scene.scenes[currentStage - 1].load.image('background2', 'assets/Backgrounds/Background2.jpg');
    game.scene.scenes[currentStage - 1].load.image('background3', 'assets/Backgrounds/Background3.jpg');
    game.scene.scenes[currentStage - 1].load.image('background4', 'assets/Backgrounds/Background4.jpg');
    game.scene.scenes[currentStage - 1].load.image('restartQuestionMenu', 'assets/GameMenu/MenuPopup.png');
    game.scene.scenes[currentStage - 1].load.image('menuPopupTile', 'assets/GameMenu/MenuPopup2.png');
    game.scene.scenes[currentStage - 1].load.image('buttonSmallYes', 'assets/GameMenu/ButtonSmallYes.png');
    game.scene.scenes[currentStage - 1].load.image('buttonSmallNo', 'assets/GameMenu/ButtonSmallNo.png');
    game.scene.scenes[currentStage - 1].load.image('backgroundBlackout', 'assets/GameMenu/BackgroundBlackout.png');
    game.scene.scenes[currentStage - 1].load.image('buttonContinue', 'assets/GameMenu/ButtonContinue.png');
    /* - - - - - - - - - - - - Animations - - - - - - - - - - - - */


   /* - - - - - - - - - - - - Audio - - - - - - - - - - - - */
   
    game.scene.scenes[currentStage - 1].load.audio('playerDeath', 'assets/Audio/Fx/playerDeath.ogg');
    game.scene.scenes[currentStage - 1].load.audio('skeletonDeath', 'assets/Audio/Fx/skeletonDeath.ogg');
    game.scene.scenes[currentStage - 1].load.audio('phantomDeath', 'assets/Audio/Fx/phantomDeath.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lichDeath', 'assets/Audio/Fx/lichDeath.ogg');
    game.scene.scenes[currentStage - 1].load.audio('demonDeath', 'assets/Audio/Fx/demonDeath.ogg');
    
    game.scene.scenes[currentStage - 1].load.audio('potionCooldown', 'assets/Audio/Fx/potionCooldown.ogg');
    game.scene.scenes[currentStage - 1].load.audio('potionDrink', 'assets/Audio/Fx/potionDrink.ogg');

    game.scene.scenes[currentStage - 1].load.audio('blinkSound', 'assets/Audio/Fx/blinkSound.mp3');
    game.scene.scenes[currentStage - 1].load.audio('fearSound', 'assets/Audio/Fx/fearSound.mp3');
    game.scene.scenes[currentStage - 1].load.audio('fireballSound1', 'assets/Audio/Fx/fireballSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballSound2', 'assets/Audio/Fx/fireballSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballSound3', 'assets/Audio/Fx/fireballSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballSound4', 'assets/Audio/Fx/fireballSound4.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballImpactSound1', 'assets/Audio/Fx/fireballImpactSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballImpactSound2', 'assets/Audio/Fx/fireballImpactSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballImpactSound3', 'assets/Audio/Fx/fireballImpactSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballImpactSound4', 'assets/Audio/Fx/fireballImpactSound4.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballExplosionSound1', 'assets/Audio/Fx/fireballExplosionSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballExplosionSound2', 'assets/Audio/Fx/fireballExplosionSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballExplosionSound3', 'assets/Audio/Fx/fireballExplosionSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('fireballExplosionSound4', 'assets/Audio/Fx/fireballExplosionSound4.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningSound1', 'assets/Audio/Fx/lightningSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningSound2', 'assets/Audio/Fx/lightningSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningSound3', 'assets/Audio/Fx/lightningSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningSound4', 'assets/Audio/Fx/lightningSound4.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningImpactSound1', 'assets/Audio/Fx/lightningImpactSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningImpactSound2', 'assets/Audio/Fx/lightningImpactSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('lightningImpactSound3', 'assets/Audio/Fx/lightningImpactSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltSound1', 'assets/Audio/Fx/toxicboltSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltSound2', 'assets/Audio/Fx/toxicboltSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltSound3', 'assets/Audio/Fx/toxicboltSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltSound4', 'assets/Audio/Fx/toxicboltSound4.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltImpactSound1', 'assets/Audio/Fx/toxicboltImpactSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltImpactSound2', 'assets/Audio/Fx/toxicboltImpactSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('toxicboltImpactSound3', 'assets/Audio/Fx/toxicboltImpactSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseSound1', 'assets/Audio/Fx/horseSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseSound2', 'assets/Audio/Fx/horseSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseSound3', 'assets/Audio/Fx/horseSound3.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseImpactSound1', 'assets/Audio/Fx/horseImpactSound1.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseImpactSound2', 'assets/Audio/Fx/horseImpactSound2.ogg');
    game.scene.scenes[currentStage - 1].load.audio('horseImpactSound3', 'assets/Audio/Fx/horseImpactSound3.ogg');

    /* - - - - - - - - - - - - Audio - - - - - - - - - - - - */

  }

  function createAnimationsAndAudio(currentStage)
  {
      /* - - - - - - - - - - - - Animations - - - - - - - - - - - - */
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
        key: 'horses',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('horsesAnimation', { start: 0, end: 4}),
        frameRate: 8,
        repeat: -1
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
      game.scene.scenes[currentStage - 1].anims.create({
        key: 'explosion',
        frames: game.scene.scenes[currentStage - 1].anims.generateFrameNumbers('explosionAnimation', { start: 0, end: 9}),
        frameRate: 15,
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

      /* - - - - - - - - - - - - Animations - - - - - - - - - - - - */




      /* - - - - - - - - - - - - Audio - - - - - - - - - - - - */

      potionDrink = game.scene.scenes[currentStage - 1].sound.add('potionDrink', { volume: 0.7 }); 
      potionCooldown = game.scene.scenes[currentStage - 1].sound.add('potionCooldown', { volume: 0.7 }); 
      
      playerDeath = game.scene.scenes[currentStage - 1].sound.add('playerDeath', { volume: 0.7 }); 
      skeletonDeath = game.scene.scenes[currentStage - 1].sound.add('skeletonDeath', { volume: 0.35 }); 
      phantomDeath = game.scene.scenes[currentStage - 1].sound.add('phantomDeath', { volume: 0.35 }); 
      lichDeath = game.scene.scenes[currentStage - 1].sound.add('lichDeath', { volume: 0.35 }); 
      demonDeath = game.scene.scenes[currentStage - 1].sound.add('demonDeath', { volume: 0.35 }); 



      blinkSound = game.scene.scenes[currentStage - 1].sound.add('blinkSound'); 
      fearSound = game.scene.scenes[currentStage - 1].sound.add('fearSound'); 
      fireballSound1 = game.scene.scenes[currentStage - 1].sound.add('fireballSound1', { volume: 0.30}); 
      fireballSound2 = game.scene.scenes[currentStage - 1].sound.add('fireballSound2', { volume: 0.30}); 
      fireballSound3 = game.scene.scenes[currentStage - 1].sound.add('fireballSound3', { volume: 0.30}); 
      fireballSound4 = game.scene.scenes[currentStage - 1].sound.add('fireballSound4', { volume: 0.30}); 
      fireballImpactSound1 = game.scene.scenes[currentStage - 1].sound.add('fireballImpactSound1', { volume: 0.30}); 
      fireballImpactSound2 = game.scene.scenes[currentStage - 1].sound.add('fireballImpactSound2', { volume: 0.30}); 
      fireballImpactSound3 = game.scene.scenes[currentStage - 1].sound.add('fireballImpactSound3', { volume: 0.30}); 
      fireballImpactSound4 = game.scene.scenes[currentStage - 1].sound.add('fireballImpactSound4', { volume: 0.30}); 
      fireballExplosionSound1 = game.scene.scenes[currentStage - 1].sound.add('fireballExplosionSound1', { volume: 0.55}); 
      fireballExplosionSound2 = game.scene.scenes[currentStage - 1].sound.add('fireballExplosionSound2', { volume: 0.55}); 
      fireballExplosionSound3 = game.scene.scenes[currentStage - 1].sound.add('fireballExplosionSound3', { volume: 0.55}); 
      fireballExplosionSound4 = game.scene.scenes[currentStage - 1].sound.add('fireballExplosionSound4', { volume: 0.55}); 
      lightningSound1 = game.scene.scenes[currentStage - 1].sound.add('lightningSound1', { volume: 0.40}); 
      lightningSound2 = game.scene.scenes[currentStage - 1].sound.add('lightningSound3', { volume: 0.40}); 
      lightningSound3 = game.scene.scenes[currentStage - 1].sound.add('lightningSound3', { volume: 0.40}); 
      lightningSound4 = game.scene.scenes[currentStage - 1].sound.add('lightningSound4', { volume: 0.40}); 
      lightningImpactSound1 = game.scene.scenes[currentStage - 1].sound.add('lightningImpactSound1', { volume: 0.55}); 
      lightningImpactSound2 = game.scene.scenes[currentStage - 1].sound.add('lightningImpactSound2', { volume: 0.55}); 
      lightningImpactSound3 = game.scene.scenes[currentStage - 1].sound.add('lightningImpactSound3', { volume: 0.55}); 
      toxicboltSound1 = game.scene.scenes[currentStage - 1].sound.add('toxicboltSound1', { volume: 0.35}); 
      toxicboltSound2 = game.scene.scenes[currentStage - 1].sound.add('toxicboltSound2', { volume: 0.35}); 
      toxicboltSound3 = game.scene.scenes[currentStage - 1].sound.add('toxicboltSound3', { volume: 0.35}); 
      toxicboltSound4 = game.scene.scenes[currentStage - 1].sound.add('toxicboltSound4', { volume: 0.35}); 
      toxicboltImpactSound1 = game.scene.scenes[currentStage - 1].sound.add('toxicboltImpactSound1', { volume: 0.35}); 
      toxicboltImpactSound2 = game.scene.scenes[currentStage - 1].sound.add('toxicboltImpactSound2', { volume: 0.35}); 
      toxicboltImpactSound3 = game.scene.scenes[currentStage - 1].sound.add('toxicboltImpactSound3', { volume: 0.35}); 
      horseSound1 = game.scene.scenes[currentStage - 1].sound.add('horseSound1', { volume: 0.45}); 
      horseSound2 = game.scene.scenes[currentStage - 1].sound.add('horseSound2', { volume: 0.45}); 
      horseSound3 = game.scene.scenes[currentStage - 1].sound.add('horseSound3', { volume: 0.45}); 
      horseImpactSound1 = game.scene.scenes[currentStage - 1].sound.add('horseImpactSound1', { volume: 0.50}); 
      horseImpactSound2 = game.scene.scenes[currentStage - 1].sound.add('horseImpactSound2', { volume: 0.50}); 
      horseImpactSound3 = game.scene.scenes[currentStage - 1].sound.add('horseImpactSound3', { volume: 0.50}); 
      

      /* - - - - - - - - - - - - Audio - - - - - - - - - - - - */


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
    fourButton = game.scene.scenes[currentStage - 1].input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
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
    playerAlive = false;
    playerDeath.play();
    healthAmount = 0;
    document.getElementById("stage_1_music").src = "assets/Audio/Music/deadMusic.mp3";
    document.getElementById("stage_1_music").load();
    document.getElementById("stage_1_music").play();
    document.getElementById("health_bar_amount").innerHTML = (healthAmount.toFixed(1) + "/" + healthMain);

    let playerDead = game.scene.scenes[currentStage - 1].physics.add.image(player.x, player.y, 'deadPlayer');
    playerDead.displayHeight = player.displayHeight + 30;
    playerDead.displayWidth = player.displayWidth + 30;
    player.disableBody(true, true);

    let restartMenu = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2, game.canvas.height/2, 'restartQuestionMenu');
    restartMenu.displayWidth = 900;
    restartMenu.displayHeight = 300;

    let restartButtonYes = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2 - 200, game.canvas.height/2 + 25, 'buttonSmallYes').setInteractive();
    restartButtonYes.displayWidth = 340;
    restartButtonYes.displayHeight = 100;
    restartButtonYes.on('pointerdown', function(event)
    {
      healthAmount = 100; healthTemp = 100;
      manaTemp = 100;
      playerAlive = true;
      enemies = null;
      enemiesSprites = null;
      enemiesCount = 0;


      manaPlayerSetMana();
      document.getElementById("stage_1_music").src = "assets/Audio/Music/stage1Music.mp3";
      document.getElementById("stage_1_ambience").src = "";
      document.getElementById("stage_1_ambience").src = "assets/Audio/Music/stage1Ambience.mp3";
      document.getElementById("health_bar").src = "assets/HpBars/hpBar100.jpg";
      document.getElementById("health_bar_amount").innerHTML = (healthTemp.toFixed(1) + "/" + healthMain);
      game.scene.scenes[currentStage - 1].scene.restart();
    });

    //button restart no
    let restartButtonNo = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2 + 200, game.canvas.height/2 + 25, 'buttonSmallNo').setInteractive();
    restartButtonNo.displayWidth = 340;
    restartButtonNo.displayHeight = 100;
    restartButtonNo.on('pointerdown', function (event)
    {
      location.reload();
    });
  }

  function nextStage(currentStage)
  {
    nextStagePopupMenuVisible = true;
    xpSave = xp;
    healthSave = healthTemp;
    spellsSave = spellsBought;
    //FIXME
    potionManaCountSave = potionManaCount;
    potionHealthCount = potionHealthCountSave;
    
    enemiesCount = 1; // this is to stop nextStage() loop
    playerNotMovable = game.scene.scenes[currentStage - 1].physics.add.sprite(player.x, player.y, 'playerDown'); //player sprite set
    player.disableBody(false, true);

    playerNotMovable.anims.play('up', true); //player animation
    playerNotMovable.displayWidth = 80; //player width
    playerNotMovable.displayHeight = 80; //player height

    backgroundBlackout = game.scene.scenes[currentStage - 1].add.image(987.5, 620, 'backgroundBlackout');
    backgroundBlackout.displayWidth = 1975;
    backgroundBlackout.displayHeight = 1240;

    

    continueButton = game.scene.scenes[currentStage - 1].add.image(game.canvas.width/2,  game.canvas.height/2, 'buttonContinue').setInteractive();
    continueButton.displayWidth = 680;
    continueButton.displayHeight = 110;

    let stageToStart;

    switch(currentStage)
    {
      case 1: stageToStart = "SecondStage"; break;
      case 2: stageToStart = "ThirdStage"; break;
      case 3: stageToStart = "FourthStage"; break;
      case 4: stageToStart = "LastStage"; break;
    }

    continueButton.on('pointerdown', function (event)
    {
      game.scene.scenes[currentStage - 1].scene.stop();
      game.scene.scenes[currentStage - 1].scene.launch(stageToStart);
      nextStagePopupMenuVisible = false;
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
          spellName.x = player.x; spellName.y = player.y - player.displayHeight - 130;
          spellName.angle = 0;
          spellName.body.velocity.y = -speed;
          break;
        }
        case "UpRight":
        {
          spellName.x = player.x + player.displayWidth + 130; spellName.y = player.y - player.displayHeight - 130;
          spellName.angle = 45;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "UpLeft":
        {
          spellName.x = player.x - player.displayWidth  - 130; spellName.y = player.y - player.displayHeight - 130;
          spellName.angle = 315;
          spellName.body.velocity.y = -speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Down":
        {
          spellName.x = player.x; spellName.y = player.y + player.displayHeight + 130;
          spellName.angle = 180;
          spellName.body.velocity.y = speed;
          break;
        }
        case "DownRight":
        {
          spellName.x = player.x + player.displayWidth + 130; spellName.y = player.y + player.displayHeight + 130;
          spellName.angle = 135;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = speed;
          break;
        }
        case "DownLeft":
        {
          spellName.x = player.x - player.displayWidth - 130; spellName.y = player.y + player.displayHeight + 130;
          spellName.angle = 225;
          spellName.body.velocity.y = speed;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Left":
        {
          spellName.x = player.x - player.displayWidth - 130; spellName.y = player.y;
          spellName.angle = 270;
          spellName.body.velocity.x = -speed;
          break;
        }
        case "Right":
        {
          spellName.x = player.x + player.displayWidth + 130; spellName.y = player.y;
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

  function enemyDiedWhatSoundToPlay(enemy)
  {
    switch(enemy.name)
    {
      case "Skeleton": skeletonDeath.play(); break;
      case "Phantom": phantomDeath.play(); break;
      case "Lich": lichDeath.play(); break;
      case "Demon": demonDeath.play(); break;
      case "Overlord": break;
    }
  }

  function returnPlayerStatsWhenRestart()
  {
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
    if(spellsBought[5]!= spellsSave[5])
    {
      document.getElementById("horses_button").className = "spell_button horses_button"
      document.getElementById("horses_button").onclick = () =>
      {
        interfaceButtonsFunctionalities('spellFear');
      };
      document.getElementById("horses_button").style.opacity = "100%";
      spellsBought[5] = spellsSave[5];
    }

    if(xp != xpSave)
    {
      xp = xpSave;
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
    }
    if(healthTemp != healthSave)
    {
      healthTemp = healthSave;
      hurtPlayerSetHealth();
    }

    if(potionHealthCount != potionHealthCountSave)
    {
      if(potionHealthCount == 0 && potionHealthCountSave > 0)
      {
        potionHealthCount = potionHealthCountSave;
        document.getElementById("health_potion_count").innerHTML = potionHealthCount;
        document.getElementById("health_potion_count").style.opacity = "100%";
        document.getElementById("health_potion").className = "health_potion";
      }
      else if( potionHealthCount > 0 && potionHealthCountSave > 0)
      {
        potionHealthCount = potionHealthCountSave;
        document.getElementById("health_potion_count").innerHTML = potionHealthCount;
      }
    }
    if(potionManaCount != potionManaCountSave)
    {
      if(potionManaCount == 0 && potionManaCountSave > 0)
      {
        potionManaCount = potionManaCountSave;
        document.getElementById("mana_potion_count").innerHTML = potionManaCount;
        document.getElementById("mana_potion_count").style.opacity = "100%";
        document.getElementById("mana_potion").className = "mana_potion";
      }
      else if( potionManaCount > 0 && potionManaCountSave > 0)
      {
        potionManaCount = potionManaCountSave;
        document.getElementById("mana_potion_count").innerHTML = potionManaCount;
      }
    }

  }

  function addExpText(x, y, currentStage, enemies)
  {
    let xpTemp = 0;
    let xpTextText;
    switch(enemies.name)
    {
      case "Skeleton":
      {
        xpTextText = "+ 0.5 exp"; xpTemp = 0.5;
        break;
      }
      case "Phantom":
      {
        xpTextText = "+ 1.5 exp"; xpTemp = 1.5;
        break;
      }
      case "Lich":
      {
        xpTextText = "+ 2.5 exp"; xpTemp = 2.5;
        break;
      }
      case "Demon":
      {
        xpTextText = "+ 5 exp"; xpTemp = 5 ;
        break;
      }
    }
    let expText = game.scene.scenes[currentStage - 1].add.text(x, y, xpTextText, { fontFamily: 'Arial', fontSize: 31, color: '#0c9419', stroke: '#000000', strokeThickness: 5});
    expText.setDepth(5);

    xp += xpTemp;
    document.getElementById("xp_amount").innerText = xp.toFixed(1);

    for(let i = 0; i < 4; i++)
    {
      moveExpText(expText, -2.5, i);
    }
  }

  function moveExpText(expText, y, i)
  {
    setTimeout( ()=>
    {
      expText.y += y;
      if(i = 4)
      {
        setTimeout(() => 
        {
          expText.destroy();
        }, 220 * (i + 1));
      }
    }, 220 * i);  
  }

  function addDmgText(x, y, currentStage, damage)
  {
    let damageTxt = game.scene.scenes[currentStage - 1].add.text(x, y, damage, { fontFamily: 'Arial', fontSize: 39, color: '#b32d2d', stroke: '#000000', strokeThickness: 5 });
    damageTxt.setDepth(5);
    let direction = Math.floor(Math.random()*(4 - 1)) + 1;
    switch(direction)
    {
      case 1:
      {
        for(let i = 0; i < 4; i++)
        {
          moveDmgText(damageTxt, 2.5, -2.5, i);
        }
        break;
      }
      case 2:
      {
        for(let i = 0; i < 4; i++)
        {
          moveDmgText(damageTxt, 2.5, 2.5, i);
        }
        break;
      }
      case 3:
      {
        for(let i = 0; i < 4; i++)
        {
          moveDmgText(damageTxt, -2.5, 2.5, i);
        }
        break;
      }
      case 4:
      {
        for(let i = 0; i < 4; i++)
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
      if(i = 4)
      {
        setTimeout(() => 
        {
          if(dmgTextCount > 0)
          {
            dmgTextCount--;
          }
          dmgtext.destroy();
        }, 60 * (i + 1));
      }
    }, 60 * i);  
  }

  //deprecated on purpose
  function enemyDrop(enemies, currentStage, player, enemyX, enemyY, enemyHeight, enemyWidth)
  {
    if(enemies.drop == "xpParticle")
    {
      let xpParticle = game.scene.scenes[currentStage - 1].add.sprite(enemyX + enemyWidth/2, enemyY + enemyHeight/2, 'expParticle');
      xpParticle.anims.play('exp', true);
      xpParticle.displayWidth = 25; xpParticle.displayHeight = 25;

      game.scene.scenes[currentStage - 1].physics.add.overlap(player, xpParticle, () => 
      {
        xpParticle.disableBody(true, true);
        xp += 0.5;
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
      });
    }
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
    scene: [ FirstStage, SecondStage, ThirdStage, PauseMenu ]
  };

  game = new Phaser.Game(config); //game object, most important

  var enemiesSprites = [];
  var enemies = [];

  var enemiesSkeletonSprites = [];
  var enemiesLichSprites = [];
  var enemiesDemonSprites = [];
  var enemiesPhantomSprites = [];
  
  dmgTextCount = 0;
  enemiesCount = 0;
  fearActive = false;
  nextStagePopupMenuVisible = false;

  var player, cursors;
  var vSwitch, escapeButtonSwitch, escapeButtonMenuSwitch, attackSwitch;

  var oneButtonSwitch = true, twoButtonSwitch = true, threeButtonSwitch = true, fourButtonSwitch = true, eButtonSwitch = true;

  var healthSave = healthTemp, xpSave = xp, potionHealthCountSave = potionHealthCount, potionManaCountSave = potionManaCount; //used when player is restarting stage  
  equippedSpell = "fireball", playerFacingDirection = "Up", playerAlive = true;
}




function restoreHpOrMana(whatToRestore)
{
  if(playerAlive)
  {
    switch(whatToRestore)
    {
      case 'health':
      {
        if(potionHealthCount > 0)
        {
          if(healthTemp < 100)
          {
            if(healthTemp + 20 > 100)
            {
              healthTemp = 100; 
            }
            else
            {
              healthTemp += 20;
            }
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
            potionHealthCount--;
            potionDrink.play();
            document.getElementById("health_potion_count").innerHTML = potionHealthCount;
            if(potionHealthCount == 0)
            {
              document.getElementById("health_potion_count").style.opacity = "60%";
              document.getElementById("health_potion").className = "health_potion_after";
            }
          }
          else
          {
            potionCooldown.play();
          }
        }
        break;
      }
      case 'mana':
      {
        if(potionManaCount > 0)
        {
          if(manaTemp < 100)
          {
            manaTemp = 100;
            potionManaCount--;
            potionDrink.play();
            document.getElementById("mana_potion_count").innerHTML = potionManaCount;
            console.log(potionManaCount);
            if(potionManaCount == 0)
            {

              document.getElementById("mana_potion_count").style.opacity = "60%";
              document.getElementById("mana_potion").className = "mana_potion_after";
            }
          }
          else
          {
            potionCooldown.play();
          }
        }
        break;
      }
    }
  }
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
    case "spellHorses": spellHorses(); break;
  }
  function spellBlink()
  {
    if(xp >= 15)
    {
      xp -= 15;
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
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
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
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
    if(xp >= 10)
    {
      xp -= 10;
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
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
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
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
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
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
  function spellHorses()
  {
    if(xp >= 40)
    {
      xp -= 40;
      document.getElementById("xp_amount").innerText = xp.toFixed(1);
      document.getElementById("buy_spell_sound").load();
      document.getElementById("buy_spell_sound").play();
      document.getElementById("horses_button").className = "spell_button_after horses_button"
      document.getElementById("horses_button").onclick = "";
      document.getElementById("horses_button").style.opacity = "50%";
      spellsBought[5] = true;
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
  if(!nextStagePopupMenuVisible)
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
        if(manaTemp >= 30)
        {
          spellSelectCosmetic();
        }
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
      equippedSpell = "fireball";
      document.getElementById("selected_spell").src = "assets/Icons/FireballIcon.jpg";
      spellSelectCosmetic();
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
        if(fearActive == false && manaTemp >= 70)
        {
          spellSelectCosmetic();
        }
      }
      else
      {
        document.getElementById("errorSpeech").currentTime = 0;
        document.getElementById("errorSpeech").play();
      }
      break;
    }
    case "horses":
    {
      if(spellsBought[5] == true)
      {
        equippedSpell = "horses";
        document.getElementById("selected_spell").src = "assets/Icons/HorsesIcon.jpg";
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
