import { ServerMessage } from "../../../../server/network/schema/ServerMessage";
import { ServerGameMessage } from "../server/ServerGameMessageSchema";
import { ClientGameSystem } from "./ClientGameSystem";

export class ClientGameRouter {
  constructor(protected readonly game_system: ClientGameSystem) {
    this.game_system.server_talker.set_listener({
      receive_message: (msg: ServerMessage) => {
        if (msg.type === "ServerGameMessage") {
          this.route_msg(msg);
        }
      },
    });
  }

  public route_msg(msg: ServerGameMessage) {
    if (msg.msg.type === "UserJoinMessage") {
      //do nothing right now
    } else if (msg.msg.type === "UserLeaveMessage") {
      //do nothing right now
    } else if (msg.msg.type === "ServerShapeletMessage") {
      const shapelet = this.game_system.object_container.shapelets.get(msg.msg.id);
      shapelet?.syncher.route_msg(msg.msg);
    } else if (msg.msg.type === "ServerObjectMessage") {
      this.game_system.object_container.route_msg(msg.msg);
    } else {
      throw new Error("Unknown message in client router");
    }
  }
}
