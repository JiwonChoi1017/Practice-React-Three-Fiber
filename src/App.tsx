import "./styles/style.css";

import { Cursor, Sizes } from "./Common";
import React, { useEffect, useState } from "react";

import Lights from "./components/lights/Lights";

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
  const changeCursorHandler = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursor({
      // x: event.clientX / sizes.width - 0.5,
      // y: event.clientY / sizes.height - 0.5,
      x: event.clientX / sizes.width - 0.5,
      y: -(event.clientY / sizes.height - 0.5),
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

  return <Lights sizes={sizes} />;
}

export default App;
