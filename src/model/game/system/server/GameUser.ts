import { User } from "../../../../server/network/user/User";
import { ClientMessage } from "../../../../server/network/schema/ClientMessage";
import { ServerGameSystem } from "./ServerGameSystem";
import { WebsocketWrapper } from "../../../../server/network/user/WebsocketWrapper";

export class GameUser extends User {
  constructor(ws_wrapper: WebsocketWrapper, protected readonly game: ServerGameSystem) {
    super(ws_wrapper);
  }

  public receive_message(msg: ClientMessage): void {
    if (msg.type === "ClientGameMessage") {
      this.game.server_room.router.route_msg(msg, this.id);
    }
  }

  public on_close(): void {
    this.game.remove_user(this.id);
  }
}
