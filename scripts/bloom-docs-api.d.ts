declare module "@bloomengine/engine" {
  export interface Vec3 { x: number; y: number; z: number }
  export interface Color { r: number; g: number; b: number; a: number }
  export interface Camera3D {
    position: Vec3;
    target: Vec3;
    up: Vec3;
    fovy: number;
    projection: "perspective" | "orthographic";
  }
  export interface Model { handle: number }

  export const Colors: Record<string, Color>;
  export function initWindow(width: number, height: number, title: string, fullscreen?: boolean): void;
  export function runGame(frame: (dt: number) => void): void;
  export function beginDrawing(): void;
  export function endDrawing(): void;
  export function clearBackground(color: Color): void;
  export function drawText(text: string, x: number, y: number, size: number, color: Color): void;
  export function beginMode3D(camera: Camera3D): void;
  export function endMode3D(): void;
  export function drawModel(model: Model, position: Vec3, scale: number, tint: Color): void;
  export function drawGrid(slices: number, spacing: number): void;
  export function updateModelAnimation(handle: number, animIndex: number, time: number, scale: number, px: number, py: number, pz: number, rotY: number): void;
}

declare module "@bloomengine/engine/shapes" {
  import type { Color } from "@bloomengine/engine";
  interface Rect { x: number; y: number; width: number; height: number }
  export function drawRect(x: number, y: number, width: number, height: number, color: Color): void;
  export function drawCircle(x: number, y: number, radius: number, color: Color): void;
  export function checkCollisionRecs(a: Rect, b: Rect): boolean;
}
