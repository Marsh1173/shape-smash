export enum CollisionGroupName {
  Ground,
  Entity,
  ShapeletRemains,
  All,
}

const group_to_bitmap: Record<CollisionGroupName, number> = {
  [CollisionGroupName.Ground]: 0b0000_0000_0000_0001, //group 0
  [CollisionGroupName.Entity]: 0b0000_0000_0000_0010, //group 1
  [CollisionGroupName.ShapeletRemains]: 0b0000_0000_0000_0100, //group 2
  [CollisionGroupName.All]: 0b1111_1111_1111_1111, // all groups
};

/**
 * In order for two objects to collide, each object's "is part of" group must contain at least one  the other objects' "can collide with" group
 */
export function MakeCollisionGroups(
  is_part_of: CollisionGroupName[],
  can_collide_with: CollisionGroupName[]
): number {
  const is_part_of_set: Set<CollisionGroupName> = new Set(is_part_of);
  const can_collide_with_set: Set<CollisionGroupName> = new Set(
    can_collide_with
  );

  let is_part_of_bitmap = 0;
  let can_collide_with_bitmap = 0;

  for (const group of is_part_of_set) {
    is_part_of_bitmap += group_to_bitmap[group];
  }
  for (const group of can_collide_with_set) {
    can_collide_with_bitmap += group_to_bitmap[group];
  }

  return (is_part_of_bitmap << 16) + can_collide_with_bitmap;
}
