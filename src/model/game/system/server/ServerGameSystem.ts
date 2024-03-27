import { GameData, GameSystem } from "../GameSystem";
import { ServerObjectFactory } from "../../factory/ServerObjectFactory";
import { GameUser } from "./GameUser";
import { Id } from "../../../utils/Id";
import { ShapeletData } from "../../objects/shapelet/Shapelet";
import { ClientPlayerData } from "../client/ClientPlayer";
import { ShapeletSpriteDataGenerator } from "../../objects/shapelet/sprite/ShapeletAssets";
import { WebsocketWrapper } from "../../../../server/network/user/WebsocketWrapper";
import { GameServerRoom } from "./GameServerRoom";
import { ServerObjectContainer } from "../../objectcontainer/ServerObjectContainer";

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

  public add_user(ws_wrapper: WebsocketWrapper) {
    const shapelet_data: ShapeletData = {
      type: "ShapeletData",
      id: ws_wrapper.id,
      body_data: {
        pos: { x: 8, y: 5 },
      },
      controller_data: {},
      sprite_data: ShapeletSpriteDataGenerator.generate(),
      health_data: {},
    };
    const player_data: ClientPlayerData = {
      shapelet_data,
    };
    const server_player = this.object_factory.shapelet(shapelet_data);

    const game_user_listener = new GameUser(ws_wrapper, this);
    this.server_room.add_user(
      game_user_listener,
      { ...this.get_game_data(ws_wrapper.id), main_player_data: player_data },
      player_data
    );
  }

  public remove_user(id: Id) {
    this.server_room.remove_user(id, id);
    this.object_container.remove_object(id);
  }

  public get_game_data(exclude_shapelet_id: Id): GameData {
    const shapelet_datas = [...this.object_container.shapelets]
      .filter(([id, shapelet]) => id !== exclude_shapelet_id)
      .map(([id, shapelet]) => shapelet.serialize());
    return {
      shapelets: shapelet_datas,
      platforms: [...this.object_container.platforms].map(([id, platform]) => platform.serialize()),
    };
  }
}
