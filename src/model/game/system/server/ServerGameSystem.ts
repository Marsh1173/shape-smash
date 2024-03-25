import { GameData, GameSystem } from "../GameSystem";
import { ServerObjectFactory } from "../../factory/ServerObjectFactory";
import { GameUser } from "./GameUser";
import { Id } from "../../../utils/Id";
import { ShapeletData } from "../../objects/shapelet/Shapelet";
import { ClientPlayerData } from "../../objects/player/ClientPlayer";
import { ShapeletSpriteDataGenerator } from "../../objects/shapelet/sprite/ShapeletAssets";
import { WebsocketWrapper } from "../../../../server/network/user/WebsocketWrapper";
import { GameServerRoom } from "./GameServerRoom";
import { ServerShapelet } from "../../objects/shapelet/server/ServerShapelet";

export interface ServerGameData extends GameData {}

export class ServerGameSystem extends GameSystem {
  declare readonly shapelets: ServerShapelet[];

  public readonly object_factory: ServerObjectFactory;
  public readonly server_room: GameServerRoom;

  constructor(data: ServerGameData) {
    super(data);

    this.server_room = new GameServerRoom(this);
    this.object_factory = new ServerObjectFactory(this);

    this.populate_objects(data);
  }

  public update(elapsed_seconds: number): void {
    super.update(elapsed_seconds);
  }

  public add_user(ws_wrapper: WebsocketWrapper) {
    const shapelet_data: ShapeletData = {
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
      { ...this.get_game_data(), main_player_data: player_data },
      player_data
    );

    this.shapelets.push(server_player);
  }

  public remove_user(id: Id) {
    const shapelet_index = this.shapelets.findIndex((shapelet) => shapelet.id === id);
    if (shapelet_index !== -1) {
      this.shapelets[shapelet_index].destroy();
      this.shapelets.splice(shapelet_index, 1);
    }

    this.server_room.remove_user(id, id);
  }

  public get_game_data(): GameData {
    return {
      shapelets: this.shapelets.map((shapelet) => shapelet.serialize()),
      platforms: this.platforms.map((platform) => platform.get_data()),
    };
  }
}
