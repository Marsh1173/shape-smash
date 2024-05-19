import { DynamicRectComponent } from "../../objects/components/positional/dynamicrect/DynamicRectComponent";
import { ClientGameObject } from "../../objects/model/ClientGameObject";
import { AttackSword, AttackSwordData } from "../library/attack_sword/AttackSword";
import { Dash, DashData } from "../library/dash/Dash";
import { AbilityDataType } from "../model/AbilityType";
import { ClientAbilityType } from "../model/ClientAbilityType";

export class ClientAbilityFactory {
  public attack_sword(data: AttackSwordData): AttackSword {
    return new AttackSword(data);
  }
  public dash(data: DashData, positional_component: DynamicRectComponent): Dash {
    return new Dash(data, positional_component);
  }

  public make_ability(data: AbilityDataType, game_object: ClientGameObject): ClientAbilityType {
    switch (data?.type) {
      case "AttackSword":
        return this.attack_sword(data);
      case "Dash":
        if (game_object.positional_component?.type === "DynamicRect") {
          return this.dash(data, game_object.positional_component);
        } else {
          throw new Error("Tried to dash with entity " + game_object.id + " without dynamic rect positional component");
        }
    }
  }
}
