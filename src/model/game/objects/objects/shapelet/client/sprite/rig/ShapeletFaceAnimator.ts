import { AnimationRunData, Animator } from "../../../../../../display/animation/Animation";
import { ShapeletFaceRig } from "./ShapeletFaceRig";
import { LinearInterpolationAnim } from "../../../../../../../utils/functionofprogress/LinearInterpolation";

enum ShapeletFaceAnimatableField {
  x_translation,
}

const updated_fields: ShapeletFaceAnimatableField[] = [ShapeletFaceAnimatableField.x_translation];

export class ShapeletFaceAnimator extends Animator<ShapeletFaceAnimatableField> {
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

  public static readonly left_slide: AnimationRunData<ShapeletFaceAnimatableField> = {
    duration: this.slide.duration,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, -this.slide.start_pos],
        [1, -this.slide.end_pos],
      ]),
    },
  };
  public static readonly right_slide: AnimationRunData<ShapeletFaceAnimatableField> = {
    duration: this.slide.duration,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, this.slide.start_pos],
        [1, this.slide.end_pos],
      ]),
    },
  };
  public static readonly left_stay: AnimationRunData<ShapeletFaceAnimatableField> = {
    duration: Infinity,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, -this.slide.end_pos],
      ]),
    },
  };
  public static readonly right_stay: AnimationRunData<ShapeletFaceAnimatableField> = {
    duration: Infinity,
    anim: {
      [ShapeletFaceAnimatableField.x_translation]: LinearInterpolationAnim([
        [0, this.slide.end_pos],
      ]),
    },
  };
}
