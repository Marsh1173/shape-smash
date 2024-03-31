import { Container, Sprite } from "pixi.js";
import { ShapeletSpriteData } from "../ShapeletAssets";
import { ImageAssetHandler } from "../../../../../display/Assets";
import { Camera } from "../../../../../display/Camera";

export class ShapeletBodyRig {
  protected readonly body_sprite: Container;

  constructor(protected readonly rig_container: Container, protected readonly data: ShapeletSpriteData) {
    this.body_sprite = this.make_body_sprite();
    this.rig_container.addChild(this.body_sprite);
  }

  public update(elapsed_seconds: number) {}

  public destroy() {}

  protected make_body_sprite(): Sprite {
    const body_sprite = Sprite.from(ImageAssetHandler.get(this.data.body_type));
    body_sprite.scale.set(Camera.sprite_scale);
    body_sprite.position.set(-body_sprite.width / 2, -body_sprite.height / 2);
    return body_sprite;
  }
}
