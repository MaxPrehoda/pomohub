export default class PomoSession {
  start: Date;

  numberOfCycles: number;

  numberOfCyclesCompleted: number;

  constructor(start: Date, numberOfCycles: number) {
    this.start = start;
    this.numberOfCycles = numberOfCycles;
    this.numberOfCyclesCompleted = 0;
  }
}
