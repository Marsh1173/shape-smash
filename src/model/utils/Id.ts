export type Id = string;

export interface HasId {
  readonly id: Id;
}

export abstract class HasId implements HasId {
  public readonly id: Id = uuid();
}

/**
 * @returns A virtually unique UUID string
 */
export const uuid: () => Id = () => {
  let dt = new Date().getTime();
  const randomize_char = (c: string) => {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  };

  return "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[x]/g, randomize_char);
};
