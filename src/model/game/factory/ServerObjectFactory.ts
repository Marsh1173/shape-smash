import { PlatformData, Platform } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ServerShapelet } from "../objects/shapelet/ServerShapelet";
import { World } from "@dimforge/rapier2d-compat";
import { ServerGameSystem } from "../system/ServerGameSystem";
import { ShapeletData } from "../objects/shapelet/Shapelet";

export class ServerObjectFactory extends ObjectFactory {
  constructor(world: World, protected readonly game_system: ServerGameSystem) {
    super(world, game_system);
  }

  public shapelet(data: ShapeletData): ServerShapelet {
    return new ServerShapelet(this.world, data);
  }

  public platform(data: PlatformData): Platform {
    return new Platform(this.world, data);
  }
}
