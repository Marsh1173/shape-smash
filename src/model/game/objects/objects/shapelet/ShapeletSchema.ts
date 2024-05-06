import { HasId } from "../../../../utils/Id";
import { HealthComponentData } from "../../components/health/HealthComponent";
import { ShapeletBodyData } from "./ShapeletBody";
import { ShapeletControllerData } from "./ShapeletController";
import { ShapeletSpriteData } from "./client/sprite/ShapeletSpriteData";

export interface ShapeletData extends HasId {
  type: "ShapeletData";
  body_data: ShapeletBodyData;
  controller_data: ShapeletControllerData;
  sprite_data: ShapeletSpriteData;
  health_data: HealthComponentData;
}
