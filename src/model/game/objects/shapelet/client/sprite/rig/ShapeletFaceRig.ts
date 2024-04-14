import { Container, Sprite } from "pixi.js";
import { ShapeletBody } from "../../../ShapeletBody";
import { ShapeletSpriteData } from "../ShapeletSpriteData";
import { ImageAssetHandler } from "../../../../../display/assets/Assets";
import { Camera } from "../../../../../display/Camera";
import { Id, uuid } from "../../../../../../utils/Id";
import { ShapeletFaceAnimator, ShapeletFaceAnimations } from "./ShapeletFaceAnimator";

export class ShapeletFaceRig {
  public readonly face_container: Container;
  protected readonly face_sprite: Sprite;
  protected readonly animator: ShapeletFaceAnimator;

  protected readonly observer_id: Id = uuid();

  constructor(
    protected readonly rig_container: Container,
    protected readonly body: ShapeletBody,
    protected readonly data: ShapeletSpriteData
  ) {
    this.face_sprite = this.make_face_sprite();

    this.face_container = new Container();
    this.face_container.addChild(this.face_sprite);

    this.rig_container.addChild(this.face_container);
    this.animator = new ShapeletFaceAnimator(this);

    this.update_facing(
      this.body.facing.add_observer_and_get_value({
        id: this.observer_id,
        on_change: this.update_facing.bind(this),
      })
    );
  }

  public update(elapsed_seconds: number) {
    this.animator.update(elapsed_seconds);
  }

  public destroy() {
    this.body.facing.remove_observer(this.observer_id);
  }

  protected update_facing(new_value: "left" | "right") {
    if (new_value === "left") {
      this.animator.set_animation(ShapeletFaceAnimations.left_slide);
      this.animator.set_default(ShapeletFaceAnimations.left_stay);
    } else {
      this.animator.set_animation(ShapeletFaceAnimations.right_slide);
      this.animator.set_default(ShapeletFaceAnimations.right_stay);
    }
  }

  protected make_face_sprite(): Sprite {
    const face_sprite = Sprite.from(ImageAssetHandler.get(this.data.face_type));
    face_sprite.scale.set(Camera.sprite_scale);
    face_sprite.position.set(-face_sprite.width / 2, -face_sprite.height / 2.5);

    return face_sprite;
  }
}
