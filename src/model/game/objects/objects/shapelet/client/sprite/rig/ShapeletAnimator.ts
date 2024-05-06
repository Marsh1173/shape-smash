import { AnimationRunData, Animator } from "../../../../../display/animation/Animation";
import { ShapeletRig } from "./ShapeletRig";

enum ShapeletAnimatableField {
  white_filter,
}

const updated_fields: ShapeletAnimatableField[] = [ShapeletAnimatableField.white_filter];

export class ShapeletAnimator extends Animator<ShapeletAnimatableField> {
  public set_field: Record<ShapeletAnimatableField, (value: number) => void> = {
    [ShapeletAnimatableField.white_filter]: (value: number) => {
      console.log();
      const enabled = value === 1;
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
  protected static filter_values = {
    on: 1,
    off: 0,
  };

  public static readonly idle: AnimationRunData<ShapeletAnimatableField> = {
    duration: Infinity,
    anim: {
      [ShapeletAnimatableField.white_filter]: [[0, this.filter_values.off]],
    },
  };

  public static readonly damage: AnimationRunData<ShapeletAnimatableField> = {
    duration: 0.06,
    anim: {
      [ShapeletAnimatableField.white_filter]: [[0, this.filter_values.on]],
    },
  };
}
