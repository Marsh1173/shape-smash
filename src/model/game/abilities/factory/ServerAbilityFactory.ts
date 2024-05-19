import { Id } from "../../../utils/Id";
import { DynamicRectComponent } from "../../objects/components/positional/dynamicrect/DynamicRectComponent";
import { ServerGameSystem } from "../../system/server/ServerGameSystem";
import { AttackSwordData } from "../library/attack_sword/AttackSword";
import { ServerAttackSword } from "../library/attack_sword/ServerAttackSword";
import { Dash, DashData } from "../library/dash/Dash";

export class ServerAbilityFactory {
  constructor(protected readonly game_system: ServerGameSystem) {}

  public attack_sword(data: AttackSwordData, actor_id: Id): ServerAttackSword {
    return new ServerAttackSword(data, this.game_system, actor_id);
  }

  public dash(data: DashData, positional_component: DynamicRectComponent): Dash {
    return new Dash(data, positional_component);
  }
}
