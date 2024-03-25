import { Container, DisplayObject, Renderer } from "pixi.js";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { Camera } from "./Camera";

export interface GameDisplayLayers {
  readonly indicators: Container;
  readonly shapelets: Container;
  readonly platforms: Container;
}

export class GameDisplay {
  protected readonly pixijs_main_stage: Container<DisplayObject>;
  protected readonly renderer: Renderer;
  public readonly camera: Camera;

  public readonly layers: GameDisplayLayers = {
    indicators: new Container(),
    shapelets: new Container(),
    platforms: new Container(),
  };

  constructor(protected readonly game_system: ClientGameSystem, canvas: HTMLCanvasElement) {
    this.renderer = new Renderer({
      width: Camera.standard_viewport_size.w,
      height: Camera.standard_viewport_size.h,
      background: "#e1e8f0",
      view: canvas,
      antialias: true, // disable for a 1% performance increase
    });
    this.pixijs_main_stage = new Container();
    this.pixijs_main_stage.interactiveChildren = false;

    this.pixijs_main_stage.addChild(this.layers.indicators, this.layers.shapelets, this.layers.platforms);

    this.camera = new Camera(this.pixijs_main_stage, this.game_system);
  }

  public update(elapsed_seconds: number) {
    // debug_shapes(world, pixijs_app);
    this.camera.update(elapsed_seconds);
    this.renderer.render(this.pixijs_main_stage);
  }
}
