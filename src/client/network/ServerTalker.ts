import { ClientConfig } from "../utils/ClientConfig";
import { ServerMessage } from "../../server/network/schema/ServerMessage";
import { ClientMessage } from "./schema/ClientMessage";

export interface ServerTalkerListener {
  receive_message(msg: ServerMessage): void;
}

export class ServerTalker {
  private wss: WebSocket;
  protected listener: ServerTalkerListener | undefined = undefined;

  constructor() {
    this.wss = this.open_websocket();
  }

  private open_websocket(): WebSocket {
    let wss: WebSocket = new WebSocket(ClientConfig.get().ws_url());

    wss.onclose = (ev: CloseEvent) => {
      this.on_unable_to_connect();
    };

    wss.onopen = () => {
      console.log("Websocket connection succeeded");

      wss.onclose = (ev: CloseEvent) => {
        this.on_close();
      };

      wss.onerror = (error) => {
        console.error("WebSocket error:");
        console.error(error);
      };

      wss.onmessage = (msg: MessageEvent) => {
        try {
          this.receive_message(msg.data);
        } catch (err) {
          console.error(err);
        }
      };
      wss.onopen = () => {};
    };

    return wss;
  }

  public force_close() {
    this.wss.close();
  }

  private on_close() {
    console.error("Websocket connection closed");
    this.wss.onerror = () => {};
    if (ClientConfig.get().refresh_on_ws_close) {
      location.reload();
    }
  }

  private on_unable_to_connect() {
    console.error("Could not connect");
  }

  /* Listener */
  public set_listener(listener: ServerTalkerListener) {
    this.listener = listener;
  }

  public clear_listener() {
    this.listener = undefined;
  }

  /* MESSAGE SENDING */
  public send(msg: ClientMessage) {
    if (this.wss.readyState === this.wss.OPEN) {
      this.wss.send(JSON.stringify(msg));
    } else {
      console.error("ERROR: TRIED TO SEND TO A CLOSED WEBSOCKET");
    }
  }

  protected receive_message(msg: string) {
    this.listener?.receive_message(JSON.parse(msg) as ServerMessage);
  }
}
