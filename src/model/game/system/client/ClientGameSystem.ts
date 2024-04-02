import { ClientObjectFactory } from "../../factory/ClientObjectFactory";
import { GameSystem } from "../GameSystem";
import { ServerTalker } from "../../../../client/network/ServerTalker";
import { ClientGameRouter } from "./ClientGameRouter";
import { GameDisplay } from "../../display/GameDisplay";
import { ClientGamePlayerAliveState, ClientGamePlayerState } from "./ClientGamePlayerState";
import { ClientObjectContainer } from "../../objectcontainer/ClientObjectContainer";
import { LifecycleTextures } from "../../display/pixijsutils/LifecycleTextures";
import { ClientGameData } from "../server/ServerGameMessageSchema";

export class ClientGameSystem extends GameSystem {
  public readonly object_factory: ClientObjectFactory;
  public readonly object_container: ClientObjectContainer;
  public readonly router: ClientGameRouter;

  public readonly display: GameDisplay;
  public readonly player_state: ClientGamePlayerState;

  constructor(data: ClientGameData, canvas: HTMLCanvasElement, public readonly server_talker: ServerTalker) {
    super(data);

    this.display = new GameDisplay(this, canvas);

    this.router = new ClientGameRouter(this);
    this.object_factory = new ClientObjectFactory(this);
    this.object_container = new ClientObjectContainer(this);

    this.populate_objects(data);

    this.player_state = new ClientGamePlayerState(data.player_state, this);
  }

  public update(elapsed_seconds: number): void {
    super.update(elapsed_seconds);
    this.display.update(elapsed_seconds);
  }

  public dispose() {
    this.player_state.deconstruct();
    LifecycleTextures.destroy_all();
    super.dispose();
  }
}
export { ClientGameData };
