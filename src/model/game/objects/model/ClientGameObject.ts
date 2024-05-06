import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientPortal } from "../objects/portal/client/ClientPortal";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";

export type ClientGameObjectType =
  | ClientShapelet
  | ClientPlatform
  | ClientPortal;
