/* eslint-disable react/no-unknown-property */

import React, { forwardRef } from "react";

import { BlendFunction } from "postprocessing";
import DrunkEffect from "./DrunkEffect";
import { ThreeElements } from "@react-three/fiber";

/**
 * Drunk.
 * @param {object} props
 * @param {React.ForwardedRef<PrimitiveProps>} ref
 * @return Drunk.
 */
const Drunk = forwardRef<
  // ref
  ThreeElements["primitive"],
  // props
  { frequency: number; amplitude: number; blendFunction: BlendFunction }
>((props, ref) => {
  const effect = new DrunkEffect(props);
  return <primitive object={effect} ref={ref} />;
});

Drunk.displayName = "Drunk";

export default Drunk;
