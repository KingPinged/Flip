import { render } from "react-dom";
import React, { useRef, useState, useEffect } from "react";
import { useSprings, animated, useTransition, config } from "react-spring";
import "./styles.css";

import Phaser from "phaser";

import { MyGame } from "./game";

//scenes
import { Tutorial, Level1, BootScene } from "@/scenes";

import { calculateGameSize } from "@/utils/calculateDimensions";

const { width, height, multiplier } = calculateGameSize();

const startText = "A game made by Team 5";

function Viewpager() {
  const [gameReady, setGameReady] = useState(false);

  const NUM_TRANS = startText.length;
  const [items, setItems] = useState(startText.split(" "));

  const transitions = useTransition(items, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0, position: "absolute" },
    delay: 200,
    trail: 500,
    config: config.molasses
  });

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      title: "some-game-title",
      parent: "gameBox",
      orientation: Phaser.Scale.LANDSCAPE,
      localStorageName: "some-game-title",
      width,
      height,
      autoRound: true,
      pixelArt: true,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        mode: Phaser.Scale.ENVELOP
      },
      scene: [BootScene, Tutorial, Level1],
      //scene: [BootScene, MainMenuScene, GameScene, GameOverScene],
      physics: {
        default: "arcade"
      },
      backgroundColor: "#000000"
    });
  }, []);

  return (
    <>
      <div
        id={"gameBox"}
        className={"gameContainer"}
        style={
          gameReady
            ? { visibility: "visible", position: "absolute" }
            : { visibility: "hidden", position: "absolute" }
        }
      />
      {/* This is the initial game loading*/}
      <div
        onClick={() => setGameReady(true)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          visibility: gameReady ? "hidden" : "visible"
        }}
      >
        {transitions(({ opacity }, item, t, index) => (
          <animated.div
            key={index}
            style={{
              textAlign: "center",
              opacity: opacity
            }}
          >
            {" " + item}
          </animated.div>
        ))}
      </div>
      {/* container for the game */}
    </>
  );
}

render(<Viewpager />, document.getElementById("root"));
