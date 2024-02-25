export interface InputListener {
  on_start_up?: () => void;
  on_end_up?: () => void;
  on_start_down?: () => void;
  on_end_down?: () => void;
  on_start_left?: () => void;
  on_end_left?: () => void;
  on_start_right?: () => void;
  on_end_right?: () => void;
}

export class Input {
  private static listener?: InputListener;
  private static pressed_keys: Set<string> = new Set();
  private constructor() {}

  public static set_listener(listener: InputListener) {
    this.clear_listener();
    this.listener = listener;
  }

  public static clear_listener() {
    this.pressed_keys.forEach((key) => this.process_input_end(key));
    this.listener = undefined;
    this.pressed_keys.clear();
  }

  public static init() {
    window.onkeydown = (e) => this.process_input_start(e.key);
    window.onkeyup = (e) => this.process_input_end(e.key);
  }

  private static process_input_start(key: string) {
    if (this.pressed_keys.has(key)) {
      return;
    }

    this.pressed_keys.add(key);
    switch (key) {
      case "w":
        this.listener?.on_start_up?.();
        break;
      case "a":
        this.listener?.on_start_left?.();
        break;
      case "s":
        this.listener?.on_start_down?.();
        break;
      case "d":
        this.listener?.on_start_right?.();
        break;
    }
  }

  private static process_input_end(key: string) {
    if (this.pressed_keys.delete(key)) {
      switch (key) {
        case "w":
          this.listener?.on_end_up?.();
          break;
        case "a":
          this.listener?.on_end_left?.();
          break;
        case "s":
          this.listener?.on_end_down?.();
          break;
        case "d":
          this.listener?.on_end_right?.();
          break;
      }
    }
  }
}
