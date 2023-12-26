import { EventTypeEnum } from '@nmxjs/config';
import { IEventsClient } from './IEventsClient';

export interface IEventsStrategy {
  type: EventTypeEnum;
  createClient(): Promise<IEventsClient>;
}
