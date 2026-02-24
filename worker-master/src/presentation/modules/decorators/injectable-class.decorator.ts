import { ExistingProvider, Injectable as LibInjectable } from '@nestjs/common';

export function InjectableClass<T>(customToken?: T): ClassDecorator {
  return function (target: any): any {
    LibInjectable()(target);

    target.asProvider = [target];

    if (customToken) {
      target.asProvider.push({
        provide: customToken,
        useExisting: target,
      } as ExistingProvider);
    }

    return target;
  };
}

export type InjectableClassType<T> = T & {
  asProvider: [ExistingProvider];
};
