import { ServerHealthComponent } from "../../../components/health/server/ServerHealthComponent";
import { Shapelet } from "../Shapelet";
import { ServerShapeletSyncher } from "./ServerShapeletSyncher";
import { ServerGameSystem } from "../../../../system/server/ServerGameSystem";
import { TriggerDeathOnFall } from "../../../components/TriggerDeathOnFall";
import { ShapeletData } from "../ShapeletSchema";
import { ServerAbilityComponent } from "../../../components/ability/server/ServerAbilityComponent";

export class ServerShapelet extends Shapelet {
  public readonly syncher: ServerShapeletSyncher;
  public readonly health_component: ServerHealthComponent;
  public readonly ability_component: ServerAbilityComponent;
  protected readonly trigger_death_on_fall: TriggerDeathOnFall;

  constructor(protected readonly game_system: ServerGameSystem, data: ShapeletData) {
    super(game_system, data);

    this.ability_component = new ServerAbilityComponent(this.id, this.game_system.server_room);
    this.health_component = new ServerHealthComponent(
      Shapelet.base_stats.max_health,
      data.health_data,
      this.game_system,
      this.id
    );
    this.trigger_death_on_fall = new TriggerDeathOnFall(this.health_component, () => this.positional_component.pos);

    this.syncher = new ServerShapeletSyncher(this, game_system.server_room);
  }

  public update(elapsed_seconds: number) {
    super.update(elapsed_seconds);
    this.trigger_death_on_fall.update();
  }

  //temp code called by syncher
  public attack() {
    this.ability_component.set_ability(this.game_system.ability_factory.attack_sword({ type: "AttackSword" }, this.id));
  }
  public dash() {
    this.ability_component.set_ability(
      this.game_system.ability_factory.dash(
        {
          type: "Dash",
          start_pos: this.positional_component.pos,
          end_pos: { x: this.positional_component.pos.x, y: this.positional_component.pos.y - 40 },
        },
        this.positional_component
      )
    );
  }
}
