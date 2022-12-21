import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

/**
 * GameState.
 */
type GameState = {
  blocksCount: number;
  blocksSeed: number;
  startTime: number;
  endTime: number;
  phase: string;
  start: () => void;
  restart: () => void;
  end: () => void;
};

/**
 * ゲームの状態管理.
 * TODO: ReduxやContext APIで代替できそう
 */
export default create(
  subscribeWithSelector<GameState>((set) => {
    return {
      blocksCount: 10,
      blocksSeed: 0,
      startTime: 0,
      endTime: 0,
      phase: "ready",
      start: () => {
        set((state) => {
          if (state.phase !== "ready") return {};
          return { phase: "playing", startTime: Date.now() };
        });
      },
      restart: () => {
        set((state) => {
          if (state.phase === "ready") return {};
          return { phase: "ready", blocksSeed: Math.random() };
        });
      },
      end: () => {
        set((state) => {
          if (state.phase !== "playing") return {};
          return { phase: "ended", endTime: Date.now() };
        });
      },
    };
  })
);
