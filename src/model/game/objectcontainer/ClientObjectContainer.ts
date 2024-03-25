import { Id } from "../../utils/Id";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { ObjectContainer } from "./ObjectContainer";

export class ClientObjectContainer extends ObjectContainer {
  declare readonly shapelets: Map<Id, ClientShapelet>;
  declare readonly platforms: Map<Id, ClientPlatform>;
}
