//
const appDiv = document.getElementById('game');

function showMenu()
{
  document.getElementById("game_menu_frame").style.margin ="0px 35%"; //slide animation
  document.getElementById("chains_down_sound").play(); //sound playback 
  document.getElementById("rain_loop").play(); //sound playback 
  document.getElementById("rain_loop").volume = "0.25"; //rain volume set
  
  document.getElementById("click_anywhere_info").onclick = ""; //removing onclick method from ClickAnywhereInfo text
  document.getElementById("vignette").onclick = ""; //removing onclick method from vignette 
  document.getElementById("game_menu_buttons_frame").onclick = ""; //removing onclick method from specific div 

  document.getElementById("click_anywhere_info").style.margin = "8% 0px 0px 12%"; //hiding text 
  document.getElementById("click_anywhere_info").style.fontSize = "33"; //hiding text 
  document.getElementById("click_anywhere_info").textContent = "v.1.0.1"; //hiding text 

  document.getElementById("game_logo").style.margin = "2% 0px 0px 7%"; //hiding logo
  document.getElementById("game_logo").style.width = "300px"; //hiding logo



  setTimeout( ()=>
  {
    document.getElementById("main_menu_music").play(); //sound playback 
    document.getElementById("game_menu_button_start").style.display = "block"; //showing button
    document.getElementById("game_menu_button_options").style.display = "block"; //showing button
    document.getElementById("game_menu_button_quit").style.display = "block"; //showing button
  }, 700);
}

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

function startMenuButtonsChoice(buttonClicked)
{
  switch (buttonClicked)
  {
    case "startGameButton": 
    {
      hideMenu();
      setTimeout( ()=>
      {
        startGame();
      }, 700);
      break;
    }
    case "optionsButton": 
    {
      optionsGame();
      break;
    }

    case "quitButton": 
    {

      break;
    }
    case "returnButton": 
    {
      returnFromOptionsGame();
      break;
    }
  }
}

//method that starts game - initializes variables, sets stages etc..
function startGame()
{

  var FirstStage = new Phaser.Class({

    Extends: Phaser.Scene,
    initialize:

    function FirstStage()
    {
      Phaser.Scene.call(this, {key: 'FirstStage'});
    },
    
    //preload needed images
    preload: function()
    {
      this.load.crossOrigin = 'anonymous';
      this.load.spritesheet('playerDown', 'assets/PlayerBody/BodyPlayerDown.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerUp', 'assets/PlayerBody/BodyPlayerUp.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerLeft', 'assets/PlayerBody/BodyPlayerLeft.png', { frameWidth: 100, frameHeight: 100});
      this.load.spritesheet('playerRight', 'assets/PlayerBody/BodyPlayerRight.png', { frameWidth: 100, frameHeight: 100});
      this.load.image('background', 'assets/Backgrounds/Background1.jpg');
    },

    //launches on stage creation
    create: function()
    {
      document.getElementById("stage_1").play();
      document.getElementById("stage_1").volume = "0.5";
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
        key: 'up', 
        frames: this.anims.generateFrameNumbers('playerUp', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
    
      this.anims.create({
        key: 'right', 
        frames: this.anims.generateFrameNumbers('playerRight', { start: 0, end: 34}), 
        frameRate: 11,
        repeat: -1
      });
    
      backgroundImage = this.add.image(800, 500, 'background');
      backgroundImage.displayWidth = 1600;
      backgroundImage.displayHeight  = 1000;
    
      player = this.physics.add.sprite(800, 500 , 'playerDown');
      player.anims.play('down', true); //animation
      player.displayWidth = 80;
      player.displayHeight = 80;
      player.body.collideWorldBounds = true;
      player.body.immovable = true;
      document.getElementsByClassName("")

    
      cursors = this.input.keyboard.createCursorKeys(); // UP DOWN LEFT RIGHT SPACE bind kinda
      escapeButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC); //escape button bind

      this.scene.pause();
      this.scene.launch('PauseMenu');
    },

    //runs with every frame of the game
    update: function() 
    {
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

    resume: function()
    {
    }

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
      this.load.image('pauseMenu', 'assets/Backgrounds/BackgroundBlackout.png');
    },

    //launches on stage creation
    create: function()
    {
      document.getElementById("stage_1").pause();
      backgroundPause = this.add.image(800, 500, 'pauseMenu');
      escapeButtonMenu = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      document.getElementsByClassName("site_content")[0].style.boxShadow = "0rem 2rem 5rem #222222";
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
          this.scene.resume('FirstStage');
        }
      }
      if(escapeButtonMenu.isUp)
      {
        escapeButtonMenuSwitch = false;
      }
    }
  });

  function keyboardButtonsFunctionalities()
  {
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    if (cursors.right.isDown) //On RIGHT press action
    {
      player.body.velocity.x = 200; player.anims.play('right', true);
    }
    if (cursors.down.isDown) //On DOWN press action
    {
      player.body.velocity.y = 200; player.anims.play('down', true);
    }
    if (cursors.left.isDown) //On LEFT press action
    {
      player.body.velocity.x = -200; player.anims.play('left', true);
    }
    if (cursors.up.isDown) //On UP press action
    {
      player.body.velocity.y = -200; player.anims.play('up', true);
    }
    if (cursors.left.isDown && cursors.right.isDown) //On LEFT and RIGHT character stands still.
    {
      player.body.velocity.x = 0;
    }
    if (cursors.up.isDown && cursors.down.isDown)  //On UP and DOWN character stands still.
    {
      player.body.velocity.y = 0;
    }

    if(cursors.space.isDown ) //On SPACEBAR press action
    {
      if(!spacebarSwitch) //Pressing spacebar activates teleport only once because of this.
      {
        healthTemp--;
        hurtPlayerSetHealth();
        if(player.body.velocity.x == 200)
        {
          player.body.x +=160;
        }      
        if(player.body.velocity.y == 200)
        {
          player.body.y +=120;
        }
        if(player.body.velocity.x == -200)
        { 
          player.body.x -=160; 
        }
        if(player.body.velocity.y == -200)
        { 
          player.body.y -=120;
        }
        spacebarSwitch = true;
      }
    }
    if(cursors.space.isUp)
    {
      spacebarSwitch = false;
    }
  }

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
      let lightningButton = document.getElementsByClassName("spell_button")[0];
      lightningButton.style.display = "none";
    }
    function spellBlink()
    {
      let blinkButton = document.getElementsByClassName("spell_button")[1];
      blinkButton.style.display = "none";
    }
    function spellFear()
    {
      let fearButton = document.getElementsByClassName("spell_button")[2];
      fearButton.style.display = "none";
    }
    function spellFireball()
    {
      let fireballButton = document.getElementsByClassName("spell_button")[3];
      fireballButton.style.display = "none";
    }

    function spellToxicbolt()
    {
      let toxicboltButton = document.getElementsByClassName("spell_button")[4];
      toxicboltButton.style.display = "none";
    }
  }

  //whole game configuration, width, height, scenes etc..
  var config = 
  {
    type: Phaser.AUTO,
    width: 1600,
    height: 1000,
    parent: appDiv,
    backgroundColor: "48a",
    physics: 
    {
      default: 'arcade',
    },
    scene: [ FirstStage, PauseMenu ]
  };

  var game = new Phaser.Game(config); //game object, most important
  let healthAmount = 100, healthTemp = healthAmount; //main player health variable and temporary health variable that tells game when player has been hurt 
  var player, cursors;
  var spellsBought = [false, false, false, false, false]; //array that holds information about which spells have been purchased
  var spacebarSwitch, escapeButtonSwitch, escapeButtonMenuSwitch;

  //inform game when player was hurt, update health bar
  function hurtPlayerSetHealth()
  {
    if(healthTemp != healthAmount)
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
      healthAmount = healthTemp
    }
  }
}


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

function returnFromOptionsGame()
{
  document.getElementById("chains_up_sound").load(); //sound load again because sometimes sound doesnt play  
  document.getElementById("chains_up_sound").play(); //sound playback 
  document.getElementById("options_section").style.display = "none";
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

function quitGame()
{

}