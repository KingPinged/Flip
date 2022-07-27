/**
 * A class that wraps up our 2D platforming player logic. It creates, animates and moves a sprite in
 * response to WASD/arrow keys. Call its update method from the scene's update and call its destroy
 * method when you're done with the player.
 */
 import Phaser from "phaser";

 import { mapScale } from "@/game/config";
 export default class Player {
   constructor(scene, x, y) {
     this.scene = scene;
     this.jumpHeld = { on: false, time: 0 };
 
     const jumpHeld = this.jumpHeld;
     // Create the animations we need from the player spritesheet
     const anims = scene.anims;
     anims.create({
       key: "player-idle",
       frames: anims.generateFrameNumbers("player", { start: 0, end: 3 }),
       frameRate: 3,
       repeat: -1
     });
     anims.create({
       key: "player-run",
       frames: anims.generateFrameNumbers("player", { start: 8, end: 15 }),
       frameRate: 12,
       repeat: -1
     });
 
     // Create the physics-based sprite that we will move around and animate
     this.sprite = scene.physics.add
       .sprite(x, y, "player", 0)
       .setDrag(200, 0)
       // .setMaxVelocity(300, 400)
       .setSize(18, 24)
       .setOffset(7, 9);
 
     scene.cameras.main.zoom = 0.5;
     scene.cameras.main.startFollow(this.sprite, false, 0.2, 0.2);
 
     // Track the arrow keys & WASD
     const { LEFT, RIGHT, UP, W, A, D } = Phaser.Input.Keyboard.KeyCodes;
     this.keys = scene.input.keyboard.addKeys({
       left: LEFT,
       right: RIGHT,
       up: UP,
       w: W,
       a: A,
       d: D
     });
 
     const sprite = this.sprite;
     const keys = this.keys;
     //𓁹‿𓁹
     //𓁹‿𓁹
     //𓁹‿𓁹
     //𓁹‿𓁹
     //TODO: the following should most likely be put in a Maid: cleanup the event memory
     scene.input.keyboard.on("keydown-SPACE", function (event) {
       if (jumpHeld.on || !sprite.body.blocked.down) return false;
       jumpHeld.on = true;
       jumpHeld.time = Date.now();
     });
     scene.input.keyboard.on("keyup-SPACE", function (event) {
       if (!jumpHeld.on) return false;
       jumpHeld.on = false;
 
       //calculate the POWER of the jump based on the time of the event.
       //𓁹‿𓁹
 
       //you don't need to reset time as it will change to now in the keydown event
       const duration = Date.now() - jumpHeld.time; // in ms
 
       let seconds = duration / 1000; //1000 ms = 1 second 𓁹‿𓁹
 
       if (seconds > 1.5) seconds = 1.5;
 
       sprite.setVelocityY(seconds * -200 + -300);
 
       if (keys.left.isDown || keys.a.isDown) {
         sprite.setVelocityX(-300);
       } else if (keys.right.isDown || keys.d.isDown) {
         sprite.setVelocityX(300);
       }
     });
   }
 
   freeze() {
     this.sprite.body.moves = false;
   }
 
   update() {
     const { keys, sprite } = this;
     const onGround = sprite.body.blocked.down;
     const acceleration = onGround ? 50 : 20;
 
     // Apply horizontal acceleration when left/a or right/d are applied
     if ((keys.left.isDown || keys.a.isDown) && !this.jumpHeld.on && onGround) {
       sprite.setVelocityX(-acceleration);
       // No need to have a separate set of graphics for running to the left & to the right. Instead
       // we can just mirror the sprite.
       sprite.setFlipX(true);
     } else if (
       (keys.right.isDown || keys.d.isDown) &&
       !this.jumpHeld.on &&
       onGround
     ) {
       sprite.setVelocityX(acceleration);
       sprite.setFlipX(false);
     } else {
       //(0);
     }
 
     if (onGround) {
       sprite.body.velocity.x /= 2;
     }
 
     // Only allow the player to jump if they are on the ground
     if (onGround && (keys.up.isDown || keys.w.isDown)) {
       //  sprite.setVelocityY(-500);
     }
 
     // Update the animation/texture based on the state of the player
     if (onGround) {
       if (sprite.body.velocity.x !== 0) sprite.anims.play("player-run", true);
       else sprite.anims.play("player-idle", true);
     } else {
       sprite.anims.stop();
       sprite.setTexture("player", 10);
     }
   }
 
   destroy() {
     this.sprite.destroy();
   }
 }
 