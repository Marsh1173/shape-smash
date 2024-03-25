import { ServerRoom } from "../../../../server/network/ServerRoom";
import { Id } from "../../../utils/Id";
import { ClientPlayerData } from "../client/ClientPlayer";
import { ClientGameData } from "../client/ClientGameSystem";
import { ServerGameSystem } from "./ServerGameSystem";
import { GameUser } from "./GameUser";
import { GameServerRouter } from "./GameServerRouter";

export class GameServerRoom extends ServerRoom<GameUser, ClientGameData, ClientPlayerData, Id> {
  public readonly router: GameServerRouter;
  constructor(game_system: ServerGameSystem) {
    super();

    this.router = new GameServerRouter(game_system);
  }

  protected send_room_data_on_join(user: GameUser, data: ClientGameData): void {
    user.send_message({
      type: "GameDataMessage",
      data,
    });
  }

  protected broadcast_user_join(data: ClientPlayerData): void {
    this.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "UserJoinMessage",
        player_data: data,
      },
    });
  }

  protected broadcast_user_leave(data: Id): void {
    this.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "UserLeaveMessage",
        id: data,
      },
    });
  }
}
