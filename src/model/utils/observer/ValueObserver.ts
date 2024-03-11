import { Observable, Observer } from "./Observer";

export interface ValueObserver<T> extends Observer {
  on_change(new_value: T): void;
}

export class ValueObservable<T> extends Observable<ValueObserver<T>> {
  private _value: T;

  constructor(initial_value: T) {
    super();
    this._value = initial_value;
  }

  public get value(): T {
    return this._value;
  }

  public set_value(new_value: T): void {
    this._value = new_value;
    this.broadcast_change(this._value);
  }

  public add_observer_and_get_value(observer: ValueObserver<T>): T {
    super.add_observer(observer);
    return this._value;
  }

  private broadcast_change = this.broadcast((o) => o.on_change);
}
