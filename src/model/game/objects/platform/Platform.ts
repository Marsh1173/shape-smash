import { World } from "@dimforge/rapier2d-compat";
import { PlatformBody, PlatformBodyData } from "./PlatformBody";

export interface PlatformData {
  body_data: PlatformBodyData;
}

export class Platform {
  protected readonly body: PlatformBody;
  constructor(world: World, protected readonly data: PlatformData) {
    this.body = new PlatformBody(world, data.body_data);
  }

  public get_data(): PlatformData {
    return this.data;
  }

  public destroy() {
    this.body.destroy();
  }
}
