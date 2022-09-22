/* eslint-disable react/no-unknown-property */

import { Canvas } from "@react-three/fiber";
import React from "react";
import classes from "../styles/Global.module.css";

const Cube = () => {
  const object = (
    // mesh: 3D空間に表示するメッシュ
    // 形状とマテリアルを結合したものである
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#e91e63" />
    </mesh>
  );
  // @react-three/fiberの場合、scene.add()は不要っぽい
  return object;
};

const Basic = () => {
  return (
    <div className={classes.canvas}>
      {/* Canvasの中に3D空間を描画 */}
      <Canvas camera={{ position: [1, 1, 3] }}>
        <Cube />
      </Canvas>
    </div>
  );
};

export default Basic;
