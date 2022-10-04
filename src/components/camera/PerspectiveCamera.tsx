/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Cursor, Sizes } from "../../Common";
import React, { useRef } from "react";

/**
 * Props.
 */
interface Props {
  sizes: Sizes;
  cursor: Cursor;
  onChangeCursor: (event: React.PointerEvent<HTMLDivElement>) => void;
}

/**
 * カーソルの状態を更新する.
 * @param {event} event イベント
 * @param {function} onChangeCursor カーソルの状態を更新するメソッド
 */
const ChangeCursorHandler = (
  event: React.PointerEvent<HTMLDivElement>,
  onChangeCursor: (event: React.PointerEvent<HTMLDivElement>) => void
) => {
  onChangeCursor(event);
};

/**
 * キューブ.
 * @param {object} cursor カーソル位置
 * @return Cube
 */
const Cube: React.FC<{ cursor: Cursor }> = ({ cursor }) => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!cubeRef.current) {
      return;
    }

    // state.camera.position.x = cursor.x * 10;
    // state.camera.position.y = cursor.y * 10;

    state.camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    state.camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    state.camera.position.y = cursor.y * 5;
    state.camera.lookAt(cubeRef.current.position);
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
 * PerspectiveCamera: 奥行を見渡せる遠近法のカメラ
 * @param {object} sizes 画面サイズ
 * @param {object} cursor カーソル位置
 * @param {function} onChangeCursor カーソル位置を変更
 * @return PerspecticeCamera
 */
const PerspectiveCamera = ({ sizes, cursor, onChangeCursor }: Props) => {
  return (
    <div style={{ width: sizes.width, height: sizes.height }}>
      {/* 
        fov: Field Of Viewの略. 
            カメラの位置から見えるシーンの範囲.
            例えば人間はおよそ180度のfov（視野角）を持つが、
            鳥類は360度のfovを持つ場合もある.
            通常の設定では60 ~ 90度の設定が選ばれる.
        near: カメラのどのくらい近くから描画を開始するかを指定. nearより手前にあるものはレンダリングされない.
              0.0001みたいな異常値はバグの原因になるので、使用しないこと.
        far: 撮影範囲の最大距離. farより遠くのものはレンダリングされない.
              9999999みたいな異常値はz-fightingの原因になるので、使用しないこと.
      */}
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
        onPointerMove={(event) => ChangeCursorHandler(event, onChangeCursor)}
      >
        <Cube cursor={cursor} />
      </Canvas>
    </div>
  );
};

export default PerspectiveCamera;
