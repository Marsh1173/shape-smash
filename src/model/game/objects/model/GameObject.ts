import { HasId } from "../../../utils/Id";
import { Platform, PlatformData } from "../platform/Platform";
import { Portal } from "../portal/Portal";
import { PortalData } from "../portal/PortalSchema";
import { Shapelet } from "../shapelet/Shapelet";
import { ShapeletData } from "../shapelet/ShapeletSchema";

export type GameObjectData = ShapeletData | PlatformData | PortalData;

export type GameObjectType = Shapelet | Platform | Portal;

export interface GameObject extends HasId {
  destroy(): void;
}
