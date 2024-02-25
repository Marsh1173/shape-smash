import { Container, DisplayObject, Renderer } from "pixi.js";
import { ClientObjectFactory } from "../factory/ClientObjectFactory";
import { GameData, GameSystem } from "./GameSystem";
import { Camera } from "../display/Camera";
import { ClientPlayer } from "../objects/player/ClientPlayer";
import { ClientPlayerData } from "../objects/player/ClientPlayer";
import { ServerTalker } from "../../../client/network/ServerTalker";
import { ServerGameMessage, ServerMessage } from "../../../client/network/schema/ServerMessage";

export interface ClientGameData extends GameData {
  main_player_data: ClientPlayerData;
}

export class ClientGameSystem extends GameSystem {
  protected readonly object_factory: ClientObjectFactory;
  protected readonly pixijs_main_stage: Container<DisplayObject>;
  protected readonly renderer: Renderer;
  protected readonly camera: Camera;

  protected readonly main_player: ClientPlayer;

  constructor(data: ClientGameData, canvas: HTMLCanvasElement, public readonly server_talker: ServerTalker) {
    super(data);

    this.renderer = new Renderer({
      width: Camera.standard_viewport_size.w,
      height: Camera.standard_viewport_size.h,
      backgroundAlpha: 0,
      view: canvas,
    });
    this.pixijs_main_stage = new Container();
    this.pixijs_main_stage.interactiveChildren = false;

    this.object_factory = new ClientObjectFactory(this.rapier_world, this, this.pixijs_main_stage);
    this.main_player = this.object_factory.player(data.main_player_data);
    this.camera = new Camera(this.pixijs_main_stage, this.main_player.get_shapelet());

    this.server_talker.set_listener({
      receive_message: (msg: ServerMessage) => {
        if (msg.type === "ServerGameMessage") {
          this.receive_msg(msg);
        }
      },
    });

    this.populate_objects(data);
  }

  public update(elapsed_seconds: number): void {
    this.main_player.update(elapsed_seconds);

    super.update(elapsed_seconds);

    // debug_shapes(world, pixijs_app);
    this.camera.update(elapsed_seconds);
    this.renderer.render(this.pixijs_main_stage);
  }

  public dispose() {
    this.main_player.destroy();
    super.dispose();
  }

  protected receive_msg(msg: ServerGameMessage) {
    switch (msg.msg.type) {
      case "UserJoinMessage":
        const new_shapelet = this.object_factory.shapelet(msg.msg.player_data.shapelet_data);
        this.shapelets.push(new_shapelet);
        break;
      case "UserLeaveMessage":
        const user_leave_message_id = msg.msg.id;
        const shapelet_index = this.shapelets.findIndex((shapelet) => shapelet.id === user_leave_message_id);
        if (shapelet_index !== -1) {
          this.shapelets[shapelet_index].destroy();
          this.shapelets.splice(shapelet_index, 1);
        }
        break;
      case "UserMoveMessage":
        const user_move_message_id = msg.msg.id;
        const shapelet = this.shapelets.find((p) => p.id === user_move_message_id);
        if (shapelet) {
          shapelet.controller.on_input(msg.msg.action, msg.msg.active);
          shapelet.body.set_pos_and_vel(msg.msg.pos, msg.msg.vel);
        }
        break;
    }
  }
}
