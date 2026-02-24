export abstract class IBaseUseCase<Input, Result> {
  abstract execute(input: Input): Promise<Result>;
}
