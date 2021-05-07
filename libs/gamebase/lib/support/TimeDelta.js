"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TimeDelta {
    constructor() {
        this.lastMillis = Date.now();
    }
    getDelta() {
        const now = Date.now();
        const delta = (now - this.lastMillis) / 1000;
        this.lastMillis = now;
        return delta;
    }
}
exports.default = TimeDelta;
//# sourceMappingURL=TimeDelta.js.map