import { Id } from "../../utils/Id";
import { Platform } from "../objects/platform/Platform";
import { Shapelet } from "../objects/shapelet/Shapelet";

export abstract class ObjectContainer {
  public readonly platforms: Map<Id, Platform> = new Map();
  public readonly shapelets: Map<Id, Shapelet> = new Map();
}
