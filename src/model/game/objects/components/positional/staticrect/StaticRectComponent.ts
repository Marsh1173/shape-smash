import { Collider, ColliderDesc, Vector, World } from "@dimforge/rapier2d-compat";
import { CollisionGroupName, MakeCollisionGroups } from "../../../../utils/physics/MakeCollisionGroups";
import { Dimensions } from "../../../../../utils/Dimensions";

export interface StaticRectComponentData {
  readonly pos: Readonly<Vector>;
  readonly dimensions: Readonly<Dimensions>;
}

export class StaticRectComponent {
  public readonly type = "StaticRect";
  public readonly pos: Readonly<Vector>;
  public readonly dimensions: Readonly<Dimensions>;

  protected readonly collider_desc: ColliderDesc;
  protected readonly collider: Collider;

  protected readonly collision_groups = MakeCollisionGroups([CollisionGroupName.Ground], [CollisionGroupName.All]);

  constructor(data: StaticRectComponentData, protected readonly world: World) {
    this.pos = data.pos;
    this.dimensions = data.dimensions;

    this.collider_desc = ColliderDesc.cuboid(this.dimensions.w / 2, this.dimensions.h / 2)
      .setTranslation(this.pos.x, this.pos.y)
      .setCollisionGroups(this.collision_groups);

    this.collider = world.createCollider(this.collider_desc);
  }

  public serialize(): StaticRectComponentData {
    return {
      pos: this.pos,
      dimensions: this.dimensions,
    };
  }

  public destroy() {
    this.world.removeCollider(this.collider, false);
  }
}
