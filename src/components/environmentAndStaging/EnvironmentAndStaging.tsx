/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import {
  AccumulativeShadows,
  BakeShadows,
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RandomizedLight,
  Sky,
  Stage,
  softShadows,
  useHelper,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Leva, useControls } from "leva";
import React, { useRef } from "react";

import { Perf } from "r3f-perf";

// type Props = {
//   gl: THREE.WebGLRenderer;
//   scene: THREE.Scene;
// };

// const createdHandler = ({ gl, scene }: Props) => {
//   // gl.setClearColor("#ff0000", 1);
//   scene.background = new THREE.Color("red");
// };

// softShadows({
//   frustum: 3.75,
//   size: 0.005,
//   near: 9.5,
//   samples: 17,
//   rings: 11,
// });

/**
 * Lights.
 * @return Lights
 */
const Lights: React.FC<{
  params: {
    color: string;
    opacity: number;
    blur: number;
  };
  sunPosition: [number, number, number];
}> = ({ params, sunPosition }) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);

  return (
    <>
      {/* <AccumulativeShadows
        position={[0, -0.99, 0]}
        scale={10}
        color="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal
        blend={100}
      >
        <RandomizedLight
          amount={8}
          radius={1}
          ambient={0.5}
          intensity={1}
          position={[1, 2, 3]}
          bias={0.001}
        />
      </AccumulativeShadows> */}
      {/* <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        resolution={512}
        far={5}
        frames={1}
        {...params}
      /> */}
      {/* <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        ref={directionalLightRef}
        position={sunPosition}
        intensity={1.5}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={10}
        shadow-camera-top={5}
        shadow-camera-right={5}
        shadow-camera-bottom={-5}
        shadow-camera-left={-5}
      /> */}
    </>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects: React.FC<{
  envMapParams: {
    envMapIntensity: number;
    envMapHeight: number;
    envMapRadius: number;
    envMapScale: number;
  };
}> = ({ envMapParams }) => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!cubeRef.current) return;
    // const elapsedTime = state.clock.elapsedTime;
    // cubeRef.current.position.x = 2 + Math.sin(elapsedTime);
    cubeRef.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      {/* <Environment
        // background: 周囲にテクスチャを表示
        background
        // files: カスタムテクスチャのロード時に使用
        // files={
        //   //   [
        //   //   "./textures/environmentMaps/2/px.jpg",
        //   //   "./textures/environmentMaps/2/nx.jpg",
        //   //   "./textures/environmentMaps/2/py.jpg",
        //   //   "./textures/environmentMaps/2/nx.jpg",
        //   //   "./textures/environmentMaps/2/pz.jpg",
        //   //   "./textures/environmentMaps/2/nz.jpg",
        //   // ]
        //   "./textures/environmentMaps/the_sky_is_on_fire_2k.hdr"
        // }
        // preset: あらかじめ用意されているテクスチャが指定できる
        preset="sunset"
        ground={{
          height: envMapParams.envMapHeight,
          radius: envMapParams.envMapRadius,
          scale: envMapParams.envMapScale,
        }}
        // resolution={32}
      > */}
      {/* <color args={["#000000"]} attach="background" /> */}
      {/* <mesh position-z={-5} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color={[10, 0, 0]} />
        </mesh> */}
      {/* <Lightformer
          position-z={-5}
          scale={10}
          color="red"
          intensity={10}
          form="ring"
        /> */}
      {/* </Environment> */}
      {/* Stage: スタジオ証明、コンテンツの中心と平面、陰影の追加などをよし何やってくれるコンポーネント */}
      <Stage
        contactShadow={{ opacity: 0.2, blur: 3 }}
        environment="sunset"
        preset="portrait"
        intensity={2}
      >
        <mesh castShadow position-x={-2} position-y={1}>
          <sphereGeometry />
          <meshStandardMaterial
            color="orange"
            envMapIntensity={envMapParams.envMapIntensity}
          />
        </mesh>
        <mesh
          castShadow
          ref={cubeRef}
          position-x={2}
          position-y={1}
          rotation-y={Math.PI * 0.25}
          scale={1.5}
        >
          <boxGeometry />
          <meshStandardMaterial
            color="mediumpurple"
            envMapIntensity={envMapParams.envMapIntensity}
          />
        </mesh>
      </Stage>
      {/* <mesh
        // receiveShadow
        position-y={0}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial
          color="greenyellow"
          envMapIntensity={envMapIntensity}
        />
      </mesh> */}
    </>
  );
};

/**
 * EnvironmentAndStaging.
 * @return EnvironmentAndStaging
 */
const EnvironmentAndStaging = () => {
  const params = useControls("contact shadows", {
    color: "#1d8f75",
    opacity: { value: 0.4, min: 0, max: 1 },
    blur: { value: 2.8, min: 0, max: 10 },
  });

  const { sunPosition } = useControls("sky", {
    sunPosition: { value: [1, 2, 3] },
  });

  const envMapParams = useControls("environment map", {
    envMapIntensity: { value: 3.5, min: 0, max: 12 },
    envMapHeight: { value: 7, min: 0, max: 100 },
    envMapRadius: { value: 20, min: 10, max: 1000 },
    envMapScale: { value: 100, min: 10, max: 1000 },
  });

  return (
    <>
      <Leva />
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
        // shadows
        // onCreated={createdHandler}
      >
        <Lights params={params} sunPosition={sunPosition} />
        {/* <Sky sunPosition={sunPosition} /> */}
        <Objects envMapParams={envMapParams} />
        <OrbitControls makeDefault />
        <Perf position="top-left" />
        {/* <BakeShadows /> */}
      </Canvas>
    </>
  );
};

export default EnvironmentAndStaging;
