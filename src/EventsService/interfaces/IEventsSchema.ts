export type IEventsSchema = Record<
  string,
  {
    name: string;
    payload: object;
  }
>;
