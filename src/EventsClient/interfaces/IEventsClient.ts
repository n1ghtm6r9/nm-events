import { IEmitOptions } from './IEmitOptions';
import { MicroserviceOptions } from '@nestjs/microservices';

export interface IEventsClient {
  options: MicroserviceOptions;
  emit(options: IEmitOptions): Promise<void>;
  close(): Promise<void>;
}
