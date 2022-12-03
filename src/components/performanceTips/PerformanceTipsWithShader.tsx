/* eslint-disable react/no-unknown-property */

import * as THREE from "three";

import { OrbitControls, useTexture } from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import React from "react";
import displacementTextureUrl from "../../assets/textures/displacementMap.png";

/**
 * vertexShader.
 */
const vertexShader = `
  uniform sampler2D uDisplacementTexture;

  varying vec3 vColor;

  void main() 
  {
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = texture2D(uDisplacementTexture, uv).r;
    modelPosition.y += max(elevation, 0.5) * DISPLACEMENT_STRENGTH;
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Color
    float colorElevation  = max(elevation, 0.25);
    vec3 color = mix(vec3(1.0, 0.1, 0.1), vec3(0.1, 0.0, 0.5), colorElevation);

    // Varying
    vColor = color;
  }
`;

/**
 * fragmentShader.
 */
const fragmentShader = `
  varying vec3 vColor;

  void main() 
  {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

/**
 * Objects.
 * @return Objects
 */
const Objects = () => {
  const displacementTexture = useTexture([displacementTextureUrl]);

  return (
    <>
      <mesh rotation-x={-Math.PI * 0.5}>
        <planeGeometry args={[10, 10, 256, 256]} />
        {/* TODO: なぜかシェーダーが適用されず、原因がわからない状態であるので、手が空いたら調査・対応する. */}
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          defines={{
            DISPLACEMENT_STRENGTH: 1.5,
          }}
          uniforms={{
            uDisplacementTexture: { value: displacementTexture },
            uDisplacementStrength: { value: 1.5 },
          }}
          precision="lowp"
        />
      </mesh>
    </>
  );
};

/**
 * PerformanceTipsWithShader.
 * @return PerformanceTipsWithShader
 */
const PerformanceTipsWithShader = () => {
  return (
    <Canvas
      gl={{
        // powerPreference: "high-performance",
        antialias: true,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
      }}
      camera={{
        fov: 75,
        near: 0.1,
        far: 100,
        position: [2, 2, 6],
      }}
      shadows={{
        enabled: true,
        type: THREE.PCFSoftShadowMap,
      }}
    >
      <Perf position="top-left" />
      <color attach="background" args={["black"]} />
      <Objects />
      <OrbitControls />
    </Canvas>
  );
};

export default PerformanceTipsWithShader;
