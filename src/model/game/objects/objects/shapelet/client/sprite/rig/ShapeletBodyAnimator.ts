import { LinearInterpolationAnim } from "../../../../../../../utils/functionofprogress/LinearInterpolation";
import { AnimationRunData, Animator } from "../../../../../../display/animation/Animation";
import { ShapeletBodyRig } from "./ShapeletBodyRig";

enum ShapeletBodyAnimatableField {
  x_scale,
  y_scale,
  y_position,
}

const updated_fields: ShapeletBodyAnimatableField[] = [
  ShapeletBodyAnimatableField.x_scale,
  ShapeletBodyAnimatableField.y_scale,
  ShapeletBodyAnimatableField.y_position,
];
type ShapeletBodyAnimationRunData = AnimationRunData<ShapeletBodyAnimatableField, number>;

export class ShapeletBodyAnimator extends Animator<ShapeletBodyAnimatableField, number> {
  public set_field: Record<ShapeletBodyAnimatableField, (value: number) => void> = {
    [ShapeletBodyAnimatableField.x_scale]: (value: number) => {
      this.rig.body_container.scale.x = value;
    },
    [ShapeletBodyAnimatableField.y_scale]: (value: number) => {
      this.rig.body_container.scale.y = value;
    },
    [ShapeletBodyAnimatableField.y_position]: (value: number) => {
      this.rig.body_container.position.y = value;
    },
  };

  constructor(protected readonly rig: ShapeletBodyRig) {
    super(ShapeletBodyAnimations.idle, updated_fields);
  }
}

export class ShapeletBodyAnimations {
  protected static jiggle = {
    duration: 0.15,
    scale_factor: 0.15,
    y_pos_change: 3,
  };
  private constructor() {}

  public static readonly jump: ShapeletBodyAnimationRunData = {
    duration: this.jiggle.duration,
    anim: {
      [ShapeletBodyAnimatableField.x_scale]: LinearInterpolationAnim([
        [0, 1],
        [0.5, 1 - this.jiggle.scale_factor],
        [1, 1],
      ]),
      [ShapeletBodyAnimatableField.y_scale]: LinearInterpolationAnim([
        [0, 1],
        [0.5, 1 + this.jiggle.scale_factor],
        [1, 1],
      ]),
      [ShapeletBodyAnimatableField.y_position]: () => 0,
    },
  };
  public static readonly land: ShapeletBodyAnimationRunData = {
    duration: this.jiggle.duration,
    anim: {
      [ShapeletBodyAnimatableField.x_scale]: LinearInterpolationAnim([
        [0, 1],
        [0.5, 1 + this.jiggle.scale_factor],
        [1, 1],
      ]),
      [ShapeletBodyAnimatableField.y_scale]: LinearInterpolationAnim([
        [0, 1],
        [0.5, 1 - this.jiggle.scale_factor],
        [1, 1],
      ]),
      [ShapeletBodyAnimatableField.y_position]: LinearInterpolationAnim([
        [0, 0],
        [0.5, this.jiggle.y_pos_change],
        [1, 0],
      ]),
    },
  };
  public static readonly idle: ShapeletBodyAnimationRunData = {
    duration: Infinity,
    anim: {
      [ShapeletBodyAnimatableField.x_scale]: () => 1,
      [ShapeletBodyAnimatableField.y_scale]: () => 1,
      [ShapeletBodyAnimatableField.y_position]: () => 0,
    },
  };
}
