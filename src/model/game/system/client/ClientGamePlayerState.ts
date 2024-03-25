import { StateMachineObservable, StateMachineState } from "../../../utils/observer/StateMachineObservable";
import { ClientPlayer, ClientPlayerData } from "./ClientPlayer";
import { ClientShapelet } from "../../objects/shapelet/client/ClientShapelet";
import { ClientGameSystem } from "./ClientGameSystem";

export class ClientGamePlayerState extends StateMachineObservable<ClientGamePlayerStateType> {}
export type ClientGamePlayerStateType = ClientGamePlayerAliveState | ClientGamePlayerDeadState;

export class ClientGamePlayerAliveState implements StateMachineState {
  public readonly type = "ClientGamePlayerAliveState";

  public readonly player: ClientPlayer;
  public readonly shapelet: ClientShapelet;

  constructor(protected readonly game_system: ClientGameSystem, player_data: ClientPlayerData) {
    this.shapelet = this.game_system.object_factory.shapelet(player_data.shapelet_data);
    this.player = new ClientPlayer(this.shapelet, player_data, this.game_system);
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
