import Phaser from "phaser";

import config from "@/game/config";

import Player from "@/game/player";

export class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial");
  }

  update(time, delta) {
    if (this.isPlayerDead) return;

    this.player.update();
  }
  destroyTile(tile) {
    var layer = tile.tilemapLayer;
    layer.removeTileAt(tile.x, tile.y);
    tile.physics.matterBody.destroy();
  }

  smoothMoveCameraTowards(target, smoothFactor) {
    if (smoothFactor === undefined) {
      smoothFactor = 0;
    }
    this.cam.scrollX =
      smoothFactor * this.cam.scrollX +
      (1 - smoothFactor) * (target.x - this.cam.width * 0.5);
    this.cam.scrollY =
      smoothFactor * this.cam.scrollY +
      (1 - smoothFactor) * (target.y - this.cam.height * 0.5);
  }

  create() {
    const mapScale = config.mapScale;
    this.map = this.make.tilemap({ key: "map" });
    var tileset = this.map.addTilesetImage("platformer_tiles");
    var bgLayer = this.map.createLayer("Background Layer", tileset, 0, 0);
    // .setScale(mapScale);
    var groundLayer = this.map.createLayer("Ground Layer", tileset, 0, 0);
    //.setScale(mapScale);
    var fgLayer = this.map
      .createLayer("Foreground Layer", tileset, 0, 0)
      //.setScale(mapScale)
      .setDepth(1);

    // Set up the layer to have matter bodies. Any colliding tiles will be given a Matter body.
    groundLayer.setCollisionByProperty({ collides: true });

    this.player = new Player(this, 50, 50);
    this.physics.world.addCollider(this.player.sprite, groundLayer);

    //this.matter.world.convertTilemapLayer(groundLayer);

    // Change the label of the Matter body on platform tiles that should fall when the player steps
    // on them. This makes it easier to check Matter collisions.
    groundLayer.forEachTile(function (tile) {
      // In Tiled, the platform tiles have been given a "fallOnContact" property
      if (tile.properties.fallOnContact) {
        // tile.physics.matterBody.body.label = "disappearingPlatform";
      }
    });
  }
}
