import { Vector } from "@dimforge/rapier2d-compat";
import { ShapeletBodyColor } from "../objects/objects/shapelet/client/sprite/ShapeletSpriteData";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ShapeletRemains } from "./particles/ShapeletRemains";

export class ParticleFactory {
  constructor(protected readonly game_system: ClientGameSystem) {}
  public shapelet_remains(
    color: ShapeletBodyColor,
    pos: Vector,
    x_vel: number
  ) {
    this.game_system.particle_system.add(
      new ShapeletRemains(this.game_system, color, pos, x_vel)
    );
  }
}
