//TODO: add this for Star entity
import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'
import { random } from '../util'
import * as Phaser from 'phaser'

export default class Star {
  /** give the Star xyz coords. End is optional */
  constructor(scene, pos, i, end = false, random = false) {
    const svg = scene.cache.html.get('star')
    const starShape = scene.third.transform.fromSVGtoShape(svg)
    const starScale = 250

    this.pos = pos
    this.Star = scene.third.add.extrude({ shape: starShape[0], depth: 120 })
    this.Star.name = `star-${i}`
    this.Star.scale.set(1 / starScale, 1 / -starScale, 1 / starScale)
    this.Star.material.color.setHex(0xffd851)
    this.Star.position.setX(pos.x)
    this.Star.position.setY(pos.y)
    scene.third.physics.add.existing(this.Star, {
      shape: 'box',
      ignoreScale: true,
      width: 0.5,
      height: 0.5,
      depth: 0.5
    })
    this.Star.body.setCollisionFlags(6)

    this.end = end
    this.random = random

    if (this.random) {
      this.Star.position.x = Phaser.Math.Between(this.pos.x - 5, this.pos.x + 5)
    }
  }

  getType() {
    if (this.end) return 'moving'
    return 'static'
  }

  //only call update if getType === moving
  update(scene, time) {
    if (!this.Star.userData.dead) {
      this.Star.rotation.y += 0.03
      this.Star.body.needUpdate = true
    }

    if (this.getType() !== 'moving') return

    //this.Star.position.copy(this.Star.position).add(new THREE.Vector3(0, 5, 25))

    //sin has min 0 and max 1 given time is always increasing
    //console.log(Math.sin(time / 1000))
    this.Star.position.y += Math.sin(time / 1000) * 0.005
    // this.Star.body.needUpdate = true
  }

  getStar() {
    return this.Star
  }
}
