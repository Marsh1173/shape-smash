import { Texture } from "pixi.js";

/**
 * This class is meant to manage textures that are created and destroyed with the client game system instance.
 */
export abstract class LifecycleTextures {
  private constructor() {}

  private static textures: Texture[] = [];

  public static add_texture(texture: Texture) {
    LifecycleTextures.textures.push(texture);
  }

  public static destroy_all() {
    for (const texture of LifecycleTextures.textures) {
      texture.destroy(true);
    }
    LifecycleTextures.textures = [];
  }
}
