/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";

const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshNormalMaterial();

/**
 * Light.
 * @return Light
 */
const Light = () => {
  return (
    <directionalLight
      castShadow
      color="#ffffff"
      intensity={1}
      shadow-mapSize={[1024, 1024]}
      shadow-camera-far={15}
      shadow-normalBias={0.05}
      position={[0.25, 3, 2.25]}
    />
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const torusKnotRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!torusKnotRef.current) return;

    const elapsedTime = state.clock.elapsedTime;
    torusKnotRef.current.rotation.y = elapsedTime * 0.1;
  });

  return (
    <>
      <mesh castShadow position-x={-5}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial />
      </mesh>
      <mesh ref={torusKnotRef} castShadow>
        <torusKnotGeometry args={[1, 0.4, 128, 32]} />
        <meshStandardMaterial />
      </mesh>
      <mesh castShadow position-x={5}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial />
      </mesh>
      <mesh receiveShadow position-y={-2} rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial />
      </mesh>
      {[...Array(50)].map((box, idx) => {
        return (
          <mesh
            key={idx}
            geometry={boxGeometry}
            material={material}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          />
        );
      })}
    </>
  );
};

/**
 * PerformanceTips.
 * @return PerformanceTips
 */
const PerformanceTips = () => {
  return (
    <Canvas
      gl={{
        // powerPreference: "high-performance",
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      }}
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: [2, 2, 6],
      }}
      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      }}
    >
      <Perf position="top-left" />
      <color attach="background" args={["black"]} />
      <Light />
      <Objects />
      <OrbitControls />
    </Canvas>
  );
};

export default PerformanceTips;
