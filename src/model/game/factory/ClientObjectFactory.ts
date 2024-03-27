import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ShapeletData } from "../objects/shapelet/Shapelet";
import { GameObjectData } from "../objects/model/GameObject";

export class ClientObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ClientGameSystem) {
    super(game_system);
  }

  public object(object_data: GameObjectData) {
    if (object_data.type === "PlatformData") {
      this.platform(object_data);
    } else if (object_data.type === "ShapeletData") {
      this.shapelet(object_data);
    } else {
      throw new Error("Unknown object data type " + (object_data as { type: string }).type);
    }
  }

  public shapelet(data: ShapeletData): ClientShapelet {
    const shapelet = new ClientShapelet(this.game_system, data);
    this.game_system.object_container.add_object(shapelet);
    return shapelet;
  }

  public platform(data: PlatformData): ClientPlatform {
    const platform = new ClientPlatform(this.game_system, data);
    this.game_system.object_container.add_object(platform);
    return platform;
  }
}
