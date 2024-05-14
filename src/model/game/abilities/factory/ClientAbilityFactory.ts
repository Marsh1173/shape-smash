import { AttackSword, AttackSwordData } from "../library/attack_sword/AttackSword";
import { AbilityDataType } from "../model/AbilityType";
import { ClientAbilityType } from "../model/ClientAbilityType";

export class ClientAbilityFactory {
  public attack_sword(data: AttackSwordData): AttackSword {
    return new AttackSword(data);
  }

  public make_ability(data: AbilityDataType): ClientAbilityType {
    switch (data?.type) {
      case "AttackSword":
        return this.attack_sword(data);
    }
  }
}
