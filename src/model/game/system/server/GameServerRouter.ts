import { ClientGameMessage } from "../../../../server/network/schema/ClientMessage";
import { Id } from "../../../utils/Id";
import { ServerGameSystem } from "./ServerGameSystem";

export class GameServerRouter {
  constructor(protected readonly game_system: ServerGameSystem) {}

  public route_msg(msg: ClientGameMessage, id: Id) {
    switch (msg.msg.type) {
      case "PlayerMoveMessage":
        const shapelet = this.game_system.shapelets.find((s) => s.id === id);
        shapelet?.syncher.route_msg(msg.msg);
        break;
    }
  }
}
