import { FunctionOfProgress } from "../../../utils/functionofprogress/FunctionOfProgress";

/**
 * [progress, value]
 */
export type Animation<FieldName extends number, ValueType> = Readonly<
  Record<FieldName, FunctionOfProgress<ValueType>>
>;

export interface AnimationRunData<FieldName extends number, ValueType> {
  readonly anim: Animation<FieldName, ValueType>;
  readonly duration: number;
}

export abstract class Animator<FieldName extends number, ValueType> {
  protected current_run_time: number = 0;
  protected animation_queue: AnimationRunData<FieldName, ValueType>[] = [];

  constructor(
    protected default_animation: AnimationRunData<FieldName, ValueType>,
    protected readonly updated_fields: FieldName[]
  ) {}

  public set_animation(anim_data: AnimationRunData<FieldName, ValueType>) {
    this.set_animation_sequence([anim_data]);
  }

  public set_default(anim_data: AnimationRunData<FieldName, ValueType>) {
    if (this.animation_queue.length === 0) {
      this.current_run_time = 0;
    }
    this.default_animation = anim_data;
  }

  public set_animation_sequence(anim_datas: AnimationRunData<FieldName, ValueType>[]) {
    this.current_run_time = 0;
    this.animation_queue = anim_datas;
  }

  public abstract set_field: Record<FieldName, (value: ValueType) => void>;

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
      const field_animation: FunctionOfProgress<ValueType> | undefined = anim[field_name];
      if (field_animation) {
        this.set_field[field_name](field_animation(progress));
      }
    }
  }
}
