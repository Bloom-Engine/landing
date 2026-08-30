import {
  Colors,
  beginDrawing,
  beginMode3D,
  clearBackground,
  drawGrid,
  drawModel,
  drawText,
  endDrawing,
  endMode3D,
  initWindow,
  runGame,
  updateModelAnimation,
  type Camera3D,
  type Model,
} from "@bloomengine/engine";
import { checkCollisionRecs, drawCircle, drawRect } from "@bloomengine/engine/shapes";

// Compile-only copies of the high-traffic website examples. This file is never
// executed; CI type-checks it against the latest stable npm package.
initWindow(800, 450, "Hello Bloom");
runGame(() => {
  beginDrawing();
  clearBackground(Colors.SNOW);
  drawText("Hello, Bloom!", 190, 200, 20, Colors.DARKGRAY);
  endDrawing();
});

declare const tree: Model;
declare const animation: number;
const camera: Camera3D = {
  position: { x: 10, y: 10, z: 10 },
  target: { x: 0, y: 0, z: 0 },
  up: { x: 0, y: 1, z: 0 },
  fovy: 45,
  projection: "perspective",
};

beginMode3D(camera);
drawModel(tree, { x: 0, y: 0, z: 0 }, 1, Colors.WHITE);
drawGrid(10, 1);
endMode3D();

updateModelAnimation(animation, 0, 0, 1, 0, 0, 0, 0);
drawRect(100, 100, 200, 80, Colors.GREEN);
drawCircle(400, 300, 50, Colors.GOLD);
checkCollisionRecs(
  { x: 0, y: 0, width: 10, height: 10 },
  { x: 5, y: 5, width: 10, height: 10 },
);
