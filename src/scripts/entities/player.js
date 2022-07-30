import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'
import Phaser from 'phaser'
import { Vector3 } from 'three'

//TODO: debounce the gravity switch effect

import gameConfig from '../../config/game.js'
import { rotate, teleport } from '../util.js'
export default class Player {
  getPlayer() {
    return this.player
  }
  walkAnimation() {
    if (this.player.animation.current !== 'Walking') this.player.animation.play('Walking')
  }

  setIdle(self) {
    if (this.player.animation.current !== 'Idle') this.player.animation.play('Idle')

    const curPos = self.third.camera.position
    //camera zoom in
    // self.third.camera.position.lerp(new THREE.Vector3(curPos.x, curPos.y, 4), 0.5)
  }

  async update(self) {
    if (!this.player || !this.player.body) return

    const curPos = this.player.position

    // add just the camera position
    //self.third.camera.position.copy(this.player.position).add(new THREE.Vector3(0, 5, 25))

    if (curPos.x) self.third.camera.position.lerp(new THREE.Vector3(curPos.x, curPos.y + 5, 25), 0.5)

    // get rotation of robot
    const theta = this.player.world.theta
    this.player.body.setAngularVelocityY(0)
    this.player.body.setAngularVelocityZ(0)

    //TODO: for some reason the player gravity does not register this is a workaround Rotate too
    this.player.body.setGravity(0, this.gravityDown ? -9.9 : 9.9, 0)
    //rotate(this.player, 0, 0, this.gravityDown ? 0 : 180)

    // set the speed variable
    const speed = 7

    //check if player is past the height limit
    if (this.player.position.y > gameConfig.heightLimit || this.player.position.y < gameConfig.heightMin) {
      await teleport(this.player, 0, 0, 0)
      this.player.body.setGravity(0, this.gravityDown ? -9.9 : 9.9, 0)
      await rotate(this.player, 0, 0, this.gravityDown ? 0 : 180)
      console.log('player is past the height limit')
    }

    // move left
    if (this.keys.a.isDown) {
      this.player.body.setVelocityX(-speed)
      if (theta > -(Math.PI / 2)) this.player.body.setAngularVelocityY(-10)
      this.walkAnimation()
    }
    // move right
    else if (this.keys.d.isDown) {
      this.player.body.setVelocityX(speed)
      if (theta < Math.PI / 2) this.player.body.setAngularVelocityY(10)
      this.walkAnimation()
    }
    // do not move
    else {
      this.player.body.setVelocityX(0)

      //idle animation is handled in setIdle
      //this.idleAnimation()
      this.setIdle(self)
    }

    // jump
    if (this.keys.w.isDown && this.player.userData.onGround && Math.abs(this.player.body.velocity.y) < 1e-1) {
      this.player.animation.play('WalkJump')
      this.player.body.applyForceY(this.gravityDown ? 10 : -10)
    }

    function degreesToRadians(degrees) {
      return degrees * (Math.PI / 180)
    }
    if (this.keys.space.isDown && this.player.userData.onGround && this.canJump) {
      this.canJump = false
      this.player.animation.play('WalkJump')
      this.player.body.applyForceY(this.gravityDown ? 15 : -15)
      this.gravityDown = !this.gravityDown
      //TODO: set gravity as config
      this.player.body.setGravity(0, this.gravityDown ? -15 : 15, 0)
      await rotate(this.player, 0, 0, this.gravityDown ? 0 : 180)

      // this.canJump = true
      //TODO: may not be needed since rotate returns promise and may be the cause of error
      setTimeout(() => {
        this.canJump = true
      }, 1000)
      //this.player.rotation.set(degreesToRadians(90), degreesToRadians(130), degreesToRadians(180))

      /*
            this.player.body.setCollisionFlags(2)
      
            this.player.body.needUpdate = true
      
            // this will run only on the next update if body.needUpdate = true
            this.player.body.once.update(() => {
              // set body back to dynamic
              this.player.body.setCollisionFlags(0)
              this.player.rotation.set(0, 0, degreesToRadians(180))
              // if you do not reset the velocity and angularVelocity, the object will keep it
              this.player.body.setVelocity(0, 0, 0)
              this.player.body.setAngularVelocity(0, 0, 0)
            })*/
    }
  }

  /** give the this.player xyz coords */
  constructor(scene, x, y, z) {
    this.canJump = true
    this.keys = {
      w: scene.input.keyboard.addKey('w'),
      a: scene.input.keyboard.addKey('a'),
      d: scene.input.keyboard.addKey('d'),
      space: scene.input.keyboard.addKey('space')
    }
    this.gravityDown = true
    scene.third.load.gltf('../../assets/glb/robot.glb').then(async (gltf) => {
      this.player = new ExtendedObject3D()
      this.player.add(gltf.scene)
      this.player.name = 'player'

      // if (x && y && z) this.player.position.set(x, y, z)

      const scale = 1 / 3
      this.player.scale.set(scale, scale, scale)

      this.player.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true
        }
      })

      // anims
      scene.third.animationMixers.add(this.player.anims.mixer)
      gltf.animations.forEach((anims) => {
        this.player.anims.add(anims.name, anims)
      })
      this.player.anims.play('Idle')

      scene.third.add.existing(this.player)
      await scene.third.physics.add.existing(this.player, {
        shape: 'capsule',
        ignoreScale: true,
        height: 0.8,
        radius: 0.4,
        offset: { y: -0.8 }
      })
      this.player.body.setLinearFactor(1, 1, 0)
      this.player.body.setAngularFactor(0, 0, 0)
      this.player.body.setFriction(0)

      scene.third.camera.lookAt(this.player.position)

      // add a sensor
      const sensor = new ExtendedObject3D()
      sensor.position.setY(-0.9)
      scene.third.physics.add.existing(sensor, { mass: 1e-8, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
      sensor.body.setCollisionFlags(4)

      // connect sensor to robot
      scene.third.physics.add.constraints.slider(this.player.body, sensor.body)

      // detect if sensor is on the ground
      sensor.body.on.collision((otherObject, event) => {
        if (/platform/.test(otherObject.name)) {
          if (event !== 'end') this.player.userData.onGround = true
          else this.player.userData.onGround = false
        }
      })

      // check robot overlap with star or enemy
      this.player.body.on.collision((otherObject, event) => {
        if (/star/.test(otherObject.name)) {
          if (!otherObject.userData.dead) {
            otherObject.userData.dead = true
            otherObject.visible = false
            scene.score += 10
            scene.scoreText.setText(`score: ${scene.score}`)
            scene.third.physics.destroy(otherObject)
          }
        } else if (/enemy/.test(otherObject.name)) {
          if (!otherObject.userData.dead) {
            otherObject.userData.dead = true
            otherObject.visible = false
            scene.score -= 10
            scene.scoreText.setText(`score: ${scene.score}`)
            scene.third.physics.destroy(otherObject)
          }
        }
      })
    })
  }
}
