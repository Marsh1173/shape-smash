import { ServerMessage } from "../schema/ServerMessage";
import { HasId } from "../../../model/utils/Id";
import { WebSocket } from "ws";
import { ClientMessage } from "../../../client/network/schema/ClientMessage";
import { ServerConfig } from "../../../tools/server/server-config";
import { User } from "./User";

export class WebsocketWrapper extends HasId {
  protected user: User | undefined = undefined;

  constructor(protected readonly ws: WebSocket) {
    super();
    if (ServerConfig.get().log_ws_connections) {
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
    if (ServerConfig.get().log_ws_connections) {
      console.log("Disconnected from " + this.id);
    }
    this.user?.on_close();
  }

  /* Listener */
  public set_user(listener: User) {
    this.user = listener;
  }

  public clear_user() {
    this.user = undefined;
  }

  /* Message sending / receiving */
  protected receive_message(msg: string) {
    this.user?.receive_message(JSON.parse(msg) as ClientMessage);
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
