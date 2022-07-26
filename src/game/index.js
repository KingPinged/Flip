import Phaser from "phaser";


export class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image('Tiles', 'assests/tiles.png')
    this.load.tilemapTiledJSON('tilemap', 'assests/newMap.json')               
  }

  create() {
    //this.add.image(0,0,'testPhaserMap')
    const map = this.make.tilemap({ key: 'tilemap' })
    const tileset = map.addTilesetImage('standard_tiles', 'Tiles')
   
    map.createStaticLayer('Background', tileset)
    //map.createStaticLayer('Ground', tileset)
    }

  
}
