import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ShapeletData } from "../objects/shapelet/Shapelet";

export class ClientObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ClientGameSystem) {
    super(game_system);
  }

  public shapelet(data: ShapeletData): ClientShapelet {
    return new ClientShapelet(this.game_system, data);
  }

  public platform(data: PlatformData): ClientPlatform {
    return new ClientPlatform(this.game_system, data);
  }
}
