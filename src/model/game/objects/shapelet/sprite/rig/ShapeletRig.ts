import { Container } from "pixi.js";
import { ShapeletBodyRig } from "./ShapeletBodyRig";
import { ShapeletFaceRig } from "./ShapeletFaceRig";
import { ShapeletBody } from "../../ShapeletBody";
import { ShapeletSpriteData } from "../ShapeletAssets";
import { Camera } from "../../../../display/Camera";
import { GameDisplay } from "../../../../display/GameDisplay";

export class ShapeletRig {
  protected readonly body_rig: ShapeletBodyRig;
  protected readonly face_rig: ShapeletFaceRig;

  protected readonly container: Container;

  constructor(
    protected readonly game_display: GameDisplay,
    protected readonly body: ShapeletBody,
    protected readonly data: ShapeletSpriteData
  ) {
    this.container = new Container();
    this.game_display.layers.shapelets.addChild(this.container);

    this.body_rig = new ShapeletBodyRig(this.container, this.data);
    this.face_rig = new ShapeletFaceRig(this.container, this.body, this.data);
  }

  public update(elapsed_seconds: number) {
    const position = Camera.units_to_px(this.body.pos);
    this.container.position.set(position.x, position.y);

    this.body_rig.update(elapsed_seconds);
    this.face_rig.update(elapsed_seconds);
  }

  public destroy() {
    this.game_display.layers.shapelets.removeChild(this.container);
    this.body_rig.destroy();
    this.face_rig.destroy();
  }
}
