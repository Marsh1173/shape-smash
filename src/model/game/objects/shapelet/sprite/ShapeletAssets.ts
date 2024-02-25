export type ShapeletFaceType =
  | "face_a"
  | "face_b"
  | "face_c"
  | "face_d"
  | "face_e"
  | "face_f"
  | "face_g"
  | "face_h"
  | "face_i"
  | "face_j"
  | "face_k"
  | "face_l";

export type ShapeletBodyType =
  | "blue_body_squircle"
  | "green_body_squircle"
  | "pink_body_squircle"
  | "purple_body_squircle"
  | "red_body_squircle"
  | "yellow_body_squircle";

export interface ShapeletSpriteData {
  body_type: ShapeletBodyType;
  face_type: ShapeletFaceType;
}

export class ShapeletSpriteDataGenerator {
  private constructor() {}

  public static generate(): ShapeletSpriteData {
    return {
      body_type: get_random(bodies),
      face_type: get_random(faces),
    };
  }
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
  "face_j",
  "face_k",
  "face_l",
];

const bodies: ShapeletBodyType[] = [
  "blue_body_squircle",
  "green_body_squircle",
  "pink_body_squircle",
  "purple_body_squircle",
  "red_body_squircle",
  "yellow_body_squircle",
];

function get_random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
