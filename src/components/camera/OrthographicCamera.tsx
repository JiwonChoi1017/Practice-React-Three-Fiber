/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";

/**
 * キューブ.
 * @return Cube
 */
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

/**
 * OrthographicCamera: 平行投影を表現できるカメラ
 * <p>
 * オブジェクトの大きさが位置によって変化しない状態.
 * どこからみても同じ大きさになる.
 * </p>
 *
 * @param {object} sizes 画面サイズ
 * @return OrthographicCamera
 */
const OrthographicCamera = ({ sizes }: Props) => {
  const aspectRatio = sizes.width / sizes.height;
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      {/* 
        zoom: zoomプロパティを使用することで、シーンにズームイン・ズームアウトすることができる.
              1より小さい値を設定するとズームアウト、1より大きい値を設定するとズームイン.
              負の値を設定すると上下逆に描画される.
        left: カメラ中心座標からの左側の長さ
        right: カメラ中心座標からの右側の長さ
        top: カメラ中心座標からの上側の長さ
        bottom: カメラ中心座標からの下側の長さ
        near: カメラのどのくらい近くから描画を開始するかを指定. nearより手前にあるものはレンダリングされない.
              0.0001みたいな異常値はバグの原因になるので、使用しないこと.
        far: 撮影範囲の最大距離. farより遠くのものはレンダリングされない.
              9999999みたいな異常値はz-fightingの原因になるので、使用しないこと.
      */}
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
