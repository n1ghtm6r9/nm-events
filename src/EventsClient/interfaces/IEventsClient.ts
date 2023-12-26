import { IEmitOptions } from './IEmitOptions';

export interface IEventsClient {
  emit(options: IEmitOptions): Promise<void>;
  close(): Promise<void>;
}
