import {
  StateMachineObservable,
  StateMachineState,
} from "../../../../utils/observer/StateMachineObservable";
import { PlayerController } from "../controller/PlayerController";
import { ClientShapelet } from "../../../objects/objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "../ClientGameSystem";
import {
  UserStateAliveMessage,
  UserStateUpdateMessage,
} from "../../server/user/ServerGameUserSchema";
import { Id } from "../../../../utils/Id";
import { PlayerInputConfig } from "../controller/PlayerInputConfig";

export class ClientGamePlayerState extends StateMachineObservable<ClientGamePlayerStateType> {
  constructor(
    data: UserStateUpdateMessage,
    protected readonly game_system: ClientGameSystem,
    public readonly user_id: Id
  ) {
    super(ClientGamePlayerState.get_state(data, game_system));
  }

  public set_state_with_data(msg: UserStateUpdateMessage) {
    this.set_value(ClientGamePlayerState.get_state(msg, this.game_system));
  }

  protected static get_state(
    msg: UserStateUpdateMessage,
    game_system: ClientGameSystem
  ): ClientGamePlayerStateType {
    if (msg.msg.type === "UserStateAliveMessage") {
      return new ClientGamePlayerAliveState(game_system, msg.msg);
    } else if (msg.msg.type === "UserStateDieMessage") {
      return new ClientGamePlayerDeadState(game_system);
    } else {
      throw new Error("Unknown user state update message");
    }
  }

  public route_input(key: string, active: boolean) {
    if (this.value.type === "ClientGamePlayerAliveState") {
      const action = PlayerInputConfig[key];
      if (action !== undefined) {
        this.value.controller.route_input(action, active);
      }
    }
  }
}
export type ClientGamePlayerStateType =
  | ClientGamePlayerAliveState
  | ClientGamePlayerDeadState;

export class ClientGamePlayerAliveState implements StateMachineState {
  public readonly type = "ClientGamePlayerAliveState";

  public readonly controller: PlayerController;
  public readonly shapelet: ClientShapelet;

  constructor(
    protected readonly game_system: ClientGameSystem,
    msg: UserStateAliveMessage
  ) {
    const shapelet = this.game_system.object_container.shapelets.get(
      msg.shapelet_id
    );
    if (shapelet) {
      this.shapelet = shapelet;
    } else {
      throw new Error(
        "Could not find shapelet after changing to Player Alive State"
      );
    }
    this.controller = new PlayerController(this.shapelet, this.game_system);
  }

  public init(): void {
    this.game_system.display.camera.set_focus(() => this.shapelet.body.pos);
  }

  public deconstruct(): void {
    this.game_system.display.camera.clear_focus();
  }
}

export class ClientGamePlayerDeadState implements StateMachineState {
  public readonly type = "ClientGamePlayerDeadState";
  constructor(protected readonly game_system: ClientGameSystem) {}

  public init(): void {
    this.game_system.display.screen_effects.start_effect("death");
  }
  public deconstruct(): void {
    this.game_system.display.screen_effects.end_effect("death");
  }
}
