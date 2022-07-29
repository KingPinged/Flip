import { enable3d, Scene3D, Canvas, ExtendedObject3D, THREE } from '@enable3d/phaser-extension'

import Enemy from '../entities/enemy'
import Player from '../entities/player'
import Platform from '../entities/platform'

export default class MainScene extends Scene3D {
  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.third.load.preload('sky', '../../assets/img/sky.png')
    this.load.html('star', '../../assets/svg/star.svg')
  }

  init() {
    this.accessThirdDimension({ gravity: { x: 0, y: -20, z: 0 } })
    delete this.robot
    this.enemies = []
    this.platforms = []
    this.stars = []
    this.score = 0
  }

  async create() {
    const { lights } = await this.third.warpSpeed('-ground', '-sky', '-orbitControls')

    // adjust the camera
    this.third.camera.position.set(0, 5, 20)
    this.third.camera.lookAt(0, 0, 0)

    // enable physics debugging
    this.third.physics.debug.enable()

    // add background image
    this.third.load.texture('sky').then((sky) => (this.third.scene.background = sky))

    // add score text
    this.scoreText = this.add.text(32, this.cameras.main.height - 32, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    })
    this.scoreText.setOrigin(0, 1)
    this.scoreText.depth = 1

    // add platforms
    const platformMaterial = { phong: { transparent: true, color: 0x21572f } }
    const platforms = [
      new Platform(this, { name: 'platform-ground', y: -2, width: 30, depth: 5, height: 2, mass: 0 }, platformMaterial),
      new Platform(this, { name: 'platform-right1', x: 7, y: 4, width: 15, depth: 5, mass: 0 }, platformMaterial),
      new Platform(this, { name: 'platform-left', x: -10, y: 7, width: 10, depth: 5, mass: 0 }, platformMaterial),
      new Platform(this, { name: 'platform-right2', x: 10, y: 10, width: 10, depth: 5, mass: 0 }, platformMaterial),
      new Platform(
        this,
        { name: 'platform-right3', x: 10, y: 8, width: 10, depth: 5, mass: 10, collisionFlags: 2 },
        platformMaterial,
        true
      )
    ]

    platforms.forEach((platform) => {
      this.platforms.push(platform)
    })

    // add stars
    const svg = this.cache.html.get('star')
    const starShape = this.third.transform.fromSVGtoShape(svg)
    const starScale = 250
    const starPositions = [
      { x: -14, y: 8.5 },
      { x: -12, y: 8.5 },
      { x: -10, y: 8.5 },
      { x: -8, y: 8.5 },
      { x: -6, y: 8.5 },
      { x: -4, y: 0 },
      { x: -2, y: 0 },
      { x: 0, y: 5.5 },
      { x: 2, y: 5.5 },
      { x: 4, y: 5.5 },
      { x: 6, y: 11.5 },
      { x: 8, y: 11.5 },
      { x: 10, y: 11.5 },
      { x: 12, y: 11.5 },
      { x: 14, y: 11.5 }
    ]
    starPositions.forEach((pos, i) => {
      const star = this.third.add.extrude({ shape: starShape[0], depth: 120 })
      star.name = `star-${i}`
      star.scale.set(1 / starScale, 1 / -starScale, 1 / starScale)
      star.material.color.setHex(0xffd851)
      star.position.setX(pos.x)
      star.position.setY(pos.y)
      this.third.physics.add.existing(star, {
        shape: 'box',
        ignoreScale: true,
        width: 0.5,
        height: 0.5,
        depth: 0.5
      })
      star.body.setCollisionFlags(6)
      this.stars.push(star)
    })

    /**
     * Model by Tomás Laulhé (https://www.patreon.com/quaternius), modifications by Don McCurdy (https://donmccurdy.com)
     * https://threejs.org/examples/#webgl_animation_skinning_morph
     * CC-0 license
     */
    // add robot
    this.robot = new Player(this)

    //create enemy
    for (let i = 0; i < 20; i++) new Enemy(this)
  }

  update(time, delta) {
    // rotate the starts
    // (this looks strange I know, I will try to improve this in a future update)
    this.stars.forEach((star) => {
      if (!star.userData.dead) {
        star.rotation.y += 0.03
        star.body.needUpdate = true
      }
    })

    this.platforms.forEach((platform) => {
      if (platform.getType() === 'moving') {
        platform.update(this, time)
      }
    })

    this.robot.update(this)
    /*if (this.robot && this.robot.body) {
      // add just the camera position
      this.third.camera.position.copy(this.robot.position).add(new THREE.Vector3(0, 5, 16))

      // get rotation of robot
      const theta = this.robot.world.theta
      this.robot.body.setAngularVelocityY(0)

      // set the speed variable
      const speed = 7

      // move left
      if (this.keys.a.isDown) {
        this.robot.body.setVelocityX(-speed)
        if (theta > -(Math.PI / 2)) this.robot.body.setAngularVelocityY(-10)
        this.walkAnimation()
      }
      // move right
      else if (this.keys.d.isDown) {
        this.robot.body.setVelocityX(speed)
        if (theta < Math.PI / 2) this.robot.body.setAngularVelocityY(10)
        this.walkAnimation()
      }
      // do not move
      else {
        this.robot.body.setVelocityX(0)
        this.idleAnimation()
      }

      // jump
      if (this.keys.w.isDown && this.robot.userData.onGround && Math.abs(this.robot.body.velocity.y) < 1e-1) {
        this.robot.animation.play('WalkJump')
        this.robot.body.applyForceY(16)
      }
    }*/
  }
}
