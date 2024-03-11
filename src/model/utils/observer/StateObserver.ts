import { Observable, Observer } from "./Observer";

export interface StateObserver<StateType> extends Observer {
  on_state_change(new_state: StateType): void;
}

export class StateObservable<StateType extends Object> extends Observable<
  StateObserver<StateType>
> {
  private _state: StateType;

  constructor(initial_state: StateType) {
    super();
    this._state = initial_state;
  }

  public add_observer_and_get_state(
    observer: StateObserver<StateType>
  ): StateType {
    super.add_observer(observer);
    return this._state;
  }

  protected set_state(new_state: Partial<StateType>) {
    this._state = { ...this._state, ...new_state };
    this.broadcast_state_change({ ...this._state });
  }

  protected get state(): StateType {
    return { ...this._state };
  }

  private broadcast_state_change = this.broadcast((o) => o.on_state_change);
}
