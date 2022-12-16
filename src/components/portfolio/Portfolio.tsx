/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  ContactShadows,
  Environment,
  Float,
  Html,
  PresentationControls,
  Text,
  useGLTF,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import React from "react";
import classes from "../../styles/Global.module.css";

/**
 * Object.
 * @return Object.
 */
const Object = () => {
  const { scene } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/macbook/model.gltf"
  );

  const macbookMeshes = scene.children[0].children;

  const macbook = macbookMeshes
    .map((item) => {
      const newItem = item as THREE.Mesh;
      // @ts-ignore
      // グループだったら子要素のmeshを探して描画する。・・・他にいい方法ないかな。
      if (item.isGroup) {
        return item.children.map((child) => {
          const newChild = child as THREE.Mesh;
          // どうしてもロゴの位置がずれちゃうので一旦外す
          if (newChild.name === "AppleLogo000") {
            return;
          }

          return (
            <mesh
              key={newChild.uuid}
              geometry={newChild.geometry}
              material={newChild.material}
              position={item.position}
              rotation={item.rotation}
              scale={item.scale}
            />
          );
        });
      } else {
        return (
          <mesh
            key={newItem.uuid}
            geometry={newItem.geometry}
            material={newItem.material}
            position={newItem.position}
            rotation={newItem.rotation}
            scale={newItem.scale}
          />
        );
      }
    })
    // undefined排除
    .filter((it) => it);

  return (
    <>
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <Float rotationIntensity={0.4}>
          {/* ScreenLight */}
          <rectAreaLight
            width={2.5}
            height={1.65}
            intensity={65}
            color={"#ff6900"}
            rotation={[0.1, Math.PI, 0]}
            position={[0, 0.55, -1.15]}
          />
          {/* Model */}
          <group scale={0.1} position-y={-0.8}>
            ${macbook}
          </group>
          <Html
            transform
            distanceFactor={1.14}
            position={[0, 0.18, -1.35]}
            rotation-x={-0.256}
          >
            <iframe
              className={classes.htmlScreen}
              src="https://bruno-simon.com/html/"
            />
          </Html>
          <Text
            font="./fonts/bangers-v20-latin-regular.woff"
            fontSize={1}
            position={[2, 0.75, 0.75]}
            rotation-y={-1.25}
            maxWidth={2}
            textAlign="center"
          >
            BRUNO SIMON
          </Text>
        </Float>
      </PresentationControls>
      <ContactShadows position-y={-1.4} opacity={0.4} scale={5} blur={2.4} />
    </>
  );
};

/**
 * Portfolio.
 * @return Portfolio.
 */
const Portfolio = () => {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [-3, 1.5, 4],
      }}
    >
      <Environment preset="city" />
      <color args={["#695b5b"]} attach="background" />
      <Object />
    </Canvas>
  );
};

export default Portfolio;
