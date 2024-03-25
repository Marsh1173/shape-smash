import { Texture } from "pixi.js";
import { ShapeletBodyType, ShapeletFaceType } from "../objects/shapelet/sprite/ShapeletAssets";

export type ImageAsset =
  | ShapeletFaceType
  | ShapeletBodyType
  | "tile_center"
  | "tile_left"
  | "tile_right"
  | "tile"
  | "heart"
  | "empty_health";

const ImageAssetUrl: Record<ImageAsset, string> = {
  blue_body_squircle: "./assets/images/bodies/blue_body_squircle.png",
  green_body_squircle: "./assets/images/bodies/green_body_squircle.png",
  pink_body_squircle: "./assets/images/bodies/pink_body_squircle.png",
  purple_body_squircle: "./assets/images/bodies/purple_body_squircle.png",
  red_body_squircle: "./assets/images/bodies/red_body_squircle.png",
  yellow_body_squircle: "./assets/images/bodies/yellow_body_squircle.png",
  blue_body_circle: "./assets/images/bodies/blue_body_circle.png",
  green_body_circle: "./assets/images/bodies/green_body_circle.png",
  pink_body_circle: "./assets/images/bodies/pink_body_circle.png",
  purple_body_circle: "./assets/images/bodies/purple_body_circle.png",
  red_body_circle: "./assets/images/bodies/red_body_circle.png",
  yellow_body_circle: "./assets/images/bodies/yellow_body_circle.png",
  blue_body_rhombus: "./assets/images/bodies/blue_body_rhombus.png",
  green_body_rhombus: "./assets/images/bodies/green_body_rhombus.png",
  pink_body_rhombus: "./assets/images/bodies/pink_body_rhombus.png",
  purple_body_rhombus: "./assets/images/bodies/purple_body_rhombus.png",
  red_body_rhombus: "./assets/images/bodies/red_body_rhombus.png",
  yellow_body_rhombus: "./assets/images/bodies/yellow_body_rhombus.png",
  blue_body_square: "./assets/images/bodies/blue_body_square.png",
  green_body_square: "./assets/images/bodies/green_body_square.png",
  pink_body_square: "./assets/images/bodies/pink_body_square.png",
  purple_body_square: "./assets/images/bodies/purple_body_square.png",
  red_body_square: "./assets/images/bodies/red_body_square.png",
  yellow_body_square: "./assets/images/bodies/yellow_body_square.png",
  face_a: "./assets/images/faces/face_a.png",
  face_b: "./assets/images/faces/face_b.png",
  face_c: "./assets/images/faces/face_c.png",
  face_d: "./assets/images/faces/face_d.png",
  face_e: "./assets/images/faces/face_e.png",
  face_f: "./assets/images/faces/face_f.png",
  face_g: "./assets/images/faces/face_g.png",
  face_h: "./assets/images/faces/face_h.png",
  face_i: "./assets/images/faces/face_i.png",
  face_j: "./assets/images/faces/face_j.png",
  face_k: "./assets/images/faces/face_k.png",
  face_l: "./assets/images/faces/face_l.png",
  tile_center: "./assets/images/tile_center.png",
  tile_left: "./assets/images/tile_left.png",
  tile_right: "./assets/images/tile_right.png",
  tile: "./assets/images/tile.png",
  heart: "./assets/images/heart.png",
  empty_health: "./assets/images/empty_health.png",
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
