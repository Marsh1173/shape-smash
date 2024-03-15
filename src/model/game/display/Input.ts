import { Vector } from "@dimforge/rapier2d-compat";

export interface InputListener {
  on_start_up?: () => void;
  on_end_up?: () => void;
  on_start_down?: () => void;
  on_end_down?: () => void;
  on_start_left?: () => void;
  on_end_left?: () => void;
  on_start_right?: () => void;
  on_end_right?: () => void;
  on_start_primary_action?: (screen_pos: Vector) => void;
  on_end_primary_action?: (screen_pos: Vector) => void;
  on_mouse_move?: (screen_pos: Vector) => void;
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
    window.onkeydown = (e) => this.process_input_start(e.key.toLowerCase());
    window.onkeyup = (e) => this.process_input_end(e.key.toLowerCase());

    window.oncontextmenu = (ev) => {
      // stop right click from opening context menu
      ev.preventDefault();
    };

    window.onmousedown = (e) => {
      this.listener?.on_start_primary_action?.({ x: e.pageX, y: e.pageY });
    };
    window.onmouseup = (e) => {
      this.listener?.on_end_primary_action?.({ x: e.pageX, y: e.pageY });
    };
    window.onmousemove = (e) => {
      this.listener?.on_mouse_move?.({ x: e.pageX, y: e.pageY });
    };
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
