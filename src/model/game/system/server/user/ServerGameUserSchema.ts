import { Id } from "../../../../utils/Id";

export type ServerGameUserMessageContent = UserJoinMessage | UserLeaveMessage | UserStateUpdateMessage;

export interface ServerGameUserMessage {
  type: "ServerGameUserMessage";
  msg: ServerGameUserMessageContent;
}

export interface UserJoinMessage {
  type: "UserJoinMessage";
}

export interface UserLeaveMessage {
  type: "UserLeaveMessage";
}

/* State change */
export interface UserStateUpdateMessage {
  type: "UserStateUpdateMessage";
  msg: UserStateDieMessage | UserStateAliveMessage;
}
export interface UserStateDieMessage {
  type: "UserStateDieMessage";
}
export interface UserStateAliveMessage {
  type: "UserStateAliveMessage";
  shapelet_id: Id;
}
