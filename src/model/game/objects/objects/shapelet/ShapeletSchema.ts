import { HasId } from "../../../../utils/Id";
import { HealthComponentData } from "../../components/health/HealthComponent";
import { ShapeletControllerData } from "./ShapeletController";
import { ShapeletSpriteData } from "./client/sprite/ShapeletSpriteData";
import { DynamicRectComponentData } from "../../components/positional/dynamicrect/DynamicRectComponent";

export interface ShapeletData extends HasId {
  type: "ShapeletData";
  controller_data: ShapeletControllerData;
  sprite_data: ShapeletSpriteData;
  health_data: HealthComponentData;
  positional_data: DynamicRectComponentData;
}
