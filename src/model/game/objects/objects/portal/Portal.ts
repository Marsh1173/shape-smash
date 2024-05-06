import { Vector } from "@dimforge/rapier2d-compat";
import { Id } from "../../../utils/Id";
import { GameSystem } from "../../system/GameSystem";
import { GameObject } from "../model/GameObject";
import { PortalData } from "./PortalSchema";

export class Portal implements GameObject {
  public readonly id: Id;
  public readonly type = "Portal";

  public readonly pos: Readonly<Vector>;

  constructor(protected readonly game_system: GameSystem, data: PortalData) {
    this.id = data.id;
    this.pos = data.pos;
  }

  public destroy() {}

  public serialize(): PortalData {
    return {
      type: "PortalData",
      id: this.id,
      pos: this.pos,
    };
  }
}
