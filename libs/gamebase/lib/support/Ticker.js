"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ticker {
    constructor(stage, aliveMillis) {
        this.stage = stage;
        this.aliveMillis = aliveMillis;
        this.startMillis = Date.now();
        this.ageBefore = -1;
    }
    get age() {
        return this.calculateAge();
    }
    isAlive() {
        return this.elapsed() < this.aliveMillis;
    }
    async checkAgeChanged(onChanged) {
        const newAge = this.calculateAge();
        if (this.ageBefore === newAge) {
            return;
        }
        this.ageBefore = newAge;
        await onChanged(this.stage, newAge);
    }
    calculateAge() {
        return Math.floor(this.elapsed() / 1000);
    }
    elapsed() {
        return Date.now() - this.startMillis;
    }
}
exports.default = Ticker;
//# sourceMappingURL=Ticker.js.map