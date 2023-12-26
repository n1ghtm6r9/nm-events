import { ModuleMetadata } from '@nestjs/common';

export interface IEventsCoreModuleOptions extends Required<Pick<ModuleMetadata, 'imports'>> {
  servicesKeys: Array<string | symbol>;
  eventsFactory(...any): object;
}
