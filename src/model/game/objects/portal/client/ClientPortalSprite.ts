import { Container, Sprite } from "pixi.js";
import { ClientPortal } from "./ClientPortal";
import { Camera } from "../../../display/Camera";
import { GameDisplay } from "../../../display/GameDisplay";
import { ImageAssetHandler } from "../../../display/assets/Assets";

export class ClientPortalSprite {
  protected readonly sprite_container: Container;
  constructor(protected readonly portal: ClientPortal, protected readonly game_display: GameDisplay) {
    const px_pos = Camera.units_to_px(this.portal.pos);
    this.sprite_container = new Container();
    this.sprite_container.position.set(px_pos.x, px_pos.y);

    this.make_sprite();
    this.game_display.layers.background.addChild(this.sprite_container);
  }

  private make_sprite() {
    const portal_sprite = Sprite.from(ImageAssetHandler.get("portal"));
    portal_sprite.scale.set(Camera.sprite_scale);
    portal_sprite.position.set(-portal_sprite.width / 2, -portal_sprite.height);
    this.sprite_container.addChild(portal_sprite);
  }

  public destroy() {
    this.game_display.layers.platforms.removeChild(this.sprite_container);
  }
}
