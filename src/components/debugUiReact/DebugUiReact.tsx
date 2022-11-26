/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Leva, button, useControls } from "leva";
import React, { StrictMode, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

/**
 * Lights.
 * @return Lights.
 */
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
    </>
  );
};

/**
 * Objects.
 * @param {object} position 位置
 * @param {object} color 色
 * @param {object} scale 大きさ
 * @param {object} visible 表示・非表示
 * @return Objects.
 */
const Objects: React.FC<{
  position: { x: number; y: number };
  color: string;
  scale: number;
  visible: boolean;
}> = ({ position, color, scale, visible }) => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <mesh ref={sphereRef} position={[position.x, position.y, 0]}>
        <sphereGeometry />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={cubeRef} position-x={2} scale={scale} visible={visible}>
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
};

/**
 * DebugUiReact.
 * @return DebugUiReact.
 */
const DebugUiReact = () => {
  const { perfVisible } = useControls({
    perfVisible: true,
  });

  const { position, color } = useControls("sphere", {
    position: {
      // value: -2,
      value: { x: -2, y: 0 },
      // min: -4,
      // max: 4,
      step: 0.01,
      joystick: "invertY",
    },
    color: "#ff0000",
    myInterval: {
      min: 0,
      max: 10,
      value: [4, 5],
    },
    clickMe: button(() => {
      console.log("ok");
    }),
    choice: { options: ["a", "b", "c"] },
  });

  const { scale, visible } = useControls("cube", {
    scale: {
      value: 1.5,
      min: 0,
      max: 5,
      step: 0.01,
    },
    visible: true,
  });

  return (
    <StrictMode>
      <Leva collapsed />
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        {perfVisible && <Perf position="top-left" />}
        <Lights />
        <Objects
          position={position}
          color={color}
          scale={scale}
          visible={visible}
        />
        <OrbitControls makeDefault />
      </Canvas>
    </StrictMode>
  );
};

export default DebugUiReact;
