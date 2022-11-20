/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import DatGui, { DatNumber } from "react-dat-gui";
import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";

import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";
import flagTextureUrl from "../../assets/textures/flag/ntf_131.png";

/**
 * vertexShader.
 */
const vertexShader = `
  // uniform mat4 modelMatrix; //オブジェクト座標からワールド座標へ変換.
  // uniform mat4 viewMatrix; // ワールド座標から視点座標へ変換.
  // uniform mat4 projectionMatrix; // カメラの各種パラメータから３次元を２次元に射影し、クリップ座標系に変換する行列. 
  uniform vec2 uFrequency;
  uniform float uTime;

  // attribute vec3 position;
  // attribute vec2 uv; // テクスチャを貼るためのUV座標
  // attribute float aRandom;

  varying vec2 vUv; // fragmentShaderに渡すためのvarying変数.
  varying float vElevation;
  // varying float vRandom;

  void main()
  {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x - uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;

    modelPosition.z += elevation;
    // modelPosition.z += aRandom * 0.1;
    
    // 変換：ローカル座標 → 配置 → カメラ座標 → 画面座標.
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    
    // vRandom = aRandom;
    // 処理する頂点ごとのuv（テクスチャ）座標をそのままfragmentShaderに横流しする.
    vUv = uv;
    vElevation = elevation;
  }
`;

/**
 * fragmentShader.
 */
const fragmentShader = `
  // precision mediump float;

  // varying float vRandom;
  uniform vec3 uColor;
  // uniform変数としてテクスチャのデータを受け取る.
  uniform sampler2D uTexture;
  // vertexShaderで処理されて渡されるテクスチャ座標.
  varying vec2 vUv;
  varying float vElevation;

  void main()
  {
    // テクスチャの色情報をそのままピクセルに塗る.
    vec4 textureColor = texture2D(uTexture, vUv);
    // gl_FragColor = vec4(vRandom, vRandom * 0.5, 1.0, 1.0);
    // gl_FragColor = vec4(uColor, 1.0);
    textureColor.rgb *= vElevation * 2.0 + 0.5;
    gl_FragColor = textureColor;
    gl_FragColor = vec4(vUv, 1.0, 1.0);
  }  
`;

/**
 * オブジェクト.
 * @param {number} x x軸
 * @param {number} y y軸
 * @return オブジェクト.
 */
const Objects: React.FC<{
  params: {
    x: number;
    y: number;
  };
}> = ({ params }) => {
  const planeRef = useRef<THREE.PlaneGeometry>(null);
  const [flagTexture] = useTexture([flagTextureUrl]);
  const uFrequency = {
    value: new THREE.Vector2(params.x, params.y),
  };
  const uTime = {
    value: 0,
  };
  const uColor = {
    value: new THREE.Color("orange"),
  };
  const uTexture = {
    value: flagTexture,
  };

  useEffect(() => {
    if (!planeRef.current) return;
    const count = planeRef.current.attributes.position.count;
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }
    planeRef.current.setAttribute(
      "aRandom",
      new THREE.BufferAttribute(randoms, 1)
    );
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    uTime.value = elapsedTime;
  });

  return (
    <mesh scale={[1, 2 / 3, 1]}>
      <planeGeometry ref={planeRef} args={[1, 1, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        // transparent={true}
        uniforms={{
          uFrequency: uFrequency,
          uTime: uTime,
          uColor: uColor,
          uTexture: uTexture,
        }}
      />
    </mesh>
  );
};

/**
 * Shaders.
 *
 * glslについては下記をご参考ください。
 * https://qiita.com/kitasenjudesign/items/1657d9556591284a43c8
 * @param {object} sizes 画面サイズ
 * @return Shaders.
 */
const Shaders = ({ sizes }: Props) => {
  const [params, setParams] = useState({
    x: 10,
    y: 5,
  });

  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          aspect: sizes.width / sizes.height,
          fov: 75,
          near: 0.1,
          far: 100,
          position: [0.25, -0.25, 1],
        }}
        gl={{
          pixelRatio: Math.min(window.devicePixelRatio, 2),
        }}
      >
        <color attach="background" args={["#211d20"]} />
        <Objects params={params} />
        <OrbitControls enableDamping={true} />
      </Canvas>
      <DatGui data={params} onUpdate={setParams}>
        <DatNumber path="x" min={0} max={20} step={0.01} label="frequencyX" />
        <DatNumber path="y" min={0} max={20} step={0.01} label="frequencyY" />
      </DatGui>
    </div>
  );
};

export default Shaders;
