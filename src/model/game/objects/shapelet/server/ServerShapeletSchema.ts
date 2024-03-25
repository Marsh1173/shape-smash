import { Vector } from "@dimforge/rapier2d-compat";
import { ShapeletAction } from "../ShapeletController";
import { ServerHealthComponentMessage } from "../../components/health/server/ServerHealthComponentSchema";
import { Id } from "../../../../utils/Id";

export type ServerShapeletMessageContent = ServerShapeletMoveMessage | ServerHealthComponentMessage;

export interface ServerShapeletMessage {
  type: "ServerShapeletMessage";
  id: Id;
  msg: ServerShapeletMessageContent;
}

export interface ServerShapeletMoveMessage {
  type: "ServerShapeletMoveMessage";
  active: boolean;
  action: ShapeletAction;
  pos: Vector;
  vel: Vector;
}
