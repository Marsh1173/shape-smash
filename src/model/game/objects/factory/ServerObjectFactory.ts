import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";
import { ServerGameSystem } from "../../system/server/ServerGameSystem";
import { ShapeletData } from "../objects/shapelet/ShapeletSchema";
import { PortalData } from "../objects/portal/PortalSchema";
import { ServerPlatform } from "../objects/platform/ServerPlatform";
import { ServerPortal } from "../objects/portal/ServerPortal";

export class ServerObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ServerGameSystem) {
    super(game_system);
  }

  public shapelet(data: ShapeletData): ServerShapelet {
    const shapelet = new ServerShapelet(this.game_system, data);
    this.insert_object_into_container(shapelet);
    return shapelet;
  }

  public platform(data: PlatformData): ServerPlatform {
    const platform = new ServerPlatform(this.game_system, data);
    this.insert_object_into_container(platform);
    return platform;
  }

  public portal(data: PortalData): ServerPortal {
    const portal = new ServerPortal(this.game_system, data);
    this.insert_object_into_container(portal);
    return portal;
  }
}
