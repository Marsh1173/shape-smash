import { Id } from "../../../../../utils/Id";
import { ServerGameSystem } from "../../../../system/server/ServerGameSystem";
import { HealthComponent, HealthComponentData } from "../HealthComponent";

export class ServerHealthComponent extends HealthComponent {
  constructor(max_health: number, data: HealthComponentData, game_system: ServerGameSystem, object_id: Id) {
    super(max_health, data.current_health ?? max_health, game_system, object_id);
  }

  public damage(amount: number) {
    super.damage(amount);

    if (this.current_health.value === 0) {
      this.die();
    }
  }

  public die(): void {
    super.die();
    this.game_system.object_container.remove_object(this.object_id);
  }
}
