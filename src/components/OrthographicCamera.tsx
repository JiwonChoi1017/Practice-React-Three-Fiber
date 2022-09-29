/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

import classes from "../styles/Global.module.css";

const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (!cubeRef.current) {
      return;
    }
    state.camera.lookAt(cubeRef.current.position);
    cubeRef.current.rotation.y = elapsedTime;
  });

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1, 5, 5, 5]} />
      <meshBasicMaterial color="#e91e63" />
    </mesh>
  );
  return object;
};

const OrthographicCamera = () => {
  // 任意の値を入れている
  const aspectRatio = 880 / 820;
  return (
    <div className={classes.canvas}>
      <Canvas
        orthographic
        camera={{
          zoom: 300,
          position: [2, 2, 2],
          left: -1 * aspectRatio,
          right: 1 * aspectRatio,
          top: 1,
          bottom: -1,
          near: 0.1,
          far: 100,
        }}
      >
        <Cube />
      </Canvas>
    </div>
  );
};

export default OrthographicCamera;
