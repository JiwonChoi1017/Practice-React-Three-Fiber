/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";
import simpleShadowTextureUrl from "../../assets/textures/shadow/simpleShadow.jpg";

/**
 * ライト.
 * @param {number} intensity 強度
 * @param {number} x x軸
 * @param {number} y y軸
 * @param {number} z z軸
 * @return ライト.
 */
const Lights: React.FC<{
  params: { intensity: number; x: number; y: number; z: number };
}> = ({ params }) => {
  const { scene } = useThree();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    if (
      !directionalLightRef.current ||
      !spotLightRef.current ||
      !pointLightRef.current
    ) {
      return;
    }
    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLightRef.current.shadow.camera
    );
    directionalLightCameraHelper.visible = false;

    const spotLightCameraHelper = new THREE.CameraHelper(
      spotLightRef.current.shadow.camera
    );
    spotLightCameraHelper.visible = false;

    const pointLightCameraHelper = new THREE.CameraHelper(
      pointLightRef.current.shadow.camera
    );
    pointLightCameraHelper.visible = false;

    scene.add(directionalLightCameraHelper);
    scene.add(spotLightCameraHelper);
    scene.add(pointLightCameraHelper);
  }, []);

  return (
    <>
      <ambientLight intensity={params.intensity} />
      <directionalLight
        ref={directionalLightRef}
        intensity={params.intensity}
        position={[params.x, params.y, params.z]}
      />
      <spotLight
        ref={spotLightRef}
        color={0xffffff}
        intensity={params.intensity}
        distance={10}
        angle={Math.PI * 0.3}
        position={[0, 2, 2]}
      />
      <pointLight
        ref={pointLightRef}
        color={0xffffff}
        intensity={0.3}
        position={[-1, 1, 0]}
      />
    </>
  );
};

/**
 * オブジェクト.
 * @param {number} metalness 金属度
 * @param {number} roughness 荒さ
 * @return オブジェクト.
 */
const Objects: React.FC<{
  params: { metalness: number; roughness: number };
}> = ({ params }) => {
  const sphereMeshRef = useRef<THREE.Mesh>(null);
  const planeMeshRef = useRef<THREE.Mesh>(null);
  const shadowMeshRef = useRef<THREE.Mesh>(null);
  const simpleShadowTexture = useTexture(simpleShadowTextureUrl);

  useFrame((state) => {
    if (!sphereMeshRef.current || !shadowMeshRef.current) {
      return;
    }
    const elapsedTime = state.clock.getElapsedTime();
    sphereMeshRef.current.position.x = Math.cos(elapsedTime) * 1.5;
    sphereMeshRef.current.position.z = Math.sin(elapsedTime) * 1.5;
    sphereMeshRef.current.position.y = Math.abs(Math.sin(elapsedTime * 3));

    shadowMeshRef.current.position.x = sphereMeshRef.current.position.x;
    shadowMeshRef.current.position.z = sphereMeshRef.current.position.z;
  });

  useEffect(() => {
    if (!planeMeshRef.current || !shadowMeshRef.current) {
      return;
    }
    shadowMeshRef.current.position.y = planeMeshRef.current.position.y + 0.01;
  }, []);

  return (
    <>
      <mesh ref={sphereMeshRef} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh
        ref={planeMeshRef}
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry args={[5, 5]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh ref={shadowMeshRef} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          color={0x000000}
          transparent={true}
          alphaMap={simpleShadowTexture}
        />
      </mesh>
    </>
  );
};

/**
 * 共通マテリアル.
 * @param {number} metalness 金属度
 * @param {number} roughness 荒さ
 * @return 共通マテリアル.
 */
const CommonMaterial: React.FC<{
  params: { metalness: number; roughness: number };
}> = ({ params }) => {
  return <meshStandardMaterial {...params} />;
};

/**
 * BakedShadow.
 * @param {object} sizes 画面サイズ
 * @return BakedShadow.
 */
const BakedShadow = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    metalness: 0.15,
    roughness: 0.7,
    intensity: 0.25,
    x: 2,
    y: 2,
    z: -1,
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
        <Lights params={params} />
        <Objects params={params} />
        <OrbitControls enableDamping={true} />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber path="metalness" min={0} max={1} step={0.001} />
        <DatNumber path="roughness" min={0} max={1} step={0.001} />
        <DatNumber path="intensity" min={0} max={1} step={0.001} />
        <DatNumber path="x" min={-5} max={5} step={0.001} />
        <DatNumber path="y" min={-5} max={5} step={0.001} />
        <DatNumber path="z" min={-5} max={5} step={0.001} />
      </DatGui>
    </div>
  );
};

export default BakedShadow;
