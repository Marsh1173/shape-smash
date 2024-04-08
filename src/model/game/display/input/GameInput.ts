import { Vector } from "@dimforge/rapier2d-compat";
import { ClientGameSystem } from "../../system/client/ClientGameSystem";

export class GameInput {
  private readonly pressed_keys: Set<string> = new Set();

  /**
   * [Identifier, active]
   */
  private unprocessed_keys: [string, boolean][] = [];

  private readonly mouse_page_pos: Vector = { x: 0, y: 0 };
  private readonly _mouse_pos: Vector = { x: 0, y: 0 };
  public get mouse_pos(): Readonly<Vector> {
    return this._mouse_pos;
  }

  constructor(protected readonly game_system: ClientGameSystem) {
    window.onkeydown = (e) => this.receive_input_start(e.key.toLowerCase());
    window.onkeyup = (e) => this.receive_input_end(e.key.toLowerCase());

    window.onmousedown = (e) => this.receive_input_start("mouse-" + e.button);
    window.onmouseup = (e) => this.receive_input_end("mouse-" + e.button);
    window.onmousemove = (e) => {
      this.mouse_page_pos.x = e.pageX;
      this.mouse_page_pos.y = e.pageY;
    };

    window.oncontextmenu = (ev) => {
      // stop right click from opening context menu
      ev.preventDefault();
    };
  }

  public update() {
    const world_pos = this.game_system.display.camera.get_world_pos_from_screen_pos(this.mouse_page_pos);
    this._mouse_pos.x = world_pos.x;
    this._mouse_pos.y = world_pos.y;

    for (const [key, active] of this.unprocessed_keys) {
      this.game_system.player_state.route_input(key, active);
    }

    this.unprocessed_keys = [];
  }

  private receive_input_start(key: string) {
    if (this.pressed_keys.has(key)) {
      return;
    } else {
      this.pressed_keys.add(key);
      this.unprocessed_keys.push([key, true]);
    }
  }

  private receive_input_end(key: string) {
    if (this.pressed_keys.delete(key)) {
      this.unprocessed_keys.push([key, false]);
    }
  }

  public cleanup() {
    window.onkeydown = () => {};
    window.onkeyup = () => {};
    window.oncontextmenu = () => {};
    window.onmousedown = () => {};
    window.onmouseup = () => {};
    window.onmousemove = () => {};
  }
}
