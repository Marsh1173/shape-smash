import { Id } from "../../../utils/Id";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ClientPortal } from "../objects/portal/client/ClientPortal";
import { ObjectContainer } from "./ObjectContainer";
import { ClientGameObject, ClientGameObjectType } from "../model/ClientGameObject";
import { ServerObjectComponentMessage, ServerObjectMessage } from "../model/ServerObjectSchema";
import { ClientGameSystem } from "../../system/client/ClientGameSystem";

export class ClientObjectContainer extends ObjectContainer {
  declare readonly shapelets: ReadonlyMap<Id, ClientShapelet>;
  declare readonly platforms: ReadonlyMap<Id, ClientPlatform>;
  declare readonly portals: ReadonlyMap<Id, ClientPortal>;

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
    } else if (msg.msg.type === "ServerObjectComponentMessage") {
      const obj: ClientGameObject | undefined = this.get_obj_or_warn(msg.msg.object_id, msg);
      if (obj) this.route_object_component_msg(msg.msg, obj);
    } else {
      throw new Error("Route not implemented yet");
    }
  }

  protected route_object_component_msg(msg: ServerObjectComponentMessage, obj: ClientGameObject) {
    if (msg.msg.type === "ServerHealthComponentMessage") {
      obj.health_component?.route_msg(msg.msg);
    }
  }

  protected get_obj_or_warn(object_id: Id, msg: any): ClientGameObject | undefined {
    const obj: ClientGameObject | undefined = this.objects.get(msg.msg.object_id);
    if (!obj) {
      console.error(
        "Could not find obj with id " +
          msg.msg.object_id +
          " and server component msg " +
          JSON.stringify(msg)
      );
    }
    return obj;
  }
}
