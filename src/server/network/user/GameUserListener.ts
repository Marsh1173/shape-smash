import { User } from "./User";
import { ClientMessage } from "../schema/ClientMessage";
import { ServerGameSystem } from "../../../model/game/system/ServerGameSystem";
import { UserListener } from "./UserListener";

export class GameUserListener extends UserListener {
  constructor(user: User, protected readonly game: ServerGameSystem) {
    super(user);
  }

  public receive_message(msg: ClientMessage): void {
    if (msg.type === "ClientGameMessage") {
      this.game.receive_message(msg, this.id);
    }
  }

  public on_close(): void {
    this.game.remove_user(this.id);
  }
}
