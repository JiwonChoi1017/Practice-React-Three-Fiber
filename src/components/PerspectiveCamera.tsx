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

const PerspectiveCamera = () => {
  return (
    <div className={classes.canvas}>
      {/* 
        fov: Field Of Viewの略. 
            カメラの位置らか見えるシーンの範囲.
            例えば人間はおよそ180度のfov（視野角）を持つが、
            鳥類は360度のfovを持つ場合もある.
            通常の設定では60 ~ 90度の設定が選ばれる.
        near: カメラのどのくらい近くから描画を開始するかを指定. nearより手前にあるものはレンダリングされない.
              0.0001みたいな異常値はバグの原因になるので、使用しないこと.
        far: 撮影範囲の最大距離. farより遠くのものはレンダリングされない.
              9999999みたいな異常値はz-fightingの原因になるので、使用しないこと.
      */}
      <Canvas camera={{ position: [2, 2, 2], fov: 75, near: 0.1, far: 100 }}>
        <Cube />
      </Canvas>
    </div>
  );
};

export default PerspectiveCamera;
