import { Scene3D } from '@enable3d/phaser-extension'

export default class menuScene extends Scene3D {
  constructor() {
    super({ key: 'MenuScene' })
  }

  preload() {
    this.load.preload('hero', '/assets/spritesheet/adventurer-Sheet.png')
    this.third.load.preload('sky', '../../assets/img/sky.png')
    this.load.html('star', '../../assets/svg/star.svg')
  }

  init() {
    this.accessThirdDimension()
  }

  create() {}
  render() {
    this.scoreText = this.add.text(32, this.cameras.main.height - 32, 'score: 0', {
      fontSize: '32px',
      fill: '#000'
    })
    // creates a nice scene
    this.third.warpSpeed()

    // adds a box
    this.third.add.box({ x: 1, y: 2 })

    this.third.camera.position.set(10, 10, 20)

    this.third.camera.lookAt(1, 2)

    // adds a box with physics
    //this.third.physics.add.box({ x: -1, y: 2 })

    // throws some random object on the scene
    //this.third.haveSomeFun()
  }

  update() {
    const pos = this.third.camera.position
    console.log(pos)
    //this.third.camera.position.set(pos.x + 0.1,pos.y,pos.z)
    // this.third.camera.lookAt(1,2)
  }
}
