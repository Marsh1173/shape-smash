/**
 * [progress, value]
 */
export type Animation<FieldName extends number> = Readonly<Record<FieldName, [number, number][]>>;

export interface AnimationRunData<FieldName extends number> {
  readonly anim: Animation<FieldName>;
  readonly duration: number;
}

export abstract class Animator<FieldName extends number> {
  protected current_run_time: number = 0;
  protected animation_queue: AnimationRunData<FieldName>[] = [];

  constructor(
    protected default_animation: AnimationRunData<FieldName>,
    protected readonly updated_fields: FieldName[]
  ) {}

  public set_animation(anim_data: AnimationRunData<FieldName>) {
    this.set_animation_sequence([anim_data]);
  }

  public set_default(anim_data: AnimationRunData<FieldName>) {
    if (this.animation_queue.length === 0) {
      this.current_run_time = 0;
    }
    this.default_animation = anim_data;
  }

  public set_animation_sequence(anim_datas: AnimationRunData<FieldName>[]) {
    this.current_run_time = 0;
    this.animation_queue = anim_datas;
  }

  public abstract set_field: Record<FieldName, (value: number) => void>;

  protected current_anim() {
    return this.animation_queue.at(0) ?? this.default_animation;
  }

  public update(elapsed_seconds: number) {
    this.current_run_time += elapsed_seconds;
    let progress = 0;

    do {
      progress = this.current_run_time / this.current_anim().duration;

      if (progress >= 1) {
        this.move_to_next_animation();
      }
    } while (progress >= 1);

    this.assign_fields(progress);
  }

  protected move_to_next_animation() {
    this.current_run_time -= this.current_anim().duration;

    if (this.animation_queue.length > 0) {
      this.animation_queue.splice(0, 1);
    }
  }

  protected assign_fields(progress: number) {
    const anim = this.current_anim().anim;

    for (const field_name of this.updated_fields) {
      const field_animation: [number, number][] | undefined = anim[field_name];
      if (field_animation) {
        this.set_field[field_name](this.lerp_animation(progress, field_animation));
      }
    }
  }

  protected lerp_animation(progress: number, field_animation: [number, number][]): number {
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
      return this.lerp_value(
        field_animation[lower_index][1],
        field_animation[upper_index][1],
        (progress - field_animation[lower_index][0]) /
          (field_animation[upper_index][0] - field_animation[lower_index][0])
      );
    }
  }

  protected lerp_value(start: number, end: number, progress: number): number {
    return end * progress + start * (1 - progress);
  }
}
