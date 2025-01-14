import { Platform, PlatformData } from "./Platform";
import { PlatformSprite } from "./PlatformSprite";
import { ClientGameSystem } from "../../../system/client/ClientGameSystem";

export class ClientPlatform extends Platform {
  protected readonly sprite: PlatformSprite;

  constructor(protected readonly game_system: ClientGameSystem, data: PlatformData) {
    super(game_system, data);

    this.sprite = new PlatformSprite(data, this.game_system.display);
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
