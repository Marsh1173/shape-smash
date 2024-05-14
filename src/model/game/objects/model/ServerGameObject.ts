import { ServerHealthComponent } from "../components/health/server/ServerHealthComponent";
import { PositionalComponent } from "../components/positional/PositionalComponent";
import { ServerAbilityComponent } from "../components/ability/server/ServerAbilityComponent";
import { ServerPlatform } from "../objects/platform/ServerPlatform";
import { ServerPortal } from "../objects/portal/ServerPortal";
import { ServerShapelet } from "../objects/shapelet/server/ServerShapelet";
import { GameObject } from "./GameObject";

export type ServerGameObjectType = ServerShapelet | ServerPlatform | ServerPortal;

export interface ServerGameObject extends GameObject {
  readonly health_component?: ServerHealthComponent;
  readonly positional_component?: PositionalComponent;
  readonly ability_component?: ServerAbilityComponent;
}
