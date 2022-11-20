/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef } from "react";

import { OrbitControls } from "@react-three/drei";

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
    </>
  );
};

/**
 * CustomObject.
 * @return CustomObject
 */
const CustomObject = () => {
  const verticesCount = 10 * 3;

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);

    for (let i = 0; i < verticesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);

  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (!geometryRef.current) return;
    geometryRef.current.computeVertexNormals();
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!cubeRef.current || !groupRef.current) return;
    cubeRef.current.rotation.y += delta;
    // groupRef.current.rotation.y += delta;
    // const angle = state.clock.elapsedTime;
    // state.camera.position.x = Math.sin(angle) * 8;
    // state.camera.position.z = Math.cos(angle) * 8;
    // state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={groupRef}>
        <mesh position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <mesh
          ref={cubeRef}
          position-x={2}
          rotation-y={Math.PI * 0.25}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="mediumpurple"
            // wireframe
          />
        </mesh>
      </group>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
    </>
  );
};

/**
 * Tutorial.
 * @return Tutorial
 */
const Tutorial = () => {
  return (
    <Canvas
      // orthographic
      // flat
      dpr={[1, 2]}
      gl={{
        // antialias（アンチエイリアス）: 物体の輪郭がギザギザになることを抑える処理.
        // trueにすると、物体の輪郭が滑らかになるが、計算量が増え、動作が重くなる場合がある.
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
      }}
      camera={{
        fov: 45,
        // zoom: 100,
        near: 0.1,
        far: 200,
        position: [3, 2, 6],
      }}
    >
      <Lights />
      <CustomObject />
      <Objects />
      <OrbitControls />
    </Canvas>
  );
};

export default Tutorial;
