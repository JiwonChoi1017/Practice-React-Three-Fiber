/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useCubeTexture } from "@react-three/drei";
import { Physics, usePlane, useSphere } from "@react-three/cannon";

import { Props } from "../../types/Common";
import React from "react";
import classes from "../../styles/Global.module.css";

const MATERIAL_LIST = {
  default: "default",
  plastic: "plastic",
};

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <ambientLight color={0xffffff} intensity={0.4} />
      <directionalLight
        castShadow
        color={0xffffff}
        intensity={0.2}
        position={[5, 5, 5]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
        shadow-camera-left={-7}
        shadow-camera-top={7}
        shadow-camera-right={7}
        shadow-camera-bottom={-7}
      />
    </>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const cubeMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    {
      path: "/textures/environmentMaps/0/",
    }
  );
  const material = {
    name: MATERIAL_LIST.default,
    friction: 0.1,
    restitution: 0.7,
  };
  const [sphereRef, sphereApi] = useSphere(() => ({
    args: [0.5],
    mass: 1,
    position: [0, 3, 0],
    material: material,
  }));

  const [planeRef] = usePlane(() => ({
    mass: 0,
    rotation: [-Math.PI * 0.5, 0, 0],
    material: material,
  }));

  // useEffect(() => {
  //   sphereApi.applyLocalForce([150, 0, 0], [0, 0, 0]);
  // }, []);

  useFrame(() => {
    if (!sphereRef.current) return;
    const spherePos = sphereRef.current.position;
    sphereApi.applyForce([-0.5, 0, 0], [spherePos.x, spherePos.y, spherePos.z]);
  });

  return (
    <>
      {/* @ts-ignore */}
      <mesh ref={sphereRef} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          metalness={0.3}
          roughness={0.4}
          envMap={cubeMap}
          envMapIntensity={0.5}
        />
      </mesh>
      {/* @ts-ignore */}
      <mesh ref={planeRef} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color="#777777"
          metalness={0.3}
          roughness={0.4}
          envMap={cubeMap}
          envMapIntensity={0.5}
        />
      </mesh>
    </>
  );
};

/**
 * SpherePhysics.
 * @param {object} sizes 画面サイズ
 * @return SpherePhysics
 */
const SpherePhysics = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          position: [-3, 3, 3],
          fov: 75,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
        }}
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap,
        }}
      >
        <color attach="background" args={["#1e1a20"]} />
        <Lights />
        <Physics gravity={[0, -9.02, 0]}>
          <Objects />
        </Physics>
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default SpherePhysics;
