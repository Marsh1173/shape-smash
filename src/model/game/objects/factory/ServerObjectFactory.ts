import { PlatformData, Platform } from "../platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ServerShapelet } from "../shapelet/server/ServerShapelet";
import { ServerGameSystem } from "../../system/server/ServerGameSystem";
import { ShapeletData } from "../shapelet/ShapeletSchema";
import { PortalData } from "../portal/PortalSchema";
import { Portal } from "../portal/Portal";

export class ServerObjectFactory extends ObjectFactory {
  constructor(protected readonly game_system: ServerGameSystem) {
    super(game_system);
  }

  public shapelet(data: ShapeletData): ServerShapelet {
    const shapelet = new ServerShapelet(this.game_system, data);
    this.insert_object_into_container(shapelet);
    return shapelet;
  }

  public platform(data: PlatformData): Platform {
    const platform = new Platform(this.game_system, data);
    this.insert_object_into_container(platform);
    return platform;
  }

  public portal(data: PortalData): Portal {
    const portal = new Portal(this.game_system, data);
    this.insert_object_into_container(portal);
    return portal;
  }
}