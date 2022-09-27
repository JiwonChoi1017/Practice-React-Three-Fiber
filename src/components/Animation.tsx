/* eslint-disable react/no-unknown-property */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";

import classes from "../styles/Global.module.css";
import gsap from "gsap";

const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  // useFrame: 1フレームごとにコールバック関数をトリガーする.
  //           1フレーム = 60fps(1秒間に60回処理)
  useFrame((state) => {
    if (!cubeRef.current) {
      return;
    }

    // useFrameを使うことでstateのclockにアクセスできる.
    // getElapsedTime(): clockが生成されてからの経過時間
    // const elapsedTime = state.clock.getElapsedTime();

    // cubeRef.current.position.x += 0.01;
    // cubeRef.current.rotation.y += 0.01;

    // cubeRef.current.position.y = elapsedTime;
    // sin(x): 0からスタートし、上下に動く
    // cubeRef.current.position.y = Math.sin(elapsedTime);
    // cos(x): 一番上からスタートし、上下に動く
    // cubeRef.current.position.x = Math.cos(elapsedTime);

    // すごいスピードで回転させる.
    // cubeRef.current.rotation.y = elapsedTime * Math.PI * 2;

    // 上記のcubeRef.current.position.yと似たような動きをする
    // state.camera.position.y = Math.sin(elapsedTime);
    // state.camera.position.x = Math.cos(elapsedTime);
    // lookAt(): 原点座標（0, 0, 0）を指定する
    // 上記のコードと組み合わせて、指定したオブジェクトを中心としてカメラを回転させることも可能.
    // state.camera.lookAt(cubeRef.current.position);
  });

  useEffect(() => {
    if (!cubeRef.current) {
      return;
    }
    // to: ゴールの状態を指定する（現在の状態からのアニメーション）
    gsap.to(cubeRef.current.position, { duration: 1, delay: 1, x: 2 });
    gsap.to(cubeRef.current.position, { duration: 1, delay: 2, x: 0 });
  }, []);

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#e91e63" />
    </mesh>
  );
  return object;
};

const Animation = () => {
  return (
    <div className={classes.canvas}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Cube />
      </Canvas>
    </div>
  );
};

export default Animation;
