export default class PomoSession {
  startingDate: Date;

  numberOfCycles: number;

  numberOfCyclesCompleted: number;

  isRunning: boolean;

  constructor(startingDate: Date, numberOfCycles: number) {
    this.startingDate = startingDate;
    this.numberOfCycles = numberOfCycles;
    this.numberOfCyclesCompleted = 0;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }
}
