export default class Ticker<STAGE> {
  private readonly startMillis: number = Date.now();
  private ageBefore: number = -1;

  constructor(
    public readonly stage: STAGE,
    private readonly aliveMillis: number
  ) {}

  public get age() {
    return this.calculateAge();
  }

  public isAlive() {
    return this.elapsed() < this.aliveMillis;
  }

  public async checkAgeChanged(
    onChanged: (stage: STAGE, age: number) => Promise<unknown>
  ) {
    const newAge = this.calculateAge();
    if (this.ageBefore === newAge) {
      return;
    }
    this.ageBefore = newAge;
    await onChanged(this.stage, newAge);
  }

  private calculateAge() {
    return Math.floor(this.elapsed() / 1000);
  }

  private elapsed() {
    return Date.now() - this.startMillis;
  }
}
