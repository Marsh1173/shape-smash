import { Id } from "../../utils/Id";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";
import { ObjectContainer } from "./ObjectContainer";

export class ServerObjectContainer extends ObjectContainer {
  declare readonly shapelets: Map<Id, ServerShapelet>;
}
