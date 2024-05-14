import { BaseAbility } from "../../model/BaseAbility";

export interface AttackSwordData {
  type: "AttackSword";
}

export class AttackSword extends BaseAbility {
  public readonly type = "AttackSword";

  public static readonly duration: number = 0.1;

  constructor(data: AttackSwordData) {
    super();
  }

  public is_finished(): boolean {
    return this.runtime > AttackSword.duration;
  }

  public serialize(): AttackSwordData {
    return {
      type: "AttackSword",
    };
  }
}
