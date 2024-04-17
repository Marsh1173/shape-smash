export interface ServerHealthComponentMessage {
  type: "ServerHealthComponentMessage";
  msg:
    | ServerHealthComponentTakeHealMessage
    | ServerHealthComponentTakeDamageMessage
    | ServerHealthComponentUpdateMaxHealthMessage
    | ServerHealthComponentDieMessage;
}

export interface ServerHealthComponentTakeHealMessage {
  type: "ServerHealthComponentTakeHealMessage";
  amount: number;
  old_health: number;
  new_health: number;
}
export interface ServerHealthComponentTakeDamageMessage {
  type: "ServerHealthComponentTakeDamageMessage";
  amount: number;
  old_health: number;
  new_health: number;
}

export interface ServerHealthComponentUpdateMaxHealthMessage {
  type: "ServerHealthComponentUpdateMaxHealthMessage";
  new_value: number;
}

export interface ServerHealthComponentDieMessage {
  type: "ServerHealthComponentDieMessage";
}
