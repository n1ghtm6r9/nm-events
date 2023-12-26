import { IEventsSchema } from './IEventsSchema';
import { IEventsService } from './IEventsService';
import { ICreateEventsServiceOptions } from './ICreateEventsServiceOptions';

export interface IEventsServiceFactory<T extends IEventsSchema = any> {
  create(options: ICreateEventsServiceOptions): IEventsService<T>;
}
