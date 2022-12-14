/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useThree } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import React, { useEffect, useRef, useState } from "react";

import { OrbitControls } from "@react-three/drei";
import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";

/**
 * ライト.
 * @param {number} intensity 強度
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
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={2}
        shadow-camera-right={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-2}
        shadow-camera-near={1}
        shadow-camera-far={6}
        // shadow-radius={10}
        intensity={params.intensity}
        position={[params.x, params.y, params.z]}
      />
      <spotLight
        ref={spotLightRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-fov={30}
        shadow-camera-near={1}
        shadow-camera-far={6}
        color={0xffffff}
        intensity={params.intensity}
        distance={10}
        angle={Math.PI * 0.3}
        position={[0, 2, 2]}
      />
      <pointLight
        ref={pointLightRef}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={5}
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
  return (
    <>
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
      >
        <planeGeometry args={[5, 5]} />
        <CommonMaterial params={params} />
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
 * Shadows.
 * @param {object} sizes 画面サイズ
 * @return Shadows.
 */
const Shadows = ({ sizes }: Props) => {
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
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap,
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

export default Shadows;
