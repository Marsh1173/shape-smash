import { ValueObservable } from "../../../../utils/observer/ValueObserver";

export interface HealthComponentData {
  current_health?: number;
}

export abstract class HealthComponent {
  public max_health: ValueObservable<number>;
  public current_health: ValueObservable<number>;

  constructor(max_health: number, current_health: number) {
    this.current_health = new ValueObservable<number>(current_health);
    this.max_health = new ValueObservable<number>(max_health);
  }

  public heal(amount: number) {
    this.current_health.set_value(Math.min(this.current_health.value + amount, this.max_health.value));
  }

  public damage(amount: number): boolean {
    this.current_health.set_value(Math.max(this.current_health.value - amount, 0));

    if (this.current_health.value === 0) {
      this.die();
      return true;
    } else {
      return false;
    }
  }

  protected die() {}

  public serialize(): HealthComponentData {
    return { current_health: this.current_health.value };
  }
}
