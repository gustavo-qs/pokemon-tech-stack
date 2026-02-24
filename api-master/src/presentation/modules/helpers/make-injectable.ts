type Provider<T> = abstract new (...args: any[]) => T;
type InjectableClass<T> = new (...args: any[]) => T;

export function makeInjectable<C, P>(
  InjectableClass: InjectableClass<C>,
  providers: Provider<P>[] = [],
) {
  return {
    provide: InjectableClass,
    useFactory: (...providers: unknown[]) => new InjectableClass(...providers),
    inject: providers,
  };
}
