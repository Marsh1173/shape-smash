import { Id } from "../../../utils/Id";
import { ServerGameObjectType } from "../model/ServerGameObject";
import { ServerGameSystem } from "../../system/server/ServerGameSystem";
import { ObjectContainer } from "./ObjectContainer";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";
import { ServerPlatform } from "../objects/platform/ServerPlatform";
import { ServerPortal } from "../objects/portal/ServerPortal";

export class ServerObjectContainer extends ObjectContainer {
  declare readonly shapelets: ReadonlyMap<Id, ServerShapelet>;
  declare readonly platforms: ReadonlyMap<Id, ServerPlatform>;
  declare readonly portals: ReadonlyMap<Id, ServerPortal>;

  declare readonly objects: ReadonlyMap<Id, ServerGameObjectType>;

  constructor(protected readonly game_system: ServerGameSystem) {
    super();
  }

  public add_object(object: ServerGameObjectType) {
    super.add_object(object);
    const object_data = object.serialize();

    this.game_system.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerObjectMessage",
        msg: {
          type: "ServerObjectCreateMessage",
          object_data,
        },
      },
    });
  }

  protected remove_object_inner(object: ServerGameObjectType): void {
    super.remove_object_inner(object);

    this.game_system.server_room.broadcast({
      type: "ServerGameMessage",
      msg: {
        type: "ServerObjectMessage",
        msg: {
          type: "ServerObjectDestroyMessage",
          object_id: object.id,
        },
      },
    });
  }
}
