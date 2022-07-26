import Phaser from "phaser";

export class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }
  preload() {
    console.log("Preloading");
  }

  create() {
    // create the Tilemap
    const map = this.make.tilemap({ key: "tilemap" });

    // add the tileset image we are using
    const tileset = map.addTilesetImage("standard_tiles", "base_tiles");

    // create the layers we want in the right order
    map.createStaticLayer("Background", tileset);

    // "Ground" layer will be on top of "Background" layer
    map.createStaticLayer("Ground", tileset);
  }
}
