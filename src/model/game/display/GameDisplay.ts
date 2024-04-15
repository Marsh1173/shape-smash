import { Container, DisplayObject, Renderer } from "pixi.js";
import { ClientGameSystem } from "../system/client/ClientGameSystem";
import { Camera } from "./Camera";
import { ScreenEffects } from "./ScreenEffects";
import { GradientSprite } from "./pixijsutils/GradientSprite";

export interface GameDisplayLayers {
  readonly indicators: Container;
  readonly visual_effects: Container;
  readonly platforms: Container;
  readonly game_space: Container;
  readonly background: Container;
  readonly pixijs_main_stage: Container;
}

export class GameDisplay {
  protected readonly renderer: Renderer;
  public readonly camera: Camera;
  public readonly screen_effects: ScreenEffects;

  protected readonly background_cover: DisplayObject;
  protected readonly translating_layer = new Container();

  public readonly layers: GameDisplayLayers = {
    indicators: new Container(),
    visual_effects: new Container(),
    platforms: new Container(),
    game_space: new Container(),
    background: new Container(),
    pixijs_main_stage: new Container(),
  };

  constructor(protected readonly game_system: ClientGameSystem, canvas: HTMLCanvasElement) {
    this.renderer = new Renderer({
      width: Camera.standard_viewport_size.w,
      height: Camera.standard_viewport_size.h,
      view: canvas,
      antialias: true, // disable for a 1% performance increase
    });
    this.layers.pixijs_main_stage.interactiveChildren = false;

    this.background_cover = this.make_background_cover();

    this.translating_layer.addChild(
      this.layers.background,
      this.layers.game_space,
      this.layers.platforms,
      this.layers.visual_effects,
      this.layers.indicators
    );

    this.layers.pixijs_main_stage.addChild(this.background_cover, this.translating_layer);

    this.camera = new Camera(this.translating_layer, this.game_system);
    this.screen_effects = new ScreenEffects(this);
  }

  public update(elapsed_seconds: number) {
    // debug_shapes(world, pixijs_app);
    this.camera.update(elapsed_seconds);
    this.renderer.render(this.layers.pixijs_main_stage);
  }

  protected make_background_cover(): DisplayObject {
    return GradientSprite(
      { x: Camera.standard_viewport_size.w, y: Camera.standard_viewport_size.h },
      { x: 0, y: 0 },
      { x: Camera.standard_viewport_size.w, y: Camera.standard_viewport_size.h },
      "#7e889d",
      "#162f3d"
    );
  }
}
