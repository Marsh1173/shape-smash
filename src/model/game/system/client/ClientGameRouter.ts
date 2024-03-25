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
      const new_shapelet = this.game_system.object_factory.shapelet(msg.msg.player_data.shapelet_data);
      this.game_system.shapelets.push(new_shapelet);
    } else if (msg.msg.type === "UserLeaveMessage") {
      const user_leave_message_id = msg.msg.id;
      const shapelet_index = this.game_system.shapelets.findIndex((shapelet) => shapelet.id === user_leave_message_id);
      if (shapelet_index !== -1) {
        this.game_system.shapelets[shapelet_index].destroy();
        this.game_system.shapelets.splice(shapelet_index, 1);
      }
    } else if (msg.msg.type === "ServerShapeletMessage") {
      const shapelet_id = msg.msg.id;
      const shapelet = this.game_system.shapelets.find((s) => s.id === shapelet_id);
      shapelet?.syncher.route_msg(msg.msg);
    } else {
      throw new Error("Unknown message in client router");
    }
  }
}
