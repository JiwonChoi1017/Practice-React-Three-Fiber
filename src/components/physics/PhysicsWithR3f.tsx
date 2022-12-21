/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import {
  BallCollider,
  CuboidCollider,
  CylinderCollider,
  Debug,
  InstancedRigidBodies,
  Physics,
  RigidBody,
  RigidBodyApi,
  Vector3Array,
} from "@react-three/rapier";
import { BufferGeometry, InstancedMesh, Material } from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Perf } from "r3f-perf";

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <directionalLight castShadow position={[1, 2, 3]} />
      <ambientLight intensity={0.5} />
    </>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const cubeRef = useRef<RigidBodyApi>(null);
  const twisterRef = useRef<RigidBodyApi>(null);

  const [hitSound] = useState(new Audio("./audio/hit.mp3"));

  const hamburger = useGLTF("./models/Hamburger/glTF-Binary/Hamburger.glb");

  const cubesCount = 300;
  const cubesTransforms = useMemo(() => {
    const positions: Vector3Array[] = [];
    const rotations: Vector3Array[] = [];
    const scales: Vector3Array[] = [];

    for (let i = 0; i < cubesCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 8,
        6 + i * 0.2,
        (Math.random() - 0.5) * 8,
      ]);
      rotations.push([Math.random(), Math.random(), Math.random()]);
      const scale = 0.2 + Math.random() * 0.8;
      scales.push([scale, scale, scale]);
    }

    return { positions, rotations, scales };
  }, []);

  const cubesRef = useRef<InstancedMesh>(null);

  const jumpHandler = () => {
    const mass = cubeRef.current?.mass() ?? 1;
    cubeRef.current?.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cubeRef.current?.applyTorqueImpulse({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  const collisionEnterHandler = () => {
    // hitSound.currentTime = 0;
    // hitSound.volume = Math.random();
    // hitSound.play();
  };

  // useEffect(() => {
  //   for (let i = 0; i < cubesCount; i++) {
  //     const matrix = new THREE.Matrix4();
  //     matrix.compose(
  //       new THREE.Vector3(i * 2, 0, 0),
  //       new THREE.Quaternion(),
  //       new THREE.Vector3(1, 1, 1)
  //     );
  //     cubesRef.current?.setMatrixAt(i, matrix);
  //   }
  // }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const eulerRotation = new THREE.Euler(0, time * 3, 0);
    const quarternionRotation = new THREE.Quaternion();
    quarternionRotation.setFromEuler(eulerRotation);
    twisterRef.current?.setNextKinematicRotation(quarternionRotation);

    const angle = time * 0.5;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    twisterRef.current?.setNextKinematicTranslation({ x, y: -0.8, z });
  });

  return (
    <Physics gravity={[0, -9.81, 0]}>
      {/* <Debug /> */}
      <RigidBody colliders="ball">
        <mesh castShadow position={[-1.5, 2, 0]}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </RigidBody>
      <RigidBody
        ref={cubeRef}
        colliders={false}
        position={[1.5, 2, 0]}
        // rotation={[Math.PI * 0.5, 0, 0]}
        gravityScale={1}
        restitution={0}
        friction={0}
        onCollisionEnter={collisionEnterHandler}
        // onCollisionExit={() => {
        //   console.log("exit");
        // }}
        onSleep={() => {
          console.log("sleep");
        }}
        onWake={() => {
          console.log("wake");
        }}
      >
        {/* <CuboidCollider args={[1.5, 1.5, 0.5]} />
        <CuboidCollider
          args={[0.25, 1, 0.25]}
          position={[0, 0, 1]}
          rotation={[-Math.PI * 0.35, 0, 0]}
        /> */}
        {/* <BallCollider args={[1.5]} />
        <mesh castShadow>
          <torusGeometry args={[1, 0.5, 16, 32]} />
          <meshStandardMaterial color="mediumpurple" />
        </mesh> */}
        <CuboidCollider mass={2} args={[0.5, 0.5, 0.5]} />
        <mesh
          castShadow
          onClick={() => {
            jumpHandler();
          }}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" friction={0.7}>
        <mesh receiveShadow position-y={-1.25}>
          <boxGeometry args={[10, 0.5, 10]} />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </RigidBody>
      <RigidBody
        ref={twisterRef}
        position={[0, -0.8, 0]}
        friction={0}
        type="kinematicPosition"
      >
        <mesh castShadow scale={[0.4, 0.4, 3]}>
          <boxGeometry />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
      <RigidBody colliders={false} position={[0, 4, 0]}>
        <CylinderCollider args={[0.5, 1.25]} />
        <primitive object={hamburger.scene} scale={0.25} />
      </RigidBody>
      <RigidBody type="fixed">
        <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.5]} />
        <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.5]} />
        <CuboidCollider args={[0.5, 2, 5]} position={[5.5, 1, 0]} />
        <CuboidCollider args={[0.5, 2, 5]} position={[-5.5, 1, 0]} />
      </RigidBody>
      <InstancedRigidBodies
        positions={cubesTransforms.positions}
        rotations={cubesTransforms.rotations}
        scales={cubesTransforms.scales}
      >
        <instancedMesh
          ref={cubesRef}
          castShadow
          args={[new BufferGeometry(), new Material(), cubesCount]}
        >
          <boxGeometry />
          <meshStandardMaterial color="tomato" />
        </instancedMesh>
      </InstancedRigidBodies>
    </Physics>
  );
};

/**
 * PhysicsWithR3f.
 * @return PhysicsWithR3f
 */
const PhysicsWithR3f = () => {
  return (
    <Canvas
      shadows
      camera={{ fov: 45, near: 0.1, far: 200, position: [4, 2, 6] }}
    >
      <Perf position="top-left" />
      <Lights />
      <Objects />
      <OrbitControls makeDefault />
    </Canvas>
  );
};

export default PhysicsWithR3f;
