//TODO: add this for platform entity

import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'

export default class Platform {
  /** give the Platform xyz coords. End is optional */
  constructor(scene, config, material, end = false) {
    this.raycaster = scene.third.physics.add.raycaster('closest')

    this.player = scene.robot

    this.platform = scene.third.physics.add.box(config, material)

    this.end = end
  }

  getType() {
    if (this.end) return 'moving'
    return 'static'
  }

  //only call update if getType === moving
  update(scene, time) {
    if (!scene.robot.getPlayer() || !scene.robot.getPlayer().body) return
    this.player = scene.robot.getPlayer()
    const { x, y, z } = scene.robot.getPlayer().position

    console.log(Math.sin(time / 10000))
    //sin has min 0 and max 1 given time is always increasing
    this.platform.position.x = (Math.sin(time / 1000) + 1) * 5 + 12
    this.platform.body.needUpdate = true

    //console.log("platform pos: ", this.platform.position)

    //TODO: slopes

    let tooSteep = false
    let addVelocity = 0

    let offset = 0
    const rayLength = 1.25

    this.raycaster.setRayFromWorld(x, y, z)
    this.raycaster.setRayToWorld(x + offset, y - rayLength, z)
    this.raycaster.rayTest()

    if (this.raycaster.hasHit()) {
      const hnw = this.raycaster.getHitNormalWorld()
      const co = this.raycaster.getCollisionObject()

      // adjust the velocity of the player while on the moving platform
      //includes checks if name of object has platform
      if (co.name.includes('platform')) addVelocity = co.body.velocity.x
    }

    if (addVelocity !== 0) {
      const vx = this.player.body.velocity.x
      this.player.body.setVelocityX(vx + addVelocity)
    }
    addVelocity = 0
  }

  getPlatform() {
    return this.platform
  }
}
