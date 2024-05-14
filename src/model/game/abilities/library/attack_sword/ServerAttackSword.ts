import { AttackSword, AttackSwordData } from "./AttackSword";
import { ServerGameSystem } from "../../../system/server/ServerGameSystem";
import { Id } from "../../../../utils/Id";

export class ServerAttackSword extends AttackSword {
  constructor(
    data: AttackSwordData,
    protected readonly game_system: ServerGameSystem,
    protected readonly actor_id: Id
  ) {
    super(data);
  }

  public update(elapsed_seconds: number): void {
    super.update(elapsed_seconds);

    if (this.is_finished()) {
      this.game_system.object_container.shapelets.forEach((shapelet) => {
        if (shapelet.id !== this.actor_id) {
          shapelet.health_component.damage(1);
        }
      });
    }
  }
}
