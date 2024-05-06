import { Id } from "../../../utils/Id";
import { GameObjectType } from "../model/GameObject";
import { Platform } from "../objects/platform/Platform";
import { Portal } from "../objects/portal/Portal";
import { Shapelet } from "../objects/shapelet/Shapelet";

export abstract class ObjectContainer {
  protected readonly _platforms: Map<Id, Platform> = new Map();
  protected readonly _shapelets: Map<Id, Shapelet> = new Map();
  protected readonly _portals: Map<Id, Portal> = new Map();

  public readonly platforms: ReadonlyMap<Id, Platform> = this._platforms;
  public readonly shapelets: ReadonlyMap<Id, Shapelet> = this._shapelets;
  public readonly portals: ReadonlyMap<Id, Portal> = this._portals;

  protected readonly _objects: Map<Id, GameObjectType> = new Map();
  public readonly objects: ReadonlyMap<Id, GameObjectType> = this._objects;

  public add_object(object: GameObjectType) {
    if (this._objects.has(object.id)) {
      throw new Error(
        "Object already in container: " + object.type + " " + object.id
      );
    }

    this._objects.set(object.id, object);
    this.get_container(object.type).set(object.id, object);
  }

  public remove_object(id: Id) {
    const object = this._objects.get(id);
    if (object) {
      this.remove_object_inner(object);
    }
  }

  protected remove_object_inner(object: GameObjectType) {
    object.destroy();
    this._objects.delete(object.id);
    this.get_container(object.type).delete(object.id);
  }

  protected get_container(label: string): Map<Id, GameObjectType> {
    switch (label) {
      case "Platform":
        return this._platforms;
      case "Shapelet":
        return this._shapelets;
      case "Portal":
        return this._portals;
      default:
        throw new Error("Unknown container " + label);
    }
  }
}
