import { PlatformBody, PlatformBodyData } from "./PlatformBody";
import { GameSystem } from "../../system/GameSystem";
import { HasId, Id } from "../../../utils/Id";

export interface PlatformData {
  id: Id;
  body_data: PlatformBodyData;
}

export class Platform extends HasId {
  public readonly id: Id;
  protected readonly body: PlatformBody;

  constructor(protected readonly game_system: GameSystem, protected readonly data: PlatformData) {
    super();
    this.id = data.id;

    this.body = new PlatformBody(game_system.rapier_world, data.body_data);
    this.game_system.object_container.platforms.set(this.id, this);
  }

  public get_data(): PlatformData {
    return this.data;
  }

  public destroy() {
    this.body.destroy();
    this.game_system.object_container.platforms.delete(this.id);
  }
}
