import { PlayerMoveMessage } from "../../../../../../client/network/schema/ClientMessage";
import { Id, uuid } from "../../../../../utils/Id";
import { GameServerRoom } from "../../../../system/server/GameServerRoom";
import { ServerHealthComponentSyncher } from "../../../components/health/server/ServerHealthComponentSyncher";
import { ShapeletAction } from "../ShapeletController";
import { ServerShapelet } from "./ServerShapelet";
import { ServerShapeletMessageContent } from "./ServerShapeletSchema";

export class ServerShapeletSyncher {
  protected readonly syncher_id: Id = uuid();
  protected readonly health_syncher: ServerHealthComponentSyncher;

  constructor(protected readonly shapelet: ServerShapelet, protected readonly server_room: GameServerRoom) {
    this.health_syncher = new ServerHealthComponentSyncher(
      this.shapelet.health_component,
      this.syncher_id,
      this.server_room,
      this.shapelet.id
    );
  }

  protected broadcast(msg: ServerShapeletMessageContent) {
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

    //TODO write a check here to make sure client position isn't too far from server position

    //temp code
    if (msg.action === ShapeletAction.MainAction) {
      if (msg.active) {
        this.shapelet.attack();
      }
    } else if (msg.action === ShapeletAction.SecondaryAction) {
      if (msg.active) {
        this.shapelet.dash();
      }
    } else {
      this.broadcast({
        type: "ServerShapeletActionMessage",
        active: msg.active,
        action: msg.action,
        pos: this.shapelet.positional_component.pos,
        vel: this.shapelet.positional_component.vel,
      });
    }
  }
}
