import { ServerMessage } from "../../client/network/schema/ServerMessage";
import { Id } from "../../model/utils/Id";
import { User } from "./user/User";
import { WebsocketWrapper } from "./user/WebsocketWrapper";

export abstract class ServerRoom<UserType extends User, SessionJoinData, UserJoinData, UserLeaveData> {
  protected users: Map<Id, UserType> = new Map();

  /**
   * Broadcast to all remaining users in the room that a user has left
   */
  protected abstract broadcast_user_leave(data: UserLeaveData): void;

  public remove_user(id: Id, data: UserLeaveData): WebsocketWrapper | undefined {
    const user = this.users.get(id);
    if (user) {
      this.users.delete(id);
      const ws_wrapper = user.deconstruct();
      this.broadcast_user_leave(data);

      return ws_wrapper;
    } else {
      return undefined;
    }
  }

  /**
   * Send the new user the necessary data to join the room
   */
  protected abstract send_room_data_on_join(user: UserType, data: SessionJoinData): void;
  /**
   * Broadcast to all current users in the room that a user is joining
   */
  protected abstract broadcast_user_join(data: UserJoinData): void;

  public add_user(user: UserType, session_join_data: SessionJoinData, user_join_data: UserJoinData) {
    this.send_room_data_on_join(user, session_join_data);
    this.broadcast_user_join(user_join_data);
    this.users.set(user.id, user);
  }

  public broadcast(msg: ServerMessage, exclude_id: Id | undefined = undefined) {
    for (const user of this.users.values()) {
      if (user.id !== exclude_id) {
        user.send_message(msg);
      }
    }
  }

  public send_to_user(user_id: Id, msg: ServerMessage) {
    const user = this.users.get(user_id);
    if (user) {
      user.send_message(msg);
    } else {
      console.error("Could not find user " + user_id + " in server room.");
    }
  }
}
