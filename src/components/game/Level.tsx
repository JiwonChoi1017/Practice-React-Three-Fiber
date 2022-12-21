/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as THREE from "three";

import { CuboidCollider, RigidBody, RigidBodyApi } from "@react-three/rapier";
import { Float, Text, useGLTF } from "@react-three/drei";
import React, { useMemo, useRef, useState } from "react";

import { useFrame } from "@react-three/fiber";

// @ts-ignore
THREE.ColorManagement.legacyMode = false;
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const floor1Material = new THREE.MeshStandardMaterial({
  color: "#111111",
  metalness: 0,
  roughness: 0,
});
const floor2Material = new THREE.MeshStandardMaterial({
  color: "#222222",
  metalness: 0,
  roughness: 0,
});
const obstacleMatarial = new THREE.MeshStandardMaterial({
  color: "#ff0000",
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new THREE.MeshStandardMaterial({
  color: "#887777",
  metalness: 0,
  roughness: 0,
});

/**
 * BlockStart.
 * @param {THREE.Vector3} position 位置
 * @return BlockStart
 */
export const BlockStart: React.FC<{ position?: THREE.Vector3 }> = ({
  position = new THREE.Vector3(),
}) => {
  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./fonts/bebas-neue-v9-latin-regular.woff"
          scale={4}
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0.75, 0.65, 0]}
          rotation-y={-0.25}
        >
          Marble Race
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      {/* floor */}
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
    </group>
  );
};

/**
 * BlockEnd.
 * @param {THREE.Vector3} position 位置
 * @return BlockEnd
 */
export const BlockEnd: React.FC<{ position?: THREE.Vector3 }> = ({
  position = new THREE.Vector3(),
}) => {
  const hamburger = useGLTF("./models/Hamburger/glTF-Binary/Hamburger.glb");
  hamburger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <Text
        font="./fonts/bebas-neue-v9-latin-regular.woff"
        scale={8}
        position={[0, 2.25, 2]}
      >
        FINISH
        <meshBasicMaterial toneMapped={false} />
      </Text>
      {/* floor */}
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor1Material}
        position={[0, 0, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        position-y={0.5}
        restitution={0.2}
        friction={0}
      >
        <primitive object={hamburger.scene} scale={0.2} />
      </RigidBody>
    </group>
  );
};

/**
 * BlockSpinner.
 * @param {THREE.Vector3} position 位置
 * @return BlockSpinner
 */
export const BlockSpinner: React.FC<{ position?: THREE.Vector3 }> = ({
  position = new THREE.Vector3(),
}) => {
  const obstacleRef = useRef<RigidBodyApi>(null);
  const [speed] = useState(
    (Math.random() + 0.2) * Math.random() < 0.5 ? -1 : 1
  );

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotation = new THREE.Quaternion();
    rotation.setFromEuler(new THREE.Euler(0, time * speed, 0));
    obstacleRef.current?.setNextKinematicRotation(rotation);
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMatarial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

/**
 * BlockLimbo.
 * @param {THREE.Vector3} position 位置
 * @return BlockLimbo
 */
export const BlockLimbo: React.FC<{ position?: THREE.Vector3 }> = ({
  position = new THREE.Vector3(),
}) => {
  const obstacleRef = useRef<RigidBodyApi>(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const y = Math.sin(time + timeOffset) + 1.15;
    obstacleRef.current?.setNextKinematicTranslation({
      x: position?.x ?? 0,
      y: (position?.y ?? 0) + y,
      z: position?.z ?? 0,
    });
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMatarial}
          scale={[3.5, 0.3, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

/**
 * BlockAxe.
 * @param {THREE.Vector3} position 位置
 * @return BlockAxe
 */
export const BlockAxe: React.FC<{ position?: THREE.Vector3 }> = ({
  position = new THREE.Vector3(),
}) => {
  const obstacleRef = useRef<RigidBodyApi>(null);
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time + timeOffset) * 1.25;
    obstacleRef.current?.setNextKinematicTranslation({
      x: (position?.x ?? 0) + x,
      y: (position?.y ?? 0) + 0.75,
      z: position?.z ?? 0,
    });
  });

  return (
    <group position={position}>
      {/* floor */}
      <mesh
        receiveShadow
        geometry={boxGeometry}
        material={floor2Material}
        position={[0, -0.1, 0]}
        scale={[4, 0.2, 4]}
      />
      <RigidBody
        ref={obstacleRef}
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
      >
        <mesh
          castShadow
          receiveShadow
          geometry={boxGeometry}
          material={obstacleMatarial}
          scale={[1.5, 1.5, 0.3]}
        />
      </RigidBody>
    </group>
  );
};

/**
 * Bounds.
 * @param {number} length 長さ
 * @return Bounds
 */
const Bounds: React.FC<{ length: number }> = ({ length = 1 }) => {
  return (
    <>
      <RigidBody type="fixed" restitution={0.2} friction={0}>
        <mesh
          castShadow
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />
        <mesh
          receiveShadow
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[0.3, 1.5, 4 * length]}
        />
        <mesh
          receiveShadow
          position={[0, 0.75, -(length * 4) + 2]}
          geometry={boxGeometry}
          material={wallMaterial}
          scale={[4, 1.5, 0.3]}
        />
        <CuboidCollider
          args={[2, 0.1, 2 * length]}
          position={[0, -0.1, -(length * 2) + 2]}
          restitution={0.2}
          friction={1}
        />
      </RigidBody>
    </>
  );
};

/**
 * Level.
 * @param {number} count 数
 * @param {React.ComponentType} types コンポーネント種別
 * @param {number} seed seed
 * @return Level
 */
export const Level: React.FC<{
  count?: number;
  types?: React.ComponentType<{ position?: THREE.Vector3 }>[];
  seed?: number;
}> = ({
  count = 5,
  types = [BlockSpinner, BlockAxe, BlockLimbo],
  seed = 0,
}) => {
  const blocks = useMemo(() => {
    const blocks: React.ComponentType<{
      position?: THREE.Vector3;
    }>[] = [];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      blocks.push(type);
    }

    return blocks;
  }, [count, types, seed]);

  return (
    <>
      <BlockStart position={new THREE.Vector3(0, 0, 0)} />
      {blocks.map((Block, index) => (
        <Block
          key={index}
          position={new THREE.Vector3(0, 0, -(index + 1) * 4)}
        />
      ))}
      <BlockEnd position={new THREE.Vector3(0, 0, -(count + 1) * 4)} />
      <Bounds length={count + 2} />
    </>
  );
};
