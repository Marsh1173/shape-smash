import { Id } from "../../../../utils/Id";
import { Observable, Observer } from "../../../../utils/observer/Observer";
import { ValueObservable } from "../../../../utils/observer/ValueObserver";
import { GameSystem } from "../../../system/GameSystem";

export interface HealthComponentData {
  current_health?: number;
}

export class DeathObservable extends Observable<DeathObserver> {
  public on_die = this.broadcast((o) => o.on_die);
}

export interface DeathObserver extends Observer {
  on_die: () => void;
}

export class HealObservable extends Observable<HealObserver> {
  public on_take_heal = this.broadcast((o) => o.on_take_heal);
}

export interface HealObserver extends Observer {
  on_take_heal: (params: { amount: number; old_health: number; new_health: number }) => void;
}

export class DamageObservable extends Observable<DamageObserver> {
  public on_take_damage = this.broadcast((o) => o.on_take_damage);
}

export interface DamageObserver extends Observer {
  on_take_damage: (params: { amount: number; old_health: number; new_health: number }) => void;
}

export abstract class HealthComponent {
  public max_health: ValueObservable<number>;
  public current_health: ValueObservable<number>;
  public death_observable = new DeathObservable();
  public damage_observable = new DamageObservable();
  public heal_observable = new HealObservable();

  constructor(
    max_health: number,
    current_health: number,
    protected readonly game_system: GameSystem,
    protected readonly object_id: Id
  ) {
    this.current_health = new ValueObservable<number>(current_health);
    this.max_health = new ValueObservable<number>(max_health);
  }

  public serialize(): HealthComponentData {
    return { current_health: this.current_health.value };
  }
}
