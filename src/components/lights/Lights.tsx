/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import { OrbitControls, useHelper } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
import { Sizes } from "../../Common";
import classes from "../../styles/Global.module.css";

/**
 * Props.
 */
interface Props {
  sizes: Sizes;
}

/**
 * ライト.
 * @param {number} intensity 強度
 * @return ライト.
 */
const Light: React.FC<{
  params: { intensity: number };
}> = ({ params }) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  const hemisphereLightRef = useRef<THREE.HemisphereLight>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const rectAreaLightRef = useRef<THREE.RectAreaLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 0.2);
  useHelper(hemisphereLightRef, THREE.HemisphereLightHelper, 0.2);
  useHelper(pointLightRef, THREE.PointLightHelper, 0.2);
  useHelper(rectAreaLightRef, RectAreaLightHelper);
  useHelper(spotLightRef, THREE.SpotLightHelper).current?.update();

  useEffect(() => {
    if (!rectAreaLightRef.current || !spotLightRef.current) {
      return;
    }
    rectAreaLightRef.current.lookAt(0, 0, 0);
    spotLightRef.current.target.position.x = -0.75;
  }, []);

  return (
    <>
      <ambientLight color={0xffffff} {...params} />
      <directionalLight
        ref={directionalLightRef}
        color={0x00fffc}
        intensity={0.3}
        position={[1, 0.25, 0]}
      />
      <hemisphereLight
        ref={hemisphereLightRef}
        color={0xff0000}
        groundColor={0x0000ff}
        intensity={1}
      />
      <pointLight
        ref={pointLightRef}
        color={0xff9000}
        intensity={0.5}
        position={[1, -0.5, 1]}
        distance={10}
      />
      <rectAreaLight
        ref={rectAreaLightRef}
        color={0x4e00ff}
        intensity={2}
        width={1}
        height={1}
        position={[-1.5, 0, 1.5]}
      />
      <spotLight
        ref={spotLightRef}
        color={0x78ff00}
        intensity={0.5}
        distance={10}
        angle={Math.PI * 0.1}
        penumbra={0.25}
        decay={1}
        position={[5, 2, 3]}
      />
    </>
  );
};

/**
 * 共通マテリアル.
 * @return 共通マテリアル.
 */
const CommonMaterial = () => {
  return <meshStandardMaterial roughness={0.2} />;
};

/**
 * トオブジェクト.
 * @return トオブジェクト.
 */
const Objects = () => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const planeRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!sphereRef.current || !planeRef.current || !torusRef.current) {
      return;
    }
    const elapsedTime = state.clock.getElapsedTime();
    sphereRef.current.rotation.y = 0.1 * elapsedTime;
    planeRef.current.rotation.y = 0.1 * elapsedTime;
    torusRef.current.rotation.y = 0.1 * elapsedTime;

    sphereRef.current.rotation.x = 0.15 * elapsedTime;
    planeRef.current.rotation.x = 0.15 * elapsedTime;
    torusRef.current.rotation.x = 0.15 * elapsedTime;
  });

  return (
    <>
      <mesh ref={sphereRef} position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <CommonMaterial />
      </mesh>
      <mesh ref={planeRef}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <CommonMaterial />
      </mesh>
      <mesh ref={torusRef} position={[1.5, 0, 0]}>
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <CommonMaterial />
      </mesh>
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <CommonMaterial />
      </mesh>
    </>
  );
};

/**
 * Lights.
 * @param {object} sizes 画面サイズ
 * @return Lights
 */
const Lights = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    intensity: 0.15,
  });

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <Light params={params} />
        <Objects />
        <OrbitControls />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber path="intensity" min={0} max={1} step={0.01} />
      </DatGui>
    </div>
  );
};

export default Lights;
