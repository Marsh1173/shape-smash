import { Shapelet } from "../Shapelet";
import { ShapeletRig } from "./sprite/rig/ShapeletRig";
import { ClientHealthComponent } from "../../../components/health/client/ClientHealthComponent";
import { ClientShapeletSyncher } from "./ClientShapeletSyncher";
import { ClientGameSystem } from "../../../../system/client/ClientGameSystem";
import { ShapeletData } from "../ShapeletSchema";
import { ClientAbilityComponent } from "../../../components/ability/client/ClientAbilityComponent";

export class ClientShapelet extends Shapelet {
  public readonly syncher: ClientShapeletSyncher;
  public readonly health_component: ClientHealthComponent;
  public readonly ability_component: ClientAbilityComponent;
  public readonly rig: ShapeletRig;

  constructor(protected readonly game_system: ClientGameSystem, data: ShapeletData) {
    super(game_system, data);

    this.ability_component = new ClientAbilityComponent(this.game_system, this);
    this.health_component = new ClientHealthComponent(
      Shapelet.base_stats.max_health,
      data.health_data,
      this.game_system,
      this.id
    );

    this.rig = new ShapeletRig(this.game_system.display, this, data.sprite_data);
    this.syncher = new ClientShapeletSyncher(this, this.game_system);

    this.health_component.death_observable.add_observer({
      id: this.id,
      on_die: () => {
        this.game_system.particle_system.factory.shapelet_remains(
          this.sprite_data.body_color,
          this.positional_component.pos,
          this.positional_component.vel.x
        );
      },
    });
  }

  public destroy() {
    super.destroy();
    this.rig.destroy();
  }

  public update(elapsed_seconds: number) {
    super.update(elapsed_seconds);
    this.rig.update(elapsed_seconds);
  }
}
