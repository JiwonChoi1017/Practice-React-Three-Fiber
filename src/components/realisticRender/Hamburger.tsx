/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useThree } from "@react-three/fiber";
import DatGui, { DatNumber, DatSelect } from "react-dat-gui";
import { OrbitControls, useCubeTexture, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { PCFSoftShadowMap } from "three";
import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";

/**
 * Tone Mapping List.
 */
const TONE_MAPPING_LIST = {
  No: THREE.NoToneMapping,
  Linear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
} as const;

/**
 * ライト.
 * @param {number} intensity 強度
 * @param {number} x x軸
 * @param {number} y y軸
 * @param {number} z z軸
 * @return ライト.
 */
const Lights: React.FC<{
  params: {
    intensity: number;
    x: number;
    y: number;
    z: number;
  };
}> = ({ params }) => {
  const { scene } = useThree();
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useEffect(() => {
    if (!directionalLightRef.current) return;
    const directionalLightCameraHelper = new THREE.CameraHelper(
      directionalLightRef.current.shadow.camera
    );
    directionalLightCameraHelper.visible = false;
    scene.add(directionalLightCameraHelper);
  }, []);

  return (
    <>
      <directionalLight
        castShadow
        ref={directionalLightRef}
        intensity={params.intensity}
        color="#ffffff"
        position={[params.x, params.y, params.z]}
        shadow-camera-far={15}
        shadow-mapSize={[1024, 1024]}
      />
    </>
  );
};

/**
 * オブジェクト.
 * @param {number} rotateY y軸回転
 * @param {number} envMapIntensity 環境マッピング強度
 * @return オブジェクト.
 */
const Objects: React.FC<{
  params: {
    rotateY: number;
    envMapIntensity: number;
  };
}> = ({ params }) => {
  const { scene } = useThree();
  const envMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    {
      path: "/textures/environmentMaps/3/",
    }
  );
  envMap.encoding = THREE.sRGBEncoding;

  scene.background = envMap;
  scene.environment = envMap;

  const gltf = useGLTF("./models/Hamburger/glTF-Binary/Hamburger.glb");

  return (
    <>
      <group
        receiveShadow
        scale={[0.3, 0.3, 0.3]}
        position={[0, -1, 0]}
        rotation={[0, params.rotateY, 0]}
      >
        <primitive object={gltf.scene} />
      </group>
    </>
  );
};

/**
 * Hamburger.
 * @param {object} sizes 画面サイズ
 * @return Hamburger.
 */
const Hamburger = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    intensity: 1,
    x: 0.25,
    y: 3,
    z: -2.25,
    rotateY: Math.PI * 0.5,
    envMapIntensity: 2,
    toneMapping: "No",
    toneMappingExposure: 3,
  });

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        shadows={{
          enabled: true,
          type: PCFSoftShadowMap,
        }}
        camera={{
          fov: 75,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
          position: new THREE.Vector3(4, 1, -4),
        }}
        gl={{
          physicallyCorrectLights: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping:
            TONE_MAPPING_LIST[
              params.toneMapping as keyof typeof TONE_MAPPING_LIST
            ],
          toneMappingExposure: params.toneMappingExposure,
          antialias: true,
        }}
      >
        <Lights params={params} />
        <Objects params={params} />
        <OrbitControls enableDamping={true} />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber
          path="intensity"
          min={0}
          max={10}
          step={0.001}
          label="lightIntensity"
        />
        <DatNumber path="x" min={-5} max={5} step={0.001} label="lightX" />
        <DatNumber path="y" min={-5} max={5} step={0.001} label="lightY" />
        <DatNumber path="z" min={-5} max={5} step={0.001} label="lightZ" />
        <DatNumber
          path="rotateY"
          min={-Math.PI}
          max={Math.PI}
          step={0.001}
          label="rotation"
        />
        <DatNumber path="envMapIntensity" min={0} max={10} step={0.001} />
        <DatSelect
          path="toneMapping"
          options={["No", "Linear", "Reinhard", "Cineon", "ACESFilmic"]}
        />
        <DatNumber path="toneMappingExposure" min={0} max={10} step={0.001} />
      </DatGui>
    </div>
  );
};

export default Hamburger;
