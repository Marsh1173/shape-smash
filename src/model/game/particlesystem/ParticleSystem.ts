import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ParticleFactory } from "./ParticleFactory";

export interface ParticleUnit {
  update(elapsed_seconds: number): boolean;
  destroy(): void;
}

export class ParticleSystem {
  protected readonly units: ParticleUnit[] = [];
  public readonly factory: ParticleFactory;
  constructor(game_system: ClientGameSystem) {
    this.factory = new ParticleFactory(game_system);
  }

  public update(elapsed_seconds: number) {
    for (let i: number = 0; i < this.units.length; i++) {
      const finished = this.units[i].update(elapsed_seconds);

      if (finished) {
        this.units[i].destroy();
        this.units.splice(i, 1);
        i--;
      }
    }
  }

  public add(unit: ParticleUnit) {
    this.units.push(unit);
  }

  public destroy() {
    this.units.forEach((unit) => unit.destroy());
  }
}
