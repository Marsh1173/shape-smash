import {
  Collider,
  ColliderDesc,
  KinematicCharacterController,
  RigidBody,
  RigidBodyDesc,
  Vector,
  World,
} from "@dimforge/rapier2d-compat";
import { Rapier } from "../../../utils/Rapier";
import { IsOnGround } from "../../physicsutils/IsOnGround";

export interface ShapeletBodyData {
  pos: Vector;
  velocity?: Vector;
}

export class ShapeletBody {
  //current speed in units per second
  protected readonly _velocity: Vector;
  public get velocity(): Vector {
    return {
      x: this._velocity.x,
      y: this._velocity.y,
    };
  }
  public set velocity(v: Partial<Vector>) {
    this._velocity.x = v.x ?? this._velocity.x;
    this._velocity.y = v.y ?? this._velocity.y;
  }
  public accelerate(v: Partial<Vector>) {
    this._velocity.x += v.x ?? 0;
    this._velocity.y += v.y ?? 0;
  }

  public get pos(): Vector {
    return this.rigid_body.translation();
  }
  protected set pos(pos: Partial<Vector>) {
    this.rigid_body.setTranslation({ ...this.pos, ...pos }, true);
  }

  protected _on_ground: boolean = false;
  public get on_ground(): boolean {
    return this._on_ground;
  }

  public facing: "left" | "right" = "right";

  protected readonly groups_and_filters: number = 0x00020001;
  protected readonly rigid_body_desc: RigidBodyDesc;
  protected readonly rigid_body: RigidBody;
  protected readonly collider_desc: ColliderDesc;
  protected readonly collider: Collider;

  protected readonly shapelet_controller: KinematicCharacterController;

  constructor(protected readonly world: World, data: ShapeletBodyData) {
    this._velocity = data.velocity ?? { x: 0, y: 0 };

    this.rigid_body_desc = Rapier.RigidBodyDesc.kinematicVelocityBased().setTranslation(data.pos.x, data.pos.y);
    this.rigid_body = this.world.createRigidBody(this.rigid_body_desc);

    this.collider_desc = Rapier.ColliderDesc.cuboid(0.75, 0.75).setCollisionGroups(this.groups_and_filters);
    this.collider = this.world.createCollider(this.collider_desc, this.rigid_body);

    this.shapelet_controller = this.world.createCharacterController(0.01);
  }

  public destroy() {
    this.world.removeCharacterController(this.shapelet_controller);
    this.world.removeRigidBody(this.rigid_body);
    this.world.removeCollider(this.collider, false);
  }

  public update(elapsed_seconds: number) {
    this.compute_velocity(elapsed_seconds);
    this.shapelet_controller.computeColliderMovement(
      this.collider,
      {
        x: this._velocity.x * elapsed_seconds,
        y: this._velocity.y * elapsed_seconds,
      },
      undefined,
      this.groups_and_filters
    );
    const corrected_frame_velocity = this.shapelet_controller.computedMovement();

    this._on_ground = IsOnGround(this.shapelet_controller);

    this._velocity.x = corrected_frame_velocity.x / elapsed_seconds;
    this._velocity.y = corrected_frame_velocity.y / elapsed_seconds;
    this.rigid_body.setLinvel(this._velocity, true);
  }

  protected compute_velocity(elapsed_seconds: number) {
    //apply gravity
    this._velocity.y = Math.min(this._velocity.y + this.world.gravity.y * elapsed_seconds, this.world.gravity.y / 2);
  }

  public serialize(): ShapeletBodyData {
    return {
      pos: this.pos,
      velocity: this._velocity,
    };
  }

  public set_pos_and_vel(new_pos: Vector, new_velocity: Vector) {
    this._velocity.x = new_velocity.x;
    this._velocity.y = new_velocity.y;

    this.pos = new_pos;
  }
}