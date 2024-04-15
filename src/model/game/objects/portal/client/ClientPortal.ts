import { Portal } from "../Portal";
import { PortalData } from "../PortalSchema";
import { ClientGameSystem } from "../../../system/client/ClientGameSystem";
import { ClientPortalSprite } from "./ClientPortalSprite";

export class ClientPortal extends Portal {
  protected readonly sprite: ClientPortalSprite;

  constructor(protected readonly game_system: ClientGameSystem, data: PortalData) {
    super(game_system, data);

    this.sprite = new ClientPortalSprite(this, this.game_system.display);
  }

  public destroy(): void {
    super.destroy();
    this.sprite.destroy();
  }
}
