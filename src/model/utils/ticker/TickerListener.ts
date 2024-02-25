import { HasId } from "../Id";

export interface TickerListener extends HasId {
  update(elapsed_seconds: number): void;
}
