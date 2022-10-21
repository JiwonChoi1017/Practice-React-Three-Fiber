/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { Props } from "../../Common";
import bricksAmbientOcclusionTextureUrl from "../../assets/textures/bricks/ambientOcclusion.jpg";
import bricksColorTextureUrl from "../../assets/textures/bricks/color.jpg";
import bricksNormalTextureUrl from "../../assets/textures/bricks/normal.jpg";
import bricksRoughnessTextureUrl from "../../assets/textures/bricks/roughness.jpg";
import classes from "../../styles/Global.module.css";
import doorAlphaTextureUrl from "../../assets/textures/door/alpha.jpg";
import doorAmbientOcclusionTextureUrl from "../../assets/textures/door/ambientOcclusion.jpg";
import doorColorTextureUrl from "../../assets/textures/door/color.jpg";
import doorHeightTextureUrl from "../../assets/textures/door/height.jpg";
import doorMetalnessTextureUrl from "../../assets/textures/door/metalness.jpg";
import doorNormalTextureUrl from "../../assets/textures/door/normal.jpg";
import doorRoughnessTextureUrl from "../../assets/textures/door/roughness.jpg";
import grassAmbientOcclusionTextureUrl from "../../assets/textures/grass/ambientOcclusion.jpg";
import grassColorTextureUrl from "../../assets/textures/grass/color.jpg";
import grassNormalTextureUrl from "../../assets/textures/grass/normal.jpg";
import grassRoughnessTextureUrl from "../../assets/textures/grass/roughness.jpg";

/**
 * ライト.
 * @param {number} ambientLightIntensity ambientLightの強度
 * @param {number} directionalLightIntensity directionalLightの強度
 * @return ライト.
 */
const Lights: React.FC<{
  params: {
    ambientLightIntensity: number;
    directionalLightIntensity: number;
  };
}> = ({ params }) => {
  return (
    <>
      <ambientLight color="#b9d5ff" intensity={params.ambientLightIntensity} />
      <directionalLight
        castShadow
        color="#b9d5ff"
        intensity={params.directionalLightIntensity}
        position={[4, 5, -2]}
      />
      <pointLight
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={7}
        color="#ff7d46"
        intensity={1}
        distance={7}
        position={[0, 1.2, 2.7]}
      />
      <Ghosts />
    </>
  );
};

/**
 * ゴースツ.
 * @return ゴースツ.
 */
const Ghosts = () => {
  const [ghost1, setGhost1] = useState({ x: 0, y: 0, z: 0 });
  const [ghost2, setGhost2] = useState({ x: 0, y: 0, z: 0 });
  const [ghost3, setGhost3] = useState({ x: 0, y: 0, z: 0 });
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const ghost1Angle = elapsedTime * 0.5;
    setGhost1({
      x: Math.cos(ghost1Angle) * 4,
      y: Math.sin(elapsedTime * 3),
      z: Math.sin(ghost1Angle) * 4,
    });
    const ghost2Angle = -elapsedTime * 0.32;
    setGhost2({
      x: Math.cos(ghost2Angle) * 5,
      y: Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
      z: Math.sin(ghost2Angle) * 5,
    });
    const ghost3Angle = -elapsedTime * 0.18;
    setGhost3({
      x: Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32)),
      y: Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5),
      z: Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5)),
    });
  });
  return (
    <group>
      <Ghost color="#ff00ff" ghost={ghost1} />
      <Ghost color="#00ffff" ghost={ghost2} />
      <Ghost color="#ffff00" ghost={ghost3} />
    </group>
  );
};

/**
 * ゴースト.
 * @param {string} color 色
 * @param {object} ghost ゴーストの位置
 * @return ゴースト.
 */
const Ghost = (props: {
  color: string;
  ghost: { x: number; y: number; z: number };
}) => {
  const { x, y, z } = props.ghost;
  return (
    <pointLight
      castShadow
      shadow-mapSize-width={256}
      shadow-mapSize-height={256}
      shadow-camera-far={7}
      color={props.color}
      intensity={2}
      distance={3}
      position={[x, y, z]}
    />
  );
};

/**
 * 戸建.
 * @return 戸建.
 */
const House = () => {
  const height = 2.5;
  const [
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorMetalnessTexture,
    doorRoughnessTexture,
    doorNormalTexture,
    bricksColorTexture,
    bricksAmbientOcclusionTexture,
    bricksRoughnessTexture,
    bricksNormalTexture,
  ] = useTexture([
    doorColorTextureUrl,
    doorAlphaTextureUrl,
    doorAmbientOcclusionTextureUrl,
    doorHeightTextureUrl,
    doorMetalnessTextureUrl,
    doorRoughnessTextureUrl,
    doorNormalTextureUrl,
    bricksColorTextureUrl,
    bricksAmbientOcclusionTextureUrl,
    bricksRoughnessTextureUrl,
    bricksNormalTextureUrl,
  ]);
  const doorRef = useRef<THREE.Mesh>(null);
  const wallRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!doorRef.current || !wallRef.current) return;
    doorRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        doorRef.current.geometry.attributes.uv.array,
        2
      )
    );
    wallRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        wallRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  return (
    <>
      {/* 壁 */}
      <mesh castShadow ref={wallRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[4, height, 4]} />
        <meshStandardMaterial
          map={bricksColorTexture}
          aoMap={bricksAmbientOcclusionTexture}
          normalMap={bricksNormalTexture}
          roughnessMap={bricksRoughnessTexture}
        />
      </mesh>
      {/* 屋根 */}
      <mesh position={[0, height + 0.5, 0]} rotation={[0, Math.PI * 0.25, 0]}>
        <coneGeometry args={[3.5, 1, 4]} />
        <meshStandardMaterial color="#b35f45" />
      </mesh>
      {/* ドア */}
      <mesh ref={doorRef} position={[0, 1, 2 + 0.01]}>
        <planeGeometry args={[2.2, 2.2, 100, 100]} />
        <meshStandardMaterial
          transparent={true}
          map={doorColorTexture}
          alphaMap={doorAlphaTexture}
          aoMap={doorAmbientOcclusionTexture}
          displacementMap={doorHeightTexture}
          displacementScale={0.1}
          normalMap={doorNormalTexture}
          metalnessMap={doorMetalnessTexture}
          roughnessMap={doorRoughnessTexture}
        />
      </mesh>
      <Bushes />
      <Graves />
    </>
  );
};

/**
 * 茂み.
 * @return 茂み.
 */
const Bushes = () => {
  return (
    <group>
      <Bush
        radius={1}
        segments={16}
        position={new THREE.Vector3(0.8, 0.2, 2.2)}
        scale={new THREE.Vector3(0.5, 0.5, 0.5)}
      />
      <Bush
        radius={1}
        segments={16}
        position={new THREE.Vector3(1.4, 0.1, 2.1)}
        scale={new THREE.Vector3(0.25, 0.25, 0.25)}
      />
      <Bush
        radius={1}
        segments={16}
        position={new THREE.Vector3(-0.8, 0.1, 2.2)}
        scale={new THREE.Vector3(0.4, 0.4, 0.4)}
      />
      <Bush
        radius={1}
        segments={16}
        position={new THREE.Vector3(-1, 0.05, 2.6)}
        scale={new THREE.Vector3(0.15, 0.15, 0.15)}
      />
    </group>
  );
};

/**
 * 茂み.
 * @param {number} radius 半径
 * @param {number} segments セグメンツ
 * @param {THREE.Vector3} position 位置
 * @param {THREE.Vector3} scale 大きさ
 * @return 茂み.
 */
const Bush = (props: {
  radius: number;
  segments: number;
  position: THREE.Vector3;
  scale: THREE.Vector3;
}) => {
  return (
    <mesh castShadow position={props.position} scale={props.scale}>
      <sphereGeometry args={[props.radius, props.segments, props.segments]} />
      <meshStandardMaterial color="#89c854" />
    </mesh>
  );
};

/**
 * 墓.
 * @return 墓.
 */
const Graves = () => {
  const randomGraves = [];
  for (let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 6;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    randomGraves.push(
      <Grave
        size={{ width: 0.6, height: 0.8, depth: 0.2 }}
        x={x}
        z={z}
        key={`grave_${i}`}
      />
    );
  }
  return <group>{randomGraves}</group>;
};

/**
 * 墓.
 * @param {object} size サイズ
 * @param {number} x x軸
 * @param {number} z z軸
 * @return 墓.
 */
const Grave = (props: {
  size: {
    width: number;
    height: number;
    depth: number;
  };
  x: number;
  z: number;
}) => {
  const size = props.size;
  return (
    <mesh
      castShadow
      position={[props.x, 0.3, props.z]}
      rotation={[0, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4]}
    >
      <boxGeometry args={[size.width, size.height, size.depth]} />
      <meshStandardMaterial color="#b2b6b1" />
    </mesh>
  );
};

/**
 * 地面.
 * @return 地面.
 */
const Floor = () => {
  const [
    grassColorTexture,
    grassAmbientOcclusionTexture,
    grassRoughnessTexture,
    grassNormalTexture,
  ] = useTexture([
    grassColorTextureUrl,
    grassAmbientOcclusionTextureUrl,
    grassRoughnessTextureUrl,
    grassNormalTextureUrl,
  ]);
  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);
  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;
  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  const floorRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!floorRef.current) return;
    floorRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        floorRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  return (
    <>
      <mesh receiveShadow ref={floorRef} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial
          map={grassColorTexture}
          aoMap={grassAmbientOcclusionTexture}
          normalMap={grassNormalTexture}
          roughnessMap={grassRoughnessTexture}
        />
      </mesh>
    </>
  );
};

/**
 * HauntedHouse.
 * @param {object} sizes 画面サイズ
 * @return HauntedHouse.
 */
const HauntedHouse = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    ambientLightIntensity: 0.12,
    directionalLightIntensity: 0.12,
  });

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          position: [4, 2, 5],
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
        <color attach="background" args={["#262837"]} />
        <fog attach="fog" color="#262837" near={1} far={15} />
        <Lights params={params} />
        <group>
          <House />
        </group>
        <Floor />
        <OrbitControls enableDamping={true} />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber path="ambientLightIntensity" min={0} max={1} step={0.001} />
        <DatNumber
          path="directionalLightIntensity"
          min={0}
          max={1}
          step={0.001}
        />
      </DatGui>
    </div>
  );
};

export default HauntedHouse;
