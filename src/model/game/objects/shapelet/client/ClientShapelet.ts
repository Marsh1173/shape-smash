import { Shapelet, ShapeletData } from "../Shapelet";
import { ShapeletRig } from "../sprite/rig/ShapeletRig";
import { ClientHealthComponent } from "../../components/health/client/ClientHealthComponent";
import { ClientShapeletSyncher } from "./ClientShapeletSyncher";
import { ClientGameSystem } from "../../../system/client/ClientGameSystem";

export class ClientShapelet extends Shapelet {
  public readonly syncher: ClientShapeletSyncher;
  public readonly health_component: ClientHealthComponent;
  public readonly rig: ShapeletRig;

  constructor(protected readonly game_system: ClientGameSystem, data: ShapeletData) {
    super(game_system.rapier_world, data);

    this.health_component = new ClientHealthComponent(Shapelet.base_stats.max_health, data.health_data);

    this.rig = new ShapeletRig(this.game_system.display, this.body, data.sprite_data);
    this.syncher = new ClientShapeletSyncher(this);
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
