import { HasId } from "../../../utils/Id";
import { Platform, PlatformData } from "../platform/Platform";
import { Shapelet, ShapeletData } from "../shapelet/Shapelet";

export type GameObjectData = ShapeletData | PlatformData;

export type GameObjectType = Shapelet | Platform;

export interface GameObject extends HasId {
  destroy(): void;
}
