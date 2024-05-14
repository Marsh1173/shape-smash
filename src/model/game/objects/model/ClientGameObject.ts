import { ClientHealthComponent } from "../components/health/client/ClientHealthComponent";
import { PositionalComponent } from "../components/positional/PositionalComponent";
import { ClientAbilityComponent } from "../components/ability/client/ClientAbilityComponent";
import { ClientPlatform } from "../objects/platform/ClientPlatform";
import { ClientPortal } from "../objects/portal/client/ClientPortal";
import { ClientShapelet } from "../objects/shapelet/client/ClientShapelet";
import { GameObject } from "./GameObject";

export type ClientGameObjectType = ClientShapelet | ClientPlatform | ClientPortal;

export interface ClientGameObject extends GameObject {
  readonly health_component?: ClientHealthComponent;
  readonly positional_component?: PositionalComponent;
  readonly ability_component?: ClientAbilityComponent;
}
