import { Container, Sprite } from "pixi.js";
import { ShapeletBody } from "../../ShapeletBody";
import { ShapeletSpriteData } from "../ShapeletAssets";
import { ImageAssetHandler } from "../../../../display/Assets";
import { Camera } from "../../../../display/Camera";
import { uuid } from "../../../../../utils/Id";

export class ShapeletFaceRig {
  protected readonly face_container: Container;
  protected readonly face_sprite: Sprite;

  constructor(
    protected readonly rig_container: Container,
    protected readonly body: ShapeletBody,
    protected readonly data: ShapeletSpriteData
  ) {
    this.face_sprite = this.make_face_sprite();

    this.face_container = new Container();
    this.face_container.addChild(this.face_sprite);

    this.rig_container.addChild(this.face_container);

    this.update_facing(
      this.body.facing.add_observer_and_get_value({
        id: uuid(),
        on_change: this.update_facing.bind(this),
      })
    );
  }

  public update(elapsed_seconds: number) {}

  public destroy() {}

  protected update_facing(new_value: "left" | "right") {
    if (new_value === "left") {
      this.face_container.position.set(-4, 0);
    } else {
      this.face_container.position.set(4, 0);
    }
  }

  protected make_face_sprite(): Sprite {
    const face_sprite = Sprite.from(ImageAssetHandler.get(this.data.face_type));
    face_sprite.scale.set(Camera.sprite_scale);
    face_sprite.position.set(-face_sprite.width / 2, -face_sprite.height / 2.5);

    return face_sprite;
  }
}
