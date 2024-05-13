import { AnimationRunData, Animator } from "../../../../../../display/animation/Animation";
import { ShapeletFaceRig } from "./ShapeletFaceRig";
import { LinearInterpolationAnim } from "../../../../../../../utils/functionofprogress/LinearInterpolation";

enum ShapeletFaceAnimatableField {
  x_translation,
}

const updated_fields: ShapeletFaceAnimatableField[] = [ShapeletFaceAnimatableField.x_translation];
type ShapeletFaceAnimationRunData = AnimationRunData<ShapeletFaceAnimatableField, number>;

export class ShapeletFaceAnimator extends Animator<ShapeletFaceAnimatableField, number> {
  public set_field: Record<ShapeletFaceAnimatableField, (value: number) => void> = {
    [ShapeletFaceAnimatableField.x_translation]: (value: number) => {
      this.rig.face_container.position.x = value;
    },
  };

  constructor(protected readonly rig: ShapeletFaceRig) {
    super(ShapeletFaceAnimations.left_slide, updated_fields);
  }
}

export class ShapeletFaceAnimations {
  protected static slide = {
    duration: 0.1,
    start_pos: -2,
    end_pos: 4,
  };
  private constructor() {}

  public static readonly left_slide: ShapeletFaceAnimationRunData = {
    duration: this.slide.duration,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, -this.slide.start_pos],
        [1, -this.slide.end_pos],
      ]),
    },
  };
  public static readonly right_slide: ShapeletFaceAnimationRunData = {
    duration: this.slide.duration,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, this.slide.start_pos],
        [1, this.slide.end_pos],
      ]),
    },
  };
  public static readonly left_stay: ShapeletFaceAnimationRunData = {
    duration: Infinity,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, -this.slide.end_pos],
      ]),
    },
  };
  public static readonly right_stay: ShapeletFaceAnimationRunData = {
    duration: Infinity,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, this.slide.end_pos],
      ]),
    },
  };
}
