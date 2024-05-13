import { AnimationRunData, Animator } from "../../../../../../display/animation/Animation";
import { ShapeletRig } from "./ShapeletRig";

enum ShapeletAnimatableField {
  white_filter,
}

const updated_fields: ShapeletAnimatableField[] = [ShapeletAnimatableField.white_filter];
type ShapeletAnimationRunData = AnimationRunData<ShapeletAnimatableField, boolean>;

export class ShapeletAnimator extends Animator<ShapeletAnimatableField, boolean> {
  public set_field: Record<ShapeletAnimatableField, (value: boolean) => void> = {
    [ShapeletAnimatableField.white_filter]: (enabled: boolean) => {
      if (enabled !== this.rig.effect_filters.flash.enabled) {
        this.rig.effect_filters.flash.enabled = enabled;
      }
    },
  };

  constructor(protected readonly rig: ShapeletRig) {
    super(ShapeletAnimations.idle, updated_fields);
  }
}

export class ShapeletAnimations {
  public static readonly idle: ShapeletAnimationRunData = {
    duration: Infinity,
    anim: {
      [ShapeletAnimatableField.white_filter]: () => false,
    },
  };

  public static readonly damage: ShapeletAnimationRunData = {
    duration: 0.06,
    anim: {
      [ShapeletAnimatableField.white_filter]: () => true,
    },
  };
}
