export function makeInjectable(
  token: string,
  InjectableClass: any,
  providersToken: string[] = [],
) {
  return {
    provide: token,
    useFactory: (...providers: unknown[]) => new InjectableClass(...providers),
    inject: [...providersToken],
  };
}
