import { Vector, World } from "@dimforge/rapier2d-compat";
import { ShapeletBody } from "./ShapeletBody";

export interface ShapeletControllerData {
  remaining_jumps?: number;
  active_actions?: Record<ShapeletAction, boolean>;
}

export enum ShapeletAction {
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveDown,
}

export class ShapeletController {
  protected readonly active_actions: Record<ShapeletAction, boolean>;

  protected readonly side_accel: number = 70;
  protected readonly side_max_velocity: number = 11;
  protected readonly jump_force: number;

  protected on_ground: boolean = false;
  protected readonly allowed_jumps: number = 2;
  protected remaining_jumps: number;

  constructor(
    protected readonly shapelet_body: ShapeletBody,
    protected readonly world: World,
    data: ShapeletControllerData
  ) {
    this.remaining_jumps = data.remaining_jumps ?? 0;
    this.active_actions = data.active_actions ?? {
      [ShapeletAction.MoveLeft]: false,
      [ShapeletAction.MoveRight]: false,
      [ShapeletAction.MoveUp]: false,
      [ShapeletAction.MoveDown]: false,
    };

    this.jump_force = this.world.gravity.y / 3.5;
  }

  public on_input(action: ShapeletAction, active: boolean) {
    this.active_actions[action] = active;
  }

  public update(elapsed_seconds: number) {
    this.handle_jumps();
    this.handle_lateral_movement(elapsed_seconds);
    this.handle_face_direction();
  }

  protected handle_jumps() {
    if (this.shapelet_body.on_ground !== this.on_ground) {
      this.on_ground = this.shapelet_body.on_ground;
      if (this.on_ground) {
        this.remaining_jumps = this.allowed_jumps;
      }
    }

    if (this.active_actions[ShapeletAction.MoveUp]) {
      this.active_actions[ShapeletAction.MoveUp] = false;
      if (this.remaining_jumps > 0) {
        this.remaining_jumps--;
        this.shapelet_body.velocity = { y: -this.jump_force };
      }
    }
  }

  protected handle_lateral_movement(elapsed_seconds: number) {
    const current_velocity: Vector = this.shapelet_body.velocity;

    if (this.active_actions[ShapeletAction.MoveLeft] && !this.active_actions[ShapeletAction.MoveRight]) {
      if (current_velocity.x > -this.side_max_velocity) {
        this.shapelet_body.velocity = {
          x: Math.max(-this.side_max_velocity, current_velocity.x - this.side_accel * elapsed_seconds),
        };
      }
    } else if (this.active_actions[ShapeletAction.MoveRight] && !this.active_actions[ShapeletAction.MoveLeft]) {
      if (current_velocity.x < this.side_max_velocity) {
        this.shapelet_body.velocity = {
          x: Math.min(this.side_max_velocity, current_velocity.x + this.side_accel * elapsed_seconds),
        };
      }
    } else {
      let decel_factor = this.on_ground ? this.side_accel : this.side_accel / 6;
      if (current_velocity.x > 0) {
        this.shapelet_body.velocity = { x: Math.max(current_velocity.x - decel_factor * elapsed_seconds, 0) };
      } else if (current_velocity.x < 0) {
        this.shapelet_body.velocity = { x: Math.min(current_velocity.x + decel_factor * elapsed_seconds, 0) };
      }
    }
  }

  protected handle_face_direction() {
    if (this.active_actions[ShapeletAction.MoveLeft] && !this.active_actions[ShapeletAction.MoveRight]) {
      this.shapelet_body.facing = "left";
    } else if (this.active_actions[ShapeletAction.MoveRight] && !this.active_actions[ShapeletAction.MoveLeft]) {
      this.shapelet_body.facing = "right";
    }
  }

  public serialize(): ShapeletControllerData {
    return {
      remaining_jumps: this.remaining_jumps,
      active_actions: this.active_actions,
    };
  }
}
