import { User } from "../../../../../server/network/user/User";
import { ClientMessage } from "../../../../../client/network/schema/ClientMessage";
import { ServerGameSystem } from "../ServerGameSystem";
import { WebsocketWrapper } from "../../../../../server/network/user/WebsocketWrapper";
import { GameUserAliveState, GameUserState } from "./GameUserState";
import { ShapeletData } from "../../../objects/objects/shapelet/ShapeletSchema";

export class GameUser extends User {
  public readonly state: GameUserState;

  constructor(
    ws_wrapper: WebsocketWrapper,
    protected readonly game: ServerGameSystem,
    shapelet_data: ShapeletData
  ) {
    super(ws_wrapper);

    this.state = new GameUserState(
      new GameUserAliveState(this.game, shapelet_data, this),
      this.game,
      this.id
    );
  }

  public receive_message(msg: ClientMessage): void {
    if (
      msg.type === "ClientGameMessage" &&
      this.state.value.type === "GameUserAliveState"
    ) {
      this.game.server_room.router.route_msg(msg, this.state.value.shapelet.id);
    }
  }

  public on_close(): void {
    this.game.server_room.remove_user(this.id, this.id);
    this.state.value.deconstruct();

    if (this.state.value.type === "GameUserAliveState") {
      this.game.object_container.remove_object(this.state.value.shapelet.id);
    }
  }
}
