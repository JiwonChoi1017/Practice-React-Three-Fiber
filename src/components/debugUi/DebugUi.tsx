/* eslint-disable react/no-unknown-property */

import * as THREE from "three";
import * as dat from "dat.gui";

import React, { useEffect, useMemo, useRef } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Sizes } from "../../Common";
import classes from "../../styles/Global.module.css";
import gsap from "gsap";

/**
 * Props.
 */
interface Props {
  sizes: Sizes;
}

/**
 * キューブ.
 * @return キューブ.
 */
const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const gui = useMemo(() => new dat.GUI({ closed: true, width: 400 }), []);
  // const gui = useMemo(() => new dat.GUI(), []);
  const params = {
    color: "#e91e63",
    spin: () => {
      if (!cubeRef.current) return;
      gsap.to(cubeRef.current?.rotation, {
        duration: 1,
        y: cubeRef.current?.rotation.y + 10,
      });
    },
  };

  useEffect(() => {
    if (!cubeRef.current || !materialRef.current) {
      return;
    }
    // gui.add(cubeRef.current.position, "y", -3, 3, 0.01);
    gui
      .add(cubeRef.current.position, "y")
      .min(-3)
      .max(3)
      .step(0.01)
      .name("elevation");
    gui.add(cubeRef.current.position, "x", -3, 3, 0.01);
    gui.add(cubeRef.current.position, "z", -3, 3, 0.01);
    // cubeRef.current.visible = false;
    gui.add(cubeRef.current, "visible");
    gui.add(materialRef.current, "wireframe");

    gui.addColor(params, "color").onChange(() => {
      materialRef.current?.color.set(params.color);
    });
    gui.add(params, "spin");
    // 画面リサイズ時にguiが増えないように破棄する.
    // destroyをせずに済む方法があれば直したい…
    return () => gui.destroy();
  }, []);

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial ref={materialRef} color={params.color} />
    </mesh>
  );
  return object;
};

/**
 * DebugUi.
 * @param {object} sizes 画面サイズ
 * @return DebugUi.
 */
const DebugUi = ({ sizes }: Props) => {
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

export default DebugUi;
