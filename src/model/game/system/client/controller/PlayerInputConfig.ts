import { ShapeletAction } from "../../../objects/shapelet/ShapeletController";

export const PlayerInputConfig: Record<string, ShapeletAction | undefined> = {
  w: ShapeletAction.Jump,
  a: ShapeletAction.MoveLeft,
  d: ShapeletAction.MoveRight,
};
