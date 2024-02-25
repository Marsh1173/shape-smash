import { ServerMessage } from "../../../client/network/schema/ServerMessage";
import { Id } from "../../../model/utils/Id";
import { User } from "./User";
import { ClientMessage } from "../schema/ClientMessage";

export abstract class UserListener {
  public get id(): Id {
    return this.user.id;
  }

  constructor(protected readonly user: User) {
    this.user.set_listener(this);
  }

  public abstract on_close(): void;
  public abstract receive_message(msg: ClientMessage): void;

  public send_message(msg: ServerMessage) {
    if (!this._deconstructed) {
      this.user.send(msg);
    } else {
      throw new Error("Tried to send a message to a deconstructed user listener " + this.id);
    }
  }

  /* DECONSTRUCTION */
  protected _deconstructed: boolean = false;
  public get deconstructed(): boolean {
    return this._deconstructed;
  }

  public deconstruct(): User {
    if (!this._deconstructed) {
      this._deconstructed = true;
      this.user.clear_listener();
      return this.user;
    } else {
      throw new Error("User " + this.id + " already deconstructed");
    }
  }
}
