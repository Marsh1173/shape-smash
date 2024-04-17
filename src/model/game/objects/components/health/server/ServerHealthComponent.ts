import { Id } from "../../../../../utils/Id";
import { ServerGameSystem } from "../../../../system/server/ServerGameSystem";
import { HealthComponent, HealthComponentData } from "../HealthComponent";

export class ServerHealthComponent extends HealthComponent {
  constructor(max_health: number, data: HealthComponentData, game_system: ServerGameSystem, object_id: Id) {
    super(max_health, data.current_health ?? max_health, game_system, object_id);
  }

  public heal(amount: number) {
    const old_health = this.current_health.value;
    this.current_health.set_value(Math.min(this.current_health.value + amount, this.max_health.value));
    this.heal_observable.on_take_heal({ amount, old_health, new_health: this.current_health.value });
  }

  public damage(amount: number) {
    const old_health = this.current_health.value;
    this.current_health.set_value(Math.max(this.current_health.value - amount, 0));
    this.damage_observable.on_take_damage({ amount, old_health, new_health: this.current_health.value });

    if (this.current_health.value === 0) {
      this.die();
    }
  }

  public die() {
    this.death_observable.on_die(undefined);
    this.game_system.object_container.remove_object(this.object_id);
  }
}
