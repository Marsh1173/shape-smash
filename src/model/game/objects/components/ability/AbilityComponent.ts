import { BaseAbility } from "../../../abilities/model/BaseAbility";

export abstract class AbilityComponent {
  protected ability: BaseAbility | undefined = undefined;

  public update(elapsed_seconds: number) {
    if (this.ability) {
      this.ability.update(elapsed_seconds);
      if (this.ability.is_finished()) {
        this.set_ability(undefined);
      }
    }
  }

  public get_ability(): BaseAbility | undefined {
    return this.ability;
  }
  public set_ability(new_ability: BaseAbility | undefined) {
    this.ability?.cleanup();

    this.ability = new_ability;
    this.ability?.init();
  }

  public destroy() {
    this.ability?.cleanup();
  }
}
