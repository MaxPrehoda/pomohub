export default class PomoSession {
  startingDate: Date;

  numberOfCycles: number;

  numberOfCyclesCompleted: number;

  constructor(startingDate: Date, numberOfCycles: number) {
    this.startingDate = startingDate;
    this.numberOfCycles = numberOfCycles;
    this.numberOfCyclesCompleted = 0;
  }
}
