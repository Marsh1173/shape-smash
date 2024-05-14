import { Id } from "../../../../../utils/Id";
import { AbilityDataType } from "../../../../abilities/model/AbilityType";
import { GameServerRoom } from "../../../../system/server/GameServerRoom";
import { ServerAbilityComponentMessageContent } from "./ServerAbilityComponentSchema";

export class ServerAbilityComponentSyncher {
  constructor(protected readonly server_room: GameServerRoom, protected readonly object_id: Id) {}

  protected broadcast(msg: ServerAbilityComponentMessageContent) {
    this.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerObjectMessage",
        msg: {
          type: "ServerObjectComponentMessage",
          msg: {
            type: "ServerAbilityComponentMessage",
            msg,
          },
          object_id: this.object_id,
        },
      },
    });
  }

  public broadcast_ability_change(ability_data: AbilityDataType | undefined) {
    this.broadcast({
      type: "ServerAbilityComponentUpdateMessage",
      data: ability_data,
    });
  }
}
