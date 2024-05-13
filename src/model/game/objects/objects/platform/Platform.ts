import { GameSystem } from "../../../system/GameSystem";
import { Id } from "../../../../utils/Id";
import { GameObject } from "../../model/GameObject";
import {
  StaticRectComponent,
  StaticRectComponentData,
} from "../../components/positional/staticrect/StaticRectComponent";

export interface PlatformData {
  type: "PlatformData";
  id: Id;
  positional_data: Omit<StaticRectComponentData, "dimensions"> & { len: number };
}

export abstract class Platform implements GameObject {
  public readonly type = "Platform";
  public readonly id: Id;
  public readonly positional_component: StaticRectComponent;

  constructor(protected readonly game_system: GameSystem, protected readonly data: PlatformData) {
    this.id = data.id;

    this.positional_component = new StaticRectComponent(
      { ...data.positional_data, dimensions: { w: data.positional_data.len, h: 1 } },
      this.game_system.rapier_world
    );
  }

  public serialize(): PlatformData {
    const pos_data = this.positional_component.serialize();
    return {
      type: "PlatformData",
      id: this.id,
      positional_data: {
        pos: pos_data.pos,
        len: pos_data.dimensions.w,
      },
    };
  }

  public destroy() {
    this.positional_component.destroy();
  }
}
