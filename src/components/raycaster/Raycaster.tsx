/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";

import { OrbitControls } from "@react-three/drei";
import { Props } from "../../Common";
import classes from "../../styles/Global.module.css";

/**
 * グループ.
 * @return グループ.
 */
const Groups = () => {
  const object1Ref = useRef<THREE.Mesh>(null);
  const object2Ref = useRef<THREE.Mesh>(null);
  const object3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!object1Ref.current || !object2Ref.current || !object3Ref.current)
      return;

    const elapsedTime = state.clock.getElapsedTime();

    object1Ref.current.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2Ref.current.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3Ref.current.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

    // three.jsを採用した場合の書き方.
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(1, 0, 0);
    // rayDirection.normalize();
    // state.raycaster.set(rayOrigin, rayDirection);

    // const objects = [
    //   object1Ref.current,
    //   object2Ref.current,
    //   object3Ref.current,
    // ];
    // const intersects = state.raycaster.intersectObjects(objects);

    // objects.map((object) => {
    //   const material = object.material as THREE.MeshBasicMaterial;
    //   material.color.set("#ff0000");
    // });

    // intersects.map((intersect) => {
    //   const object = intersect.object as THREE.Mesh;
    //   const material = object.material as THREE.MeshBasicMaterial;
    //   material.color.set("#0000ff");
    // });
  });

  return (
    <group>
      <Object
        props={{ ref: object1Ref, position: new THREE.Vector3(-2, 0, 0) }}
      />
      <Object
        props={{ ref: object2Ref, position: new THREE.Vector3(0, 0, 0) }}
      />
      <Object
        props={{ ref: object3Ref, position: new THREE.Vector3(2, 0, 0) }}
      />
    </group>
  );
};

/**
 * オブジェクト.
 * @param {React.RefObject} ref ref
 * @param {THREE.Vector3} position 位置
 * @return オブジェクト.
 */
const Object: React.FC<{
  props: {
    ref?: React.RefObject<
      THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>
    >;
    position: THREE.Vector3;
  };
}> = ({ props }) => {
  const [hover, setHover] = useState<boolean>();
  return (
    <mesh
      {...props}
      // r3fではこの1~X行で終わる.
      onClick={(event) => console.log("clicked!")}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial color={hover ? "#0000ff" : "#ff0000"} />
    </mesh>
  );
};

/**
 * Raycaster.
 * @param {object} sizes 画面サイズ
 * @return Raycaster.
 */
const Raycaster = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
        }}
      >
        <color attach="background" args={["black"]} />
        <Groups />
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default Raycaster;
