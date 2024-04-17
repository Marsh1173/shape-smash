import { ColorMatrixFilter } from "pixi.js";
import { GameDisplay } from "./GameDisplay";

type ScreenEffect = "death";

export class ScreenEffects {
  protected readonly filters = {
    death: new ColorMatrixFilter(),
  };

  constructor(protected readonly game_display: GameDisplay) {
    this.game_display.layers.pixijs_main_stage.filters = [this.filters.death];

    this.filters.death.brightness(0.5, true);
    this.filters.death.blackAndWhite(true);
    this.filters.death.enabled = false;
  }

  public start_effect(effect: ScreenEffect) {
    if (effect === "death") {
      this.filters.death.enabled = true;
    }
  }

  public end_effect(effect: ScreenEffect) {
    if (effect === "death") {
      this.filters.death.enabled = false;
    }
  }
}
