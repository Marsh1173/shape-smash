import { Vector } from "@dimforge/rapier2d-compat";
import { BaseAbility } from "../../model/BaseAbility";
import { DynamicRectComponent } from "../../../objects/components/positional/dynamicrect/DynamicRectComponent";
import { Id, uuid } from "../../../../utils/Id";

export interface DashData {
  type: "Dash";
  start_pos: Readonly<Vector>;
  end_pos: Readonly<Vector>;
}

export class Dash extends BaseAbility {
  public readonly type = "Dash";
  protected readonly start_pos: Readonly<Vector>;
  protected readonly end_pos: Readonly<Vector>;

  public static readonly duration: number = 1;

  protected readonly dash_force_id: Id = uuid();

  constructor(data: DashData, protected readonly positional_component: DynamicRectComponent) {
    super();

    this.start_pos = data.start_pos;
    this.end_pos = data.end_pos;
  }

  public init(): void {
    super.init();

    this.positional_component.game_force_handler.add_force(this.dash_force_id, {
      duration: Dash.duration,
      calc_position: (progress: number) => {
        return {
          x: -3 * progress ** 0.7,
          y: 0,
        };
      },
    });
  }

  public cleanup(): void {
    super.cleanup();
    this.positional_component.game_force_handler.remove_force(this.dash_force_id);
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
