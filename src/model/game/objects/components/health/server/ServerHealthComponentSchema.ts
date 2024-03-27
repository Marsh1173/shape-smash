export interface ServerHealthComponentMessage {
  type: "ServerHealthComponentMessage";
  msg: ServerHealthComponentUpdateCurrentHealthMessage | ServerHealthComponentUpdateMaxHealthMessage;
}

export interface ServerHealthComponentUpdateCurrentHealthMessage {
  type: "ServerHealthComponentUpdateCurrentHealthMessage";
  new_value: number;
}

export interface ServerHealthComponentUpdateMaxHealthMessage {
  type: "ServerHealthComponentUpdateMaxHealthMessage";
  new_value: number;
}
