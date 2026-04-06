import { Module } from '@nestjs/common';
import { EventTypeEnum } from '@nmxjs/config';
import { natsJetStreamEventsStrategyKey } from './constants';
import type { IEventsStrategy } from '../EventsClient';
import * as Services from './services';

@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: natsJetStreamEventsStrategyKey,
      useFactory: (service: Services.CreateNatsJetStreamClientService): IEventsStrategy => ({
        type: EventTypeEnum.NATS_JETSTREAM,
        createClient: service.call.bind(service),
      }),
      inject: [Services.CreateNatsJetStreamClientService],
    },
  ],
  exports: [natsJetStreamEventsStrategyKey],
})
export class NatsJetStreamTransportModule {}
