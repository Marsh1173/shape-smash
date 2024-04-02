import { ServerHealthComponent } from "../../components/health/server/ServerHealthComponent";
import { Shapelet } from "../Shapelet";
import { ServerShapeletSyncher } from "./ServerShapeletSyncher";
import { ServerGameSystem } from "../../../system/server/ServerGameSystem";
import { TriggerDeathOnFall } from "../../components/TriggerDeathOnFall";
import { ShapeletData } from "../ShapeletSchema";

export class ServerShapelet extends Shapelet {
  public readonly syncher: ServerShapeletSyncher;
  public readonly health_component: ServerHealthComponent;
  protected readonly trigger_death_on_fall: TriggerDeathOnFall;

  constructor(game_system: ServerGameSystem, data: ShapeletData) {
    super(game_system, data);

    this.health_component = new ServerHealthComponent(Shapelet.base_stats.max_health, data.health_data);
    this.trigger_death_on_fall = new TriggerDeathOnFall(this.health_component, () => this.body.pos);

    this.syncher = new ServerShapeletSyncher(this, game_system.server_room);
  }

  public update(elapsed_seconds: number) {
    super.update(elapsed_seconds);
    this.trigger_death_on_fall.update();
  }
}
