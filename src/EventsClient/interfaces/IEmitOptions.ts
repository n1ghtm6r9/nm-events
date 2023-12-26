export interface IEmitOptions<T extends object = object> {
  topic: string;
  data: T;
}
