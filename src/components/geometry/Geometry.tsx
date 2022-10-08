/* eslint-disable react/no-unknown-property */

import React, { useRef } from "react";

import { Canvas } from "@react-three/fiber";
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
 * @return キューブ.
 */
const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  // const positionArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
  const count = 500;
  const positionArray = new Float32Array(count * 3 * 3);

  for (let i = 0; i < count * 3 * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 4;
  }

  const object = (
    <mesh ref={cubeRef}>
      {/* <boxGeometry args={[1, 1, 1, 4, 4, 4]} /> */}
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positionArray.length / 3}
          array={positionArray}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial color="#e91e63" wireframe={true} />
    </mesh>
  );
  return object;
};

/**
 * Geometry.
 * @param {object} sizes 画面サイズ
 * @return Geometry.
 */
const Geometry = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Geometry;
