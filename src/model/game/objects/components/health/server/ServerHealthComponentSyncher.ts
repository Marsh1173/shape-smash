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
    this.health_component.current_health.add_observer({
      id: this.syncher_id,
      on_change: (new_value: number) => {
        this.broadcaster.broadcast({
          type: "ServerHealthComponentMessage",
          msg: {
            type: "ServerHealthComponentUpdateCurrentHealthMessage",
            new_value,
          },
        });
      },
    });

    this.health_component.max_health.add_observer({
      id: this.syncher_id,
      on_change: () => {
        throw new Error("Server health syncher not implemented yet");
      },
    });
  }
}
