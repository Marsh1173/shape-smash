import { ServerGameMessage, ServerMessage } from "../../../../client/network/schema/ServerMessage";
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
      this.game_system.object_factory.shapelet(msg.msg.player_data.shapelet_data);
    } else if (msg.msg.type === "UserLeaveMessage") {
      this.game_system.object_container.shapelets.get(msg.msg.id)?.destroy();
    } else if (msg.msg.type === "ServerShapeletMessage") {
      const shapelet = this.game_system.object_container.shapelets.get(msg.msg.id);
      shapelet?.syncher.route_msg(msg.msg);
    } else {
      throw new Error("Unknown message in client router");
    }
  }
}
