import { Vector } from "@dimforge/rapier2d-compat";
import { GameDisplay } from "../../../../display/GameDisplay";
import { ClientShapelet } from "../../../shapelet/client/ClientShapelet";
import { Container, DisplayObject, Sprite } from "pixi.js";
import { uuid } from "../../../../../utils/Id";
import { ImageAssetHandler } from "../../../../display/Assets";

export class ClientHealthComponentDisplay {
  protected readonly container = new Container();
  protected nits: DisplayObject[] = [];

  constructor(
    protected readonly game_display: GameDisplay,
    protected readonly shapelet: ClientShapelet,
    protected readonly position: Vector
  ) {
    this.game_display.layers.indicators.addChild(this.container);

    this.shapelet.health_component.current_health.add_observer_and_broadcast_value({
      id: uuid(),
      on_change: (new_value: number) => {
        this.update_nits(new_value);
      },
    });
  }

  public update(elapsed_seconds: number) {
    this.container.position.set(this.position.x, this.position.y - 40);
  }

  public destroy() {}

  public update_nits(count: number) {
    for (const nit of this.nits) {
      this.container.removeChild(nit);
    }
    this.nits = [];

    for (let i: number = 0; i < count; i++) {
      const nit_sprite = Sprite.from(ImageAssetHandler.get("heart"));
      nit_sprite.scale.set(0.1);
      nit_sprite.anchor.set(-i + count / 2, 0.5);

      this.nits.push(nit_sprite);
      this.container.addChild(nit_sprite);
    }
  }
}
