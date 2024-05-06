import { Vector } from "@dimforge/rapier2d-compat";
import { ShapeletAction } from "../ShapeletController";
import { ServerHealthComponentMessage } from "../../../components/health/server/ServerHealthComponentSchema";
import { Id } from "../../../../../utils/Id";

export type ServerShapeletMessageContent =
  | ServerShapeletActionMessage
  | ServerHealthComponentMessage;

export interface ServerShapeletMessage {
  type: "ServerShapeletMessage";
  id: Id;
  msg: ServerShapeletMessageContent;
}

export interface ServerShapeletActionMessage {
  type: "ServerShapeletActionMessage";
  active: boolean;
  action: ShapeletAction;
  pos: Vector;
  vel: Vector;
}
