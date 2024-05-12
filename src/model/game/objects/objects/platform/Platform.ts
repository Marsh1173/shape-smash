import { PlatformBody, PlatformBodyData } from "./PlatformBody";
import { GameSystem } from "../../../system/GameSystem";
import { Id } from "../../../../utils/Id";
import { GameObject } from "../../model/GameObject";

export interface PlatformData {
  type: "PlatformData";
  id: Id;
  body_data: PlatformBodyData;
}

export abstract class Platform implements GameObject {
  public readonly type = "Platform";
  public readonly id: Id;
  protected readonly body: PlatformBody;

  constructor(
    protected readonly game_system: GameSystem,
    protected readonly data: PlatformData
  ) {
    this.id = data.id;

    this.body = new PlatformBody(game_system.rapier_world, data.body_data);
  }

  public serialize(): PlatformData {
    return this.data;
  }

  public destroy() {
    this.body.destroy();
  }
}
