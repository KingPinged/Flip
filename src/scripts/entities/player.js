import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'
import Phaser from 'phaser'
export default class Player {
  getPlayer() {
    return this.player
  }
  walkAnimation() {
    if (this.player.animation.current !== 'Walking') this.player.animation.play('Walking')
  }

  idleAnimation() {
    if (this.player.animation.current !== 'Idle') this.player.animation.play('Idle')
  }

  update(self) {
    if (!this.player || !this.player.body) return
    // add just the camera position
    self.third.camera.position.copy(this.player.position).add(new THREE.Vector3(0, 5, 16))

    // get rotation of robot
    const theta = this.player.world.theta
    this.player.body.setAngularVelocityY(0)

    // set the speed variable
    const speed = 7

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
      this.idleAnimation()
    }

    // jump
    /*if (self.keys.w.isDown && this.player.userData.onGround && Math.abs(this.player.body.velocity.y) < 1e-1) {
      this.player.animation.play('WalkJump')
      this.player.body.applyForceY(16)
    }*/

    if (this.keys.space.isDown && Math.abs(this.player.body.velocity.y) < 1e-1) {
      this.player.animation.play('WalkJump')
      // this.player.body.applyForceY(16)
      this.gravityDown = !this.gravityDown
      this.player.body.setGravity(0, this.gravityDown ? -9.5 : 9.5, 0)
    }
  }

  /** give the this.player xyz coords */
  constructor(scene, x, y, z) {
    this.keys = {
      w: scene.input.keyboard.addKey('w'),
      a: scene.input.keyboard.addKey('a'),
      d: scene.input.keyboard.addKey('d'),
      space: scene.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }
    this.gravityDown = 'down'
    scene.third.load.gltf('../../assets/glb/robot.glb').then((gltf) => {
      this.player = new ExtendedObject3D()
      this.player.add(gltf.scene)

      if (x && y && z) this.player.position.set(x, y, z)

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
      scene.third.physics.add.existing(this.player, {
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
      scene.third.physics.add.constraints.lock(this.player.body, sensor.body)

      // detect if sensor is on the ground
      sensor.body.on.collision((otherObject, event) => {
        if (/platform/.test(otherObject.name)) {
          if (event !== 'end') this.player.userData.onGround = true
          else this.player.userData.onGround = false
        }
      })

      // check robot overlap with star
      this.player.body.on.collision((otherObject, event) => {
        if (/star/.test(otherObject.name)) {
          if (!otherObject.userData.dead) {
            otherObject.userData.dead = true
            otherObject.visible = false
            scene.score += 10
            scene.scoreText.setText(`score: ${scene.score}`)
            scene.third.physics.destroy(otherObject)
          }
        }
      })
    })
  }
}
