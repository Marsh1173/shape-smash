import { Platform, PlatformData } from "../objects/platform/Platform";
import { World } from "@dimforge/rapier2d-compat";
import { GameSystem } from "../system/GameSystem";
import { Shapelet, ShapeletData } from "../objects/shapelet/Shapelet";

export abstract class ObjectFactory {
  constructor(protected readonly world: World, protected readonly game_system: GameSystem) {}
  public abstract shapelet(data: ShapeletData): Shapelet;
  public abstract platform(data: PlatformData): Platform;
}
