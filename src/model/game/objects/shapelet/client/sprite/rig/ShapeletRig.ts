import { Container } from "pixi.js";
import { ShapeletBodyRig } from "./ShapeletBodyRig";
import { ShapeletFaceRig } from "./ShapeletFaceRig";
import { ShapeletSpriteData } from "../ShapeletSpriteData";
import { Camera } from "../../../../../display/Camera";
import { GameDisplay } from "../../../../../display/GameDisplay";
import { ClientShapelet } from "../../../client/ClientShapelet";
import { ClientHealthComponentDisplay } from "../../../../components/health/client/ClientHealthComponentDisplay";
import { Vector } from "@dimforge/rapier2d-compat";

export class ShapeletRig {
  protected readonly body_rig: ShapeletBodyRig;
  protected readonly face_rig: ShapeletFaceRig;
  protected readonly health_display: ClientHealthComponentDisplay;

  protected readonly position: Vector = { x: 0, y: 0 };
  protected readonly container: Container;

  constructor(
    protected readonly game_display: GameDisplay,
    protected readonly shapelet: ClientShapelet,
    protected readonly data: ShapeletSpriteData
  ) {
    this.container = new Container();
    this.game_display.layers.shapelets.addChild(this.container);

    this.body_rig = new ShapeletBodyRig(this.container, this.data);
    this.face_rig = new ShapeletFaceRig(this.container, this.shapelet.body, this.data);
    this.health_display = new ClientHealthComponentDisplay(this.game_display, this.shapelet, this.position);
  }

  public update(elapsed_seconds: number) {
    const body_pos = Camera.units_to_px(this.shapelet.body.pos);
    this.position.x = body_pos.x;
    this.position.y = body_pos.y;

    this.container.position.set(this.position.x, this.position.y);

    this.body_rig.update(elapsed_seconds);
    this.face_rig.update(elapsed_seconds);
    this.health_display.update(elapsed_seconds);
  }

  public destroy() {
    this.game_display.layers.shapelets.removeChild(this.container);
    this.body_rig.destroy();
    this.face_rig.destroy();
    this.health_display.destroy();
  }
}
