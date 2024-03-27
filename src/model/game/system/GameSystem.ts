import { HasId } from "../../utils/Id";
import { PlatformData } from "../objects/platform/Platform";
import { ObjectFactory } from "../factory/ObjectFactory";
import RAPIER, { World } from "@dimforge/rapier2d-compat";
import { ShapeletData } from "../objects/shapelet/Shapelet";
import { ObjectContainer } from "../objectcontainer/ObjectContainer";

export abstract class GameSystem extends HasId {
  public readonly rapier_world: World;
  public abstract readonly object_container: ObjectContainer;
  public abstract readonly object_factory: ObjectFactory;

  constructor(data: GameData) {
    super();

    this.rapier_world = new RAPIER.World({ x: 0, y: 70 });
  }

  protected populate_objects(data: GameData) {
    for (const platform_data of data.platforms) {
      this.object_factory.platform(platform_data);
    }
    for (const shapelet_data of data.shapelets) {
      this.object_factory.shapelet(shapelet_data);
    }
  }

  public update(elapsed_seconds: number) {
    this.object_container.shapelets.forEach((shapelet) => shapelet.update(elapsed_seconds));

    this.rapier_world.timestep = elapsed_seconds; // sync physics across varying fps
    this.rapier_world.step();
  }

  public dispose() {
    this.object_container.objects.forEach((object) => {
      this.object_container.remove_object(object.id);
    });
  }
}

export interface GameData {
  platforms: PlatformData[];
  shapelets: ShapeletData[];
}
