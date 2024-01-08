import * as objHash from 'object-hash';
import { lastValueFrom } from 'rxjs';
import { ClientProxyFactory, Transport, NatsOptions, ClientNats } from '@nestjs/microservices';
import { Inject, Injectable } from '@nestjs/common';
import { configKey, IConfig } from '@nmxjs/config';
import type { IEventsClient } from '../../EventsClient';

@Injectable()
export class CreateClientService {
  protected readonly clients = new Map<string, ClientNats>();

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

    const key = objHash(natsOptions);
    let client = this.clients.get(key);

    if (!client) {
      client = ClientProxyFactory.create(natsOptions) as ClientNats;
      this.clients.set(key, client);
      await client.connect();
    }

    return {
      options: natsOptions,
      emit: async options => {
        await lastValueFrom(client.emit(options.topic, options.data));
      },
      close: async () => {
        await client.close();
      },
    };
  }
}
