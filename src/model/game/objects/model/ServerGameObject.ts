import { Platform } from "../objects/platform/Platform";
import { Portal } from "../objects/portal/Portal";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";

export type ServerGameObjectType = ServerShapelet | Platform | Portal;
