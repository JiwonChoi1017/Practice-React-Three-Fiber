/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as THREE from "three";

import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { OrbitControls, meshBounds, useGLTF } from "@react-three/drei";
import React, { useRef } from "react";

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <directionalLight position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />
    </>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const eventHandle = (event: ThreeEvent<MouseEvent>) => {
    if (!cubeRef.current) return;
    const cubeMaterial = cubeRef.current.material as THREE.MeshStandardMaterial;
    cubeMaterial.color.set(`hsl(${Math.random() * 360}, 100%, 75%)`);
  };

  useFrame((state, delta) => {
    if (!cubeRef.current) return;
    cubeRef.current.rotation.y += delta * 0.2;
  });

  // @ts-ignore
  const { nodes } = useGLTF("./models/Hamburger/glTF-Binary/Hamburger.glb");

  // なぜかprimitiveだとうまくいかなかったため、あえてこういう書き方にした
  const hamburgerMeshes = nodes.Scene.children as THREE.Mesh[];
  const Hamburger = hamburgerMeshes.map((item) => {
    return (
      <mesh
        key={item.uuid}
        geometry={item.geometry}
        material={item.material}
        position={item.position}
        rotation={item.rotation}
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    );
  });
  return (
    <>
      <mesh
        position-x={-2}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <sphereGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <mesh
        ref={cubeRef}
        raycast={meshBounds}
        position-x={2}
        scale={1.5}
        // onClick={(event) => {
        // onContextMenu={(event) => {
        // onDoubleClick={(event) => {
        // onPointerUp={(event) => {
        // onPointerDown={(event) => {
        // onPointerOver={(event) => {
        onClick={(event) => {
          // onPointerOut={(event) => {
          // onPointerLeave={(event) => {
          // onPointerLeave={(event) => {
          // onPointerMove={(event) => {
          // onPointerMissed={(event) => {
          eventHandle(event);
        }}
        onPointerEnter={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry />
        <meshStandardMaterial color="mediumpurple" />
      </mesh>
      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>
      <group position-y={0.5} scale={0.25}>
        ${Hamburger}
      </group>
    </>
  );
};

/**
 * MouseEvents.
 * @return MouseEvents
 */
const MouseEvents = () => {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Lights />
      <Objects />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default MouseEvents;
