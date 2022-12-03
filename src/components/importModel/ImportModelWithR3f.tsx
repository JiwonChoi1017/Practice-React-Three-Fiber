/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Canvas, useLoader } from "@react-three/fiber";
import {
  Clone,
  OrbitControls,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import React, { Suspense, useEffect } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Perf } from "r3f-perf";
import { useControls } from "leva";

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-normalBias={0.04}
      />
      <ambientLight intensity={0.5} />
    </>
  );
};

/**
 * Fox.
 * @return Fox
 */
const Fox = () => {
  const fox = useGLTF("./models/Fox/glTF/Fox.gltf");
  const animations = useAnimations(fox.animations, fox.scene);

  const { animationName } = useControls({
    animationName: { options: animations.names },
  });

  useEffect(() => {
    const action = animations.actions[animationName];
    if (!action) return;
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5);
    };
    // window.setTimeout(() => {
    //   const walkActions = animations.actions.Walk;
    //   walkActions?.play();
    //   walkActions?.crossFadeFrom(runActions, 1, false);
    // }, 2000);
  }, [animationName]);

  return (
    <primitive
      object={fox.scene}
      scale={0.02}
      position={[-2.5, 0, 2.5]}
      rotation-y={0.3}
    />
  );
};

/**
 * Hamburgers.
 * @return Hamburgers
 */
const Hamburgers = () => {
  // const modelBinary = useGLTF("./models/Hamburger/glTF-Binary/Hamburger.glb");
  // const modelDraco = useGLTF("./models/Hamburger/glTF-Draco/Hamburger.glb");
  // @ts-ignore
  const { nodes, materials } = useGLTF(
    "./models/Hamburger/glTF-Draco/Hamburger.glb"
  );
  // const flightHelmet = useLoader(
  //   GLTFLoader,
  //   "./models/FlightHelmet/glTF/FlightHelmet.gltf"
  // );
  return (
    <>
      {/* <Clone object={modelDraco.scene} scale={0.35} position-x={-4} />
      <Clone object={modelDraco.scene} scale={0.35} />
      <Clone object={modelDraco.scene} scale={0.35} position-x={4} /> */}
      <group dispose={null} scale={0.35}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.bottomBun.geometry}
          material={materials.BunMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.meat.geometry}
          material={materials.SteakMaterial}
          position={[0, 2.82, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.cheese.geometry}
          material={materials.CheeseMaterial}
          position={[0, 3.04, 0]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.topBun.geometry}
          material={materials.BunMaterial}
          position={[0, 1.77, 0]}
        />
      </group>
      {/* <primitive object={flightHelmet.scene} scale={5} position-y={-1} /> */}
    </>
  );
};

/**
 * PlaceHolder.
 * @return PlaceHolder
 */
const PlaceHolder = () => {
  return (
    <mesh position-y={0.5} scale={[2, 3, 2]}>
      <boxGeometry args={[1, 1, 1, 2, 2, 2]} />
      <meshBasicMaterial wireframe color="red" />
    </mesh>
  );
};

/**
 * ImportModelWithR3f.
 * @return ImportModelWithR3f
 */
const ImportModelWithR3f = () => {
  return (
    <>
      <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [-4, 3, 6],
        }}
      >
        <Perf position="top-left" />
        <Lights />
        {/* 
          Suspense: コンポーネントを「ローディング中なのでまだレンダリングできない」という状態にすることができる（try-catch文みたいな感じ）
                    レンダリングできなかった（サスペンドした）場合はfallbackを代わりにレンダリングする  
        */}
        <Suspense fallback={<PlaceHolder />}>
          <Fox />
          <Hamburgers />
        </Suspense>
        <mesh
          receiveShadow
          position-y={-1}
          rotation-x={-Math.PI * 0.5}
          scale={10}
        >
          <planeGeometry />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
};

useGLTF.preload("./models/Hamburger/glTF-Draco/Hamburger.glb");

export default ImportModelWithR3f;
