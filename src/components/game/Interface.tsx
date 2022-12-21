import React, { useEffect, useRef } from "react";

import { addEffect } from "@react-three/fiber";
import classes from "../../styles/Global.module.css";
import useGame from "../../stores/useGame";
import { useKeyboardControls } from "@react-three/drei";

/**
 * Interface.
 * @return Interface
 */
const Interface = () => {
  const timeRef = useRef<HTMLDivElement>(null);

  const restart = useGame((state) => state.restart);
  const phase = useGame((state) => state.phase);

  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  useEffect(() => {
    const unsubscribeEffect = addEffect(() => {
      const state = useGame.getState();
      let elapsedTime = 0;
      if (state.phase === "playing") {
        elapsedTime = Date.now() - state.startTime;
      } else if (state.phase === "ended") {
        elapsedTime = state.endTime - state.startTime;
      }
      elapsedTime /= 1000;
      if (timeRef.current) {
        timeRef.current.textContent = elapsedTime.toFixed(2);
      }
    });

    return () => {
      unsubscribeEffect();
    };
  }, []);

  return (
    <div className={classes.interface}>
      <div ref={timeRef} className={classes.time}>
        0.00
      </div>
      {phase === "ended" && (
        <div className={classes.restart} onClick={restart}>
          Restart
        </div>
      )}
      {/* Controls */}
      <div className={classes.controls}>
        <div className={classes.raw}>
          <div
            className={`${classes.key} ${forward ? classes.active : ""}`}
          ></div>
        </div>
        <div className={classes.raw}>
          <div
            className={`${classes.key} ${leftward ? classes.active : ""}`}
          ></div>
          <div
            className={`${classes.key} ${backward ? classes.active : ""}`}
          ></div>
          <div
            className={`${classes.key} ${rightward ? classes.active : ""}`}
          ></div>
        </div>
        <div className={classes.raw}>
          <div
            className={`${classes.key} ${classes.large} ${
              jump ? classes.active : ""
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Interface;
