import { Id } from "../../utils/Id";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ObjectContainer } from "./ObjectContainer";
import { ClientGameObjectType } from "../objects/model/ClientGameObject";
import { ServerObjectMessage } from "../objects/model/ServerObjectSchema";
import { ClientGameSystem } from "../system/client/ClientGameSystem";

export class ClientObjectContainer extends ObjectContainer {
  declare readonly shapelets: ReadonlyMap<Id, ClientShapelet>;
  declare readonly platforms: ReadonlyMap<Id, ClientPlatform>;
  declare readonly objects: ReadonlyMap<Id, ClientGameObjectType>;

  constructor(protected readonly game_system: ClientGameSystem) {
    super();
  }

  // synching objects
  public route_msg(msg: ServerObjectMessage) {
    if (msg.msg.type === "ServerObjectCreateMessage") {
      this.game_system.object_factory.object(msg.msg.object_data);
    } else if (msg.msg.type === "ServerObjectDestroyMessage") {
      this.remove_object(msg.msg.object_id);
    } else {
      throw new Error("Route not implemented yet");
    }
  }
}
