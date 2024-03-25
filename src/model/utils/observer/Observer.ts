import { HasId, Id } from "../Id";

export interface Observer extends HasId {}

export abstract class Observable<ObserverType extends Observer> {
  protected readonly observer_map: Map<Id, ObserverType> = new Map();

  public add_observer(observer: ObserverType) {
    if (this.observer_map.has(observer.id)) {
      throw new Error("Tried to add an observer with an already-registered id " + observer.id);
    }
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
}
