import { ServerShapelet } from "../../../objects/shapelet/server/ServerShapelet";
import { ServerGameSystem } from "../ServerGameSystem";
import { StateMachineObservable, StateMachineState } from "../../../../utils/observer/StateMachineObservable";
import { ShapeletData } from "../../../objects/shapelet/ShapeletSchema";
import { GameUser } from "./GameUser";
import { UserStateDieMessage, UserStateAliveMessage } from "./ServerGameUserSchema";
import { Id } from "../../../../utils/Id";

export class GameUserState extends StateMachineObservable<GameUserStateType> {
  constructor(
    initial_state: GameUserStateType,
    protected readonly game_system: ServerGameSystem,
    protected readonly user_id: Id
  ) {
    super(initial_state);
  }

  public set_value(new_state: GameUserStateType): void {
    super.set_value(new_state);

    this.game_system.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerGameUserMessage",
        user_id: this.user_id,
        msg: {
          type: "UserStateUpdateMessage",
          msg: new_state.map_to_update_state_msg(),
        },
      },
    });
  }
}

export type GameUserStateType = GameUserAliveState | GameUserDeadState;

export class GameUserAliveState implements StateMachineState {
  public readonly type = "GameUserAliveState";

  public readonly shapelet: ServerShapelet;

  constructor(
    protected readonly game_system: ServerGameSystem,
    shapelet_data: ShapeletData,
    protected readonly game_user: GameUser
  ) {
    this.shapelet = this.game_system.object_factory.shapelet(shapelet_data);
    this.shapelet.health_component.death_observable.add_observer({
      id: this.shapelet.id,
      on_die: () => {
        this.game_user.state.set_value(new GameUserDeadState());
      },
    });
  }

  public init(): void {}
  public deconstruct(): void {
    this.shapelet.health_component.death_observable.remove_observer(this.shapelet.id);
  }

  public map_to_update_state_msg(): UserStateAliveMessage {
    return {
      type: "UserStateAliveMessage",
      shapelet_id: this.shapelet.id,
    };
  }
}

export class GameUserDeadState implements StateMachineState {
  public readonly type = "GameUserDeadState";
  public init(): void {}
  public deconstruct(): void {}

  public map_to_update_state_msg(): UserStateDieMessage {
    return {
      type: "UserStateDieMessage",
    };
  }
}
