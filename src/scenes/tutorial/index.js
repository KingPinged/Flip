import Phaser from "phaser";
import logoImg from "@/assets/logo.png";

export class Tutorial extends Phaser.Scene {
  constructor() {
    super();
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
