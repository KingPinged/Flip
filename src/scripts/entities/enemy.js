import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'
import { rotate, teleport } from '../util.js'

export default class Enemy {
  /** give the enemy xyz coords */
  constructor(scene, x, y, z, end) {
    scene.third.load.gltf('../../assets/glb/robot.glb').then((gltf) => {
      this.enemy = new ExtendedObject3D()
      this.enemy.name = 'enemy'
      this.enemy.add(gltf.scene)

      this.enemy.position.set(x, y, z)

      const scale = 1 / 3
      this.enemy.scale.set(scale, scale, scale)

      // animations
      scene.third.animationMixers.add(this.enemy.animation.mixer)
      gltf.animations.forEach((animation) => {
        this.enemy.animation.add(animation.name, animation)
      })
      this.enemy.animation.play('Idle')

      scene.third.add.existing(this.enemy)
      let boundary = scene.third.physics.add.existing(this.enemy, {
        shape: 'capsule',
        ignoreScale: true,
        height: 0.8,
        radius: 0.4,
        offset: { y: -0.8 }
      })
      console.log(boundary)
      this.enemy.body.setLinearFactor(1, 1, 0)
      this.enemy.body.setAngularFactor(0, 0, 0)
      this.enemy.body.setFriction(5)
    })
    /*scene.third.load.gltf('../../assets/glb/robot.glb').then((gltf) => {
      this.enemy = new ExtendedObject3D()
      this.enemy.name = 'enemy'
      this.enemy.add(gltf.scene)

      //console.log(enemy.position)
      // if (x && y && z) teleport(this.enemy, x, y, z)

      const scale = 1 / 3
      this.enemy.scale.set(scale, scale, scale)

      // animations
      scene.third.animationMixers.add(this.enemy.animation.mixer)
      gltf.animations.forEach((animation) => {
        this.enemy.animation.add(animation.name, animation)
      })
      this.enemy.animation.play('Idle')

      scene.third.add.existing(this.enemy)
      scene.third.physics.add.existing(this.enemy, {
        shape: 'capsule',
        ignoreScale: true,
        height: 0.8,
        radius: 0.4,
        offset: { y: -0.8 }
      })
      this.enemy.body.setLinearFactor(1, 1, 0)
      this.enemy.body.setAngularFactor(0, 0, 0)
      this.enemy.body.setFriction(5)

      // add a sensor
      const sensor = new ExtendedObject3D()
      sensor.position.setY(-0.9)
      scene.third.physics.add.existing(sensor, { mass: 1e-8, shape: 'box', width: 2, height: 0.2, depth: 0.2 })
      sensor.body.setCollisionFlags(4)

      // connect sensor to robot
      scene.third.physics.add.constraints.lock(this.enemy.body, sensor.body)

      // detect if sensor is on the ground
      sensor.body.on.collision((otherObject, event) => {
        if (/platform/.test(otherObject.name)) {
          if (event !== 'end') this.enemy.userData.onGround = true
          else this.enemy.userData.onGround = false
        }
      })
    })*/
  }
}
