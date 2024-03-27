import { HasId } from "../../../utils/Id";
import { PlatformData } from "../platform/Platform";
import { ShapeletData } from "../shapelet/Shapelet";

export type GameObjectData = ShapeletData | PlatformData;

export interface GameObject extends HasId {
  destroy(): void;
}
