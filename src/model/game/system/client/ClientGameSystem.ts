import { Container, DisplayObject, Renderer } from "pixi.js";
import { ClientObjectFactory } from "../../factory/ClientObjectFactory";
import { GameData, GameSystem } from "../GameSystem";
import { Camera } from "../../display/Camera";
import { ClientPlayer } from "../../objects/player/ClientPlayer";
import { ClientPlayerData } from "../../objects/player/ClientPlayer";
import { ServerTalker } from "../../../../client/network/ServerTalker";
import { ClientShapelet } from "../../objects/shapelet/client/ClientShapelet";
import { ClientGameRouter } from "./ClientGameRouter";

export interface ClientGameData extends GameData {
  main_player_data: ClientPlayerData;
}

export class ClientGameSystem extends GameSystem {
  declare readonly shapelets: ClientShapelet[];

  public readonly object_factory: ClientObjectFactory;
  public readonly pixijs_main_stage: Container<DisplayObject>;
  public readonly renderer: Renderer;
  public readonly router: ClientGameRouter;
  public readonly camera: Camera;

  protected readonly main_player: ClientPlayer;

  constructor(data: ClientGameData, canvas: HTMLCanvasElement, public readonly server_talker: ServerTalker) {
    super(data);

    this.renderer = new Renderer({
      width: Camera.standard_viewport_size.w,
      height: Camera.standard_viewport_size.h,
      background: "#e1e8f0",
      view: canvas,
      antialias: true, // disable for a 1% performance increase
    });
    this.pixijs_main_stage = new Container();
    this.pixijs_main_stage.interactiveChildren = false;

    this.router = new ClientGameRouter(this);
    this.object_factory = new ClientObjectFactory(this);

    this.populate_objects(data);

    this.main_player = this.object_factory.player(data.main_player_data);
    this.camera = new Camera(this.pixijs_main_stage, this.main_player.get_shapelet());
  }

  public update(elapsed_seconds: number): void {
    this.main_player.update(elapsed_seconds);

    super.update(elapsed_seconds);

    // debug_shapes(world, pixijs_app);
    this.camera.update(elapsed_seconds);
    this.renderer.render(this.pixijs_main_stage);
  }

  public dispose() {
    this.main_player.destroy();
    super.dispose();
  }
}
