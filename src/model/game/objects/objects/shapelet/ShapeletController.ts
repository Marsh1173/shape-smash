import { Vector, World } from "@dimforge/rapier2d-compat";
import { Observable, Observer } from "../../../../utils/observer/Observer";
import { DynamicRectComponent } from "../../components/positional/dynamicrect/DynamicRectComponent";
import { ValueObservable } from "../../../../utils/observer/ValueObserver";

export interface ShapeletControllerData {
  remaining_jumps?: number;
  active_actions?: Record<ShapeletAction, boolean>;
}

export enum ShapeletAction {
  MoveLeft,
  MoveRight,
  Jump,
  MainAction,
  SecondaryAction,
}

export class ShapeletController {
  protected readonly active_actions: Record<ShapeletAction, boolean>;

  protected readonly side_accel: number = 70;
  protected readonly side_deccel: number = this.side_accel * 1.5;
  protected readonly side_deccel_airborne: number = this.side_deccel / 10;
  protected readonly side_max_velocity: number = 11;
  protected readonly jump_force: number;

  protected on_ground: boolean = false;
  protected readonly allowed_jumps: number = 2;
  protected remaining_jumps: number;
  public readonly jump_observable: JumpObservable = new JumpObservable();
  public facing = new ValueObservable<"left" | "right">("right");

  constructor(
    protected readonly positional_component: DynamicRectComponent,
    protected readonly world: World,
    data: ShapeletControllerData
  ) {
    this.remaining_jumps = data.remaining_jumps ?? 0;
    this.active_actions = data.active_actions ?? {
      [ShapeletAction.MoveLeft]: false,
      [ShapeletAction.MoveRight]: false,
      [ShapeletAction.Jump]: false,
      [ShapeletAction.MainAction]: false,
      [ShapeletAction.SecondaryAction]: false,
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
    if (this.positional_component.on_ground.value !== this.on_ground) {
      this.on_ground = this.positional_component.on_ground.value;
      if (this.on_ground) {
        this.jump_observable.on_land(undefined);
        this.remaining_jumps = this.allowed_jumps;
      }
    }

    if (this.active_actions[ShapeletAction.Jump]) {
      this.active_actions[ShapeletAction.Jump] = false;
      if (this.remaining_jumps > 0) {
        this.remaining_jumps--;
        this.positional_component.vel.y = -this.jump_force;
        this.jump_observable.on_jump(this.remaining_jumps);
      }
    }
  }

  protected handle_lateral_movement(elapsed_seconds: number) {
    const current_velocity: Readonly<Vector> = this.positional_component.vel;

    if (this.active_actions[ShapeletAction.MoveLeft] && !this.active_actions[ShapeletAction.MoveRight]) {
      if (current_velocity.x > -this.side_max_velocity) {
        this.positional_component.vel.x = Math.max(
          -this.side_max_velocity,
          current_velocity.x - this.side_accel * elapsed_seconds
        );
      }
    } else if (this.active_actions[ShapeletAction.MoveRight] && !this.active_actions[ShapeletAction.MoveLeft]) {
      if (current_velocity.x < this.side_max_velocity) {
        this.positional_component.vel.x = Math.min(
          this.side_max_velocity,
          current_velocity.x + this.side_accel * elapsed_seconds
        );
      }
    } else {
      let decel_factor = this.on_ground ? this.side_deccel : this.side_deccel_airborne;
      if (current_velocity.x > 0) {
        this.positional_component.vel.x = Math.max(current_velocity.x - decel_factor * elapsed_seconds, 0);
      } else if (current_velocity.x < 0) {
        this.positional_component.vel.x = Math.min(current_velocity.x + decel_factor * elapsed_seconds, 0);
      }
    }
  }

  protected handle_face_direction() {
    if (this.active_actions[ShapeletAction.MoveLeft] && !this.active_actions[ShapeletAction.MoveRight]) {
      if (this.facing.value !== "left") {
        this.facing.set_value("left");
      }
    } else if (this.active_actions[ShapeletAction.MoveRight] && !this.active_actions[ShapeletAction.MoveLeft]) {
      if (this.facing.value !== "right") {
        this.facing.set_value("right");
      }
    }
  }

  public serialize(): ShapeletControllerData {
    return {
      remaining_jumps: this.remaining_jumps,
      active_actions: this.active_actions,
    };
  }
}

interface JumpObserver extends Observer {
  on_jump: (jumps_remaining: number) => void;
  on_land: () => void;
}
class JumpObservable extends Observable<JumpObserver> {
  public on_jump = this.broadcast((o) => o.on_jump);
  public on_land = this.broadcast((o) => o.on_land);
}
