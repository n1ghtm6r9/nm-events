declare module '@nmxjs/config' {
  enum EventTypeEnum {
    NATS = 'nats',
  }
  interface IConfig {
    event?: {
      type: EventTypeEnum;
      servers: Array<{
        host?: string;
        port?: number;
      }>;
      username?: string;
      password?: string;
    };
  }
  const configKey: string;
}
