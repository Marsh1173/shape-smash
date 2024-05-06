import { ShapeletAction } from "../../../objects/objects/shapelet/ShapeletController";

export const PlayerInputConfig: Record<string, ShapeletAction | undefined> = {
  w: ShapeletAction.Jump,
  a: ShapeletAction.MoveLeft,
  d: ShapeletAction.MoveRight,
  "mouse-0": ShapeletAction.MainAction,
};
