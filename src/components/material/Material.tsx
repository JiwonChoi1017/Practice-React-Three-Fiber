/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import { OrbitControls, useCubeTexture, useTexture } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";
import doorAlphaTextureUrl from "../../assets/textures/door/alpha.jpg";
import doorAmbientOcclusionTextureUrl from "../../assets/textures/door/ambientOcclusion.jpg";
import doorColorTextureUrl from "../../assets/textures/door/color.jpg";
import doorHeightTextureUrl from "../../assets/textures/door/height.jpg";
import doorMetalnessTextureUrl from "../../assets/textures/door/metalness.jpg";
import doorNormalTextureUrl from "../../assets/textures/door/normal.jpg";
import doorRoughnessTextureUrl from "../../assets/textures/door/roughness.jpg";
import gradientTextureUrl from "../../assets/textures/gradients/3.jpg";
import matcapTextureUrl from "../../assets/textures/matcaps/5.png";

/**
 * Light.
 */
const Light = () => {
  return (
    <>
      <ambientLight color="white" intensity={0.15} />
      <pointLight color="white" intensity={0.7} position={[2, 3, 4]} />
    </>
  );
};

/**
 * 共通マテリアル.
 * @param {number} metalness 金属度
 * @param {number} roughness 荒さ
 * @param {number} aoMapIntensity アンビエントオクルージョンエフェクトの強度
 * @param {number} displacementScale 起伏の倍率
 * @return 共通マテリアル.
 */
const CommonMaterial: React.FC<{
  params: {
    metalness: number;
    roughness: number;
    aoMapIntensity: number;
    displacementScale: number;
  };
}> = ({ params }) => {
  const [
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorMetalnessTexture,
    doorRoughnessTexture,
    doorNormalTexture,
    gradientTexture,
    matcapTexture,
  ] = useTexture([
    doorColorTextureUrl,
    doorAlphaTextureUrl,
    doorAmbientOcclusionTextureUrl,
    doorHeightTextureUrl,
    doorMetalnessTextureUrl,
    doorRoughnessTextureUrl,
    doorNormalTextureUrl,
    gradientTextureUrl,
    matcapTextureUrl,
  ]);

  gradientTexture.minFilter = THREE.NearestFilter;
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;

  const cubeMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    {
      // publicフォルダの配下じゃないと読み込めないみたい.
      path: "/textures/environmentMaps/3/",
    }
  );

  // meshBasicMaterial.
  //ライティングを考慮しないマテリアル.
  // 陰がつかないので均一な塗りつぶした状態になる.
  // 開発中にライティングを無視して、動作確認するときに役立つ.
  const basicMaterial = (
    <meshBasicMaterial
      // color="purple"
      map={doorColorTexture}
      // wireframe={true}
      transparent={true}
      // opacity={0.5}
      alphaMap={doorAlphaTexture}
      side={THREE.DoubleSide}
    />
  );

  // meshNormalMaterial.
  // ノーマルのカラーをRGBで可視化するマテリアル.
  // ライティングを必要としないため、手軽に動作確認するときに役立つ.
  const normalMaterial = (
    <meshNormalMaterial
      // wireframe={true}
      flatShading={true}
    />
  );

  // meshMatcapMaterial.
  // テカリを再現するマテリアル.
  // 球体のように見えるテクスチャを用意する必要がある.
  const matcapMaterial = <meshMatcapMaterial matcap={matcapTexture} />;

  // meshDepthMaterial.
  // カメラのnearの値に近い部分が白、farの値に近い部分が黒になるマテリアル.
  const depthMaterial = <meshDepthMaterial />;

  // meshLambertMaterial.
  // ランバート・シェーディングと言う、光沢感のないマットな質感を表現できるマテリアル.
  // 陰がでるため奥行き感を表現できる.
  // 陰影を必要とするマテリアルなので、ライトが必要となる.
  const lambertMaterial = <meshLambertMaterial />;

  // meshPhongMaterial.
  // フォン・シェーディングと言う、光沢感のある質感を表現できるマテリアル.
  const phongMaterial = (
    <meshPhongMaterial shininess={100} specular={new THREE.Color(0xff0000)} />
  );

  // meshToonMaterial.
  // アニメのようなトゥーンシェーディングを実現できるマテリアル.
  // meshPhongMaterialクラスの拡張として用意されている.
  const toonMaterial = <meshToonMaterial gradientMap={gradientTexture} />;

  // meshStandardMaterial.
  // 物理ベースレンダリングのマテリアル.
  // 物理ベースレンダリングは多くの3Dアプリケーションで実装されているもので（UnityやUnrealなど）、光の反射や散乱など現実の物理現象を再現する.
  // 調整できることが多く、現実味のある表現ができる.
  const standardMaterial = (
    // <meshStandardMaterial
    //   {...params}
    //   map={doorColorTexture}
    //   aoMap={doorAmbientOcclusionTexture}
    //   displacementMap={doorHeightTexture}
    //   metalnessMap={doorMetalnessTexture}
    //   roughnessMap={doorRoughnessTexture}
    //   normalMap={doorNormalTexture}
    //   normalScale={new THREE.Vector2(0.5, 0.5)}
    //   alphaMap={doorAlphaTexture}
    //   transparent={true}
    // />
    <meshStandardMaterial {...params} envMap={cubeMap} />
  );

  return standardMaterial;
};

/**
 * オブジェクト.
 * @param {number} metalness 金属度
 * @param {number} roughness 荒さ
 * @param {number} aoMapIntensity アンビエントオクルージョンエフェクトの強度
 * @param {number} displacementScale 起伏の倍率
 * @return オブジェクト.
 */
const Objects: React.FC<{
  params: {
    metalness: number;
    roughness: number;
    aoMapIntensity: number;
    displacementScale: number;
  };
}> = ({ params }) => {
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

  useEffect(() => {
    if (!sphereRef.current || !planeRef.current || !torusRef.current) {
      return;
    }
    sphereRef.current.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(
        sphereRef.current.geometry.attributes.uv.array,
        2
      )
    );
    planeRef.current.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(
        planeRef.current.geometry.attributes.uv.array,
        2
      )
    );
    torusRef.current.geometry.setAttribute(
      "uv2",
      new THREE.BufferAttribute(
        torusRef.current.geometry.attributes.uv.array,
        2
      )
    );
  });

  return (
    <>
      <mesh ref={sphereRef} position={[-1.5, 0, 0]}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh ref={planeRef}>
        <planeGeometry args={[1, 1, 100, 100]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh ref={torusRef} position={[1.5, 0, 0]}>
        <torusGeometry args={[0.3, 0.2, 64, 128]} />
        <CommonMaterial params={params} />
      </mesh>
    </>
  );
};

/**
 * マテリアル.
 * @param {object} sizes 画面サイズ
 * @return Material
 */
const Material = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    // metalness: 0,
    // roughness: 1,
    metalness: 0.7,
    roughness: 0.2,
    aoMapIntensity: 1,
    displacementScale: 0.05,
  });

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <Light />
        <Objects params={params} />
        <OrbitControls />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber path="metalness" min={0} max={1} step={0.0001} />
        <DatNumber path="roughness" min={0} max={1} step={0.0001} />
        <DatNumber path="aoMapIntensity" min={0} max={10} step={0.0001} />
        <DatNumber path="displacementScale" min={0} max={1} step={0.0001} />
      </DatGui>
    </div>
  );
};

export default Material;
