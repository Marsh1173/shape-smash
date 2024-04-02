import { ServerShapelet } from "../../../objects/shapelet/server/ServerShapelet";
import { ServerGameSystem } from "../ServerGameSystem";
import { StateMachineObservable, StateMachineState } from "../../../../utils/observer/StateMachineObservable";
import { ShapeletData } from "../../../objects/shapelet/ShapeletSchema";

export class GameUserState extends StateMachineObservable<GameUserStateType> {}
export type GameUserStateType = GameUserAliveState | GameUserDeadState;

export class GameUserAliveState implements StateMachineState {
  public readonly type = "GameUserAliveState";

  public readonly shapelet: ServerShapelet;

  constructor(protected readonly game_system: ServerGameSystem, shapelet_data: ShapeletData) {
    this.shapelet = this.game_system.object_factory.shapelet(shapelet_data);
  }

  public init(): void {}

  public deconstruct(): void {
    this.game_system.object_container.remove_object(this.shapelet.id);
  }
}

export class GameUserDeadState implements StateMachineState {
  public readonly type = "GameUserDeadState";
  public init(): void {}
  public deconstruct(): void {}
}
