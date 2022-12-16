/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as THREE from "three";

import { Canvas, extend, useFrame } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Sparkles,
  shaderMaterial,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import React, { useRef } from "react";

import portalFragmentShader from "./shaders/portal/fragment";
import portalVertexShader from "./shaders/portal/vertex";

/**
 * ShaderMaterialType.
 */
type ShaderMaterialType = typeof THREE.ShaderMaterial & { key: string };

/**
 * PortalMaterial.
 */
const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new THREE.Color("#ffffff"),
    uColorEnd: new THREE.Color("#000000"),
  },
  portalVertexShader,
  portalFragmentShader
) as ShaderMaterialType;

extend({ PortalMaterial });

/**
 * Model.
 * @return Model
 */
const Model = () => {
  const portalMaterialRef = useRef<ShaderMaterialType>(null);
  const bakedTexture = useTexture("./models/Portal/baked.jpg");
  // @ts-ignore
  const { nodes } = useGLTF("./models/Portal/portal_baked.glb");

  useFrame((state, delta) => {
    if (!portalMaterialRef.current) return;
    // @ts-ignore
    portalMaterialRef.current.uTime += delta;
  });

  return (
    <Center>
      {/* emit以外のモデル */}
      <mesh geometry={nodes.baked.geometry}>
        <meshBasicMaterial map={bakedTexture} map-flipY={false} />
      </mesh>
      {/* emit */}
      <mesh
        geometry={nodes.poleLightA.geometry}
        position={nodes.poleLightA.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>
      <mesh
        geometry={nodes.poleLightB.geometry}
        position={nodes.poleLightB.position}
      >
        <meshBasicMaterial color="#ffffe5" />
      </mesh>
      <mesh
        geometry={nodes.portalLight.geometry}
        position={nodes.portalLight.position}
        rotation={nodes.portalLight.rotation}
      >
        {/* @ts-ignore */}
        <portalMaterial ref={portalMaterialRef} />
      </mesh>
      <Sparkles
        size={6}
        scale={[4, 2, 4]}
        position-y={1}
        speed={0.2}
        count={40}
      />
    </Center>
  );
};

/**
 * Portal.
 * @return Portal
 */
const Portal = () => {
  return (
    <Canvas
      flat
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [1, 2, 6],
      }}
    >
      <color attach="background" args={["#201919"]} />
      <Model />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default Portal;
