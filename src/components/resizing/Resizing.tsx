/* eslint-disable react/no-unknown-property */

import { Canvas, useFrame } from "@react-three/fiber";
import React, { useRef } from "react";

import { OrbitControls } from "@react-three/drei";
import { Props } from "../../types/Common";
import classes from "../../styles/Global.module.css";

/**
 * DocumentWithFullscreen.
 */
interface DocumentWithFullscreen extends Document {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => void;
}

/**
 * DocumentElementWithFullscreen.
 */
interface DocumentElementWithFullscreen extends HTMLCanvasElement {
  webkitRequestFullscreen?: () => void;
}

/**
 * フルスクリーンか.
 */
const isFullscreen = () => {
  const doc = document as DocumentWithFullscreen;
  return !!(doc.fullscreenElement || doc.webkitFullscreenElement);
};

/**
 * フルスクリーン表示を行う.
 */
const requestFullscreen = (element: DocumentElementWithFullscreen) => {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
};

/**
 * フルスクリーン解除を行う.
 */
const exitFullscreen = (doc: DocumentWithFullscreen) => {
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  }
};

/**
 * ダブルクリック時に実行するメソッド.
 * @param {event} マウスイベント
 */
const onDoubleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
  const target = event.target as HTMLCanvasElement;

  if (!isFullscreen()) {
    requestFullscreen(target);
  } else {
    exitFullscreen(document);
  }
};

/**
 * キューブ.
 * @return Cube
 */
const Cube = () => {
  const cubeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (!cubeRef.current) {
      return;
    }
    state.camera.lookAt(cubeRef.current.position);
    cubeRef.current.rotation.y = elapsedTime;
  });

  const object = (
    <mesh ref={cubeRef}>
      <boxGeometry args={[1, 1, 1, 5, 5, 5]} />
      <meshBasicMaterial color="#e91e63" />
    </mesh>
  );
  return object;
};

/**
 * 画面をリサイズ.
 * @param {object} sizes 画面サイズ
 * @return Resizing.
 */
const Resizing = ({ sizes }: Props) => {
  return (
    <div
      style={{ width: sizes.width, height: sizes.height }}
      className={classes.canvas_new}
    >
      <Canvas
        gl={{ pixelRatio: Math.min(window.devicePixelRatio, 2) }}
        onDoubleClick={(event) => onDoubleClick(event)}
      >
        <color attach="background" args={["black"]} />
        <Cube />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default Resizing;
