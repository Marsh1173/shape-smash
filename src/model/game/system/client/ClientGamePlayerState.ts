import { StateMachineObservable, StateMachineState } from "../../../utils/observer/StateMachineObservable";
import { ClientPlayer } from "./ClientPlayer";
import { ClientShapelet } from "../../objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "./ClientGameSystem";
import { UserStateAliveMessage, UserStateUpdateMessage } from "../server/user/ServerGameUserSchema";

export class ClientGamePlayerState extends StateMachineObservable<ClientGamePlayerStateType> {
  constructor(data: UserStateUpdateMessage, protected readonly game_system: ClientGameSystem) {
    super(ClientGamePlayerState.get_state(data, game_system));
  }

  public set_state_with_data(msg: UserStateUpdateMessage) {
    this.set_value(ClientGamePlayerState.get_state(msg, this.game_system));
  }

  protected static get_state(msg: UserStateUpdateMessage, game_system: ClientGameSystem): ClientGamePlayerStateType {
    if (msg.msg.type === "UserStateAliveMessage") {
      return new ClientGamePlayerAliveState(game_system, msg.msg);
    } else if (msg.msg.type === "UserStateDieMessage") {
      return new ClientGamePlayerDeadState();
    } else {
      throw new Error("Unknown user state update message");
    }
  }
}
export type ClientGamePlayerStateType = ClientGamePlayerAliveState | ClientGamePlayerDeadState;

export class ClientGamePlayerAliveState implements StateMachineState {
  public readonly type = "ClientGamePlayerAliveState";

  public readonly player: ClientPlayer;
  public readonly shapelet: ClientShapelet;

  constructor(protected readonly game_system: ClientGameSystem, msg: UserStateAliveMessage) {
    const shapelet = this.game_system.object_container.shapelets.get(msg.shapelet_id);
    if (shapelet) {
      this.shapelet = shapelet;
    } else {
      throw new Error("Could not find shapelet after changing to Player Alive State");
    }
    this.player = new ClientPlayer(this.shapelet, msg, this.game_system);
  }

  public init(): void {
    this.game_system.display.camera.set_focus(() => this.shapelet.body.pos);
  }

  public deconstruct(): void {
    this.player.destroy();
    this.game_system.display.camera.clear_focus();
  }
}

export class ClientGamePlayerDeadState implements StateMachineState {
  public readonly type = "ClientGamePlayerDeadState";
  public init(): void {}
  public deconstruct(): void {}
}
