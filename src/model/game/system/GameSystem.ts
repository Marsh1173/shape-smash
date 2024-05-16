import { HasId } from "../../utils/Id";
import { ObjectFactory } from "../objects/factory/ObjectFactory";
import RAPIER, { World } from "@dimforge/rapier2d-compat";
import { ObjectContainer } from "../objects/container/ObjectContainer";
import { GameObjectData } from "../objects/model/GameObject";
import { CleanupCallbacks } from "../utils/CleanupCallbacks";

export abstract class GameSystem extends HasId {
  public readonly rapier_world: World;
  public abstract readonly object_container: ObjectContainer;
  public abstract readonly object_factory: ObjectFactory;
  public readonly cleanup_callbacks = new CleanupCallbacks();

  constructor(data: GameData) {
    super();

    this.rapier_world = new RAPIER.World({ x: 0, y: 70 });
  }

  protected populate_objects(data: GameData) {
    for (const obj_data of data.obj_data) {
      this.object_factory.object(obj_data);
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
    this.cleanup_callbacks.cleanup();
  }
}

export interface GameData {
  obj_data: GameObjectData[];
}
