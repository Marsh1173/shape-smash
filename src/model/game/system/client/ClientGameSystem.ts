import { ClientObjectFactory } from "../../factory/ClientObjectFactory";
import { GameData, GameSystem } from "../GameSystem";
import { ClientPlayer } from "../../objects/player/ClientPlayer";
import { ClientPlayerData } from "../../objects/player/ClientPlayer";
import { ServerTalker } from "../../../../client/network/ServerTalker";
import { ClientShapelet } from "../../objects/shapelet/client/ClientShapelet";
import { ClientGameRouter } from "./ClientGameRouter";
import { GameDisplay } from "../../display/GameDisplay";

export interface ClientGameData extends GameData {
  main_player_data: ClientPlayerData;
}

export class ClientGameSystem extends GameSystem {
  declare readonly shapelets: ClientShapelet[];

  public readonly object_factory: ClientObjectFactory;
  public readonly router: ClientGameRouter;

  public readonly display: GameDisplay;
  public readonly main_player: ClientPlayer;

  constructor(data: ClientGameData, canvas: HTMLCanvasElement, public readonly server_talker: ServerTalker) {
    super(data);

    this.display = new GameDisplay(this, canvas);

    this.router = new ClientGameRouter(this);
    this.object_factory = new ClientObjectFactory(this);

    this.populate_objects(data);

    this.main_player = this.object_factory.player(data.main_player_data);
  }

  public update(elapsed_seconds: number): void {
    this.main_player.update(elapsed_seconds);

    super.update(elapsed_seconds);

    this.display.update(elapsed_seconds);
  }

  public dispose() {
    this.main_player.destroy();
    super.dispose();
  }
}
