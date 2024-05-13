import { FunctionOfProgress } from "./FunctionOfProgress";

/**
 * @param keyframes [progress, value]
 */
export function LinearInterpolationAnim(keyframes: [number, number][]): FunctionOfProgress<number> {
  return (progress: number) => lerp_animation(progress, keyframes);
}

function lerp_animation(progress: number, field_animation: [number, number][]): number {
  if (field_animation.length === 0) {
    throw new Error("Field animation had 0 length");
  } else if (field_animation.length === 1) {
    return field_animation[0][1];
  }

  //could be optimized to binary search field animation array
  let upper_index = field_animation.findIndex(([key_progress, _]) => {
    return key_progress > progress;
  });

  if (upper_index === -1) {
    //progress is higher than highest key progress
    return field_animation[field_animation.length - 1][1];
  } else if (upper_index === 0) {
    //progress is lower than lowest key progress
    return field_animation[0][1];
  } else {
    const lower_index = upper_index - 1;
    return lerp_value(
      field_animation[lower_index][1],
      field_animation[upper_index][1],
      (progress - field_animation[lower_index][0]) /
        (field_animation[upper_index][0] - field_animation[lower_index][0])
    );
  }
}

function lerp_value(start: number, end: number, progress: number): number {
  return end * progress + start * (1 - progress);
}
