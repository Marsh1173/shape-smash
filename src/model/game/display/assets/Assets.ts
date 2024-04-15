import { Texture } from "pixi.js";
import { TileAssetUrls, TileAsset } from "./TileAssets";
import { ShapeletAssetUrls, ShapeletBodyType, ShapeletFaceType } from "./ShapeletAssets";

export type ImageAsset = ShapeletFaceType | ShapeletBodyType | TileAsset | "heart" | "empty_health" | "portal";

const ImageAssetUrl: Record<ImageAsset, string> = {
  ...TileAssetUrls,
  ...ShapeletAssetUrls,
  heart: "./assets/images/heart.png",
  empty_health: "./assets/images/empty_health.png",
  portal: "./assets/images/portal.png",
};

export class ImageAssetHandler {
  protected static ImageTextures: Record<ImageAsset, Texture> | undefined = undefined;

  public static async load_all_images() {
    this.ImageTextures = (
      await Promise.all(
        Object.entries(ImageAssetUrl).map(async ([key_str, url]) => {
          const key = key_str as ImageAsset;

          const image = await this.load_image(url);

          //make pixijs texture
          const texture = Texture.from(image);

          return { [key]: texture };
        })
      )
    ).reduce((acc, r) => {
      return { ...acc, ...r };
    }) as any;
  }

  public static get(asset: ImageAsset) {
    if (!this.ImageTextures) {
      throw new Error("Tried to get image texture before loading");
    } else {
      return this.ImageTextures[asset];
    }
  }

  private static async load_image(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", (err) => reject(err));
      img.src = url;
    });
  }
}
