/* eslint-disable react/no-unknown-property */

import "/node_modules/react-dat-gui/dist/index.css";

import * as THREE from "three";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Cursor, Props, Sizes } from "../../Common";
import DatGui, { DatColor } from "react-dat-gui";
import React, { useEffect, useRef, useState } from "react";

import classes from "../../styles/Global.module.css";
import gradientTextureUrl from "../../assets/textures/gradients/3.jpg";
import gsap from "gsap";
import { useTexture } from "@react-three/drei";

interface NewProps extends Props {
  sizes: Sizes;
  cursor: Cursor;
  onChangeCursor: (event: MouseEvent) => void;
}

const objectDistance = 5;

/**
 * Particles.
 * @param {string} materialColor マテリアルカラー
 * @return Particles
 */
const Particles: React.FC<{
  params: {
    materialColor: string;
  };
}> = ({ params }) => {
  const particlesCount = 200;
  const positions = new Float32Array(particlesCount * 3);
  const pointsRef = useRef<THREE.Points>(null);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] =
      objectDistance * 0.5 - Math.random() * objectDistance * 3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }

  useEffect(() => {
    if (!pointsRef.current) return;

    pointsRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        color={params.materialColor}
        sizeAttenuation={true}
        size={0.03}
      />
    </points>
  );
};

/**
 * オブジェクト.
 * @return オブジェクト.
 */
const Objects: React.FC<{
  params: {
    materialColor: string;
  };
  sizes: Sizes;
  cursor: Cursor;
  onChangeCursor: (event: MouseEvent) => void;
}> = ({ params, sizes, cursor, onChangeCursor }) => {
  const mesh1Ref = useRef<THREE.Mesh>(null);
  const mesh2Ref = useRef<THREE.Mesh>(null);
  const mesh3Ref = useRef<THREE.Mesh>(null);

  let currentSection = 0;

  const { scene, camera } = useThree();
  const cameraGroup = new THREE.Group();
  scene.add(cameraGroup);
  cameraGroup.add(camera);

  useEffect(() => {
    if (!mesh1Ref.current || !mesh2Ref.current || !mesh3Ref.current) {
      return;
    }

    const sectionMeshes = [
      mesh1Ref.current,
      mesh2Ref.current,
      mesh3Ref.current,
    ];

    mesh1Ref.current.position.x = 2;
    mesh1Ref.current.position.y = -objectDistance * 0;
    mesh2Ref.current.position.x = -2;
    mesh2Ref.current.position.y = -objectDistance * 1;
    mesh3Ref.current.position.x = 2;
    mesh3Ref.current.position.y = -objectDistance * 2;

    window.addEventListener("scroll", () => {
      const scrollY = window.scrollY;
      const newSection = Math.round(scrollY / sizes.height);
      if (currentSection !== newSection) {
        currentSection = newSection;
        gsap.to(sectionMeshes[currentSection].rotation, {
          duration: 1.5,
          ease: "power2.inOut",
          x: "+=6",
          y: "+=3",
          z: "+=1.5",
        });
      }
      camera.position.y = (-scrollY / sizes.height) * objectDistance;
    });
    window.addEventListener("mousemove", (event) => onChangeCursor(event));
  }, []);

  let previousTime = 0;
  useFrame((state) => {
    if (!mesh1Ref.current || !mesh2Ref.current || !mesh3Ref.current) {
      return;
    }

    const elapsedTime = state.clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    const sectionMeshes = [
      mesh1Ref.current,
      mesh2Ref.current,
      mesh3Ref.current,
    ];

    sectionMeshes.map((mesh) => {
      mesh.rotation.x += deltaTime * 0.1;
      mesh.rotation.y += deltaTime * 0.12;
    });

    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    cameraGroup.position.x +=
      (parallaxX - cameraGroup.position.x) * 1 * deltaTime;
    cameraGroup.position.y +=
      (parallaxY - cameraGroup.position.y) * 1 * deltaTime;
  });

  return (
    <>
      <mesh ref={mesh1Ref}>
        <torusGeometry args={[1, 0.4, 16, 60]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh ref={mesh2Ref}>
        <coneGeometry args={[1, 2, 32]} />
        <CommonMaterial params={params} />
      </mesh>
      <mesh ref={mesh3Ref}>
        <torusKnotGeometry args={[0.8, 0.35, 100, 16]} />
        <CommonMaterial params={params} />
      </mesh>
    </>
  );
};

/**
 * 共通マテリアル.
 * @param {string} materialColor マテリアルカラー
 * @return 共通マテリアル.
 */
const CommonMaterial: React.FC<{
  params: {
    materialColor: string;
  };
}> = ({ params }) => {
  const gradientTexture = useTexture(gradientTextureUrl);
  gradientTexture.magFilter = THREE.NearestFilter;
  return (
    <meshToonMaterial
      color={params.materialColor}
      gradientMap={gradientTexture}
    />
  );
};

/**
 * ScrollBasedAnimation.
 * @param {object} sizes 画面サイズ
 * @param {object} cursor カーソル
 * @param {function} onChangeCursor カーソルステータスを更新
 * @return ScrollBasedAnimation.
 */
const ScrollBasedAnimation = ({ sizes, cursor, onChangeCursor }: NewProps) => {
  const [params, setParams] = useState({
    materialColor: "#ff0000",
  });

  return (
    <>
      <div
        style={{ width: sizes.width, height: sizes.height }}
        className={classes.canvas_new}
      >
        <Canvas
          camera={{
            position: [0, 0, 6],
            fov: 35,
            aspect: sizes.width / sizes.height,
            near: 0.1,
            far: 100,
          }}
        >
          <color attach="background" args={["#1e1a20"]} />
          <directionalLight
            color="#ffffff"
            intensity={1}
            position={new THREE.Vector3(1, 1, 0)}
          />
          <Objects
            params={params}
            sizes={sizes}
            cursor={cursor}
            onChangeCursor={onChangeCursor}
          />
          <Particles params={params} />
        </Canvas>
      </div>
      <section className={classes.section}>
        <h1>My Portfolio</h1>
      </section>
      <section className={classes.section}>
        <h2>My projects</h2>
      </section>
      <section className={classes.section}>
        <h2>Contact me</h2>
      </section>
      {/* 他要素の前に書くとデバッガーが出なくなるので、要注意 */}
      <DatGui data={params} onUpdate={setParams}>
        <DatColor path="materialColor" />
      </DatGui>
    </>
  );
};

export default ScrollBasedAnimation;
