import { Vector } from "@dimforge/rapier2d-compat";
import { ShapeletAction } from "../../../model/game/objects/objects/shapelet/ShapeletController";

export type ClientMessage = ClientGameMessage;

export interface ClientGameMessage {
  type: "ClientGameMessage";
  msg: PlayerMoveMessage;
}

export interface PlayerMoveMessage {
  type: "PlayerMoveMessage";
  active: boolean;
  action: ShapeletAction;
  pos: Vector;
  vel: Vector;
}
