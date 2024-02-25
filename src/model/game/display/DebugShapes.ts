import { World } from "@dimforge/rapier2d-compat";
import { Application, Color, Graphics } from "pixi.js";
import { Camera } from "./Camera";

let graphics: Graphics[] = [];
export function debug_shapes(world: World, pixijs_app: Application<HTMLCanvasElement>) {
  const { vertices, colors } = world.debugRender();

  graphics.forEach((g) => g.destroy());
  graphics = [];

  for (let i = 0; i < vertices.length / 4; i += 1) {
    const g = new Graphics();
    const c = new Color({
      r: colors[i * 4] * 255,
      g: colors[i * 4 + 1] * 255,
      b: colors[i * 4 + 2] * 255,
      a: colors[i * 4 + 3] * 255,
    });

    g.lineStyle(2, c, 1);
    g.moveTo(vertices[i * 4] * Camera.px_per_unit, vertices[i * 4 + 1] * Camera.px_per_unit);
    g.lineTo(vertices[i * 4 + 2] * Camera.px_per_unit, vertices[i * 4 + 3] * Camera.px_per_unit);
    g.closePath();

    graphics.push(g);
    pixijs_app.stage.addChild(g);
  }
}
