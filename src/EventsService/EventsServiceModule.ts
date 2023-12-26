import { Module } from '@nestjs/common';
import { EventsClientModule } from '../EventsClient';
import { IEventsServiceFactory } from './interfaces';
import { eventsServiceFactoryKey } from './constants';
import * as Services from './services';

@Module({
  imports: [EventsClientModule],
  providers: [
    ...Object.values(Services),
    {
      provide: eventsServiceFactoryKey,
      useFactory: (createEventsService: Services.CreateEventsService): IEventsServiceFactory => ({
        create: createEventsService.call.bind(createEventsService),
      }),
      inject: [Services.CreateEventsService],
    },
  ],
  exports: [eventsServiceFactoryKey],
})
export class EventsServiceModule {}
