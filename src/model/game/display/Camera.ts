import { Vector } from "@dimforge/rapier2d-compat";
import { Container } from "pixi.js";
import { Shapelet } from "../objects/shapelet/Shapelet";

export class Camera {
  protected readonly camera_pos: Vector;
  constructor(protected readonly pixijs_main_stage: Container, protected readonly shapelet: Shapelet) {
    const focus_pos = this.shapelet.body.pos;
    this.camera_pos = {
      x: focus_pos.x,
      y: focus_pos.y,
    };
  }

  public update(elapsed_seconds: number) {
    const focus_pos = this.shapelet.body.pos;
    this.scoot_camera(elapsed_seconds, focus_pos);

    this.pixijs_main_stage.setTransform(
      -this.camera_pos.x * Camera.px_per_unit + Camera.standard_viewport_size.w / 2,
      -this.camera_pos.y * Camera.px_per_unit + Camera.standard_viewport_size.h / 2
    );
  }

  protected scoot_camera(elapsed_seconds: number, focus_pos: Vector) {
    const follow_factor = 5;

    this.camera_pos.x += (focus_pos.x - this.camera_pos.x) * elapsed_seconds * follow_factor;
    this.camera_pos.y += (focus_pos.y - this.camera_pos.y) * elapsed_seconds * follow_factor;
  }

  // CONVERSIONS
  public static readonly standard_viewport_size = { w: 1920, h: 1080 };
  public static readonly px_per_unit: number = 50;
  public static units_to_px(p: Vector): Vector {
    return {
      x: p.x * this.px_per_unit,
      y: p.y * this.px_per_unit,
    };
  }
  public static px_to_units(p: Vector): Vector {
    return {
      x: p.x / this.px_per_unit,
      y: p.y / this.px_per_unit,
    };
  }

  public static sprite_scale = Camera.px_per_unit / 160;
}
