import { Shapelet, ShapeletData } from "./Shapelet";
import { Container } from "pixi.js";
import { World } from "@dimforge/rapier2d-compat";
import { ShapeletRig } from "./sprite/rig/ShapeletRig";

export class ClientShapelet extends Shapelet {
  public readonly rig: ShapeletRig;

  constructor(world: World, data: ShapeletData, pixijs_main_stage: Container) {
    super(world, data);

    this.rig = new ShapeletRig(pixijs_main_stage, this.body, data.sprite_data);
    // this.sprite = new ShapeletSprite(pixijs_main_stage, this.body, data.sprite_data);
  }

  public destroy() {
    super.destroy();
    this.rig.destroy();
  }

  public update(elapsed_seconds: number) {
    super.update(elapsed_seconds);
    this.rig.update(elapsed_seconds);
  }
}
