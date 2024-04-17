import { Id } from "../../../../../utils/Id";
import { ServerHealthComponent } from "./ServerHealthComponent";
import { ServerHealthComponentMessage } from "../server/ServerHealthComponentSchema";

export interface ServerHealthComponentBroadcaster {
  broadcast(msg: ServerHealthComponentMessage): void;
}

export class ServerHealthComponentSyncher {
  constructor(
    protected readonly health_component: ServerHealthComponent,
    protected readonly syncher_id: Id,
    protected readonly broadcaster: ServerHealthComponentBroadcaster
  ) {
    this.health_component.damage_observable.add_observer({
      id: this.syncher_id,
      on_take_damage: (params: { amount: number; old_health: number; new_health: number }) => {
        this.broadcaster.broadcast({
          type: "ServerHealthComponentMessage",
          msg: {
            type: "ServerHealthComponentTakeDamageMessage",
            amount: params.amount,
            old_health: params.old_health,
            new_health: params.new_health,
          },
        });
      },
    });

    this.health_component.heal_observable.add_observer({
      id: this.syncher_id,
      on_take_heal: (params: { amount: number; old_health: number; new_health: number }) => {
        this.broadcaster.broadcast({
          type: "ServerHealthComponentMessage",
          msg: {
            type: "ServerHealthComponentTakeHealMessage",
            amount: params.amount,
            old_health: params.old_health,
            new_health: params.new_health,
          },
        });
      },
    });

    this.health_component.max_health.add_observer({
      id: this.syncher_id,
      on_change: (params: { new_value: number }) => {
        this.broadcaster.broadcast({
          type: "ServerHealthComponentMessage",
          msg: {
            type: "ServerHealthComponentUpdateMaxHealthMessage",
            new_value: params.new_value,
          },
        });
      },
    });

    this.health_component.death_observable.add_observer({
      id: this.syncher_id,
      on_die: () => {
        this.broadcaster.broadcast({
          type: "ServerHealthComponentMessage",
          msg: {
            type: "ServerHealthComponentDieMessage",
          },
        });
      },
    });
  }
}
