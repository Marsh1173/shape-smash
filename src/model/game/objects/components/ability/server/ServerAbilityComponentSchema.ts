import { AbilityDataType } from "../../../../abilities/model/AbilityType";

export type ServerAbilityComponentMessageContent = ServerAbilityComponentUpdateMessage;

export interface ServerAbilityComponentMessage {
  type: "ServerAbilityComponentMessage";
  msg: ServerAbilityComponentMessageContent;
}

export interface ServerAbilityComponentUpdateMessage {
  type: "ServerAbilityComponentUpdateMessage";
  data: AbilityDataType | undefined;
}
