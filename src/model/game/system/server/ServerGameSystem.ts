import { GameData, GameSystem } from "../GameSystem";
import { ServerObjectFactory } from "../../factory/ServerObjectFactory";
import { GameUser } from "./user/GameUser";
import { uuid } from "../../../utils/Id";
import { ShapeletSpriteDataGenerator } from "../../objects/shapelet/client/sprite/ShapeletAssets";
import { WebsocketWrapper } from "../../../../server/network/user/WebsocketWrapper";
import { GameServerRoom } from "./GameServerRoom";
import { ServerObjectContainer } from "../../objectcontainer/ServerObjectContainer";
import { ShapeletData } from "../../objects/shapelet/ShapeletSchema";

export interface ServerGameData extends GameData {}

export class ServerGameSystem extends GameSystem {
  public readonly object_factory: ServerObjectFactory;
  public readonly object_container: ServerObjectContainer;
  public readonly server_room: GameServerRoom;

  constructor(data: ServerGameData) {
    super(data);

    this.server_room = new GameServerRoom(this);
    this.object_factory = new ServerObjectFactory(this);
    this.object_container = new ServerObjectContainer(this);

    this.populate_objects(data);
  }

  public update(elapsed_seconds: number): void {
    this.server_room.update(elapsed_seconds);
    super.update(elapsed_seconds);
  }

  public add_user(ws_wrapper: WebsocketWrapper) {
    const shapelet_data: ShapeletData = {
      type: "ShapeletData",
      id: uuid(),
      body_data: {
        pos: { x: 8, y: -10 },
      },
      controller_data: {},
      sprite_data: ShapeletSpriteDataGenerator.generate(),
      health_data: {},
    };

    const game_user = new GameUser(ws_wrapper, this, shapelet_data);
    this.server_room.add_user(
      game_user,
      {
        ...this.get_game_data(),
        user_id: game_user.id,
        player_state: {
          type: "UserStateUpdateMessage",
          msg: { type: "UserStateAliveMessage", shapelet_id: shapelet_data.id },
        },
      },
      game_user.id
    );
  }

  public get_game_data(): GameData {
    return {
      shapelets: [...this.object_container.shapelets].map(([_, shapelet]) => shapelet.serialize()),
      platforms: [...this.object_container.platforms].map(([_, platform]) => platform.serialize()),
    };
  }
}
