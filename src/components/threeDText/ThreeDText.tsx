/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { OrbitControls, Text3D, useTexture } from "@react-three/drei";
import React, { Suspense, useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";
import matcapTextureUrl from "../../assets/textures/matcaps/3.png";
import { useMemo } from "react";

/**
 * オブジェクト.
 * @return オブジェクト.
 */
const Objects = () => {
  return (
    <>
      <Text />
      <Torus />
    </>
  );
};

/**
 * トーラス.
 * @return トーラス.
 */
const Torus = () => {
  const torus = [];
  for (let i = 0; i < 100; i++) {
    const scaleValue = Math.random();
    torus.push(
      <mesh
        key={`torus_${i}`}
        position={[
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ]}
        rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
        scale={[scaleValue, scaleValue, scaleValue]}
      >
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <MatcapMaterial />
      </mesh>
    );
  }
  return <>{torus}</>;
};

/**
 * テキスト.
 * @return テキスト.
 */
const Text = () => {
  const fontRef = useRef<THREE.Mesh>(null);
  const config = useMemo(
    () => ({
      size: 0.5,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    }),
    []
  );

  useEffect(() => {
    if (!fontRef.current) {
      return;
    }
    const textGeometry = fontRef.current.geometry;
    // ジオメトリをセンターリング.
    // textGeometry.computeBoundingBox();
    // if (!textGeometry.boundingBox) {
    //   return;
    // }
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // );
    //
    textGeometry.center();
  }, []);

  return (
    // publicフォルダの配下じゃないと読み込めないみたい.
    <Text3D
      ref={fontRef}
      font={"/fonts/helvetiker_regular.typeface.json"}
      {...config}
    >
      choichoi!
      <MatcapMaterial />
    </Text3D>
  );
};

/**
 * MatcapMaterial.
 * @return MatcapMaterial.
 */
const MatcapMaterial = () => {
  const matcapTexture = useTexture(matcapTextureUrl);
  return <meshMatcapMaterial matcap={matcapTexture} />;
};

/**
 * 3D Text.
 * @param {object} sizes 画面サイズ
 * @return 3D Text
 */
const ThreeDText = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <Suspense>
          <Objects />
        </Suspense>
        <axesHelper />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default ThreeDText;
