import { HasId } from "../../utils/Id";
import { Platform, PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "../factory/ObjectFactory";
import RAPIER, { World } from "@dimforge/rapier2d-compat";
import { Shapelet, ShapeletData } from "../objects/shapelet/Shapelet";

export abstract class GameSystem extends HasId {
  public readonly platforms: Platform[] = [];
  public readonly shapelets: Shapelet[] = [];

  public readonly rapier_world: World;
  public abstract readonly object_factory: ObjectFactory;

  constructor(data: GameData) {
    super();

    this.rapier_world = new RAPIER.World({ x: 0, y: 70 });
  }

  protected populate_objects(data: GameData) {
    for (const platform_data of data.platforms) {
      this.platforms.push(this.object_factory.platform(platform_data));
    }
    for (const shapelet_data of data.shapelets) {
      this.shapelets.push(this.object_factory.shapelet(shapelet_data));
    }
  }

  public update(elapsed_seconds: number) {
    this.shapelets.forEach((shapelet) => shapelet.update(elapsed_seconds));

    this.rapier_world.timestep = elapsed_seconds; // sync physics across varying fps
    this.rapier_world.step();
  }

  public dispose() {
    this.shapelets.forEach((shapelet) => shapelet.destroy());
  }
}

export interface GameData {
  platforms: PlatformData[];
  shapelets: ShapeletData[];
}
