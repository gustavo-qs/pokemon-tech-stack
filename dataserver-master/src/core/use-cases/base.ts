export interface IBaseUseCase<Input, Result> {
  execute(input: Input): Promise<Result>;
}
