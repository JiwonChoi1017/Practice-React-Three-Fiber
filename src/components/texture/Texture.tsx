/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { OrbitControls, useTexture } from "@react-three/drei";
import React, { useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";
import textureUrl from "../../assets/textures/minecraft.png";

/**
 * キューブ.
 * @return キューブ.
 */
const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(textureUrl);
  // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  // texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
  // texture.repeat.x = 2;
  // texture.repeat.y = 3;
  // texture.offset.x = 0.5;
  // texture.offset.y = 0.5;
  // texture.rotation = Math.PI / 4;
  // texture.center.y = texture.center.x = 0.5;
  texture.generateMipmaps = false;
  // texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
  return object;
};

/**
 * テクスチャ
 * @param {object} sizes 画面サイズ
 * @return Texture
 */
const Texture = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas>
        <color attach="background" args={["black"]} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Texture;
