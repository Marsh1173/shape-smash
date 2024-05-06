import {
  ShapeletBodyType,
  ShapeletFaceType,
  ShapeletRemainType,
} from "../../../../../display/assets/ShapeletAssets";

export type ShapeletBodyShape = "squircle" | "square" | "rhombus" | "circle";
export type ShapeletBodyColor =
  | "blue"
  | "green"
  | "pink"
  | "purple"
  | "red"
  | "yellow";

export interface ShapeletSpriteData {
  body_shape: ShapeletBodyShape;
  body_color: ShapeletBodyColor;
  face_type: ShapeletFaceType;
}

export class ShapeletSpriteDataGenerator {
  private constructor() {}

  public static generate(): ShapeletSpriteData {
    return {
      body_shape: get_random(body_shapes),
      body_color: get_random(body_colors),
      face_type: get_random(faces),
    };
  }

  public static get_remain_asset(color: ShapeletBodyColor): ShapeletRemainType {
    return this.remain_asset_map[color];
  }

  private static remain_asset_map: Record<
    ShapeletBodyColor,
    ShapeletRemainType
  > = {
    blue: "blue_remain",
    green: "green_remain",
    pink: "pink_remain",
    purple: "purple_remain",
    red: "red_remain",
    yellow: "yellow_remain",
  };

  public static get_body_asset(
    shape: ShapeletBodyShape,
    color: ShapeletBodyColor
  ): ShapeletBodyType {
    return this.body_asset_map[shape][color];
  }

  private static body_asset_map: Record<
    ShapeletBodyShape,
    Record<ShapeletBodyColor, ShapeletBodyType>
  > = {
    squircle: {
      blue: "blue_body_squircle",
      green: "green_body_squircle",
      pink: "pink_body_squircle",
      purple: "purple_body_squircle",
      red: "red_body_squircle",
      yellow: "yellow_body_squircle",
    },
    square: {
      blue: "blue_body_square",
      green: "green_body_square",
      pink: "pink_body_square",
      purple: "purple_body_square",
      red: "red_body_square",
      yellow: "yellow_body_square",
    },
    rhombus: {
      blue: "blue_body_rhombus",
      green: "green_body_rhombus",
      pink: "pink_body_rhombus",
      purple: "purple_body_rhombus",
      red: "red_body_rhombus",
      yellow: "yellow_body_rhombus",
    },
    circle: {
      blue: "blue_body_circle",
      green: "green_body_circle",
      pink: "pink_body_circle",
      purple: "purple_body_circle",
      red: "red_body_circle",
      yellow: "yellow_body_circle",
    },
  };
}

const faces: ShapeletFaceType[] = [
  "face_a",
  "face_b",
  "face_c",
  "face_d",
  "face_e",
  "face_f",
  "face_g",
  "face_h",
  "face_i",
  "face_k",
  "face_l",
  // "face_j",
];

const body_shapes: ShapeletBodyShape[] = [
  "squircle",
  "square",
  "rhombus",
  "circle",
];
const body_colors: ShapeletBodyColor[] = [
  "blue",
  "green",
  "pink",
  "purple",
  "red",
  "yellow",
];

function get_random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
