import { Shapelet, ShapeletData } from "../Shapelet";
import { Container } from "pixi.js";
import { World } from "@dimforge/rapier2d-compat";
import { ShapeletRig } from "../sprite/rig/ShapeletRig";
import { ClientHealthComponent } from "../../components/health/client/ClientHealthComponent";
import { ClientShapeletSyncher } from "./ClientShapeletSyncher";

export class ClientShapelet extends Shapelet {
  public readonly syncher: ClientShapeletSyncher;
  public readonly health_component: ClientHealthComponent;
  public readonly rig: ShapeletRig;

  constructor(world: World, data: ShapeletData, pixijs_main_stage: Container) {
    super(world, data);

    this.health_component = new ClientHealthComponent(Shapelet.base_stats.max_health, data.health_data);

    this.rig = new ShapeletRig(pixijs_main_stage, this.body, data.sprite_data);
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
