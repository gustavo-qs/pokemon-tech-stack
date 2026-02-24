export abstract class GreetingRepository {
  abstract SayHello(name: string): Promise<{ message: string }>;
}
