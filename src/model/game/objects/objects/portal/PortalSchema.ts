import { HasId } from "../../../../utils/Id";
import { PositionComponentData } from "../../components/positional/position/PositionComponent";

export interface PortalData extends HasId {
  type: "PortalData";
  positional_data: PositionComponentData;
}
