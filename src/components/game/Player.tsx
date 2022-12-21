/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import React, { useEffect, useRef, useState } from "react";
import { RigidBody, RigidBodyApi, useRapier } from "@react-three/rapier";

import { useFrame } from "@react-three/fiber";
import useGame from "../../stores/useGame";
import { useKeyboardControls } from "@react-three/drei";

/**
 * Player.
 * @return Player
 */
const Player = () => {
  const playerRef = useRef<RigidBodyApi>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [smoothedCameraPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(10, 10, 10)
  );
  const [smoothedCameraTarget] = useState<THREE.Vector3>(new THREE.Vector3());

  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);
  const blocksCount = useGame((state) => state.blocksCount);

  const jumpHandler = () => {
    const origin = playerRef.current?.translation() ?? new THREE.Vector3();
    origin.y -= 0.31;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);
    const toi = hit?.toi ?? 0;
    if (toi < 0.15) {
      playerRef.current?.applyImpulse({ x: 0, y: 0.5, z: 0 });
    }
  };

  const resetHandler = () => {
    playerRef.current?.setTranslation({ x: 0, y: 1, z: 0 });
    playerRef.current?.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current?.setAngvel({ x: 0, y: 0, z: 0 });
  };

  // TODO: Uncaught Error: Invalid hook call.が出てるので直したい
  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === "ready") resetHandler();
      }
    );

    const unsubscribeJump = subscribeKeys(
      (state: {
        backward: boolean;
        forward: boolean;
        leftward: boolean;
        rightward: boolean;
        jump: boolean;
      }) => state.jump,
      (value: boolean) => {
        if (value) jumpHandler();
      }
    );

    const unsubscribeAny = subscribeKeys(() => {
      start();
    });

    return () => {
      unsubscribeReset();
      unsubscribeJump();
      unsubscribeAny();
    };
  }, []);

  useFrame((state, delta) => {
    // controls
    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulseStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulseStrength;
      torque.x -= torqueStrength;
    }

    if (rightward) {
      impulse.x += impulseStrength;
      torque.z -= torqueStrength;
    }

    if (backward) {
      impulse.z += impulseStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulseStrength;
      torque.z += torqueStrength;
    }

    playerRef.current?.applyImpulse(impulse);
    playerRef.current?.applyTorqueImpulse(torque);

    // camera
    const playerPosition =
      playerRef.current?.translation() ?? new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);
    cameraTarget.y += 0.25;

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothedCameraPosition);
    state.camera.lookAt(smoothedCameraTarget);

    if (playerPosition.z < -(blocksCount * 4 + 2)) {
      end();
    }

    if (playerPosition.y < -4) {
      restart();
    }
  });

  return (
    <RigidBody
      ref={playerRef}
      colliders="ball"
      position={[0, 1, 0]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};

export default Player;
