import { Vector } from "@dimforge/rapier2d-compat";
import { ServerHealthComponent } from "./server/ServerHealthComponent";

export class TriggerDeathOnFall {
  constructor(protected readonly health_component: ServerHealthComponent, protected readonly pos: () => Vector) {}

  public update() {
    if (this.pos().y > 0) {
      this.health_component.damage(Infinity);
    }
  }
}
