import { EventPattern } from '@nestjs/microservices';

export const EventPatterns =
  (patters: string[]): MethodDecorator =>
  (target: object, key: string | symbol, descriptor: PropertyDescriptor) =>
    patters.forEach(v => EventPattern(v)(target, key, descriptor));
