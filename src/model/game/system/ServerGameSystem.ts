import { GameData, GameSystem } from "./GameSystem";
import { ServerObjectFactory } from "../factory/ServerObjectFactory";
import { GameUserListener } from "../../../server/network/user/GameUserListener";
import { ServerMessage } from "../../../client/network/schema/ServerMessage";
import { Id } from "../../utils/Id";
import { User } from "../../../server/network/user/User";
import { ClientGameMessage } from "../../../server/network/schema/ClientMessage";
import { ShapeletData } from "../objects/shapelet/Shapelet";
import { ClientPlayerData } from "../objects/player/ClientPlayer";
import { ShapeletSpriteDataGenerator } from "../objects/shapelet/sprite/ShapeletAssets";

export interface ServerGameData extends GameData {}

export class ServerGameSystem extends GameSystem {
  protected readonly object_factory: ServerObjectFactory;
  public readonly user_listeners: GameUserListener[] = [];

  constructor(data: ServerGameData) {
    super(data);

    this.object_factory = new ServerObjectFactory(this.rapier_world, this);
    this.populate_objects(data);
  }

  public update(elapsed_seconds: number): void {
    super.update(elapsed_seconds);
  }

  public broadcast_message(msg: ServerMessage, exclude_id: Id | undefined = undefined) {
    for (const listener of this.user_listeners) {
      if (listener.id !== exclude_id) {
        listener.send_message(msg);
      }
    }
  }

  public add_user(user: User) {
    const shapelet_data: ShapeletData = {
      id: user.id,
      body_data: {
        pos: { x: 8, y: 5 },
      },
      controller_data: {},
      sprite_data: ShapeletSpriteDataGenerator.generate(),
    };
    const player_data: ClientPlayerData = {
      shapelet_data,
    };
    const server_player = this.object_factory.shapelet(shapelet_data);

    const game_user_listener = new GameUserListener(user, this);
    game_user_listener.send_message({
      type: "GameDataMessage",
      data: { ...this.get_game_data(), main_player_data: player_data },
    });
    this.broadcast_message({
      type: "ServerGameMessage",
      msg: {
        type: "UserJoinMessage",
        player_data,
      },
    });

    this.shapelets.push(server_player);
    this.user_listeners.push(game_user_listener);
  }

  public remove_user(id: Id) {
    const shapelet_index = this.shapelets.findIndex((shapelet) => shapelet.id === id);
    if (shapelet_index !== -1) {
      this.shapelets[shapelet_index].destroy();
      this.shapelets.splice(shapelet_index, 1);
    }

    const listener_index = this.user_listeners.findIndex((listener) => listener.id === id);
    if (listener_index !== -1) {
      this.user_listeners.splice(listener_index, 1);
    }

    this.broadcast_message({
      type: "ServerGameMessage",
      msg: {
        type: "UserLeaveMessage",
        id,
      },
    });
  }

  public get_game_data(): GameData {
    return {
      shapelets: this.shapelets.map((shapelet) => shapelet.serialize()),
      platforms: this.platforms.map((platform) => platform.get_data()),
    };
  }

  public receive_message(msg: ClientGameMessage, id: Id) {
    switch (msg.msg.type) {
      case "PlayerMoveMessage":
        const shapelet = this.shapelets.find((s) => s.id === id);
        if (shapelet) {
          shapelet.controller.on_input(msg.msg.action, msg.msg.active);
          shapelet.body.set_pos_and_vel(msg.msg.pos, msg.msg.vel);

          this.broadcast_message(
            {
              type: "ServerGameMessage",
              msg: {
                ...msg.msg,
                type: "UserMoveMessage",
                id,
              },
            },
            id
          );
        }
        break;
    }
  }
}
