import { Id } from "../Id";
import { TickerListener } from "./TickerListener";

export class ServerTicker {
  private static interval_id?: NodeJS.Timeout;
  private static readonly MS_PER_FRAME = 1000 / 60;

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

  private static start() {
    this.last_timestamp = Date.now();

    this.interval_id = setInterval(() => {
      this.loop();
    }, this.MS_PER_FRAME);
  }

  private static stop() {
    if (this.interval_id) {
      clearInterval(this.interval_id);
    }
  }

  private static last_timestamp: number = 0;
  private static loop() {
    const now = Date.now();

    const elapsed_seconds = (now - this.last_timestamp) / 1000;
    this.last_timestamp = now;

    this.listeners.forEach((listener) => listener.update(elapsed_seconds));
  }
}
