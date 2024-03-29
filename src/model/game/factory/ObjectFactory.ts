import { Platform, PlatformData } from "../objects/platform/Platform";
import { GameSystem } from "../system/GameSystem";
import { Shapelet, ShapeletData } from "../objects/shapelet/Shapelet";
import { GameObjectType } from "../objects/model/GameObject";

export abstract class ObjectFactory {
  constructor(protected readonly game_system: GameSystem) {}
  public abstract shapelet(data: ShapeletData): Shapelet;
  public abstract platform(data: PlatformData): Platform;

  protected insert_object_into_container(object: GameObjectType) {
    this.game_system.object_container.add_object(object);
  }
}
