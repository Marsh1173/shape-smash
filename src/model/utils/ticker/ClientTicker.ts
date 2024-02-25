import { Id } from "../Id";
import { TickerListener } from "./TickerListener";

export class ClientTicker {
  private constructor() {}

  private static listeners: Map<Id, TickerListener> = new Map();

  public static add(listener: TickerListener) {
    if (this.listeners.size === 0) {
      this.start();
    }
    this.listeners.set(listener.id, listener);
  }

  public static remove(id: Id) {
    this.listeners.delete(id);
    if (this.listeners.size === 0) {
      this.stop();
    }
  }

  private static going: boolean = false;
  private static start() {
    this.going = true;

    this.last_timestamp = Date.now();
    window.requestAnimationFrame(() => this.loop());
  }

  private static stop() {
    this.going = false;
  }

  private static last_timestamp: number = 0;
  private static loop() {
    if (!this.going) return;

    const now = Date.now();

    const elapsed_seconds = (now - this.last_timestamp) / 1000;
    this.last_timestamp = now;

    this.listeners.forEach((listener) => listener.update(elapsed_seconds));
    window.requestAnimationFrame(() => this.loop());
  }
}
