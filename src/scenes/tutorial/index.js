import Phaser from "phaser";
import logoImg from "@/assets/logo.png";

export class Tutorial extends Phaser.Scene {
  constructor() {
    super("Tutorial Scene");
  }

  preload() {
    console.log("loaded");
    this.load.image("logo", logoImg);
  }

  create() {
    this.scene.start("MainMenuScene");
  }
}
