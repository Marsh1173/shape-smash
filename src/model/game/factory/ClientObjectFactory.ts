import { ClientPlayerData } from "../objects/player/ClientPlayer";
import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ClientPlayer } from "../objects/player/ClientPlayer";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ShapeletData } from "../objects/shapelet/Shapelet";

export class ClientObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ClientGameSystem) {
    super(game_system);
  }

  public player(data: ClientPlayerData): ClientPlayer {
    const shapelet = this.shapelet(data.shapelet_data);
    return new ClientPlayer(shapelet, data, this.game_system);
  }

  public shapelet(data: ShapeletData): ClientShapelet {
    return new ClientShapelet(this.game_system.rapier_world, data, this.game_system.pixijs_main_stage);
  }

  public platform(data: PlatformData): ClientPlatform {
    return new ClientPlatform(this.game_system.rapier_world, data, this.game_system.pixijs_main_stage);
  }
}
