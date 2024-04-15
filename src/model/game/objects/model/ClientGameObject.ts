import { ClientPlatform } from "../platform/ClientPlatform";
import { ClientPortal } from "../portal/client/ClientPortal";
import { ClientShapelet } from "../shapelet/client/ClientShapelet";

export type ClientGameObjectType = ClientShapelet | ClientPlatform | ClientPortal;
