/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, useCubeTexture, useTexture } from "@react-three/drei";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Leva } from "leva";
import React from "react";
import mapTextureUrl from "../../assets/models/LeePerrySmith/color.jpg";
import normalTextureUrl from "../../assets/models/LeePerrySmith/normal.jpg";

/**
 * commonShader.
 */
const commonShader = `
  #include <common>

  uniform float uTime;
  
  mat2 get2dRotateMatrix(float _angle)
  {
    return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
  }
`;

/**
 * beginNormalVertexShader.
 */
const beginNormalVertexShader = `
  #include <beginnormal_vertex>

  float angle = (position.y + uTime) * 0.9;  
  mat2 rotateMatrix = get2dRotateMatrix(angle);
  
  objectNormal.xz = rotateMatrix * objectNormal.xz;
`;

/**
 * beginVertexShader.
 */
const beginVertexShader = `
  #include <begin_vertex>
  
  float angle = (position.y + uTime) * 0.9;  
  mat2 rotateMatrix = get2dRotateMatrix(angle);

  transformed.xz = rotateMatrix * transformed.xz;
`;

/**
 * beginVertexShader(影用).
 */
const beginVertexShaderForShadow = `
  #include <begin_vertex>
  
  transformed.xz = rotateMatrix * transformed.xz;
`;

/**
 * Lights.
 * @return Lights.
 */
const Lights = () => {
  return (
    <directionalLight
      castShadow
      color="#ffffff"
      intensity={3}
      shadow-mapSize={[1024, 1024]}
      shadow-camera-far={15}
      shadow-normalBias={0.05}
      position={[0.25, 2, -2.25]}
    />
  );
};

/**
 * Model.
 * @return Model.
 */
const Model = () => {
  const { scene } = useThree();
  const envMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    {
      path: "/textures/environmentMaps/",
    }
  );
  envMap.encoding = THREE.sRGBEncoding;

  const [mapTexture, normalTexture] = useTexture([
    mapTextureUrl,
    normalTextureUrl,
  ]);

  const customUniforms = {
    uTime: { value: 0 },
  };

  scene.background = envMap;
  scene.environment = envMap;
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 1;
      child.material.needsUpdate = true;
      child.material.map = mapTexture;
      child.material.normalMap = normalTexture;
      // Material.onBeforeCompile: WebGLRenderer側でマテリアルのシェーダープログラムがコンパイルされる直前に呼ばれる関数.
      // 第一引数にはプロパティにvertexShader, fragmentShaderを持つShaderオブジェクトが渡ってくるので、この関数内でシェーダーソースの追記が可能.
      // ただ、追記といっても、vertexShader, fragmentShaderはstringなのでstring.replaceを使って任意の記述に上書きする形で追記する.
      child.material.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          commonShader
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          beginVertexShader
        );
      };
      const depthMaterial = new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
      });
      depthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.uTime = customUniforms.uTime;
        shader.vertexShader = shader.vertexShader.replace(
          "#include <common>",
          commonShader
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <beginnormal_vertex>",
          beginNormalVertexShader
        );
        shader.vertexShader = shader.vertexShader.replace(
          "#include <begin_vertex>",
          beginVertexShaderForShadow
        );
      };
      child.customDepthMaterial = depthMaterial;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;
    customUniforms.uTime.value = elapsedTime;
  });

  const gltf = useLoader(GLTFLoader, "/models/LeePerrySmith/LeePerrySmith.glb");

  return (
    <>
      <group rotation-y={Math.PI * 0.5}>
        <primitive object={gltf.scene} />
      </group>
      <mesh receiveShadow position={[0, -5, 5]} rotation-y={Math.PI}>
        <planeGeometry args={[15, 15, 15]} />
        <meshStandardMaterial />
      </mesh>
    </>
  );
};

/**
 * ModifiedMaterials.
 * @return ModifiedMaterials.
 */
const ModifiedMaterials = () => {
  return (
    <>
      <Leva />
      <Canvas
        camera={{
          position: [4, 1, -4],
        }}
        gl={{
          antialias: true,
          physicallyCorrectLights: true,
          outputEncoding: THREE.sRGBEncoding,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
        shadows={{
          enabled: true,
          type: THREE.PCFShadowMap,
        }}
      >
        <Lights />
        <Model />
        <OrbitControls />
      </Canvas>
    </>
  );
};

export default ModifiedMaterials;
