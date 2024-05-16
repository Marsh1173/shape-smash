import { Vector } from "@dimforge/rapier2d-compat";
import { Texture, Sprite } from "pixi.js";
import { CleanupCallbacks } from "../../utils/CleanupCallbacks";

export function GradientSprite(
  size: Vector,
  from: Vector,
  to: Vector,
  from_color: string,
  to_color: string,
  cleanup_callbacks: CleanupCallbacks
): Sprite {
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
  cleanup_callbacks.add(() => {
    texture.destroy(true);
  });

  return Sprite.from(texture);
}
