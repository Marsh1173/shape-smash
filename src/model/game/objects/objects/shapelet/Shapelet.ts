import { Id } from "../../../../utils/Id";
import { ShapeletController } from "./ShapeletController";
import { ShapeletSpriteData } from "./client/sprite/ShapeletSpriteData";
import { HealthComponent } from "../../components/health/HealthComponent";
import { GameSystem } from "../../../system/GameSystem";
import { GameObject } from "../../model/GameObject";
import { ShapeletData } from "./ShapeletSchema";
import { AbilityComponent } from "../../components/ability/AbilityComponent";
import { DynamicRectComponent } from "../../components/positional/dynamicrect/DynamicRectComponent";

export abstract class Shapelet implements GameObject {
  public readonly id: Id;
  public readonly type = "Shapelet";
  protected readonly sprite_data: ShapeletSpriteData;

  public readonly positional_component: DynamicRectComponent;
  public readonly controller: ShapeletController;
  public abstract readonly health_component: HealthComponent;
  public abstract readonly ability_component: AbilityComponent;

  public static readonly base_stats = {
    max_health: 4,
  };

  constructor(protected readonly game_system: GameSystem, data: ShapeletData) {
    this.id = data.id;
    this.sprite_data = data.sprite_data;

    this.positional_component = new DynamicRectComponent(
      {
        ...data.positional_data,
        dimensions: { h: 1, w: 1 },
      },
      game_system
    );

    this.controller = new ShapeletController(
      this.positional_component,
      this.game_system.rapier_world,
      data.controller_data
    );
  }

  public destroy() {
    this.ability_component.destroy();
    this.positional_component.destroy();
  }

  public update(elapsed_seconds: number) {
    this.ability_component.update(elapsed_seconds);
    this.controller.update(elapsed_seconds);
    this.positional_component.update(elapsed_seconds);
  }

  public serialize(): ShapeletData {
    return {
      type: "ShapeletData",
      id: this.id,
      positional_data: this.positional_component.serialize(),
      controller_data: this.controller.serialize(),
      sprite_data: this.sprite_data,
      health_data: this.health_component.serialize(),
    };
  }
}
