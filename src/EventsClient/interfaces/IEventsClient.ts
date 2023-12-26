import { IEmitOptions } from './IEmitOptions';
import { MicroserviceOptions, CustomStrategy } from '@nestjs/microservices';

export interface IEventsClient {
  options: Exclude<MicroserviceOptions, CustomStrategy>;
  emit(options: IEmitOptions): Promise<void>;
  close(): Promise<void>;
}
