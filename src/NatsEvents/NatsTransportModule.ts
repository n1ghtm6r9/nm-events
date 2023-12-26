import { Module } from '@nestjs/common';
import { natsEventsStrategyKey } from './constants';
import type { IEventsStrategy } from '../EventsClient';
import { EventTypeEnum } from '@nmxjs/config';
import * as Services from './services';

@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: natsEventsStrategyKey,
      useFactory: (createClientService: Services.CreateClientService): IEventsStrategy => ({
        type: EventTypeEnum.NATS,
        createClient: createClientService.call.bind(createClientService),
      }),
      inject: [Services.CreateClientService],
    },
  ],
  exports: [natsEventsStrategyKey],
})
export class NatsTransportModule {}
