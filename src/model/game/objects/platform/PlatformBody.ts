import RAPIER, { World, Vector, ColliderDesc, Collider } from "@dimforge/rapier2d-compat";

export interface PlatformBodyData {
  len: number;
  pos: Vector;
}

export class PlatformBody {
  protected readonly collider_desc: ColliderDesc;
  protected readonly collider: Collider;

  constructor(protected readonly world: World, protected readonly data: PlatformBodyData) {
    this.collider_desc = RAPIER.ColliderDesc.cuboid(this.data.len / 2, 0.5)
      .setTranslation(this.data.pos.x, this.data.pos.y)
      .setCollisionGroups(0x0001ffff);

    this.collider = world.createCollider(this.collider_desc);
  }

  public serialize(): PlatformBodyData {
    return this.data;
  }

  public destroy() {
    this.world.removeCollider(this.collider, false);
  }
}
