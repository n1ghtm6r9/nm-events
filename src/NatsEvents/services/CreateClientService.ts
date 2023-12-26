import { lastValueFrom } from 'rxjs';
import { ClientProxyFactory, Transport, NatsOptions } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { configKey, IConfig } from '@nmxjs/config';
import type { IEventsClient } from '../../EventsClient';

@Injectable()
export class CreateClientService {
  constructor(@Inject(configKey) protected readonly config: IConfig) {}

  public async call(): Promise<IEventsClient> {
    const natsOptions: NatsOptions = {
      transport: Transport.NATS,
      options: {
        servers: this.config.event.servers.map(v => `nats://${v.host || '127.0.0.1'}:${v.port || 4222}`),
        ...(this.config.event.username ? { user: this.config.event.username } : {}),
        ...(this.config.event.password ? { pass: this.config.event.password } : {}),
      },
    };

    const natsClient = ClientProxyFactory.create(natsOptions);
    await natsClient.connect();

    return {
      options: natsOptions,
      emit: async options => {
        await lastValueFrom(natsClient.emit(options.topic, options.data));
      },
      close: async () => {
        await natsClient.close();
      },
    };
  }
}
