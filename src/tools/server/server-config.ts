export interface IServerConfig {
  port: number;
  is_development: boolean;
  user_timeout_limit?: number;
  subdomain: string;
  log_user_connections: boolean;
}

const PROD_SERVER_CONFIG: IServerConfig = {
  port: 3002,
  is_development: false,
  user_timeout_limit: 300, // 5 minutes
  subdomain: "shape-smash",
  log_user_connections: true,
};

const DEV_SERVER_CONFIG: IServerConfig = {
  ...PROD_SERVER_CONFIG,
  port: 3000,
  user_timeout_limit: undefined, // no timeout limit
  is_development: true,
  log_user_connections: false,
};

type ServerConfigMode = "production" | "development";

export class ServerConfig {
  protected static mode: ServerConfigMode = "development";
  protected static config_record: Record<ServerConfigMode, IServerConfig> = {
    development: DEV_SERVER_CONFIG,
    production: PROD_SERVER_CONFIG,
  };

  public static set(mode: ServerConfigMode) {
    this.mode = mode;
  }

  public static get(): IServerConfig {
    return this.config_record[this.mode];
  }

  private constructor() {}
}
