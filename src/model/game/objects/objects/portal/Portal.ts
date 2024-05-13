import { Id } from "../../../../utils/Id";
import { GameSystem } from "../../../system/GameSystem";
import { GameObject } from "../../model/GameObject";
import { PortalData } from "./PortalSchema";
import { PositionalComponent } from "../../components/positional/PositionalComponent";
import { PositionComponent } from "../../components/positional/position/PositionComponent";

export abstract class Portal implements GameObject {
  public readonly type = "Portal";

  public readonly id: Id;
  public readonly positional_component: PositionalComponent;

  constructor(protected readonly game_system: GameSystem, data: PortalData) {
    this.id = data.id;
    this.positional_component = new PositionComponent(data.positional_data);
  }

  public destroy() {}

  public serialize(): PortalData {
    return {
      type: "PortalData",
      id: this.id,
      positional_data: this.positional_component.serialize(),
    };
  }
}
