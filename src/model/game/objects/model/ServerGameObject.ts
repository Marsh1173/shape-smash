import { Platform } from "../platform/Platform";
import { Portal } from "../portal/Portal";
import { ServerShapelet } from "../shapelet/server/ServerShapelet";

export type ServerGameObjectType = ServerShapelet | Platform | Portal;
