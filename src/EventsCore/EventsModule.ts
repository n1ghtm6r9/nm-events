import { eventsKey } from './constants';
import { DynamicModule } from '@nestjs/common';
import { IEventsCoreModuleOptions } from './interfaces';
import { EventsClientModule } from '../EventsClient';

export class ApiRouteCoreModule {
  public static forRoot({ imports, eventsFactory, servicesKeys }: IEventsCoreModuleOptions): DynamicModule {
    return {
      global: true,
      imports: [...imports, EventsClientModule],
      module: ApiRouteCoreModule,
      providers: [
        {
          provide: eventsKey,
          useFactory: eventsFactory,
          inject: servicesKeys,
        },
      ],
      exports: [eventsKey],
    };
  }
}
