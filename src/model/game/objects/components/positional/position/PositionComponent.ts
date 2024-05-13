import { Vector } from "@dimforge/rapier2d-compat";

export interface PositionComponentData {
  readonly pos: Readonly<Vector>;
}

export class PositionComponent {
  public readonly type = "Position";
  public readonly pos: Readonly<Vector>;

  constructor(data: PositionComponentData) {
    this.pos = data.pos;
  }

  public serialize(): PositionComponentData {
    return {
      pos: this.pos,
    };
  }
}
