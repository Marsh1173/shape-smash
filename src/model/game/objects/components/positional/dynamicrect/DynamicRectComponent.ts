import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector,
  World,
} from "@dimforge/rapier2d-compat";
import { CollisionGroupName, MakeCollisionGroups } from "../../../../utils/physics/MakeCollisionGroups";
import { Dimensions } from "../../../../../utils/Dimensions";
import { GameSystem } from "../../../../system/GameSystem";
import { ValueObservable } from "../../../../../utils/observer/ValueObserver";
import { IsOnGround } from "../../../../utils/physics/IsOnGround";
import { GameForceHandler } from "./GameForceHandler";
import { uuid } from "../../../../../utils/Id";

export interface DynamicRectComponentData {
  readonly pos: Readonly<Vector>;
  readonly vel?: Readonly<Vector>;
}

export interface DynamicRectComponentDataWithDimensions extends DynamicRectComponentData {
  readonly dimensions: Readonly<Dimensions>;
}

export class DynamicRectComponent {
  public readonly type = "DynamicRect";

  public readonly vel: Vector;
  public readonly dimensions: Readonly<Dimensions>;
  public readonly on_ground = new ValueObservable<boolean>(false);
  public readonly game_force_handler: GameForceHandler = new GameForceHandler();

  private prev_pos: Vector;
  public get pos(): Vector {
    if (isNaN(this.rigid_body.translation().x)) {
      console.warn("RECOVERING RIGID BODY POSITION");
      this.pos = this.prev_pos;
    }
    return this.rigid_body.translation();
  }

  protected set pos(pos: Vector) {
    this.rigid_body.setTranslation(pos, true);
  }

  protected readonly rigid_body_desc: RigidBodyDesc;
  protected readonly rigid_body: RigidBody;
  protected readonly collider_desc: ColliderDesc;
  protected readonly collider: Collider;

  public readonly collision_groups = MakeCollisionGroups([CollisionGroupName.Entity], [CollisionGroupName.Ground]);
  public readonly character_controller: KinematicCharacterController;
  protected readonly world: World;

  constructor(data: DynamicRectComponentDataWithDimensions, game_system: GameSystem) {
    this.world = game_system.rapier_world;
    this.prev_pos = data.pos;

    this.vel = data.vel ?? { x: 0, y: 0 };
    this.dimensions = data.dimensions;

    this.rigid_body_desc = RigidBodyDesc.kinematicVelocityBased().setTranslation(data.pos.x, data.pos.y);
    this.rigid_body = this.world.createRigidBody(this.rigid_body_desc);

    const offset = DynamicRectCharacterControllerSingleton.collider_offset;
    this.collider_desc = ColliderDesc.cuboid(
      this.dimensions.w / 2 - offset,
      this.dimensions.h / 2 - offset
    ).setCollisionGroups(this.collision_groups);
    this.collider = this.world.createCollider(this.collider_desc, this.rigid_body);

    this.character_controller = DynamicRectCharacterControllerSingleton.get_character_controller(game_system);
  }

  public update(elapsed_seconds: number) {
    //apply gravity
    this.vel.y = Math.min(this.vel.y + this.world.gravity.y * elapsed_seconds, this.world.gravity.y / 2);

    //compute velocity excluding game forces
    const remaining_persistent_velocity = this.calculate_corrected_velocity(elapsed_seconds, {
      x: this.vel.x * elapsed_seconds,
      y: this.vel.y * elapsed_seconds,
    });

    //compute velocity including game forces
    const game_frame_forces = this.game_force_handler.calculate_frame_force(elapsed_seconds);
    const corrected_frame_velocity = this.calculate_corrected_velocity(elapsed_seconds, {
      x: this.vel.x * elapsed_seconds + game_frame_forces.x,
      y: this.vel.y * elapsed_seconds + game_frame_forces.y,
    });

    //calculate is on ground
    const is_on_ground = IsOnGround(this.character_controller);
    if (this.on_ground.value !== is_on_ground) {
      this.on_ground.set_value(is_on_ground);
    }

    //set velocity
    this.vel.x = remaining_persistent_velocity.x;
    this.vel.y = remaining_persistent_velocity.y;
    this.rigid_body.setLinvel(corrected_frame_velocity, true);

    //set pos
    this.prev_pos = this.pos;
  }

  protected calculate_corrected_velocity(elapsed_seconds: number, vel: Vector): Vector {
    this.character_controller.computeColliderMovement(this.collider, vel, undefined, this.collision_groups);

    const corrected_frame_movement = this.character_controller.computedMovement();
    return {
      x: corrected_frame_movement.x / elapsed_seconds,
      y: corrected_frame_movement.y / elapsed_seconds,
    };
  }

  public serialize(): DynamicRectComponentData {
    return {
      pos: this.pos,
      vel: this.vel,
    };
  }

  public destroy() {
    this.world.removeRigidBody(this.rigid_body);
    this.world.removeCollider(this.collider, false);
  }

  protected readonly pos_correction_id = uuid();
  public set_pos_and_vel(new_pos: Vector, new_velocity: Vector) {
    this.vel.x = new_velocity.x;
    this.vel.y = new_velocity.y;

    //correct position with game force
    const diff = {
      x: new_pos.x - this.pos.x,
      y: new_pos.y - this.pos.y,
    };

    this.game_force_handler.remove_force(this.pos_correction_id);
    this.game_force_handler.add_force(this.pos_correction_id, {
      duration: 0.2,
      calc_position: (progress: number) => {
        return {
          x: diff.x * progress,
          y: diff.y * progress,
        };
      },
    });
  }
}

namespace DynamicRectCharacterControllerSingleton {
  export const collider_offset: number = 0.01;
  let character_controller: KinematicCharacterController | undefined = undefined;

  export function get_character_controller(game_system: GameSystem): KinematicCharacterController {
    if (character_controller) {
      return character_controller;
    } else {
      let new_character_controller = game_system.rapier_world.createCharacterController(collider_offset);
      game_system.cleanup_callbacks.add(() => {
        game_system.rapier_world.removeCharacterController(new_character_controller);
        character_controller = undefined;
      });

      character_controller = new_character_controller;
      return character_controller;
    }
  }
}
