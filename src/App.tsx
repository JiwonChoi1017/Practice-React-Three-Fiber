import "./styles/style.css";

import { Cursor, Sizes } from "./types/Common";
import React, { useEffect, useState } from "react";

import EnvironmentAndStaging from "./components/environmentAndStaging/EnvironmentAndStaging";

/**
 * App.
 * @return App.
 */
function App() {
  // const [sizes, setSizes] = useState<Sizes>({
  //   width: window.innerWidth,
  //   height: window.innerHeight,
  // });
  // const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  // const changeCursorHandler = (event: React.PointerEvent<HTMLDivElement>) => {
  //   setCursor({
  //     x: event.clientX / sizes.width - 0.5,
  //     y: -(event.clientY / sizes.height - 0.5),
  //   });
  // };

  // const changeCursorHandler = (event: MouseEvent) => {
  //   setCursor({
  //     x: event.clientX / sizes.width - 0.5,
  //     y: event.clientY / sizes.height - 0.5,
  //   });
  // };

  // useEffect(() => {
  //   const resizeHandler = () => {
  //     setSizes({
  //       width: window.innerWidth,
  //       height: window.innerHeight,
  //     });
  //   };
  //   window.addEventListener("resize", resizeHandler);
  //   return () => window.removeEventListener("resize", resizeHandler);
  // }, []);

  return <EnvironmentAndStaging />;
}

export default App;
