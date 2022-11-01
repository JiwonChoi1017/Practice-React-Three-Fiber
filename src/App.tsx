import "./styles/style.css";

import { Cursor, Sizes } from "./Common";
import React, { useEffect, useState } from "react";

import ImportModel from "./components/importModel/ImportModel";

/**
 * App.
 * @return App.
 */
function App() {
  const [sizes, setSizes] = useState<Sizes>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  // const changeCursorHandler = (event: React.PointerEvent<HTMLDivElement>) => {
  //   setCursor({
  //     x: event.clientX / sizes.width - 0.5,
  //     y: -(event.clientY / sizes.height - 0.5),
  //   });
  // };

  const changeCursorHandler = (event: MouseEvent) => {
    setCursor({
      x: event.clientX / sizes.width - 0.5,
      y: event.clientY / sizes.height - 0.5,
    });
  };

  useEffect(() => {
    const resizeHandler = () => {
      setSizes({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", resizeHandler);
    return () => window.removeEventListener("resize", resizeHandler);
  }, []);

  return <ImportModel sizes={sizes} />;
}

export default App;
