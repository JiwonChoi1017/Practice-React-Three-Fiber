/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import React, { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import classes from "../styles/Global.module.css";

const Cube = (props: { position: THREE.Vector3; color: string }) => {
  // meshのプロパティのメソッドを呼び出したい場合
  // useRef()を定義し、hookの中で呼び出すようにする.
  const cubeRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    // normalize(正規化):単位ベクトル（長さが1のベクトル）へ変換.
    // 大きさの情報が必要ない場合、単位ベクトルへ直しておくと扱いやすくなるそう.
    // cubeRef.current?.position.normalize();
  }, []);

  const object = (
    // mesh
    //  position:中心座標. x, y, z軸順.
    //  scale:大きさ. x, y, z軸順. デフォルト値は[1, 1, 1]
    //  rotation:回転. x, y, z軸順.
    //           値を指定したい場合は Math.PI * X.XX OR Math.PI / X みたいな感じで書くこと.
    <mesh
      ref={cubeRef}
      position={props.position}
      // position={[0.7, -0.6, 1]}
      // scale={[2, 0.5, 0.5]}
      // rotation={[Math.PI * 0.25, Math.PI * 0.25, 0]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={props.color} />
    </mesh>
  );
  return object;
};

const TransformObject = () => {
  return (
    <div className={classes.canvas}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        {/* group:グループ単位で制御できる */}
        <group position={[0, 1, 0]} scale={[1, 2, 1]} rotation={[0, 1, 0]}>
          <Cube position={new THREE.Vector3(0, 0, 0)} color="#e91e63" />
          <Cube position={new THREE.Vector3(-2, 0, 0)} color="#94ff79" />
          <Cube position={new THREE.Vector3(2, 0, 0)} color="#6fecff" />
        </group>
        {/* 座標軸を表示. x軸は赤、y軸は緑、z軸は青. */}
        {/* scaleプロパティでサイズを調整可能 */}
        <axesHelper scale={2} />
      </Canvas>
    </div>
  );
};

export default TransformObject;
