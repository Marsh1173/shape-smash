import { Platform, PlatformData } from "../platform/Platform";
import { GameSystem } from "../../system/GameSystem";
import { Shapelet } from "../shapelet/Shapelet";
import { GameObjectData, GameObjectType } from "../model/GameObject";
import { ShapeletData } from "../shapelet/ShapeletSchema";
import { PortalData } from "../portal/PortalSchema";
import { Portal } from "../portal/Portal";

export abstract class ObjectFactory {
  constructor(protected readonly game_system: GameSystem) {}
  public abstract shapelet(data: ShapeletData): Shapelet;
  public abstract platform(data: PlatformData): Platform;
  public abstract portal(data: PortalData): Portal;

  protected insert_object_into_container(object: GameObjectType) {
    this.game_system.object_container.add_object(object);
  }

  public object(object_data: GameObjectData) {
    if (object_data.type === "PlatformData") {
      this.platform(object_data);
    } else if (object_data.type === "ShapeletData") {
      this.shapelet(object_data);
    } else if (object_data.type === "PortalData") {
      this.portal(object_data);
    } else {
      throw new Error(
        "Unknown object data type " + (object_data as { type: string }).type
      );
    }
  }
}
