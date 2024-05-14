import { AbilityDataType } from "./AbilityType";

export abstract class BaseAbility {
  protected runtime: number = 0;

  public abstract is_finished(): boolean;
  public update(elapsed_seconds: number) {
    this.runtime += elapsed_seconds;
  }
  public init() {}
  public cleanup() {}

  public abstract serialize(): AbilityDataType;
}
