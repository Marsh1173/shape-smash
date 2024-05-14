import { Id } from "../../../utils/Id";
import { ServerGameSystem } from "../../system/server/ServerGameSystem";
import { AttackSwordData } from "../library/attack_sword/AttackSword";
import { ServerAttackSword } from "../library/attack_sword/ServerAttackSword";

export class ServerAbilityFactory {
  constructor(protected readonly game_system: ServerGameSystem) {}

  public attack_sword(data: AttackSwordData, actor_id: Id): ServerAttackSword {
    return new ServerAttackSword(data, this.game_system, actor_id);
  }
}
