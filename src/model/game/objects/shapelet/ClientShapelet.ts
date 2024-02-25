import { Shapelet, ShapeletData } from "./Shapelet";
import { Container } from "pixi.js";
import { World } from "@dimforge/rapier2d-compat";
import { ShapeletSprite } from "./sprite/ShapeletSprite";

export class ClientShapelet extends Shapelet {
  public readonly sprite: ShapeletSprite;

  constructor(world: World, data: ShapeletData, pixijs_main_stage: Container) {
    super(world, data);

    this.sprite = new ShapeletSprite(pixijs_main_stage, this.body, data.sprite_data);
  }

  public destroy() {
    super.destroy();
    this.sprite.destroy();
  }

  public update(elapsed_seconds: number) {
    super.update(elapsed_seconds);
    this.sprite.update();
  }
}
