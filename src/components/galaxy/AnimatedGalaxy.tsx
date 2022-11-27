/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import React, { useEffect, useRef } from "react";

import { OrbitControls } from "@react-three/drei";

/**
 * vertexShader.
 */
const vertexShader = `
  uniform float uSize;
  uniform float uTime;
  
  attribute float aScale;
  attribute vec3 aRandomness;

  varying vec3 vColor;
  
  void main() 
  {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Spin
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    modelPosition.xyz += aRandomness;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    // Size
    gl_PointSize = uSize * aScale;
    gl_PointSize *= (1.0 / -viewPosition.z);

    // Color
    vColor = color;
  }
`;

/**
 * fragmentShader.
 */
const fragmentShader = `
  varying vec3 vColor;
  
  void main()
  {
    // Disc
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = 1.0 - step(0.5, strength);

    // Diffuse point
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength *= 2.0;
    // strength = 1.0 - strength;

    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // Final color
    vec3 color = mix(vec3(0.0), vColor, strength);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * パーティクル.
 * @param {number} pixelRatio ピクセル比
 * @param {number} count 数
 * @param {number} radius 半径
 * @param {number} branches branches
 * @param {number} randomness randomness
 * @param {number} randomnessPower randomnessPower
 * @param {string} insideColor 内側の色
 * @param {string} outsideColor 外側の色
 * @return パーティクル.
 */
const Particles: React.FC<{
  pixelRatio: number;
  params: {
    count: number;
    radius: number;
    branches: number;
    randomness: number;
    randomnessPower: number;
    insideColor: string;
    outsideColor: string;
  };
}> = ({ pixelRatio, params }) => {
  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const scales = new Float32Array(params.count * 1);
  const randomness = new Float32Array(params.count * 3);

  const colorInside = new THREE.Color(params.insideColor);
  const colorOutside = new THREE.Color(params.outsideColor);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    const randomX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    scales[i] = Math.random();
  }

  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (!shaderMaterialRef.current) return;
    const elapsedTime = state.clock.elapsedTime;
    shaderMaterialRef.current.uniforms.uTime.value = elapsedTime;
  });

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
    bufferGeometryRef.current.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scales, 1)
    );
    bufferGeometryRef.current.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(randomness, 3)
    );
  }, []);

  return (
    <>
      <points>
        <bufferGeometry ref={bufferGeometryRef} />
        <shaderMaterial
          ref={shaderMaterialRef}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uSize: { value: 30 * pixelRatio },
          }}
        />
      </points>
    </>
  );
};

/**
 * AnimatedGalaxy.
 * @return AnimatedGalaxy.
 */
const AnimatedGalaxy = () => {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const params = useControls({
    count: {
      value: 200000,
      min: 100,
      max: 1000000,
      step: 100,
    },
    radius: {
      value: 5,
      min: 0.01,
      max: 20,
      step: 0.01,
    },
    branches: {
      value: 3,
      min: 2,
      max: 20,
      step: 1,
    },
    randomness: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.001,
    },
    randomnessPower: {
      value: 3,
      min: 1,
      max: 10,
      step: 0.001,
    },
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

  return (
    <>
      <Leva />
      <Canvas
        gl={{
          pixelRatio: pixelRatio,
        }}
        camera={{
          position: [3, 3, 3],
          fov: 75,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={["black"]} />
        <Particles pixelRatio={pixelRatio} params={params} />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default AnimatedGalaxy;
