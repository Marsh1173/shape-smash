import { PlayerMoveMessage } from "../../../../../client/network/schema/ClientMessage";
import { Id, uuid } from "../../../../utils/Id";
import { GameServerRoom } from "../../../system/server/GameServerRoom";
import {
  ServerHealthComponentBroadcaster,
  ServerHealthComponentSyncher,
} from "../../components/health/server/ServerHealthComponentSyncher";
import { ShapeletAction } from "../ShapeletController";
import { ServerShapelet } from "./ServerShapelet";
import { ServerShapeletMessageContent } from "./ServerShapeletSchema";

export class ServerShapeletSyncher implements ServerHealthComponentBroadcaster {
  protected readonly syncher_id: Id = uuid();
  protected readonly health_syncher: ServerHealthComponentSyncher;

  constructor(protected readonly shapelet: ServerShapelet, protected readonly server_room: GameServerRoom) {
    this.health_syncher = new ServerHealthComponentSyncher(this.shapelet.health_component, this.syncher_id, this);
  }

  public broadcast(msg: ServerShapeletMessageContent) {
    this.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerShapeletMessage",
        id: this.shapelet.id,
        msg: msg,
      },
    });
  }

  public route_msg(msg: PlayerMoveMessage) {
    this.shapelet.controller.on_input(msg.action, msg.active);
    this.shapelet.body.set_pos_and_vel(msg.pos, msg.vel);

    //temp code
    if (msg.action === ShapeletAction.MainAction && msg.active) {
      this.shapelet.snipe();
    }

    this.broadcast({
      type: "ServerShapeletActionMessage",
      active: msg.active,
      action: msg.action,
      pos: msg.pos,
      vel: msg.vel,
    });
  }
}