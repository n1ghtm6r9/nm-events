import { Inject, Injectable } from '@nestjs/common';
import { ICreateEventsServiceOptions } from '../interfaces';
import { eventsClientKey, IEventsClient } from '../../EventsClient';

@Injectable()
export class CreateEventsService {
  constructor(@Inject(eventsClientKey) protected readonly eventsClient: IEventsClient) {}

  public call = ({ schema }: ICreateEventsServiceOptions) =>
    Object.keys(schema).reduce((service, methodName) => {
      service[methodName] = data =>
        this.eventsClient.emit({
          topic: schema[methodName].name,
          data,
        });
      return service;
    }, {});
}
