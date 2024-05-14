import { Id } from "../../../../../utils/Id";
import { ServerHealthComponent } from "./ServerHealthComponent";
import { GameServerRoom } from "../../../../system/server/GameServerRoom";
import { ServerHealthComponentMessageContent } from "./ServerHealthComponentSchema";

export class ServerHealthComponentSyncher {
  constructor(
    protected readonly health_component: ServerHealthComponent,
    protected readonly syncher_id: Id,
    protected readonly server_room: GameServerRoom,
    protected readonly object_id: Id
  ) {
    this.health_component.damage_observable.add_observer({
      id: this.syncher_id,
      on_take_damage: (params: { amount: number; old_health: number; new_health: number }) => {
        this.broadcast({
          type: "ServerHealthComponentTakeDamageMessage",
          amount: params.amount,
          old_health: params.old_health,
          new_health: params.new_health,
        });
      },
    });

    this.health_component.heal_observable.add_observer({
      id: this.syncher_id,
      on_take_heal: (params: { amount: number; old_health: number; new_health: number }) => {
        this.broadcast({
          type: "ServerHealthComponentTakeHealMessage",
          amount: params.amount,
          old_health: params.old_health,
          new_health: params.new_health,
        });
      },
    });

    this.health_component.max_health.add_observer({
      id: this.syncher_id,
      on_change: (params: { new_value: number }) => {
        this.broadcast({
          type: "ServerHealthComponentUpdateMaxHealthMessage",
          new_value: params.new_value,
        });
      },
    });

    this.health_component.death_observable.add_observer({
      id: this.syncher_id,
      on_die: () => {
        this.broadcast({
          type: "ServerHealthComponentDieMessage",
        });
      },
    });
  }

  protected broadcast(msg: ServerHealthComponentMessageContent) {
    this.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerObjectMessage",
        msg: {
          type: "ServerObjectComponentMessage",
          msg: {
            type: "ServerHealthComponentMessage",
            msg,
          },
          object_id: this.object_id,
        },
      },
    });
  }
}
