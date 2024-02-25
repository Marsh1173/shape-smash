import { HasId } from "../../utils/Id";
import { Platform, PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "../factory/ObjectFactory";
import { Rapier } from "../../utils/Rapier";
import { World } from "@dimforge/rapier2d-compat";
import { Shapelet, ShapeletData } from "../objects/shapelet/Shapelet";

export abstract class GameSystem extends HasId {
  protected readonly platforms: Platform[] = [];
  protected readonly shapelets: Shapelet[] = [];

  protected readonly rapier_world: World;
  protected abstract readonly object_factory: ObjectFactory;

  constructor(data: GameData) {
    super();

    this.rapier_world = new Rapier.World({ x: 0, y: 70 });
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

  public get_game_data(): GameData {
    return {
      platforms: this.platforms.map((platform) => platform.get_data()),
      shapelets: [],
    };
  }

  public dispose() {
    this.shapelets.forEach((shapelet) => shapelet.destroy());
  }
}

export interface GameData {
  platforms: PlatformData[];
  shapelets: ShapeletData[];
}
