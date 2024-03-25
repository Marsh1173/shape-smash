import { HasId, Id } from "../../../utils/Id";
import { ShapeletBody, ShapeletBodyData } from "./ShapeletBody";
import { ShapeletController, ShapeletControllerData } from "./ShapeletController";
import { ShapeletSpriteData } from "./sprite/ShapeletAssets";
import { HealthComponent, HealthComponentData } from "../components/health/HealthComponent";
import { GameSystem } from "../../system/GameSystem";

export interface ShapeletData extends HasId {
  body_data: ShapeletBodyData;
  controller_data: ShapeletControllerData;
  sprite_data: ShapeletSpriteData;
  health_data: HealthComponentData;
}

export abstract class Shapelet extends HasId {
  public readonly id: Id;
  protected readonly sprite_data: ShapeletSpriteData;

  public readonly body: ShapeletBody;
  public readonly controller: ShapeletController;
  public abstract readonly health_component: HealthComponent;

  public static readonly base_stats = {
    max_health: 4,
  };

  constructor(protected readonly game_system: GameSystem, data: ShapeletData) {
    super();
    this.id = data.id;
    this.sprite_data = data.sprite_data;

    this.body = new ShapeletBody(this.game_system.rapier_world, data.body_data);
    this.controller = new ShapeletController(this.body, this.game_system.rapier_world, data.controller_data);
    this.game_system.object_container.shapelets.set(this.id, this);
  }

  public destroy() {
    this.body.destroy();
    this.game_system.object_container.shapelets.delete(this.id);
  }

  public update(elapsed_seconds: number) {
    this.controller.update(elapsed_seconds);
    this.body.update(elapsed_seconds);
  }

  public serialize(): ShapeletData {
    return {
      id: this.id,
      body_data: this.body.serialize(),
      controller_data: this.controller.serialize(),
      sprite_data: this.sprite_data,
      health_data: this.health_component.serialize(),
    };
  }
}
