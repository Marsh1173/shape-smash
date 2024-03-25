import { HealthComponent, HealthComponentData } from "../HealthComponent";

export class ClientHealthComponent extends HealthComponent {
  constructor(max_health: number, data: HealthComponentData) {
    super(max_health, data.current_health ?? max_health);
  }
}
