import { HasId } from "../../../utils/Id";
import { Platform, PlatformData } from "../objects/platform/Platform";
import { Portal } from "../objects/portal/Portal";
import { PortalData } from "../objects/portal/PortalSchema";
import { Shapelet } from "../objects/shapelet/Shapelet";
import { ShapeletData } from "../objects/shapelet/ShapeletSchema";

export type GameObjectData = ShapeletData | PlatformData | PortalData;

export type GameObjectType = Shapelet | Platform | Portal;

export interface GameObject extends HasId {
  destroy(): void;
}
