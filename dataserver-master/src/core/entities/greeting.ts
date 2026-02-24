export class Greeting {
  constructor(public readonly name: string) {}

  get say() {
    return `Hello, ${this.name}`;
  }
}
