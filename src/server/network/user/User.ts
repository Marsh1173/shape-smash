import { ServerMessage } from "../../../client/network/schema/ServerMessage";
import { HasId } from "../../../model/utils/Id";
import { WebSocket } from "ws";
import { ClientMessage } from "../schema/ClientMessage";
import { ServerConfig } from "../../../tools/server/server-config";
import { UserListener } from "./UserListener";

export class User extends HasId {
  protected listener: UserListener | undefined = undefined;

  constructor(protected readonly ws: WebSocket) {
    super();
    if (ServerConfig.get().log_user_connections) {
      console.log("Connected to " + this.id);
    }

    ws.on("message", (msg: string) => {
      this.receive_message(msg);
    });

    ws.on("close", () => {
      this.on_close();
    });
  }

  protected on_close() {
    if (ServerConfig.get().log_user_connections) {
      console.log("Disconnected from " + this.id);
    }
    this.listener?.on_close();
  }

  /* Listener */
  public set_listener(listener: UserListener) {
    this.listener = listener;
  }

  public clear_listener() {
    this.listener = undefined;
  }

  /* Message sending / receiving */
  protected receive_message(msg: string) {
    this.listener?.receive_message(JSON.parse(msg) as ClientMessage);
  }

  public send(data: ServerMessage) {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.log("ERROR: TRIED TO SEND TO A CLOSED WEBSOCKET");
      console.log("Message:");
      console.log(data.toString());
    }
  }
}
