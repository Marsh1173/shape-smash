import { Vector } from "@dimforge/rapier2d-compat";
import { BaseAbility } from "../../model/BaseAbility";
import { DynamicRectComponent } from "../../../objects/components/positional/dynamicrect/DynamicRectComponent";
import { lerp_value } from "../../../../utils/functionofprogress/LerpValue";

export interface DashData {
  type: "Dash";
  start_pos: Readonly<Vector>;
  end_pos: Readonly<Vector>;
}

export class Dash extends BaseAbility {
  public readonly type = "Dash";
  protected readonly start_pos: Readonly<Vector>;
  protected readonly end_pos: Readonly<Vector>;

  public static readonly duration: number = 0.2;

  constructor(data: DashData, protected readonly positional_component: DynamicRectComponent) {
    super();

    this.start_pos = data.start_pos;
    this.end_pos = data.end_pos;
  }

  public update(elapsed_seconds: number): void {
    const prev_progress = this.runtime / Dash.duration;

    super.update(elapsed_seconds);

    const current_progress = this.runtime / Dash.duration;

    const prev_x = lerp_value(this.start_pos.x, this.end_pos.x, prev_progress);
    const current_x = lerp_value(this.start_pos.x, this.end_pos.x, current_progress);

    const prev_y = lerp_value(this.start_pos.y, this.end_pos.y, prev_progress);
    const current_y = lerp_value(this.start_pos.y, this.end_pos.y, current_progress);

    this.positional_component.vel.x += current_x - prev_x;
    this.positional_component.vel.y += current_y - prev_y;
  }

  public is_finished(): boolean {
    return this.runtime > Dash.duration;
  }

  public serialize(): DashData {
    return {
      type: "Dash",
      start_pos: this.start_pos,
      end_pos: this.end_pos,
    };
  }
}
