export interface ServerHealthComponentMessage {
  type: "ServerHealthComponentMessage";
  msg:
    | ServerHealthComponentUpdateCurrentHealthMessage
    | ServerHealthComponentUpdateMaxHealthMessage
    | ServerHealthComponentDieMessage;
}

export interface ServerHealthComponentUpdateCurrentHealthMessage {
  type: "ServerHealthComponentUpdateCurrentHealthMessage";
  new_value: number;
}

export interface ServerHealthComponentUpdateMaxHealthMessage {
  type: "ServerHealthComponentUpdateMaxHealthMessage";
  new_value: number;
}

export interface ServerHealthComponentDieMessage {
  type: "ServerHealthComponentDieMessage";
}
