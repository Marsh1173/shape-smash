import { Vector } from "@dimforge/rapier2d-compat";
import { Container } from "pixi.js";
import { ClientGameSystem } from "../system/client/ClientGameSystem";

export class Camera {
  protected readonly camera_pos: Vector = { x: 0, y: 0 };
  protected focus_pos: (() => Vector) | undefined = undefined;
  constructor(protected readonly translating_layer: Container, protected readonly game_system: ClientGameSystem) {}

  public update(elapsed_seconds: number) {
    this.scoot_camera(elapsed_seconds);

    this.translating_layer.setTransform(
      -this.camera_pos.x * Camera.px_per_unit + Camera.standard_viewport_size.w / 2,
      -this.camera_pos.y * Camera.px_per_unit + Camera.standard_viewport_size.h / 2
    );
  }

  protected scoot_camera(elapsed_seconds: number) {
    if (this.focus_pos) {
      const focus_pos = this.focus_pos();
      const follow_factor = 5;
      this.camera_pos.x += (focus_pos.x - this.camera_pos.x) * elapsed_seconds * follow_factor;
      this.camera_pos.y += (focus_pos.y - this.camera_pos.y) * elapsed_seconds * follow_factor;
    }
  }

  public set_focus(get_focus: () => Vector) {
    this.focus_pos = get_focus;
    const focus_pos = this.focus_pos();
    this.camera_pos.x = focus_pos.x;
    this.camera_pos.y = focus_pos.y;
  }

  public clear_focus() {
    this.focus_pos = undefined;
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
