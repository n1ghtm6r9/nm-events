declare module '@nestjs/common' {
  function Global();
  function Injectable();
  function Inject(params: any);
  function Module(params: any);
  type DynamicModule = any;
  type ModuleMetadata = any;
  type OnApplicationShutdown = any;
}

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
