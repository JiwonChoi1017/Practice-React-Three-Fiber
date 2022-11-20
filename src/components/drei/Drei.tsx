/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import {
  Float,
  Html,
  MeshReflectorMaterial,
  OrbitControls,
  PivotControls,
  Text,
  TransformControls,
} from "@react-three/drei";
import React, { useRef } from "react";

import { Canvas } from "@react-three/fiber";
import classes from "../../styles/Global.module.css";

/**
 * Lights.
 * @return Lights.
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
 * Objects.
 * @return Objects.
 */
const Objects = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  return (
    <>
      <PivotControls
        anchor={[0, 0, 0]}
        depthTest={false}
        lineWidth={4}
        axisColors={["#9381ff", "#ff4d6d", "#7ad582"]}
        scale={100}
        fixed={true}
      >
        <mesh ref={sphereRef} position-x={-2}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html
            position={[1, 1, 0]}
            wrapperClass={classes.label}
            center
            distanceFactor={6}
            occlude={[sphereRef, cubeRef]}
          >
            That&apos;s a sphere 👍
          </Html>
        </mesh>
      </PivotControls>
      <TransformControls
        position-x={2}
        // mode="rotate"
      >
        <mesh ref={cubeRef} scale={1.5}>
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </TransformControls>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        {/* <meshStandardMaterial color="greenyellow" /> */}
        <MeshReflectorMaterial
          resolution={512}
          blur={[1000, 1000]}
          mixBlur={1}
          mirror={0.75}
          color="greenyellow"
        />
      </mesh>
      <Float speed={5} floatIntensity={2}>
        <Text
          font="./fonts/bangers-v20-latin-regular.woff"
          fontSize={1}
          color="salmon"
          position-y={2}
          maxWidth={2}
          textAlign="center"
        >
          I LOVE R3F
        </Text>
      </Float>
    </>
  );
};

/**
 * Drei.
 * @return Drei.
 */
const Drei = () => {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        outputEncoding: THREE.sRGBEncoding,
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Lights />
      <Objects />
      {/* makeDefaultをつけ、defaultのカメラを同期する. */}
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Drei;
