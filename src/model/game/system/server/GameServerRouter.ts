import { ClientGameMessage } from "../../../../server/network/schema/ClientMessage";
import { Id } from "../../../utils/Id";
import { ServerGameSystem } from "./ServerGameSystem";

export class GameServerRouter {
  constructor(protected readonly game_system: ServerGameSystem) {}

  public route_msg(msg: ClientGameMessage, id: Id) {
    if (msg.msg.type === "PlayerMoveMessage") {
      const shapelet = this.game_system.object_container.shapelets.get(id);
      shapelet?.syncher.route_msg(msg.msg);
    } else {
      throw new Error("Unknown message in client router");
    }
  }
}
