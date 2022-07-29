


import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'

export default class Enemy {
  /** give the enemy xyz coords */
  constructor(scene, start = {}, end) {

    let { x, y, z } = start
    scene.third.load.gltf('../../assets/glb/robot.glb').then((gltf) => {
      const enemy = new ExtendedObject3D()
      enemy.name = "enemy"
      enemy.add(gltf.scene)

      if (x && y && z) enemy.position.set(x, y, z)

      const scale = 1 / 3
      enemy.scale.set(scale, scale, scale)

      enemy.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = child.receiveShadow = true
        }
      })

      // animations
      scene.third.animationMixers.add(enemy.animation.mixer)
      gltf.animations.forEach((animation) => {
        enemy.animation.add(animation.name, animation)
      })
      enemy.animation.play('Idle')

      scene.third.add.existing(enemy)
      scene.third.physics.add.existing(enemy, {
        shape: 'capsule',
        ignoreScale: true,
        height: 0.8,
        radius: 0.4,
        offset: { y: -0.8 }
      })
      enemy.body.setLinearFactor(1, 1, 0)
      enemy.body.setAngularFactor(0, 0, 0)
      enemy.body.setFriction(5)

      // add a sensor
      const sensor = new ExtendedObject3D()
      sensor.position.setY(-0.9)
      scene.third.physics.add.existing(sensor, { mass: 1e-8, shape: 'box', width: 0.2, height: 0.2, depth: 0.2 })
      sensor.body.setCollisionFlags(4)

      // connect sensor to robot
      scene.third.physics.add.constraints.lock(enemy.body, sensor.body)

      // detect if sensor is on the ground
      sensor.body.on.collision((otherObject, event) => {
        if (/platform/.test(otherObject.name)) {
          if (event !== 'end') enemy.userData.onGround = true
          else enemy.userData.onGround = false
        }
      })
    })
  }
}
