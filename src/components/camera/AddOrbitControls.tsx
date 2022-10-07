/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import { Sizes } from "../../Common";
import classes from "../../styles/Global.module.css";

/**
 * Props.
 */
interface Props {
  sizes: Sizes;
}

/**
 * キューブ.
 * @return Cube
 */
const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!cubeRef.current) {
      return;
    }
  });

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1, 5, 5, 5]} />
      <meshBasicMaterial color="#e91e63" />
    </mesh>
  );
  return object;
};

/**
 * AddOrbitControls:  カメラコントローラー
 * @param {object} sizes 画面サイズ
 * @return AddOrbitControls
 */
const AddOrbitControls = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
      >
        <Cube />
        <OrbitControls target={[0, -1, 0]} enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default AddOrbitControls;
