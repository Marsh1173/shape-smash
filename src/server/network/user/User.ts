import { ServerMessage } from "../schema/ServerMessage";
import { Id } from "../../../model/utils/Id";
import { WebsocketWrapper } from "./WebsocketWrapper";
import { ClientMessage } from "../../../client/network/schema/ClientMessage";

export abstract class User {
  public get id(): Id {
    return this.ws_wrapper.id;
  }

  constructor(protected readonly ws_wrapper: WebsocketWrapper) {
    this.ws_wrapper.set_user(this);
  }

  public abstract on_close(): void;
  public abstract receive_message(msg: ClientMessage): void;

  public send_message(msg: ServerMessage) {
    if (!this._deconstructed) {
      this.ws_wrapper.send(msg);
    } else {
      throw new Error("Tried to send a message to a deconstructed user " + this.id);
    }
  }

  /* DECONSTRUCTION */
  protected _deconstructed: boolean = false;
  public get deconstructed(): boolean {
    return this._deconstructed;
  }

  public deconstruct(): WebsocketWrapper {
    if (!this._deconstructed) {
      this._deconstructed = true;
      this.ws_wrapper.clear_user();
      return this.ws_wrapper;
    } else {
      throw new Error("User " + this.id + " already deconstructed");
    }
  }
}
