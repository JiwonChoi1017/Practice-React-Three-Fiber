/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";
import textureUrl from "../../assets/textures/particles/2.png";

/**
 * オブジェクト.
 * @return オブジェクト.
 */
const Objects = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const texture = useTexture(textureUrl);

  const count = 20000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    colors[i] = Math.random();
  }
  useEffect(() => {
    if (!pointsRef.current) return;

    pointsRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    pointsRef.current.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    if (!pointsRef.current) return;
    pointsRef.current.position.y = -elapsedTime * 0.02;
    // pointsRef.current.rotation.y = elapsedTime * 0.02;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry />
        {/* pointsMaterial: パーティクル作成時に使用するクラス. */}
        <pointsMaterial
          size={0.1}
          // color="#ff88cc"
          transparent={true}
          alphaMap={texture}
          // alphaTest={0.001}
          // depthTest={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          sizeAttenuation={true}
        />
      </points>
    </>
  );
};

/**
 * Particles.
 * @param {object} sizes 画面サイズ
 * @return Particles.
 */
const Particles = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          position: [1, 1, 2],
          fov: 75,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={["black"]} />
        <Objects />
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default Particles;
