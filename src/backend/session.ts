export default class PomoSession {
  startingDate: Date;

  numberOfCyclesCompleted: number;

  isRunning: boolean;

  constructor(startingDate: Date) {
    this.startingDate = startingDate;
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
