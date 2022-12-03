/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import React, { useEffect, useRef } from "react";

import { Perf } from "r3f-perf";

const torusGeometry = new THREE.TorusGeometry(1, 0.6, 16, 32);
const material = new THREE.MeshMatcapMaterial();

/**
 * TextObject.
 * @return TextObject
 */
const TextObject = () => {
  const donuts = useRef<THREE.Mesh[]>([]);
  const [matcapTexture] = useMatcapTexture("7B5254_E9DCC7_B19986_C8AC91", 256);

  useEffect(() => {
    matcapTexture.encoding = THREE.sRGBEncoding;
    matcapTexture.needsUpdate = true;

    material.matcap = matcapTexture;
    material.needsUpdate = true;
  }, []);

  useFrame((state, delta) => {
    if (!donuts.current) return;
    for (const donut of donuts.current) {
      donut.rotation.y += delta * 0.1;
    }
  });

  return (
    <>
      <Center>
        <Text3D
          font="./fonts/helvetiker_regular.typeface.json"
          size={0.75}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          material={material}
        >
          HELLO R3F
        </Text3D>
      </Center>

      {[...Array(100)].map((value, idx) => {
        return (
          <mesh
            ref={(element) => {
              if (element) {
                donuts.current[idx] = element;
              }
            }}
            key={idx}
            geometry={torusGeometry}
            material={material}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            scale={0.2 + Math.random() * 0.2}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          />
        );
      })}
    </>
  );
};

/**
 * ThreeDTextWithR3f.
 * @return ThreeDTextWithR3f
 */
const ThreeDTextWithR3f = () => {
  return (
    <>
      <Canvas camera={{ fov: 45, near: 0.1, far: 200, position: [4, -2, 6] }}>
        <Perf position="top-left" />
        <color attach="background" args={["ivory"]} />
        <TextObject />
        <OrbitControls makeDefault />
      </Canvas>
    </>
  );
};

export default ThreeDTextWithR3f;
