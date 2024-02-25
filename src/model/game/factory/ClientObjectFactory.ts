import { Container, DisplayObject } from "pixi.js";
import { ClientPlayerData } from "../objects/player/ClientPlayer";
import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "./ObjectFactory";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/ClientShapelet";
import { ClientPlayer } from "../objects/player/ClientPlayer";
import { World } from "@dimforge/rapier2d-compat";
import { ClientGameSystem } from "../system/ClientGameSystem";
import { ShapeletData } from "../objects/shapelet/Shapelet";

export class ClientObjectFactory extends ObjectFactory {
  constructor(
    world: World,
    protected readonly game_system: ClientGameSystem,
    protected readonly pixijs_main_stage: Container<DisplayObject>
  ) {
    super(world, game_system);
  }

  public player(data: ClientPlayerData): ClientPlayer {
    const shapelet = this.shapelet(data.shapelet_data);
    return new ClientPlayer(shapelet, data, this.game_system);
  }

  public shapelet(data: ShapeletData): ClientShapelet {
    return new ClientShapelet(this.world, data, this.pixijs_main_stage);
  }

  public platform(data: PlatformData): ClientPlatform {
    return new ClientPlatform(this.world, data, this.pixijs_main_stage);
  }
}
