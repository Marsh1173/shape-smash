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

export interface DynamicRectComponentData {
  readonly pos: Readonly<Vector>;
  readonly vel?: Readonly<Vector>;
}

export interface DynamicRectComponentDataWithDimensions extends DynamicRectComponentData {
  readonly dimensions: Readonly<Dimensions>;
}

export class DynamicRectComponent {
  public readonly type = "DynamicRect";

  protected readonly prev_pos: Vector; // necessary in case we need to recover pos (maybe not if we're storing pos in this class)
  public readonly pos: Readonly<Vector>;
  public readonly vel: Readonly<Vector>;

  public readonly dimensions: Readonly<Dimensions>;

  protected _on_ground: boolean = false;
  public get on_ground(): boolean {
    return this._on_ground;
  }

  protected readonly rigid_body_desc: RigidBodyDesc;
  protected readonly rigid_body: RigidBody;
  protected readonly collider_desc: ColliderDesc;
  protected readonly collider: Collider;

  public readonly collision_groups = MakeCollisionGroups([CollisionGroupName.Entity], [CollisionGroupName.Ground]);

  constructor(data: DynamicRectComponentDataWithDimensions, protected readonly world: World) {
    this.pos = data.pos;
    this.prev_pos = { x: data.pos.x, y: data.pos.y };

    this.vel = data.vel ?? { x: 0, y: 0 };
    this.dimensions = data.dimensions;

    this.rigid_body_desc = RigidBodyDesc.kinematicVelocityBased().setTranslation(this.pos.x, this.pos.y);
    this.rigid_body = this.world.createRigidBody(this.rigid_body_desc);

    const offset = DynamicRectCharacterControllerSingleton.collider_offset;
    this.collider_desc = ColliderDesc.cuboid(this.dimensions.w / 2, this.dimensions.h / 2)
      .setTranslation(this.pos.x - offset, this.pos.y - offset)
      .setCollisionGroups(this.collision_groups);
    this.collider = world.createCollider(this.collider_desc);
  }

  public serialize(): DynamicRectComponentDataWithDimensions {
    return {
      pos: this.pos,
      vel: this.vel,
      dimensions: this.dimensions,
    };
  }

  public destroy() {
    this.world.removeRigidBody(this.rigid_body);
    this.world.removeCollider(this.collider, false);
  }

  //update method here?
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
