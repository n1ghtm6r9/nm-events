import { IEmitOptions } from './IEmitOptions';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export interface IEventsClient {
  options: MicroserviceOptions & { transport: Transport };
  emit(options: IEmitOptions): Promise<void>;
  close(): Promise<void>;
}
