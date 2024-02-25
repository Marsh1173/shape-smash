import { World } from "@dimforge/rapier2d-compat";
import { HasId, Id } from "../../../utils/Id";
import { ShapeletBody, ShapeletBodyData } from "./ShapeletBody";
import { ShapeletController, ShapeletControllerData } from "./ShapeletController";
import { ShapeletSpriteData } from "./sprite/ShapeletAssets";

export interface ShapeletData extends HasId {
  body_data: ShapeletBodyData;
  controller_data: ShapeletControllerData;
  sprite_data: ShapeletSpriteData;
}

export class Shapelet extends HasId {
  public readonly id: Id;
  protected readonly sprite_data: ShapeletSpriteData;

  public readonly body: ShapeletBody;
  public readonly controller: ShapeletController;

  constructor(protected readonly world: World, data: ShapeletData) {
    super();
    this.id = data.id;
    this.sprite_data = data.sprite_data;

    this.body = new ShapeletBody(this.world, data.body_data);
    this.controller = new ShapeletController(this.body, this.world, data.controller_data);
  }

  public destroy() {
    this.body.destroy();
  }

  public update(elapsed_seconds: number) {
    this.controller.update(elapsed_seconds);
    this.body.update(elapsed_seconds);
  }

  public serialize(): ShapeletData {
    return {
      id: this.id,
      body_data: this.body.serialize(),
      controller_data: this.controller.serialize(),
      sprite_data: this.sprite_data,
    };
  }
}
