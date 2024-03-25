import { ValueObservable } from "./ValueObserver";

export interface StateMachineState {
  init(): void;
  deconstruct(): void;
}
export class StateMachineObservable<T extends StateMachineState> extends ValueObservable<T> {
  constructor(initial_state: T) {
    super(initial_state);
    initial_state.init();
  }

  public set_value(new_state: T) {
    this.value.deconstruct();
    new_state.init();

    super.set_value(new_state);
  }

  public deconstruct() {
    this.value.deconstruct();
  }
}
