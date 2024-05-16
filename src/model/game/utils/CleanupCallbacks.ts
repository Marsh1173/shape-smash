export class CleanupCallbacks {
  protected callbacks: (() => void)[] = [];

  public add(callback: () => void) {
    this.callbacks.push(callback);
  }

  public cleanup() {
    for (const callback of this.callbacks) {
      callback();
    }
    this.callbacks = [];
  }
}
