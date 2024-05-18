import { DynamicRectComponent } from "./dynamicrect/DynamicRectComponent";
import { PositionComponent } from "./position/PositionComponent";
import { StaticRectComponent } from "./staticrect/StaticRectComponent";

export type PositionalComponent = PositionComponent | StaticRectComponent | DynamicRectComponent;
