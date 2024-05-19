import { AbilityDataType } from "../../../../abilities/model/AbilityType";
import { ClientGameSystem } from "../../../../system/client/ClientGameSystem";
import { ClientGameObject } from "../../../model/ClientGameObject";
import { AbilityComponent } from "../AbilityComponent";
import { ServerAbilityComponentMessage } from "../server/ServerAbilityComponentSchema";

export class ClientAbilityComponent extends AbilityComponent {
  constructor(protected readonly game_system: ClientGameSystem, protected readonly owner: ClientGameObject) {
    super();
  }

  public route_msg(msg: ServerAbilityComponentMessage) {
    if (msg.msg.type === "ServerAbilityComponentUpdateMessage") {
      this.make_and_set_ability(msg.msg.data);
    } else {
      throw new Error("Route not implemented yet");
    }
  }

  protected make_and_set_ability(data: AbilityDataType | undefined) {
    const ability = data ? this.game_system.ability_factory.make_ability(data, this.owner) : undefined;
    this.set_ability(ability);
  }
}
