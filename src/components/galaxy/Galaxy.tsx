/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import DatGui, { DatColor, DatNumber } from "react-dat-gui";
import React, { useEffect, useRef, useState } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";

/**
 * パーティクル.
 * @param {number} count 数
 * @param {number} size サイズ
 * @param {number} radius 半径
 * @param {number} branches branches
 * @param {number} spin spin
 * @param {number} randomness randomness
 * @param {number} randomnessPower randomnessPower
 * @param {string} insideColor 内側の色
 * @param {string} outsideColor 外側の色
 * @return パーティクル.
 */
const Particles: React.FC<{
  params: {
    count: number;
    size: number;
    radius: number;
    branches: number;
    spin: number;
    randomness: number;
    randomnessPower: number;
    insideColor: string;
    outsideColor: string;
  };
}> = ({ params }) => {
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const spinAngle = radius * params.spin;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = 0 + randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (!bufferGeometryRef.current) return;
    bufferGeometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    bufferGeometryRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );
  }, []);

  return (
    <>
      <points>
        <bufferGeometry ref={bufferGeometryRef} />
        <pointsMaterial
          size={params.size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
    </>
  );
};

/**
 * Galaxy.
 * @param {object} sizes 画面サイズ
 * @return Galaxy.
 */
const Galaxy = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    count: 100000,
    size: 0.01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

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
        <Particles params={params} />
        <OrbitControls enableDamping={true} />
      </Canvas>
      <DatGui data={params} onUpdate={setParams} style={{ width: 400 }}>
        <DatNumber path="count" min={100} max={1000000} step={100} />
        <DatNumber path="size" min={0.001} max={0.1} step={0.001} />
        <DatNumber path="radius" min={0.01} max={20} step={0.01} />
        <DatNumber path="branches" min={2} max={20} step={1} />
        <DatNumber path="spin" min={-5} max={5} step={0.001} />
        <DatNumber path="randomness" min={0} max={2} step={0.001} />
        <DatNumber path="randomnessPower" min={1} max={10} step={0.001} />
        <DatColor path="insideColor" />
        <DatColor path="outsideColor" />
      </DatGui>
    </div>
  );
};

export default Galaxy;
