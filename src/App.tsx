import { Cursor, Sizes } from "./Common";
import React, { useState } from "react";

import PerspectiveCamera from "./components/camera/PerspectiveCamera";

function App() {
  const sizes: Sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const [cursor, setCursor] = useState<Cursor>({ x: 0, y: 0 });
  const changeCursorHandler = (event: React.PointerEvent<HTMLDivElement>) => {
    setCursor({
      // x: event.clientX / sizes.width - 0.5,
      // y: event.clientY / sizes.height - 0.5,
      x: event.clientX / sizes.width - 0.5,
      y: -(event.clientY / sizes.height - 0.5),
    });
  };

  return (
    <PerspectiveCamera
      sizes={sizes}
      cursor={cursor}
      onChangeCursor={changeCursorHandler}
    />
  );
}

export default App;
