export default class Ticker<STAGE> {
    readonly stage: STAGE;
    private readonly aliveMillis;
    private readonly startMillis;
    private ageBefore;
    constructor(stage: STAGE, aliveMillis: number);
    get age(): number;
    isAlive(): boolean;
    checkAgeChanged(onChanged: (stage: STAGE, age: number) => Promise<unknown>): Promise<void>;
    private calculateAge;
    private elapsed;
}
//# sourceMappingURL=Ticker.d.ts.map