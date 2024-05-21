import { ShapeletAction } from "../../../objects/objects/shapelet/ShapeletController";

export const PlayerInputConfig: Record<string, ShapeletAction | undefined> = {
  " ": ShapeletAction.Jump,
  a: ShapeletAction.MoveLeft,
  d: ShapeletAction.MoveRight,
  j: ShapeletAction.MainAction,
  k: ShapeletAction.SecondaryAction,
};
