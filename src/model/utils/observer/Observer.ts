import { HasId, Id } from "../Id";

export interface Observer extends HasId {
  on_observable_deconstruct?(): void;
}

export abstract class Observable<ObserverType extends Observer> {
  protected readonly observer_map: Map<Id, ObserverType> = new Map();

  public add_observer(observer: ObserverType) {
    this.observer_map.set(observer.id, observer);
  }

  public remove_observer(id: Id): boolean {
    return this.observer_map.delete(id);
  }

  protected broadcast<ParamsType>(f: (observer: ObserverType) => ((params: ParamsType) => void) | undefined) {
    return (params: ParamsType) => {
      for (const [id, observer] of this.observer_map) {
        f(observer)?.(params);
      }
    };
  }

  protected broadcast_no_params<ParamsType>(f: (observer: ObserverType) => (() => void) | undefined) {
    return () => {
      for (const [id, observer] of this.observer_map) {
        f(observer)?.();
      }
    };
  }

  public on_deconstruct() {
    this.broadcast_no_params((o) => o.on_observable_deconstruct)();
  }
}
