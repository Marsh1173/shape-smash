import { Container, Sprite } from "pixi.js";
import { ImageAsset, ImageAssetHandler } from "../../../display/Assets";
import { Camera } from "../../../display/Camera";
import { ShapeletBody } from "../ShapeletBody";
import { ShapeletSpriteData } from "./ShapeletAssets";

export class ShapeletSprite {
  protected readonly container: Container;
  protected readonly eyes_container: Container;

  protected readonly sprite_scale: number = Camera.px_per_unit / 120;

  constructor(
    protected readonly pixijs_main_stage: Container,
    protected readonly body: ShapeletBody,
    protected readonly data: ShapeletSpriteData
  ) {
    this.container = new Container();
    this.eyes_container = new Container();

    this.container.addChild(this.make_body_sprite());

    this.eyes_container.addChild(this.make_eyes_sprite());
    this.container.addChild(this.eyes_container);

    this.pixijs_main_stage.addChild(this.container);
  }

  public destroy() {
    this.pixijs_main_stage.removeChild(this.container);
  }

  public update() {
    const position = Camera.units_to_px(this.body.pos);
    this.container.position.set(position.x, position.y);

    if (this.body.facing === "left") {
      this.eyes_container.position.set(-4, 0);
    } else {
      this.eyes_container.position.set(4, 0);
    }
  }

  protected make_body_sprite(): Sprite {
    const body_sprite = Sprite.from(ImageAssetHandler.get(this.data.body_type));
    body_sprite.scale.set(this.sprite_scale);
    body_sprite.position.set(-body_sprite.width / 2, -body_sprite.height / 2);
    return body_sprite;
  }

  protected make_eyes_sprite(): Sprite {
    const eyes_sprite = Sprite.from(ImageAssetHandler.get(this.data.face_type));
    eyes_sprite.scale.set(this.sprite_scale);
    eyes_sprite.position.set(-eyes_sprite.width / 2, -eyes_sprite.height / 2.5);

    return eyes_sprite;
  }
}
