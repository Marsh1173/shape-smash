import { Platform, PlatformData } from "./Platform";
import { Container } from "pixi.js";
import { World } from "@dimforge/rapier2d-compat";
import { PlatformSprite } from "./PlatformSprite";

export class ClientPlatform extends Platform {
  protected readonly sprite: PlatformSprite;

  constructor(world: World, data: PlatformData, protected readonly pixijs_main_stage: Container) {
    super(world, data);

    this.sprite = new PlatformSprite(data.body_data, pixijs_main_stage);
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
