export class PokemonLevelUpdate {
  constructor(
    public readonly id: string,
    public readonly pokemonId: string,
    public readonly level: number,
  ) {}
}
