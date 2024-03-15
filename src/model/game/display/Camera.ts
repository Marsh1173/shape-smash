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
    this.scoot_camera(elapsed_seconds);

    this.pixijs_main_stage.setTransform(
      -this.camera_pos.x * Camera.px_per_unit + Camera.standard_viewport_size.w / 2,
      -this.camera_pos.y * Camera.px_per_unit + Camera.standard_viewport_size.h / 2
    );
  }

  protected scoot_camera(elapsed_seconds: number) {
    const focus_pos = this.shapelet.body.pos;
    const follow_factor = 5;

    this.camera_pos.x += (focus_pos.x - this.camera_pos.x) * elapsed_seconds * follow_factor;
    this.camera_pos.y += (focus_pos.y - this.camera_pos.y) * elapsed_seconds * follow_factor;
  }

  // CONVERSIONS
  public get_world_pos_from_screen_pos(screen_pos: Vector): Vector {
    const screen_pos_proportion = {
      x: screen_pos.x / window.innerWidth,
      y: screen_pos.y / window.innerHeight,
    };

    const current_screen_ratio = window.innerWidth / window.innerHeight;
    if (current_screen_ratio > Camera.standard_viewport_size_ratio) {
      const ratio_ratio = Camera.standard_viewport_size_ratio / current_screen_ratio;
      screen_pos_proportion.y = screen_pos_proportion.y * ratio_ratio + (1 - ratio_ratio) * 0.5;
    } else if (current_screen_ratio < Camera.standard_viewport_size_ratio) {
      const ratio_ratio = current_screen_ratio / Camera.standard_viewport_size_ratio;
      screen_pos_proportion.x = screen_pos_proportion.x * ratio_ratio + (1 - ratio_ratio) * 0.5;
    }

    return {
      x: this.camera_pos.x + (screen_pos_proportion.x - 0.5) * Camera.standard_viewport_size_in_units.w,
      y: this.camera_pos.y + (screen_pos_proportion.y - 0.5) * Camera.standard_viewport_size_in_units.h,
    };
  }

  public static readonly px_per_unit: number = 50;

  public static readonly standard_viewport_size = { w: 1920, h: 1080 };
  public static readonly standard_viewport_size_ratio =
    Camera.standard_viewport_size.w / Camera.standard_viewport_size.h;
  public static readonly standard_viewport_size_in_units = {
    w: Camera.standard_viewport_size.w / Camera.px_per_unit,
    h: Camera.standard_viewport_size.h / Camera.px_per_unit,
  };

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
