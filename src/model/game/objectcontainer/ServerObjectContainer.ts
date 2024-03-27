import { Id } from "../../utils/Id";
import { ServerGameObjectType } from "../objects/model/ServerGameObject";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";
import { ServerGameSystem } from "../system/server/ServerGameSystem";
import { ObjectContainer } from "./ObjectContainer";

export class ServerObjectContainer extends ObjectContainer {
  declare readonly shapelets: ReadonlyMap<Id, ServerShapelet>;
  declare readonly objects: ReadonlyMap<Id, ServerGameObjectType>;

  constructor(protected readonly game_system: ServerGameSystem) {
    super();
  }

  public add_object(object: ServerGameObjectType) {
    super.add_object(object);

    let exclude_id: Id | undefined = undefined;
    if (object.type === "Shapelet") {
      exclude_id = object.id;
    }

    const object_data = object.serialize();

    this.game_system.server_room.broadcast(
      {
        type: "ServerGameMessage",
        msg: {
          type: "ServerObjectMessage",
          msg: {
            type: "ServerObjectCreateMessage",
            object_data,
          },
        },
      },
      exclude_id
    );
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
