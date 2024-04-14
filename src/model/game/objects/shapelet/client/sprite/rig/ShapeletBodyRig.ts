import { Container, Sprite } from "pixi.js";
import { ShapeletSpriteData, ShapeletSpriteDataGenerator } from "../ShapeletSpriteData";
import { ImageAssetHandler } from "../../../../../display/assets/Assets";
import { Camera } from "../../../../../display/Camera";
import { ShapeletController } from "../../../ShapeletController";
import { ShapeletBodyAnimator, ShapeletBodyAnimations } from "./ShapeletBodyAnimator";
import { Id, uuid } from "../../../../../../utils/Id";

export class ShapeletBodyRig {
  protected readonly body_sprite: Container;
  public readonly body_container: Container = new Container();
  protected readonly animator: ShapeletBodyAnimator;

  protected readonly observer_id: Id = uuid();

  constructor(
    protected readonly rig_container: Container,
    protected readonly shapelet_controller: ShapeletController,
    protected readonly data: ShapeletSpriteData
  ) {
    this.body_sprite = this.make_body_sprite();
    this.body_container.addChild(this.body_sprite);
    this.rig_container.addChild(this.body_container);

    this.animator = new ShapeletBodyAnimator(this);

    this.shapelet_controller.jump_observable.add_observer({
      id: this.observer_id,
      on_jump: () => {
        this.animator.set_animation(ShapeletBodyAnimations.jump);
      },
      on_land: () => {
        this.animator.set_animation(ShapeletBodyAnimations.land);
      },
    });
  }

  public update(elapsed_seconds: number) {
    this.animator.update(elapsed_seconds);
  }

  public destroy() {
    this.shapelet_controller.jump_observable.remove_observer(this.observer_id);
  }

  protected make_body_sprite(): Sprite {
    const body_asset = ShapeletSpriteDataGenerator.get_body_asset(this.data.body_shape, this.data.body_color);
    const body_sprite = Sprite.from(ImageAssetHandler.get(body_asset));
    body_sprite.scale.set(Camera.sprite_scale);
    body_sprite.position.set(-body_sprite.width / 2, -body_sprite.height / 2);
    return body_sprite;
  }
}
