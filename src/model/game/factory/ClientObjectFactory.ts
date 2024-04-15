import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { ShapeletData } from "../objects/shapelet/ShapeletSchema";
import { PortalData } from "../objects/portal/PortalSchema";
import { ClientPortal } from "../objects/portal/client/ClientPortal";

export class ClientObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ClientGameSystem) {
    super(game_system);
  }

  public shapelet(data: ShapeletData): ClientShapelet {
    const shapelet = new ClientShapelet(this.game_system, data);
    this.insert_object_into_container(shapelet);
    return shapelet;
  }

  public platform(data: PlatformData): ClientPlatform {
    const platform = new ClientPlatform(this.game_system, data);
    this.insert_object_into_container(platform);
    return platform;
  }

  public portal(data: PortalData): ClientPortal {
    const portal = new ClientPortal(this.game_system, data);
    this.insert_object_into_container(portal);
    return portal;
  }
}
