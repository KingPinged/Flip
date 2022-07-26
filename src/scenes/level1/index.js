import Phaser from "phaser";
import logoImg from "@/assets/logo.png";

export class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
  }

  preload() {
    console.log("loaded");
    this.load.image("logo", logoImg);
  }

  create() {
    const logo = this.add.image(400, 150, "logo");

    this.tweens.add({
      targets: logo,
      y: 450,
      duration: 500,
      ease: "Power2",
      yoyo: true,
      loop: -1
    });
  }
}
