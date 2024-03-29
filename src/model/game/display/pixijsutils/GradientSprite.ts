import { Vector } from "@dimforge/rapier2d-compat";
import { Texture, Sprite } from "pixi.js";
import { LifecycleTextures } from "./LifecycleTextures";

export function GradientSprite(size: Vector, from: Vector, to: Vector, from_color: string, to_color: string): Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = size.x;
  canvas.height = size.y;

  const context = canvas.getContext("2d")!;
  const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);

  gradient.addColorStop(0, from_color);
  gradient.addColorStop(1, to_color);

  context.fillStyle = gradient;
  context.fillRect(0, 0, size.x, size.y);

  const texture = Texture.from(canvas);
  LifecycleTextures.add_texture(texture);

  return Sprite.from(texture);
}
