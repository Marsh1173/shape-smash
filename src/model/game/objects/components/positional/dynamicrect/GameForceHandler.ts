import { Vector } from "@dimforge/rapier2d-compat";
import { Id } from "../../../../../utils/Id";

export interface GameForce {
  duration: number;
  calc_position: (progress: number) => Vector;
}

export class GameForceHandler {
  protected running_game_forces: Map<Id, { runtime: number } & GameForce> = new Map();

  public add_force(id: Id, force: GameForce) {
    this.running_game_forces.set(id, { ...force, runtime: 0 });
  }

  public remove_force(id: Id) {
    this.running_game_forces.delete(id);
  }

  public calculate_frame_force(elapsed_seconds: number): Vector {
    let sum = { x: 0, y: 0 };

    for (const [id, force] of this.running_game_forces) {
      const prev_pos = force.calc_position(force.runtime / force.duration);

      force.runtime += elapsed_seconds;
      if (force.runtime > force.duration) {
        this.remove_force(id);
        force.runtime = force.duration;
      }

      const current_pos = force.calc_position(force.runtime / force.duration);

      sum.x += current_pos.x - prev_pos.x;
      sum.y += current_pos.y - prev_pos.y;
    }

    return sum;
  }
}
