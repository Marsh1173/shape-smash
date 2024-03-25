import { ServerHealthComponent } from "../../components/health/server/ServerHealthComponent";
import { Shapelet, ShapeletData } from "../Shapelet";
import { ServerShapeletSyncher } from "./ServerShapeletSyncher";
import { ServerGameSystem } from "../../../system/server/ServerGameSystem";

export class ServerShapelet extends Shapelet {
  public readonly syncher: ServerShapeletSyncher;
  public readonly health_component: ServerHealthComponent;

  constructor(game_system: ServerGameSystem, data: ShapeletData) {
    super(game_system.rapier_world, data);

    this.health_component = new ServerHealthComponent(Shapelet.base_stats.max_health, data.health_data);

    this.syncher = new ServerShapeletSyncher(this, game_system.server_room);
  }
}
