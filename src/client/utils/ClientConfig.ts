export interface IClientConfig {
  port: number;
  ws_url: () => string;
  is_development: boolean;
}

const PRODUCTION_CLIENT_CONFIG: IClientConfig = {
  port: 3002,
  ws_url: () => {
    return `wss://${location.host}:${PRODUCTION_CLIENT_CONFIG.port}`;
  },
  is_development: false,
};

const DEVELOPMENT_CLIENT_CONFIG: IClientConfig = {
  ...PRODUCTION_CLIENT_CONFIG,
  port: 3000,
  ws_url: () => {
    return `ws://${location.host}`;
  },
  is_development: true,
};

type ClientConfigMode = "production" | "development";

export class ClientConfig {
  protected static mode: ClientConfigMode = "development";
  protected static config_record: Record<ClientConfigMode, IClientConfig> = {
    production: PRODUCTION_CLIENT_CONFIG,
    development: DEVELOPMENT_CLIENT_CONFIG,
  };

  public static set(mode: ClientConfigMode) {
    this.mode = mode;
  }

  public static get(): IClientConfig {
    return this.config_record[this.mode];
  }
}
