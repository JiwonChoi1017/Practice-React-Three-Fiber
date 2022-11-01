/* eslint-disable react/no-unknown-property */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls, useGLTF } from "@react-three/drei";

import { PCFSoftShadowMap } from "three";
import { Props } from "../../Common";
import React from "react";
import classes from "../../styles/Global.module.css";

const glbPath = "./models/Duck/glTF-Binary/Duck.glb";
type GLTFResult = GLTF & {
  nodes: THREE.Mesh;
  materials: THREE.MeshStandardMaterial;
};

/**
 * Lights.
 * @return Lights
 */
const Lights = () => {
  return (
    <>
      <ambientLight color={0xffffff} intensity={0.8} />
      <directionalLight
        castShadow
        color={0xffffff}
        intensity={0.3}
        position={[5, 5, 5]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={15}
        shadow-camera-left={-7}
        shadow-camera-top={7}
        shadow-camera-right={7}
        shadow-camera-bottom={-7}
      />
    </>
  );
};

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  // const gltf = useLoader(GLTFLoader, "./models/Duck/glTF/Duck.gltf");

  // const gltf = useLoader(GLTFLoader, "./models/Duck/glTF-Embedded/Duck.gltf");
  // const gltf = useLoader(
  //   GLTFLoader,
  //   "./models/FlightHelmet/glTF/FlightHelmet.gltf"
  // );

  // const { nodes, materials } = useGLTF(glbPath) as GLTFResult;

  // @ts-ignore
  // const { nodes, materials } = useGLTF("./models/Duck/glTF-Draco/Duck.gltf");

  const gltf = useGLTF("./models/Fox/glTF/Fox.gltf");
  gltf.scene.scale.set(0.025, 0.025, 0.025);

  const mixer = new THREE.AnimationMixer(gltf.scene);
  const action = mixer.clipAction(gltf.animations[2]);
  action.play();

  let prevTime = 0;
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const deltaTime = elapsedTime - prevTime;
    prevTime = elapsedTime;
    mixer.update(deltaTime);
  });

  return (
    <>
      <primitive object={gltf.scene} />
      {/* <mesh
        geometry={nodes.geometry}
        material={materials}
        scale={[1.5, 1.5, 1.5]}
      /> */}
      <mesh receiveShadow rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#444444" metalness={0} roughness={0.5} />
      </mesh>
    </>
  );
};

/**
 * ImportModel.
 * @param {object} sizes 画面サイズ
 * @return ImportModel
 */
const ImportModel = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        camera={{
          fov: 75,
          aspect: sizes.width / sizes.height,
          near: 0.1,
          far: 100,
          position: [2, 2, 2],
        }}
        shadows={{
          enabled: true,
          type: PCFSoftShadowMap,
        }}
      >
        <color attach="background" args={["black"]} />
        <Lights />
        <Objects />
        <OrbitControls target={[0, 0.75, 0]} enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default ImportModel;
