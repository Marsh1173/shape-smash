import { Id } from "../../../../../utils/Id";
import { BaseAbility } from "../../../../abilities/model/BaseAbility";
import { GameServerRoom } from "../../../../system/server/GameServerRoom";
import { AbilityComponent } from "../AbilityComponent";
import { ServerAbilityComponentSyncher } from "./ServerAbilityComponentSyncher";

export class ServerAbilityComponent extends AbilityComponent {
  protected readonly syncher: ServerAbilityComponentSyncher;

  constructor(protected readonly object_id: Id, protected readonly server_room: GameServerRoom) {
    super();

    this.syncher = new ServerAbilityComponentSyncher(this.server_room, this.object_id);
  }

  public set_ability(new_ability: BaseAbility | undefined): void {
    super.set_ability(new_ability);

    this.syncher.broadcast_ability_change(new_ability?.serialize());
  }
}
