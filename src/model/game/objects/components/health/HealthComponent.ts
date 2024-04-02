import { Id } from "../../../../utils/Id";
import { Observable, Observer } from "../../../../utils/observer/Observer";
import { ValueObservable } from "../../../../utils/observer/ValueObserver";
import { GameSystem } from "../../../system/GameSystem";

export interface HealthComponentData {
  current_health?: number;
}

export interface DeathObserver extends Observer {
  on_die: () => void;
}

export class DeathObservable extends Observable<DeathObserver> {
  public on_die = this.broadcast((o) => o.on_die);
}

export abstract class HealthComponent {
  public max_health: ValueObservable<number>;
  public current_health: ValueObservable<number>;
  public death_observable = new DeathObservable();

  constructor(
    max_health: number,
    current_health: number,
    protected readonly game_system: GameSystem,
    protected readonly object_id: Id
  ) {
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

  protected die() {
    this.death_observable.on_die({});
    this.game_system.object_container.remove_object(this.object_id);
  }

  public serialize(): HealthComponentData {
    return { current_health: this.current_health.value };
  }
}
