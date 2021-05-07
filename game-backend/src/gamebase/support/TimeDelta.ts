export default class TimeDelta {
  lastMillis: number;

  constructor() {
    this.lastMillis = Date.now();
  }

  public getDelta() {
    const now = Date.now();
    const delta = (now - this.lastMillis) / 1000;
    this.lastMillis = now;
    return delta;
  }
}
