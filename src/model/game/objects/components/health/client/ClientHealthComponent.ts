import { Id } from "../../../../../utils/Id";
import { ClientGameSystem } from "../../../../system/client/ClientGameSystem";
import { HealthComponent, HealthComponentData } from "../HealthComponent";

// TODO remove most of this's api, like take damage, heal, etc
// OR update the API to have damage and heal messages instead of update health messages
export class ClientHealthComponent extends HealthComponent {
  constructor(max_health: number, data: HealthComponentData, game_system: ClientGameSystem, object_id: Id) {
    super(max_health, data.current_health ?? max_health, game_system, object_id);
  }
}
