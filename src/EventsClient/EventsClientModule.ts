import { NotFoundError } from '@nmxjs/errors';
import { configKey, IConfig } from '@nmxjs/config';
import { Inject, Global, Module, OnApplicationShutdown } from '@nestjs/common';
import { eventsClientKey } from './constants';
import { IEventsStrategy, IEventsClient } from './interfaces';
import { NatsTransportModule, natsEventsStrategyKey } from '../NatsEvents';
import { NatsJetStreamTransportModule, natsJetStreamEventsStrategyKey } from '../NatsJetStreamEvents';

@Global()
@Module({
  imports: [NatsTransportModule, NatsJetStreamTransportModule],
  providers: [
    {
      provide: eventsClientKey,
      useFactory: async (config: IConfig, ...strategies: IEventsStrategy[]): Promise<IEventsClient> => {
        const strategy = strategies.find(v => v.type === config.event.type);

        if (!strategy) {
          throw new NotFoundError({
            entityName: 'EventsStrategy',
            searchValue: config.event.type,
          });
        }

        return await strategy.createClient();
      },
      inject: [configKey, natsEventsStrategyKey, natsJetStreamEventsStrategyKey],
    },
  ],
  exports: [eventsClientKey],
})
export class EventsClientModule implements OnApplicationShutdown {
  constructor(@Inject(eventsClientKey) protected readonly eventsClient: IEventsClient) {}

  public async onApplicationShutdown() {
    await this.eventsClient.close();
  }
}
