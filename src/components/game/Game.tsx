/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";

import Effects from "./Effects";
import Interface from "./Interface";
import { KeyboardControls } from "@react-three/drei";
import { Level } from "./Level";
import { Physics } from "@react-three/rapier";
import Player from "./Player";
import useGame from "../../stores/useGame";

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.position.z = state.camera.position.z + 1 - 4;
    lightRef.current.target.position.z = state.camera.position.z - 4;
    lightRef.current.target.updateMatrixWorld();
  });

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        position={[4, 4, 1]}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={10}
        shadow-camera-right={10}
        shadow-camera-bottom={-10}
        shadow-camera-left={-10}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};

/**
 * Game.
 * @return Game
 */
const Game = () => {
  const map = useMemo(
    () => [
      { name: "forward", keys: ["ArrowUp", "KeyW"] },
      { name: "backward", keys: ["ArrowDown", "KeyS"] },
      { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
      { name: "rightward", keys: ["ArrowRight", "KeyD"] },
      { name: "jump", keys: ["Space"] },
    ],
    []
  );

  const blocksCount = useGame((state) => state.blocksCount);
  const blocksSeed = useGame((state) => state.blocksSeed);

  return (
    <KeyboardControls
      map={map}
      onChange={() => {
        //
      }}
    >
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2.5, 4, 6],
        }}
      >
        <color args={["#252731"]} attach="background" />
        <Physics>
          <Lights />
          <Level count={blocksCount} seed={blocksSeed} />
          <Player />
        </Physics>
        <Effects />
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
};

export default Game;
