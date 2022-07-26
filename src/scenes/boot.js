import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    const fontSize = 16;

    // setup loading bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    const { width: gameWidth, height: gameHeight } = this.cameras.main;

    const barPositionX = Math.ceil((gameWidth - gameWidth * 0.7) / 2);
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(
      barPositionX,
      Math.ceil(gameHeight / 6),
      Math.ceil(gameWidth * 0.7),
      Math.ceil(gameHeight / 10)
    );

    const loadingText = this.add.text(
      gameWidth / 2,
      Math.ceil(gameHeight / 10),
      "loading...",
      {
        fontFamily: '"Press Start 2P"',
        fontSize: `${fontSize}px`,
        size: `${fontSize}px`,
        fill: "#ffffff",
        color: "#ffffff"
      }
    );

    loadingText.setOrigin(0.5);
    loadingText.setResolution(30);

    const percentText = this.add.text(
      gameWidth / 2,
      Math.ceil(gameHeight / 6 + fontSize / 2 + gameHeight / 60),
      "0%",
      {
        fontFamily: '"Press Start 2P"',
        fontSize: `${fontSize}px`,
        size: `${fontSize}px`,
        fill: "#ffffff",
        color: "#ffffff"
      }
    );

    percentText.setOrigin(0.5);
    percentText.setResolution(30);

    const assetText = this.add.text(
      gameWidth / 2,
      Math.ceil(gameHeight / 3),
      "",
      {
        fontFamily: '"Press Start 2P"',
        fontSize: `${fontSize / 2}px`,
        size: `${fontSize / 2}px`,
        fill: "#ffffff",
        color: "#ffffff"
      }
    );

    assetText.setOrigin(0.5);
    assetText.setResolution(30);

    this.load.on("progress", (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(
        barPositionX,
        Math.ceil(gameHeight / 6),
        Math.ceil(gameWidth * 0.7) * value,
        Math.ceil(gameHeight / 10)
      );
      percentText.setText(`${Number.parseInt(value * 100, 10)}%`);
    });

    this.load.on("fileprogress", (file) => {
      assetText.setText(`loading: ${file.key}`);
    });

    this.load.on("complete", () => {
      progressBar.destroy();
      progressBox.destroy();
      percentText.destroy();
      assetText.destroy();
    });
  }

  create() {
    this.scene.start("Tutorial");
  }
}
