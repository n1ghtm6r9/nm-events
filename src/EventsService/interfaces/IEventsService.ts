import { IEventsSchema } from './IEventsSchema';

export type IEventsService<T extends IEventsSchema> = {
  // @ts-ignore
  [key in keyof T]: (data: T[key]['payload']['prototype']) => Promise<void>;
};
