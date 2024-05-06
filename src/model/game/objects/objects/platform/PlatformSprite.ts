import { Container, Sprite } from "pixi.js";
import { Camera } from "../../../display/Camera";
import { ImageAssetHandler } from "../../../display/assets/Assets";
import { PlatformBodyData } from "./PlatformBody";
import { GameDisplay } from "../../../display/GameDisplay";

export class PlatformSprite {
  protected readonly sprite_container: Container;
  constructor(
    protected readonly data: PlatformBodyData,
    protected readonly game_display: GameDisplay
  ) {
    const px_pos = Camera.units_to_px(this.data.pos);
    this.sprite_container = new Container();
    this.sprite_container.position.set(px_pos.x, px_pos.y);

    this.make_sprites();
    this.game_display.layers.platforms.addChild(this.sprite_container);
  }

  private make_sprites() {
    if (this.data.len > 1) {
      if (this.data.len > 2) {
        const center_sprite = Sprite.from(ImageAssetHandler.get("tile_center"));
        center_sprite.scale.set(
          (this.data.len - 2) * Camera.sprite_scale,
          Camera.sprite_scale
        );
        center_sprite.position.set(
          -((this.data.len - 2) * Camera.px_per_unit) / 2,
          0
        );

        this.sprite_container.addChild(center_sprite);
      }

      const left_side_sprite = Sprite.from(ImageAssetHandler.get("tile_left"));
      left_side_sprite.scale.set(Camera.sprite_scale);
      left_side_sprite.position.set(
        -(this.data.len * Camera.px_per_unit) / 2,
        0
      );

      const right_side_sprite = Sprite.from(
        ImageAssetHandler.get("tile_right")
      );
      right_side_sprite.scale.set(Camera.sprite_scale);
      right_side_sprite.position.set(
        ((this.data.len - 2) * Camera.px_per_unit) / 2,
        0
      );

      this.sprite_container.addChild(left_side_sprite, right_side_sprite);
    } else {
      const platform_sprite = Sprite.from(ImageAssetHandler.get("tile"));
      platform_sprite.scale.set(Camera.sprite_scale);
      platform_sprite.position.set(-platform_sprite.width / 2, 0);
      this.sprite_container.addChild(platform_sprite);
    }
  }

  public destroy() {
    this.game_display.layers.platforms.removeChild(this.sprite_container);
  }
}
