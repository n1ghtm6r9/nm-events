import { eventsKey } from './constants';
import { DynamicModule } from '@nestjs/common';
import { IEventsCoreModuleOptions } from './interfaces';

export class ApiRouteCoreModule {
  public static forRoot({ imports, eventsFactory, servicesKeys }: IEventsCoreModuleOptions): DynamicModule {
    return {
      global: true,
      imports,
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
