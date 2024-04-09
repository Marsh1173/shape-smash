export interface IClientConfig {
  port: number;
  ws_url: () => string;
  is_development: boolean;
  refresh_on_ws_close: boolean;
}

const PRODUCTION_CLIENT_CONFIG: IClientConfig = {
  port: 3002,
  ws_url: () => {
    return `wss://${location.host}:${PRODUCTION_CLIENT_CONFIG.port}`;
  },
  is_development: false,
  refresh_on_ws_close: false,
};

const DEVELOPMENT_CLIENT_CONFIG: IClientConfig = {
  ...PRODUCTION_CLIENT_CONFIG,
  port: 3000,
  ws_url: () => {
    return `ws://${location.host}`;
  },
  is_development: true,
  refresh_on_ws_close: true,
};

type ClientConfigMode = "production" | "development";

export class ClientConfig {
  protected static mode: ClientConfigMode = "production";
  protected static config_record: Record<ClientConfigMode, IClientConfig> = {
    production: PRODUCTION_CLIENT_CONFIG,
    development: DEVELOPMENT_CLIENT_CONFIG,
  };

  public static set(mode: ClientConfigMode) {
    ClientConfig.mode = mode;
  }

  public static get(): IClientConfig {
    return ClientConfig.config_record[ClientConfig.mode];
  }
}
