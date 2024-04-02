import { ServerRoom } from "../../../../server/network/ServerRoom";
import { Id } from "../../../utils/Id";
import { ClientGameData } from "../client/ClientGameSystem";
import { ServerGameSystem } from "./ServerGameSystem";
import { GameUser } from "./user/GameUser";
import { GameServerRouter } from "./GameServerRouter";

export class GameServerRoom extends ServerRoom<GameUser, ClientGameData, Id, Id> {
  public readonly router: GameServerRouter;
  constructor(game_system: ServerGameSystem) {
    super();

    this.router = new GameServerRouter(game_system);
  }

  protected send_room_data_on_join(user: GameUser, data: ClientGameData) {
    user.send_message({
      type: "GameDataMessage",
      data,
    });
  }

  protected broadcast_user_join(data: Id) {
    this.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerGameUserMessage",
        user_id: data,
        msg: {
          type: "UserJoinMessage",
        },
      },
    });
  }

  protected broadcast_user_leave(data: Id): void {
    this.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerGameUserMessage",
        user_id: data,
        msg: {
          type: "UserLeaveMessage",
        },
      },
    });
  }
}
