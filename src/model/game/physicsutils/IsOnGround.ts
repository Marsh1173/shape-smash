import { CharacterCollision, KinematicCharacterController } from "@dimforge/rapier2d-compat";

// Roughly 25 degrees, or 0.46 radians of allowed slope
const MAX_FLOOR_Y_NORMAL: number = -0.9;

export function IsOnGround(character_controller: KinematicCharacterController): boolean {
  let is_now_on_ground: boolean = false;
  for (let i = 0; i < character_controller.numComputedCollisions(); i++) {
    let collision: CharacterCollision | null = character_controller.computedCollision(i);
    if (collision && collision.normal1 && collision.normal1.y < MAX_FLOOR_Y_NORMAL) {
      is_now_on_ground = true;
    }
  }

  return is_now_on_ground;
}
