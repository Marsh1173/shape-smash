import { Vector } from "@dimforge/rapier2d-compat";
import { HasId } from "../../../utils/Id";

export interface PortalData extends HasId {
  type: "PortalData";
  pos: Vector;
}
