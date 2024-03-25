export interface ServerHealthComponentMessage {
  type: "ServerHealthComponentMessage";
  msg: ServerHealthComponentUpdateCurrentHealthMessage;
}

export interface ServerHealthComponentUpdateCurrentHealthMessage {
  type: "ServerHealthComponentUpdateCurrentHealthMessage";
  new_value: number;
}
