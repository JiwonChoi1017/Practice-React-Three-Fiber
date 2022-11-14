/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import DatGui, { DatFolder, DatNumber } from "react-dat-gui";
import { OrbitControls, useCubeTexture, useTexture } from "@react-three/drei";
import React, { useEffect, useState } from "react";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PCFSoftShadowMap } from "three";
import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";
import floorColorTextureUrl from "../../assets/textures/dirt/color.jpg";
import floorNormalTextureUrl from "../../assets/textures/dirt/normal.jpg";

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
  return (
    <>
      <directionalLight
        castShadow
        color="#ffffff"
        intensity={params.intensity}
        shadow-camera-far={15}
        shadow-mapSize={[1024, 1024]}
        shadow-normalBias={0.05}
        position={[params.x, params.y, params.z]}
      />
    </>
  );
};

/**
 * オブジェクト.
 * @param {number} envMapIntensity 環境マッピング強度
 * @return オブジェクト.
 */
const Objects: React.FC<{ params: { envMapIntensity: number } }> = ({
  params,
}) => {
  const [floorColorTexture, floorNormalTexture] = useTexture([
    floorColorTextureUrl,
    floorNormalTextureUrl,
  ]);
  floorColorTexture.repeat.set(1.5, 1.5);
  floorColorTexture.wrapS = THREE.RepeatWrapping;
  floorColorTexture.wrapT = THREE.RepeatWrapping;
  floorNormalTexture.repeat.set(1.5, 1.5);
  floorNormalTexture.wrapS = THREE.RepeatWrapping;
  floorNormalTexture.wrapT = THREE.RepeatWrapping;

  const { scene } = useThree();
  const envMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    {
      path: "/textures/environmentMaps/",
    }
  );
  envMap.encoding = THREE.sRGBEncoding;

  scene.environment = envMap;
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = params.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const gltf = useLoader(GLTFLoader, "/models/Fox/glTF/Fox.gltf");
  const foxMixer = new THREE.AnimationMixer(gltf.scene);
  const action = foxMixer.clipAction(gltf.animations[0]);
  action.play();

  let prevTime = 0;
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime;
    foxMixer.update(deltaTime);
  });

  return (
    <>
      <group scale={[0.02, 0.02, 0.02]}>
        <primitive object={gltf.scene} />
      </group>
      <mesh receiveShadow rotation={[-Math.PI * 0.5, 0, 0]}>
        <circleGeometry args={[5, 64]} />
        <meshStandardMaterial
          map={floorColorTexture}
          normalMap={floorNormalTexture}
        />
      </mesh>
    </>
  );
};

/**
 * Fox.
 * @param {object} sizes 画面サイズ
 * @return Fox.
 */
const Fox = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    intensity: 4,
    x: 5,
    y: 5,
    z: 1.25,
    envMapIntensity: 0.4,
  });

  const [isDebug, setIsDebug] = useState(false);

  useEffect(() => {
    // location.hashについては下記をご参考ください.
    // https://developer.mozilla.org/ja/docs/Web/API/Location/hash
    if (window.location.hash === "#debug") {
      // デバッグモード活性化
      setIsDebug(true);
    }
  }, []);

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        gl={{
          physicallyCorrectLights: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.CineonToneMapping,
          toneMappingExposure: 1.75,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
          antialias: true,
        }}
        camera={{
          fov: 35,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
          position: [6, 4, 8],
        }}
        shadows={{
          enabled: true,
          type: PCFSoftShadowMap,
        }}
      >
        <color attach="background" args={["#211d20"]} />
        <Lights params={params} />
        <Objects params={params} />
        <OrbitControls enableDamping={true} />
      </Canvas>
      {isDebug && (
        <DatGui data={params} onUpdate={setParams}>
          <DatFolder title="environment" closed={true}>
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
            <DatNumber path="envMapIntensity" min={0} max={4} step={0.001} />
          </DatFolder>
        </DatGui>
      )}
    </div>
  );
};

export default Fox;
